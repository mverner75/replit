import { storage } from "./storage";
import type { Assessment, InsertUsageAnalytics, InsertCallReductionMetrics } from "@shared/schema";

export async function updateAnalyticsAfterAssessment(assessment: Assessment) {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  const currentMonth = today.substring(0, 7); // YYYY-MM format
  
  try {
    // Update daily usage analytics
    await updateDailyAnalytics(assessment, today);
    
    // Update monthly call reduction metrics
    await updateMonthlyMetrics(assessment, currentMonth);
  } catch (error) {
    console.error('Failed to update analytics:', error);
    // Don't throw - analytics failure shouldn't break the assessment flow
  }
}

async function updateDailyAnalytics(assessment: Assessment, date: string) {
  const existing = await storage.getDailyUsageAnalytics(date);
  
  // Get symptom from assessment (first symptom if multiple)
  const symptoms = Array.isArray(assessment.symptoms) ? assessment.symptoms : [assessment.symptoms];
  const primarySymptom = symptoms[0] || 'unknown';
  
  // Calculate new analytics
  const analytics: InsertUsageAnalytics = {
    date,
    totalAssessments: (existing?.totalAssessments || 0) + 1,
    emergencyRecommendations: existing?.emergencyRecommendations || 0,
    callDoctorRecommendations: existing?.callDoctorRecommendations || 0,
    homeCareRecommendations: existing?.homeCareRecommendations || 0,
    topSymptoms: updateSymptomCounts(existing?.topSymptoms as any, primarySymptom),
    topAgeGroups: updateAgeGroupCounts(existing?.topAgeGroups as any, assessment.ageGroup),
    avgCompletionTime: null, // Will implement timing tracking later
  };
  
  // Increment the appropriate recommendation counter
  switch (assessment.recommendation) {
    case 'emergency':
      analytics.emergencyRecommendations! += 1;
      break;
    case 'call_doctor':
      analytics.callDoctorRecommendations! += 1;
      break;
    case 'home_care':
      analytics.homeCareRecommendations! += 1;
      break;
  }
  
  await storage.updateDailyUsageAnalytics(analytics);
}

async function updateMonthlyMetrics(assessment: Assessment, month: string) {
  const existing = await storage.getMonthlyCallReductionMetrics(month);
  
  // Calculate calls potentially avoided (home_care recommendations)
  const callsAvoided = assessment.recommendation === 'home_care' ? 1 : 0;
  const emergenciesIdentified = assessment.recommendation === 'emergency' ? 1 : 0;
  
  const metrics: InsertCallReductionMetrics = {
    month,
    totalAssessments: (existing?.totalAssessments || 0) + 1,
    estimatedCallsAvoided: (existing?.estimatedCallsAvoided || 0) + callsAvoided,
    potentialEmergenciesIdentified: (existing?.potentialEmergenciesIdentified || 0) + emergenciesIdentified,
    userSatisfactionScore: existing?.userSatisfactionScore || null, // Future feature
  };
  
  await storage.updateMonthlyCallReductionMetrics(metrics);
}

function updateSymptomCounts(existing: Record<string, number> | null, symptom: string): Record<string, number> {
  const counts = existing || {};
  counts[symptom] = (counts[symptom] || 0) + 1;
  return counts;
}

function updateAgeGroupCounts(existing: Record<string, number> | null, ageGroup: string): Record<string, number> {
  const counts = existing || {};
  counts[ageGroup] = (counts[ageGroup] || 0) + 1;
  return counts;
}

export async function generateUsageReport(days: number = 30) {
  const endDate = new Date().toISOString().split('T')[0];
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  const analytics = await storage.getUsageAnalyticsRange(startDate, endDate);
  
  const summary = analytics.reduce((acc, day) => {
    acc.totalAssessments += day.totalAssessments || 0;
    acc.emergencyRecommendations += day.emergencyRecommendations || 0;
    acc.callDoctorRecommendations += day.callDoctorRecommendations || 0;
    acc.homeCareRecommendations += day.homeCareRecommendations || 0;
    return acc;
  }, {
    totalAssessments: 0,
    emergencyRecommendations: 0,
    callDoctorRecommendations: 0,
    homeCareRecommendations: 0
  });
  
  return {
    period: `${startDate} to ${endDate}`,
    summary,
    dailyData: analytics,
    callReductionRate: summary.totalAssessments > 0 
      ? (summary.homeCareRecommendations / summary.totalAssessments * 100).toFixed(1) + '%'
      : '0%'
  };
}

export async function generateCallReductionReport(months: number = 12) {
  const metrics = await storage.getCallReductionTrends(months);
  
  const totalSummary = metrics.reduce((acc, month) => {
    acc.totalAssessments += month.totalAssessments || 0;
    acc.estimatedCallsAvoided += month.estimatedCallsAvoided || 0;
    acc.potentialEmergenciesIdentified += month.potentialEmergenciesIdentified || 0;
    return acc;
  }, {
    totalAssessments: 0,
    estimatedCallsAvoided: 0,
    potentialEmergenciesIdentified: 0
  });
  
  return {
    timeframe: `Last ${months} months`,
    totalSummary,
    monthlyData: metrics,
    impactMetrics: {
      callReductionRate: totalSummary.totalAssessments > 0 
        ? (totalSummary.estimatedCallsAvoided / totalSummary.totalAssessments * 100).toFixed(1) + '%'
        : '0%',
      emergencyDetectionRate: totalSummary.totalAssessments > 0 
        ? (totalSummary.potentialEmergenciesIdentified / totalSummary.totalAssessments * 100).toFixed(1) + '%'
        : '0%'
    }
  };
}