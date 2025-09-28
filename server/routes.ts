import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage, hashPassword } from "./storage";
import { randomBytes } from "crypto";
import { z } from "zod";

import { ensureStudentPortalTables } from "./neondb";

import {
  insertContactMessageSchema,
  insertTrainingApplicationSchema,
  type InsertContactMessage,
  type InsertTrainingApplication
} from "@shared/schema";

// Enhanced anti-spam and flood protection
const submissionTracker = new Map<string, number[]>();
const shortTermTracker = new Map<string, number[]>(); // For short-term flood protection
const studentSessions = new Map<string, { studentId: number; createdAt: number }>();

const STUDENT_SESSION_DURATION_MS = 1000 * 60 * 60 * 8; // 8 hours

function createStudentSessionToken(studentId: number): string {
  // Remove any existing sessions for this student to keep only the newest token active
  for (const [token, session] of studentSessions.entries()) {
    if (session.studentId === studentId) {
      studentSessions.delete(token);
    }
  }

  const token = randomBytes(32).toString("hex");
  studentSessions.set(token, { studentId, createdAt: Date.now() });
  return token;
}

function getStudentIdFromRequest(req: Request): number | null {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return null;
  }

  const [scheme, token] = authHeader.split(" ");
  if (!token || scheme.toLowerCase() !== "bearer") {
    return null;
  }

  const session = studentSessions.get(token);
  if (!session) {
    return null;
  }

  const age = Date.now() - session.createdAt;
  if (age > STUDENT_SESSION_DURATION_MS) {
    studentSessions.delete(token);
    return null;
  }

  // Refresh session timestamp on use
  session.createdAt = Date.now();
  studentSessions.set(token, session);
  return session.studentId;
}

function scheduleSessionCleanup() {
  setInterval(() => {
    const now = Date.now();
    for (const [token, session] of studentSessions.entries()) {
      if (now - session.createdAt > STUDENT_SESSION_DURATION_MS) {
        studentSessions.delete(token);
      }
    }
  }, STUDENT_SESSION_DURATION_MS).unref?.();
}

scheduleSessionCleanup();

function isSpamSubmission(ip: string): boolean {
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;
  const oneMinute = 60 * 1000;
  const fiveMinutes = 5 * 60 * 1000;
  
  // Get submission times for this IP
  const submissions = submissionTracker.get(ip) || [];
  const shortTermSubmissions = shortTermTracker.get(ip) || [];
  
  // Remove old submissions
  const recentSubmissions = submissions.filter(time => now - time < oneHour);
  const recentShortTerm = shortTermSubmissions.filter(time => now - time < fiveMinutes);
  
  // Update the trackers
  submissionTracker.set(ip, recentSubmissions);
  shortTermTracker.set(ip, recentShortTerm);
  
  // Multiple layer protection:
  // 1. Max 2 submissions per hour per IP
  if (recentSubmissions.length >= 2) {
    return true;
  }
  
  // 2. Max 2 submissions per 5 minutes per IP
  if (recentShortTerm.length >= 2) {
    return true;
  }
  
  // 3. No more than 1 submission per minute per IP
  const lastMinuteSubmissions = recentShortTerm.filter(time => now - time < oneMinute);
  if (lastMinuteSubmissions.length >= 1) {
    return true;
  }
  
  return false;
}

function recordSubmission(ip: string): void {
  const now = Date.now();
  
  // Record in both trackers
  const submissions = submissionTracker.get(ip) || [];
  const shortTermSubmissions = shortTermTracker.get(ip) || [];
  
  submissions.push(now);
  shortTermSubmissions.push(now);
  
  submissionTracker.set(ip, submissions);
  shortTermTracker.set(ip, shortTermSubmissions);
}

function validateFormContent(data: any): boolean {
  // Basic spam content detection
  const spamKeywords = ['viagra', 'casino', 'lottery', 'winner', 'urgent', 'click here', 'free money'];
  const text = `${data.firstName} ${data.lastName} ${data.email} ${data.message}`.toLowerCase();

  // Check for spam keywords
  if (spamKeywords.some(keyword => text.includes(keyword))) {
    return false;
  }

  // Check for excessive links
  const linkCount = (data.message.match(/https?:\/\//g) || []).length;
  if (linkCount > 2) {
    return false;
  }

  // Check message length (too short or too long)
  if (data.message.length < 10 || data.message.length > 2000) {
    return false;
  }

  return true;
}

function validateApplicationContent(data: InsertTrainingApplication): boolean {
  const spamKeywords = ['viagra', 'casino', 'lottery', 'winner', 'urgent', 'click here', 'free money'];
  const text = `${data.firstName} ${data.lastName} ${data.email} ${data.motivations} ${data.careerGoals}`.toLowerCase();

  if (spamKeywords.some(keyword => text.includes(keyword))) {
    return false;
  }

  const linkCount = ((data.motivations.match(/https?:\/\//g) || []).length) +
    ((data.careerGoals.match(/https?:\/\//g) || []).length);
  if (linkCount > 2) {
    return false;
  }

  if (data.motivations.length < 20 || data.careerGoals.length < 20) {
    return false;
  }

  return true;
}

// Discord webhook function
async function sendToDiscordWebhook(contactData: InsertContactMessage) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn("Discord webhook URL not configured, skipping Discord notification");
    return;
  }

  try {
    const serviceNames: { [key: string]: string } = {
      "public-safety": "Consultation en Sécurité Publique",
      "francophone": "Services Communautaires Francophones", 
      "health-safety": "Santé et Sécurité au Travail",
      "animal-aid": "Premiers Soins Animaliers"
    };

    const embed = {
      title: "🔔 Nouvelle Demande d'Information",
      color: 0xf89422, // Orange color matching the website
      fields: [
        {
          name: "👤 Nom",
          value: `${contactData.firstName} ${contactData.lastName}`,
          inline: true
        },
        {
          name: "📧 Email",
          value: contactData.email,
          inline: true
        },
        {
          name: "🏢 Service",
          value: serviceNames[contactData.service] || contactData.service,
          inline: true
        },
        {
          name: "💬 Message",
          value: contactData.message.length > 1000 ? 
            contactData.message.substring(0, 1000) + "..." : 
            contactData.message,
          inline: false
        }
      ],
      timestamp: new Date().toISOString(),
      footer: {
        text: "Rémi Guillette Groupe - Demande d'Information"
      }
    };

    const payload = {
      content: "📋 **Nouvelle demande d'information reçue**",
      embeds: [embed]
    };

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Discord webhook failed: ${response.status} ${response.statusText}`);
    }

    console.log("Successfully sent contact form to Discord");
  } catch (error) {
    console.error("Failed to send message to Discord:", error);
    // Don't throw error to prevent form submission failure
  }
}

async function sendTrainingApplicationToDiscord(applicationData: InsertTrainingApplication) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn("Discord webhook URL not configured, skipping training application notification");
    return;
  }

  try {
    const statusLabel = applicationData.employmentStatus === 'other'
      ? `Autre: ${applicationData.employmentStatusOther || 'Non précisé'}`
      : applicationData.employmentStatus;

    const embed = {
      title: "🎓 Nouvelle demande de formation",
      color: 0x0d6efd,
      fields: [
        {
          name: "👤 Candidat",
          value: `${applicationData.firstName} ${applicationData.lastName}`,
          inline: true
        },
        {
          name: "📧 Email",
          value: applicationData.email,
          inline: true
        },
        {
          name: "📞 Téléphone",
          value: applicationData.phoneNumber,
          inline: true
        },
        {
          name: "🎂 Date de naissance",
          value: applicationData.dateOfBirth,
          inline: true
        },
        {
          name: "🏠 Adresse",
          value: applicationData.address,
          inline: false
        },
        {
          name: "💼 Statut actuel",
          value: statusLabel,
          inline: true
        },
        {
          name: "🎯 Motivations",
          value: applicationData.motivations.length > 1024
            ? `${applicationData.motivations.substring(0, 1021)}...`
            : applicationData.motivations,
          inline: false
        },
        {
          name: "🚀 Objectifs professionnels",
          value: applicationData.careerGoals.length > 1024
            ? `${applicationData.careerGoals.substring(0, 1021)}...`
            : applicationData.careerGoals,
          inline: false
        }
      ],
      timestamp: new Date().toISOString(),
      footer: {
        text: "Rémi Guillette Groupe - Demande de formation"
      }
    };

    const payload = {
      content: "📥 **Nouvelle demande de formation reçue**",
      embeds: [embed]
    };

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Discord webhook failed: ${response.status} ${response.statusText}`);
    }

    console.log("Successfully sent training application to Discord");
  } catch (error) {
    console.error("Failed to send training application to Discord:", error);
  }
}

export async function registerRoutes(app: Express): Promise<Server> {

  ensureStudentPortalTables().catch((error) => {
    console.warn("Unable to verify Neon student tables:", error);
  });

  // Dynamic sitemap generation
  app.get("/sitemap.xml", (req, res) => {
    // Use the production domain or fallback to request host for local development
    const host = req.get('host');
    const isLocalDev = host?.includes('localhost') || host?.includes('127.0.0.1');
    const baseUrl = isLocalDev ? `http://${host}` : 'https://rgra.ca';
    
    const currentDate = new Date().toISOString().split('T')[0];
    
    const urls = [
      { path: '/', priority: '1.0', changefreq: 'monthly' },
      { path: '/divisions', priority: '0.8', changefreq: 'monthly' },
      { path: '/services', priority: '0.8', changefreq: 'monthly' },
      { path: '/contact', priority: '0.7', changefreq: 'monthly' },
      { path: '/learn', priority: '0.7', changefreq: 'monthly' },
      { path: '/apprendre', priority: '0.7', changefreq: 'monthly' },
      { path: '/public-safety', priority: '0.7', changefreq: 'monthly' },
      { path: '/francophone-services', priority: '0.7', changefreq: 'monthly' },
      { path: '/health-safety', priority: '0.7', changefreq: 'monthly' },
      { path: '/animal-first-aid', priority: '0.7', changefreq: 'monthly' },
      { path: '/student/login', priority: '0.6', changefreq: 'monthly' },
      { path: '/etudiant/connexion', priority: '0.6', changefreq: 'monthly' },
      { path: '/student/change-password', priority: '0.5', changefreq: 'monthly' },
      { path: '/etudiant/mot-de-passe', priority: '0.5', changefreq: 'monthly' },
      { path: '/student/portal', priority: '0.6', changefreq: 'weekly' },
      { path: '/etudiant/portail', priority: '0.6', changefreq: 'weekly' },
      { path: '/privacy-policy', priority: '0.3', changefreq: 'yearly' },
      { path: '/politique-confidentialite', priority: '0.3', changefreq: 'yearly' }
    ];
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${baseUrl}${url.path}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
    
    res.setHeader('Content-Type', 'application/xml');
    res.send(sitemap);
  });

  // Dynamic robots.txt generation
  app.get("/robots.txt", (req, res) => {
    // Use the production domain or fallback to request host for local development
    const host = req.get('host');
    const isLocalDev = host?.includes('localhost') || host?.includes('127.0.0.1');
    const baseUrl = isLocalDev ? `http://${host}` : 'https://rgra.ca';
    
    const robots = `User-agent: *
Allow: /

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml`;
    
    res.setHeader('Content-Type', 'text/plain');
    res.send(robots);
  });

  // SEO health check endpoint
  app.get("/api/seo-health", (req, res) => {
    // Use the production domain or fallback to request host for local development
    const host = req.get('host');
    const isLocalDev = host?.includes('localhost') || host?.includes('127.0.0.1');
    const baseUrl = isLocalDev ? `http://${host}` : 'https://rgra.ca';
    
    const seoStatus = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      domain: host,
      sitemapUrl: `${baseUrl}/sitemap.xml`,
      robotsUrl: `${baseUrl}/robots.txt`,
      googleVerification: `${baseUrl}/googlec46fc42c837208e4.html`,
      seoFeatures: {
        dynamicSitemap: true,
        robotsTxt: true,
        googleVerification: true,
        metaTags: true,
        multiLanguage: true,
        structuredData: true,
        organizationSchema: true,
        localBusinessSchema: true,
        socialMediaProfiles: true
      }
    };
    
    res.json(seoStatus);
  });

  // Test routes for error handling
  app.get("/api/test-error", (req, res) => {
    throw new Error("This is a test server error for 500 page testing");
  });

  app.get("/api/test-404", (req, res) => {
    res.status(404).json({ message: "Test 404 endpoint" });
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString() });
  });

  app.post("/api/student/login", async (req, res) => {
    try {
      const { cardNumber, password } = req.body ?? {};

      if (!cardNumber || !password) {
        return res.status(400).json({
          success: false,
          error: "Card number and password are required.",
          errorCode: "missing_fields",
        });
      }

      const student = await storage.getStudentByCardNumber(String(cardNumber));
      if (!student) {
        return res.status(401).json({
          success: false,
          error: "Unable to find a matching student account.",
          errorCode: "not_found",
        });
      }

      if (!student.isActive) {
        return res.status(403).json({
          success: false,
          error: "This account has not been activated yet.",
          errorCode: "inactive",
        });
      }

      const hashedInput = hashPassword(String(password));
      const expectedHash =
        student.requiresPasswordChange || !student.passwordHash
          ? student.temporaryPasswordHash
          : student.passwordHash;

      if (expectedHash !== hashedInput) {
        return res.status(401).json({
          success: false,
          error: "The credentials provided are invalid.",
          errorCode: "invalid_credentials",
        });
      }

      const sessionToken = createStudentSessionToken(student.id);

      res.json({
        success: true,
        sessionToken,
        student: {
          id: student.id,
          cardNumber: student.cardNumber,
          firstName: student.firstName,
          lastName: student.lastName,
          requiresPasswordChange: student.requiresPasswordChange,
        },
      });
    } catch (error) {
      console.error("Student login failed:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error.",
        errorCode: "server_error",
      });
    }
  });

  app.post("/api/student/change-password", async (req, res) => {
    try {
      const studentId = getStudentIdFromRequest(req);
      if (!studentId) {
        return res.status(401).json({
          success: false,
          error: "Authentication required.",
          errorCode: "unauthorized",
        });
      }

      const { currentPassword, newPassword, confirmPassword } = req.body ?? {};
      if (!currentPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({
          success: false,
          error: "All password fields are required.",
          errorCode: "missing_fields",
        });
      }

      if (String(newPassword) !== String(confirmPassword)) {
        return res.status(400).json({
          success: false,
          error: "The confirmation password does not match.",
          errorCode: "mismatch",
        });
      }

      if (String(newPassword).length < 8) {
        return res.status(400).json({
          success: false,
          error: "The new password must contain at least 8 characters.",
          errorCode: "weak_password",
        });
      }

      const student = await storage.getStudentById(studentId);
      if (!student) {
        return res.status(404).json({
          success: false,
          error: "Student account not found.",
          errorCode: "not_found",
        });
      }

      const hashedCurrent = hashPassword(String(currentPassword));
      const currentHash = student.passwordHash ?? student.temporaryPasswordHash;
      if (hashedCurrent !== currentHash) {
        return res.status(400).json({
          success: false,
          error: "The current password is incorrect.",
          errorCode: "invalid_current_password",
        });
      }

      const newHash = hashPassword(String(newPassword));
      if (newHash === currentHash) {
        return res.status(400).json({
          success: false,
          error: "Please choose a different password than your current one.",
          errorCode: "password_reused",
        });
      }

      const updatedStudent = await storage.updateStudentPassword(studentId, newHash);
      if (!updatedStudent) {
        return res.status(500).json({
          success: false,
          error: "Unable to update the password.",
          errorCode: "update_failed",
        });
      }

      const sessionToken = createStudentSessionToken(updatedStudent.id);

      res.json({
        success: true,
        message: "Password updated successfully.",
        sessionToken,
        student: {
          id: updatedStudent.id,
          cardNumber: updatedStudent.cardNumber,
          firstName: updatedStudent.firstName,
          lastName: updatedStudent.lastName,
          requiresPasswordChange: updatedStudent.requiresPasswordChange,
        },
      });
    } catch (error) {
      console.error("Student password change failed:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error.",
        errorCode: "server_error",
      });
    }
  });

  app.get("/api/student/dashboard", async (req, res) => {
    try {
      const studentId = getStudentIdFromRequest(req);
      if (!studentId) {
        return res.status(401).json({
          success: false,
          error: "Authentication required.",
          errorCode: "unauthorized",
        });
      }

      const dashboard = await storage.getStudentDashboard(studentId);
      if (!dashboard) {
        return res.status(404).json({
          success: false,
          error: "Student account not found.",
          errorCode: "not_found",
        });
      }

      res.json({ success: true, data: dashboard });
    } catch (error) {
      console.error("Failed to load student dashboard:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error.",
        errorCode: "server_error",
      });
    }
  });

  app.post("/api/student/store/request", async (req, res) => {
    try {
      const studentId = getStudentIdFromRequest(req);
      if (!studentId) {
        return res.status(401).json({
          success: false,
          error: "Authentication required.",
          errorCode: "unauthorized",
        });
      }

      const { courseId } = req.body ?? {};
      const numericCourseId = Number(courseId);
      if (!Number.isInteger(numericCourseId)) {
        return res.status(400).json({
          success: false,
          error: "A valid course identifier is required.",
          errorCode: "invalid_course",
        });
      }

      const request = await storage.createStudentCourseRequest(studentId, numericCourseId);
      const dashboard = await storage.getStudentDashboard(studentId);

      res.json({
        success: true,
        request,
        dashboard,
      });
    } catch (error) {
      console.error("Failed to create course request:", error);
      if (error instanceof Error) {
        if (error.message === "course_not_found") {
          return res.status(404).json({
            success: false,
            error: "The selected course could not be found.",
            errorCode: "course_not_found",
          });
        }

        if (error.message === "course_already_enrolled") {
          return res.status(400).json({
            success: false,
            error: "You are already enrolled in this course.",
            errorCode: "course_already_enrolled",
          });
        }
      }

      res.status(500).json({
        success: false,
        error: "Internal server error.",
        errorCode: "server_error",
      });
    }
  });

  // Contact form submission
  app.post("/api/training-applications", async (req, res) => {
    try {
      const clientIP = req.ip || req.connection.remoteAddress || 'unknown';

      if (isSpamSubmission(clientIP)) {
        console.warn(`Flood protection triggered for training form IP: ${clientIP}`);
        return res.status(429).json({
          success: false,
          error: "Trop de soumissions détectées. Veuillez patienter avant de soumettre à nouveau."
        });
      }

      if (req.body.website || req.body.url || req.body.phone_hidden) {
        console.warn(`Training form bot detected via honeypot from IP: ${clientIP}`);
        return res.status(400).json({
          success: false,
          error: "Soumission invalide détectée."
        });
      }

      const submissionStartTime = req.body.formStartTime;
      if (submissionStartTime) {
        const submissionTime = Date.now() - parseInt(submissionStartTime);
        if (submissionTime < 3000) {
          console.warn(`Training form submitted too quickly from IP: ${clientIP}, time: ${submissionTime}ms`);
          return res.status(400).json({
            success: false,
            error: "Soumission trop rapide. Veuillez prendre le temps de remplir le formulaire."
          });
        }
      }

      const { recaptchaToken, website, url, phone_hidden, formStartTime, ...formData } = req.body;

      const requiredFields = [
        'firstName',
        'lastName',
        'dateOfBirth',
        'address',
        'phoneNumber',
        'email',
        'employmentStatus',
        'motivations',
        'careerGoals'
      ];

      const missingFields = requiredFields.filter(field => !formData[field] || String(formData[field]).trim() === '');
      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          error: "Tous les champs obligatoires doivent être remplis.",
          details: missingFields
        });
      }

      if (formData.employmentStatus === 'other' && (!formData.employmentStatusOther || String(formData.employmentStatusOther).trim() === '')) {
        return res.status(400).json({
          success: false,
          error: "Veuillez préciser votre statut actuel."
        });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        return res.status(400).json({
          success: false,
          error: "Format d'email invalide."
        });
      }

      const phoneDigits = String(formData.phoneNumber).replace(/\D/g, '');
      if (phoneDigits.length < 10) {
        return res.status(400).json({
          success: false,
          error: "Veuillez fournir un numéro de téléphone valide."
        });
      }

      const birthDate = new Date(formData.dateOfBirth);
      if (Number.isNaN(birthDate.getTime()) || birthDate > new Date()) {
        return res.status(400).json({
          success: false,
          error: "La date de naissance est invalide."
        });
      }

      const motivations = String(formData.motivations).trim();
      const careerGoals = String(formData.careerGoals).trim();

      if (motivations.length < 20 || careerGoals.length < 20) {
        return res.status(400).json({
          success: false,
          error: "Merci de détailler vos motivations et objectifs professionnels."
        });
      }

      if (!formData.declarationAccepted) {
        return res.status(400).json({
          success: false,
          error: "La déclaration doit être acceptée pour soumettre votre demande."
        });
      }

      const sanitizedData: InsertTrainingApplication = {
        firstName: String(formData.firstName).trim(),
        lastName: String(formData.lastName).trim(),
        dateOfBirth: String(formData.dateOfBirth),
        address: String(formData.address).trim(),
        phoneNumber: String(formData.phoneNumber).trim(),
        email: String(formData.email).trim().toLowerCase(),
        employmentStatus: String(formData.employmentStatus),
        employmentStatusOther: formData.employmentStatus === 'other'
          ? String(formData.employmentStatusOther).trim()
          : undefined,
        motivations,
        careerGoals,
        declarationAccepted: true,
      };

      const validatedData = insertTrainingApplicationSchema.parse(sanitizedData);

      if (!validateApplicationContent(validatedData)) {
        console.warn(`Training application content flagged from IP: ${clientIP}`);
        return res.status(400).json({
          success: false,
          error: "Le contenu du formulaire contient des éléments non autorisés."
        });
      }

      recordSubmission(clientIP);

      const application = await storage.createTrainingApplication(validatedData);

      await sendTrainingApplicationToDiscord(validatedData);

      console.log(`Training application submitted successfully from IP: ${clientIP}`);
      res.json({ success: true, message: "Demande envoyée avec succès", id: application.id });
    } catch (error) {
      console.error("Error creating training application:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, error: "Données du formulaire invalides", details: error.errors });
      } else {
        res.status(500).json({ success: false, error: "Erreur interne du serveur" });
      }
    }
  });

  app.post("/api/contact", async (req, res) => {
    try {
      const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
      
      // Enhanced anti-spam and bot protection
      if (isSpamSubmission(clientIP)) {
        console.warn(`Flood protection triggered for IP: ${clientIP}`);
        return res.status(429).json({ 
          success: false, 
          error: "Trop de soumissions détectées. Veuillez attendre avant de soumettre à nouveau." 
        });
      }
      
      // Honeypot check - if hidden field is filled, it's a bot
      if (req.body.website || req.body.url || req.body.phone_hidden) {
        console.warn(`Bot detected via honeypot from IP: ${clientIP}`);
        return res.status(400).json({ 
          success: false, 
          error: "Soumission invalide détectée." 
        });
      }
      
      // Check submission time (must be at least 3 seconds to prevent instant bot submissions)
      const submissionStartTime = req.body.formStartTime;
      if (submissionStartTime) {
        const submissionTime = Date.now() - parseInt(submissionStartTime);
        if (submissionTime < 3000) { // Less than 3 seconds
          console.warn(`Too fast submission detected from IP: ${clientIP}, time: ${submissionTime}ms`);
          return res.status(400).json({ 
            success: false, 
            error: "Soumission trop rapide. Veuillez prendre le temps de remplir le formulaire." 
          });
        }
      }
      
      // Extract form data (ignore any recaptcha token and honeypot fields)
      const { recaptchaToken, website, url, phone_hidden, formStartTime, ...formData } = req.body;
      
      // Enhanced server-side validation
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.message) {
        return res.status(400).json({ 
          success: false, 
          error: "Tous les champs obligatoires doivent être remplis." 
        });
      }
      
      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        return res.status(400).json({ 
          success: false, 
          error: "Format d'email invalide." 
        });
      }
      
      // Validate form data with schema
      const validatedData = insertContactMessageSchema.parse(formData);
      
      // Enhanced content validation
      if (!validateFormContent(validatedData)) {
        console.warn(`Spam content detected from IP: ${clientIP}`);
        return res.status(400).json({ 
          success: false, 
          error: "Le contenu du message contient des éléments non autorisés." 
        });
      }
      
      // Record successful submission
      recordSubmission(clientIP);
      
      const message = await storage.createContactMessage(validatedData);
      
      // Send to Discord webhook
      await sendToDiscordWebhook(validatedData);
      
      console.log(`Contact form submitted successfully from IP: ${clientIP}`);
      res.json({ success: true, message: "Message envoyé avec succès", id: message.id });
    } catch (error) {
      console.error("Error creating contact message:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, error: "Données du formulaire invalides", details: error.errors });
      } else {
        res.status(500).json({ success: false, error: "Erreur interne du serveur" });
      }
    }
  });



  const httpServer = createServer(app);

  return httpServer;
}
