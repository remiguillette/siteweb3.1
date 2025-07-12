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
      
      // Auto-respond if it's a user message (simulate BeaverTalk agent)
      if (messageData.senderType === 'user') {
        setTimeout(async () => {
          // Determine if session is French or English based on client site or content
          const isEnglish = session.clientSite?.includes('en') || 
                           messageData.messageContent.toLowerCase().match(/\b(hello|hi|help|english)\b/);
          
          const agentResponsesFr = [
            "Merci de contacter le support BeaverTalk. Je serai ravi de vous aider avec votre demande.",
            "Je comprends votre préoccupation. Laissez-moi examiner cela pour vous immédiatement.",
            "Excellente question ! Laissez-moi vous fournir les informations dont vous avez besoin.",
            "Je peux certainement vous aider avec cela. Voici ce que je recommande...",
            "Merci de nous avoir contactés. J'examine votre demande et répondrai sous peu.",
            "J'apprécie que vous nous ayez signalé cela. Laissez-moi vérifier nos systèmes.",
            "Parfait ! J'ai des solutions qui devraient aider avec votre situation.",
            "Je vois de quoi vous parlez. C'est en fait une demande courante que nous traitons."
          ];

          const agentResponsesEn = [
            "Thank you for contacting BeaverTalk support. I'll be happy to help you with your inquiry.",
            "I understand your concern. Let me look into this for you right away.",
            "That's a great question! Let me provide you with the information you need.",
            "I can definitely help you with that. Here's what I recommend...",
            "Thanks for reaching out. I'm reviewing your request and will respond shortly.",
            "I appreciate you bringing this to our attention. Let me check our systems.",
            "Perfect! I have some solutions that should help with your situation.",
            "I see what you're asking about. This is actually a common request we handle."
          ];

          const agentResponses = isEnglish ? agentResponsesEn : agentResponsesFr;
          
          const randomResponse = agentResponses[Math.floor(Math.random() * agentResponses.length)];
          
          const agentMessage = {
            sessionId: messageData.sessionId,
            senderId: "beavertalk_agent_1",
            senderName: "BeaverTalk Support Agent",
            senderType: "agent" as const,
            messageContent: randomResponse,
            messageType: "text" as const,
          };
          
          await storage.createChatMessage(agentMessage);
        }, 1500 + Math.random() * 2000); // Random delay between 1.5-3.5 seconds
      }
      
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

  const httpServer = createServer(app);

  return httpServer;
}
