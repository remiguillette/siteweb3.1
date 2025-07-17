import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertContactMessageSchema } from "@shared/schema";
import { sendContactEmail } from "./email";

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
      
      // Send email instead of storing in database
      const emailSent = await sendContactEmail(validatedData);
      
      if (emailSent) {
        res.json({ success: true, message: "Message sent successfully" });
      } else {
        res.status(500).json({ success: false, error: "Failed to send email" });
      }
    } catch (error) {
      console.error("Error sending contact message:", error);
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
