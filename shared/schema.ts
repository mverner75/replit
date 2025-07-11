import { pgTable, text, serial, integer, boolean, jsonb, timestamp, date, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const assessments = pgTable("assessments", {
  id: serial("id").primaryKey(),
  ageGroup: text("age_group").notNull(), // newborn, infant, toddler, child
  symptoms: jsonb("symptoms").notNull(), // array of symptom objects
  responses: jsonb("responses").notNull(), // user responses to questions
  recommendation: text("recommendation").notNull(), // home_care, call_doctor, emergency
  urgencyLevel: text("urgency_level").notNull(), // low, medium, high, emergency
  sessionId: text("session_id"), // For tracking user sessions
  userAgent: text("user_agent"), // Browser/device info
  ipAddress: text("ip_address"), // For geographic insights (anonymized)
  completedAt: timestamp("completed_at"), // When user finished assessment
  createdAt: text("created_at").notNull(),
});

export const medicalProtocols = pgTable("medical_protocols", {
  id: serial("id").primaryKey(),
  symptom: text("symptom").notNull(), // fever, rash, cough
  ageGroup: text("age_group").notNull(),
  questions: jsonb("questions").notNull(), // decision tree questions
  guidelines: jsonb("guidelines").notNull(), // care recommendations
});

export const usageAnalytics = pgTable("usage_analytics", {
  id: serial("id").primaryKey(),
  date: date("date").notNull(),
  totalAssessments: integer("total_assessments").default(0),
  emergencyRecommendations: integer("emergency_recommendations").default(0),
  callDoctorRecommendations: integer("call_doctor_recommendations").default(0),
  homeCareRecommendations: integer("home_care_recommendations").default(0),
  topSymptoms: jsonb("top_symptoms"), // JSON object with symptom counts
  topAgeGroups: jsonb("top_age_groups"), // JSON object with age group counts
  avgCompletionTime: integer("avg_completion_time"), // Average time in seconds
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const callReductionMetrics = pgTable("call_reduction_metrics", {
  id: serial("id").primaryKey(),
  month: text("month").notNull(), // YYYY-MM format
  totalAssessments: integer("total_assessments").default(0),
  estimatedCallsAvoided: integer("estimated_calls_avoided").default(0), // Based on home_care recommendations
  potentialEmergenciesIdentified: integer("potential_emergencies_identified").default(0),
  userSatisfactionScore: decimal("user_satisfaction_score", { precision: 3, scale: 2 }), // Future feature
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAssessmentSchema = createInsertSchema(assessments).omit({
  id: true,
  createdAt: true,
});

export const insertMedicalProtocolSchema = createInsertSchema(medicalProtocols).omit({
  id: true,
});

export const insertUsageAnalyticsSchema = createInsertSchema(usageAnalytics).omit({
  id: true,
  createdAt: true,
});

export const insertCallReductionMetricsSchema = createInsertSchema(callReductionMetrics).omit({
  id: true,
  createdAt: true,
});

export type Assessment = typeof assessments.$inferSelect;
export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;
export type MedicalProtocol = typeof medicalProtocols.$inferSelect;
export type InsertMedicalProtocol = z.infer<typeof insertMedicalProtocolSchema>;
export type UsageAnalytics = typeof usageAnalytics.$inferSelect;
export type InsertUsageAnalytics = z.infer<typeof insertUsageAnalyticsSchema>;
export type CallReductionMetrics = typeof callReductionMetrics.$inferSelect;
export type InsertCallReductionMetrics = z.infer<typeof insertCallReductionMetricsSchema>;
