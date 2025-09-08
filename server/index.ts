import express, { type Request, type Response, type NextFunction } from "express";
import compression from "compression";
import { registerRoutes } from "./routes";
import { log, setupVite } from "./vite";

async function createServer() {
  // --- Initialize Express App ---
  const app = express();

  // --- Core Middlewares ---

  // Enable Gzip compression for all responses to reduce payload size
  app.use(compression());

  // Parse JSON and URL-encoded request bodies
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: false, limit: "10mb" }));

  // --- Security & CORS Middlewares ---
  app.use((req: Request, res: Response, next: NextFunction) => {
    // Set security headers to protect against common vulnerabilities
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

    // Set CORS headers to allow cross-origin requests
    // NOTE: For better security in production, you might want to restrict the origin
    // to your specific frontend domain instead of using "*".
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    // Handle pre-flight CORS requests
    if (req.method === "OPTIONS") {
      res.sendStatus(200);
      return;
    }

    next();
  });

  // --- Request Logging Middleware ---
  // Logs API requests with method, path, status code, and duration.
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (!req.path.startsWith("/api")) {
      return next(); // Only log API routes
    }

    const start = Date.now();
    res.on("finish", () => {
      const duration = Date.now() - start;
      const logLine = `${req.method} ${req.path} ${res.statusCode} in ${duration}ms`;
      log(logLine);
    });

    next();
  });

  // --- Register API Routes ---
  const httpServer = await registerRoutes(app);

  // --- Set up Vite Development Server ---
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, httpServer);
  }

  // --- Global Error Handling Middleware ---
  // This middleware must be the last `app.use()` call.
  app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    // Log the full error for debugging purposes
    console.error("Error:", {
      message: err.message,
      status,
      url: req.url,
      method: req.method,
      stack: err.stack, // Include stack trace for detailed debugging
    });

    // Send a clean, user-friendly error response to the client
    res.status(status).json({
      message: status === 500 && process.env.NODE_ENV === "production"
        ? "An unexpected internal server error occurred." // Generic message in production
        : message,
    });
  });

  // --- Start the Server ---
  const PORT = parseInt(process.env.PORT || "5000", 10);
  const HOST = process.env.HOST || "0.0.0.0";

  httpServer.listen(PORT, HOST, () => {
    log(`🚀 Server running on http://${HOST}:${PORT}`);
    log(`🔥 Environment: ${process.env.NODE_ENV || "development"}`);
  });

  return httpServer;
}

// Start the server
createServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});