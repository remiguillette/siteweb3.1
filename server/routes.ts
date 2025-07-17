import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertContactMessageSchema, type InsertContactMessage } from "@shared/schema";

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

export async function registerRoutes(app: Express): Promise<Server> {

  // Dynamic sitemap generation
  app.get("/sitemap.xml", (req, res) => {
    const protocol = req.secure ? 'https' : 'http';
    const host = req.get('host');
    const baseUrl = `${protocol}://${host}`;
    
    const currentDate = new Date().toISOString().split('T')[0];
    
    const urls = [
      { path: '/', priority: '1.0', changefreq: 'monthly' },
      { path: '/divisions', priority: '0.8', changefreq: 'monthly' },
      { path: '/services', priority: '0.8', changefreq: 'monthly' },
      { path: '/contact', priority: '0.7', changefreq: 'monthly' },
      { path: '/public-safety', priority: '0.7', changefreq: 'monthly' },
      { path: '/francophone-services', priority: '0.7', changefreq: 'monthly' },
      { path: '/health-safety', priority: '0.7', changefreq: 'monthly' },
      { path: '/animal-first-aid', priority: '0.7', changefreq: 'monthly' },
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
    const protocol = req.secure ? 'https' : 'http';
    const host = req.get('host');
    const baseUrl = `${protocol}://${host}`;
    
    const robots = `User-agent: *
Allow: /

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml`;
    
    res.setHeader('Content-Type', 'text/plain');
    res.send(robots);
  });

  // SEO health check endpoint
  app.get("/api/seo-health", (req, res) => {
    const protocol = req.secure ? 'https' : 'http';
    const host = req.get('host');
    const baseUrl = `${protocol}://${host}`;
    
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
        structuredData: false
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

  // Contact form submission
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(validatedData);
      
      // Send to Discord webhook
      await sendToDiscordWebhook(validatedData);
      
      res.json({ success: true, message: "Message sent successfully", id: message.id });
    } catch (error) {
      console.error("Error creating contact message:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, error: "Invalid form data", details: error.errors });
      } else {
        res.status(500).json({ success: false, error: "Internal server error" });
      }
    }
  });



  const httpServer = createServer(app);

  return httpServer;
}
