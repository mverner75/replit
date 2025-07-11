import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAssessmentSchema } from "@shared/schema";
import { updateAnalyticsAfterAssessment, generateUsageReport, generateCallReductionReport } from "./analytics-service";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get medical protocol for specific symptom and age group
  app.get("/api/protocols/:symptom/:ageGroup", async (req, res) => {
    try {
      const { symptom, ageGroup } = req.params;
      const protocol = await storage.getMedicalProtocol(symptom, ageGroup);
      
      if (!protocol) {
        return res.status(404).json({ message: "Protocol not found for this symptom and age group" });
      }
      
      res.json(protocol);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve protocol" });
    }
  });

  // Get all medical protocols
  app.get("/api/protocols", async (req, res) => {
    try {
      const protocols = await storage.getAllMedicalProtocols();
      res.json(protocols);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve protocols" });
    }
  });

  // Create new assessment
  app.post("/api/assessments", async (req, res) => {
    try {
      const validatedData = insertAssessmentSchema.parse(req.body);
      
      // Add tracking data
      const assessmentData = {
        ...validatedData,
        sessionId: req.get('X-Session-ID') || null,
        userAgent: req.get('User-Agent') || null,
        ipAddress: req.ip || req.connection.remoteAddress || null,
        completedAt: new Date(),
      };
      
      const assessment = await storage.createAssessment(assessmentData);
      
      // Update analytics asynchronously (don't wait for completion)
      updateAnalyticsAfterAssessment(assessment).catch(console.error);
      
      res.status(201).json(assessment);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to create assessment" });
      }
    }
  });

  // Get assessment by ID
  app.get("/api/assessments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid assessment ID" });
      }
      
      const assessment = await storage.getAssessment(id);
      if (!assessment) {
        return res.status(404).json({ message: "Assessment not found" });
      }
      
      res.json(assessment);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve assessment" });
    }
  });

  // Analytics routes
  app.get("/api/analytics/usage", async (req, res) => {
    try {
      const days = parseInt(req.query.days as string) || 30;
      const report = await generateUsageReport(days);
      res.json(report);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate usage report" });
    }
  });

  app.get("/api/analytics/call-reduction", async (req, res) => {
    try {
      const months = parseInt(req.query.months as string) || 12;
      const report = await generateCallReductionReport(months);
      res.json(report);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate call reduction report" });
    }
  });

  // Dashboard summary endpoint
  app.get("/api/analytics/dashboard", async (req, res) => {
    try {
      const [usageReport, callReport] = await Promise.all([
        generateUsageReport(30),
        generateCallReductionReport(6)
      ]);
      
      res.json({
        last30Days: usageReport,
        last6Months: callReport,
        generated: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to generate dashboard data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
