import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const assessments = pgTable("assessments", {
  id: serial("id").primaryKey(),
  ageGroup: text("age_group").notNull(), // newborn, infant, toddler, child
  symptoms: jsonb("symptoms").notNull(), // array of symptom objects
  responses: jsonb("responses").notNull(), // user responses to questions
  recommendation: text("recommendation").notNull(), // home_care, call_doctor, emergency
  urgencyLevel: text("urgency_level").notNull(), // low, medium, high, emergency
  createdAt: text("created_at").notNull(),
});

export const medicalProtocols = pgTable("medical_protocols", {
  id: serial("id").primaryKey(),
  symptom: text("symptom").notNull(), // fever, rash, cough
  ageGroup: text("age_group").notNull(),
  questions: jsonb("questions").notNull(), // decision tree questions
  guidelines: jsonb("guidelines").notNull(), // care recommendations
});

export const insertAssessmentSchema = createInsertSchema(assessments).omit({
  id: true,
  createdAt: true,
});

export const insertMedicalProtocolSchema = createInsertSchema(medicalProtocols).omit({
  id: true,
});

export type Assessment = typeof assessments.$inferSelect;
export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;
export type MedicalProtocol = typeof medicalProtocols.$inferSelect;
export type InsertMedicalProtocol = z.infer<typeof insertMedicalProtocolSchema>;
