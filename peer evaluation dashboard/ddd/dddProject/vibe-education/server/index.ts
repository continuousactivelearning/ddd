import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { connectMongoDB } from "./mongodb";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Connect to MongoDB
await connectMongoDB();

// Setup API routes
const server = await registerRoutes(app);

// Error handling middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  console.error(`Error ${status}: ${message}`);
  res.status(status).json({ message });
});

// Setup Vite for development
if (app.get("env") === "development") {
  await setupVite(app, server);
} else {
  serveStatic(app);
}

const PORT = 5000;
server.listen(PORT, "0.0.0.0", () => {
  log(`Server running on port ${PORT}`);
});