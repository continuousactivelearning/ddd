import fs from "fs";
import path from "path";
import { createServer as createViteServer } from "vite";
import type { Express } from "express";
import type { Server } from "http";
import express from "express";

export function log(message: string, source = "express") {
  const timestamp = new Date().toLocaleTimeString("en-US", { hour12: false });
  console.log(`\x1b[36m[${timestamp}]\x1b[0m \x1b[90m${source}:\x1b[0m ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "custom",
  });
  
  app.use(vite.middlewares);
  
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    
    try {
      let template = fs.readFileSync(path.resolve("client/index.html"), "utf-8");
      template = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(template);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve("dist/client");
  if (!fs.existsSync(distPath)) {
    throw new Error("Client build not found. Run 'npm run build' first.");
  }
  
  app.use(express.static(distPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}