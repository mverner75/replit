import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAssessmentSchema } from "@shared/schema";

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
      const assessment = await storage.createAssessment(validatedData);
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

  const httpServer = createServer(app);
  return httpServer;
}
