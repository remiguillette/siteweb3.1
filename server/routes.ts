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
