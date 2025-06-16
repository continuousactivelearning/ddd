import type { Express } from "express";
import { createServer, type Server } from "http";
import { getDB } from "./mongodb";

export async function registerRoutes(app: Express): Promise<Server> {
  const db = getDB();

  // Simple auth middleware
  const requireAuth = (req: any, res: any, next: any) => {
    req.user = { id: "demo-user", email: "demo@example.com", firstName: "Demo", lastName: "User" };
    next();
  };

  // Course routes
  app.get("/api/courses", requireAuth, async (req: any, res: any) => {
    try {
      const courses = await db.collection("courses").find({}).toArray();
      res.json(courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });

  app.get("/api/courses/:courseId/questions/random/:count", requireAuth, async (req: any, res: any) => {
    try {
      const courseId = parseInt(req.params.courseId);
      const count = parseInt(req.params.count);
      
      const questions = await db.collection("questions")
        .aggregate([
          { $match: { courseId } },
          { $sample: { size: count } }
        ])
        .toArray();
      
      res.json(questions);
    } catch (error) {
      console.error("Error fetching questions:", error);
      res.status(500).json({ message: "Failed to fetch questions" });
    }
  });

  // Assessment routes
  app.post("/api/assessments", requireAuth, async (req: any, res: any) => {
    try {
      const assessment = {
        ...req.body,
        id: Date.now(),
        userId: req.user.id,
        createdAt: new Date()
      };
      
      const result = await db.collection("assessments").insertOne(assessment);
      res.status(201).json({ ...assessment, _id: result.insertedId });
    } catch (error) {
      console.error("Error creating assessment:", error);
      res.status(500).json({ message: "Failed to create assessment" });
    }
  });

  app.get("/api/assessments", requireAuth, async (req: any, res: any) => {
    try {
      const assessments = await db.collection("assessments")
        .find({ userId: req.user.id })
        .sort({ createdAt: -1 })
        .toArray();
      res.json(assessments);
    } catch (error) {
      console.error("Error fetching assessments:", error);
      res.status(500).json({ message: "Failed to fetch assessments" });
    }
  });

  app.get("/api/user", requireAuth, (req: any, res: any) => {
    res.json({ user: req.user });
  });

  return createServer(app);
}