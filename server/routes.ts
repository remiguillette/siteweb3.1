import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertChatSessionSchema, insertChatMessageSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Chat session routes
  app.post("/api/chat/sessions", async (req, res) => {
    try {
      const sessionData = insertChatSessionSchema.parse(req.body);
      const session = await storage.createChatSession(sessionData);
      res.json(session);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid session data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create session" });
      }
    }
  });

  app.get("/api/chat/sessions/:sessionId", async (req, res) => {
    try {
      const session = await storage.getChatSession(req.params.sessionId);
      if (!session) {
        res.status(404).json({ error: "Session not found" });
        return;
      }
      res.json(session);
    } catch (error) {
      res.status(500).json({ error: "Failed to get session" });
    }
  });

  app.patch("/api/chat/sessions/:sessionId/status", async (req, res) => {
    try {
      const { status } = req.body;
      if (!status || typeof status !== 'string') {
        res.status(400).json({ error: "Status is required" });
        return;
      }
      
      const session = await storage.updateChatSessionStatus(req.params.sessionId, status);
      if (!session) {
        res.status(404).json({ error: "Session not found" });
        return;
      }
      res.json(session);
    } catch (error) {
      res.status(500).json({ error: "Failed to update session status" });
    }
  });

  // Chat message routes
  app.post("/api/chat/messages", async (req, res) => {
    try {
      const messageData = insertChatMessageSchema.parse(req.body);
      
      // Check if session exists
      const session = await storage.getChatSession(messageData.sessionId);
      if (!session) {
        res.status(404).json({ error: "Session not found" });
        return;
      }
      
      const message = await storage.createChatMessage(messageData);
      
      res.json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid message data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to send message" });
      }
    }
  });

  app.get("/api/chat/messages/:sessionId", async (req, res) => {
    try {
      const messages = await storage.getChatMessages(req.params.sessionId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to get messages" });
    }
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

  // BeaverTalk API Proxy routes to bypass CORS
  const beavertalkUsername = process.env.VITE_BEAVERTALK_USERNAME || 'remiguillette';
  const beavertalkPassword = process.env.VITE_BEAVERTALK_PASSWORD || 'MC.84rg99qc@';
  const beavertalkAuth = Buffer.from(`${beavertalkUsername}:${beavertalkPassword}`).toString("base64");

  app.get("/api/beavertalk/health", async (req, res) => {
    try {
      const response = await fetch("https://rgbeavernet.ca/api/chat/health", {
        method: "GET",
        headers: {
          "Authorization": `Basic ${beavertalkAuth}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      });
      
      if (!response.ok) {
        throw new Error(`BeaverTalk API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("BeaverTalk API proxy error:", error);
      res.status(500).json({ error: "Failed to connect to BeaverTalk API", details: error.message });
    }
  });

  app.post("/api/beavertalk/sessions", async (req, res) => {
    try {
      const response = await fetch("https://rgbeavernet.ca/api/chat/sessions", {
        method: "POST",
        headers: {
          "Authorization": `Basic ${beavertalkAuth}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(req.body)
      });
      
      if (!response.ok) {
        throw new Error(`BeaverTalk API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("BeaverTalk API proxy error:", error);
      res.status(500).json({ error: "Failed to create BeaverTalk session", details: error.message });
    }
  });

  app.post("/api/beavertalk/messages", async (req, res) => {
    try {
      const response = await fetch("https://rgbeavernet.ca/api/chat/messages", {
        method: "POST",
        headers: {
          "Authorization": `Basic ${beavertalkAuth}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(req.body)
      });
      
      if (!response.ok) {
        throw new Error(`BeaverTalk API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("BeaverTalk API proxy error:", error);
      res.status(500).json({ error: "Failed to send message to BeaverTalk", details: error.message });
    }
  });

  app.get("/api/beavertalk/messages/:sessionId", async (req, res) => {
    try {
      const response = await fetch(`https://rgbeavernet.ca/api/chat/messages/${req.params.sessionId}`, {
        method: "GET",
        headers: {
          "Authorization": `Basic ${beavertalkAuth}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      });
      
      if (!response.ok) {
        throw new Error(`BeaverTalk API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("BeaverTalk API proxy error:", error);
      res.status(500).json({ error: "Failed to fetch messages from BeaverTalk", details: error.message });
    }
  });

  app.patch("/api/beavertalk/sessions/:sessionId/status", async (req, res) => {
    try {
      const response = await fetch(`https://rgbeavernet.ca/api/chat/sessions/${req.params.sessionId}/status`, {
        method: "PATCH",
        headers: {
          "Authorization": `Basic ${beavertalkAuth}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(req.body)
      });
      
      if (!response.ok) {
        throw new Error(`BeaverTalk API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("BeaverTalk API proxy error:", error);
      res.status(500).json({ error: "Failed to update session status", details: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
