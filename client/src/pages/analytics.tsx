import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Activity, Users, Phone, AlertTriangle, TrendingUp, Calendar } from "lucide-react";

interface AnalyticsDashboard {
  last30Days: {
    period: string;
    summary: {
      totalAssessments: number;
      emergencyRecommendations: number;
      callDoctorRecommendations: number;
      homeCareRecommendations: number;
    };
    callReductionRate: string;
  };
  last6Months: {
    timeframe: string;
    totalSummary: {
      totalAssessments: number;
      estimatedCallsAvoided: number;
      potentialEmergenciesIdentified: number;
    };
    impactMetrics: {
      callReductionRate: string;
      emergencyDetectionRate: string;
    };
  };
  generated: string;
}

export default function Analytics() {
  const { data: analytics, isLoading, error } = useQuery<AnalyticsDashboard>({
    queryKey: ["/api/analytics/dashboard"],
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Analytics Unavailable</CardTitle>
            <CardDescription>
              Unable to load analytics data. This feature requires database tracking to be enabled.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const { last30Days, last6Months } = analytics;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">PediTriage Analytics</h1>
          <p className="text-muted-foreground">
            Impact metrics and usage insights for after-hours pediatric care
          </p>
        </div>
        <Badge variant="secondary" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Last updated: {new Date(analytics.generated).toLocaleString()}
        </Badge>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assessments</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {last30Days.summary.totalAssessments.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calls Avoided</CardTitle>
            <Phone className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {last6Months.totalSummary.estimatedCallsAvoided.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Last 6 months</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emergencies Identified</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {last6Months.totalSummary.potentialEmergenciesIdentified.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Last 6 months</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Call Reduction Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {last6Months.impactMetrics.callReductionRate}
            </div>
            <p className="text-xs text-muted-foreground">Of assessments result in home care</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Assessment Outcomes (30 Days)</CardTitle>
            <CardDescription>
              Distribution of care recommendations from recent assessments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Home Care</span>
                <span className="text-sm font-medium text-green-600">
                  {last30Days.summary.homeCareRecommendations}
                </span>
              </div>
              <Progress 
                value={(last30Days.summary.homeCareRecommendations / last30Days.summary.totalAssessments) * 100}
                className="h-2"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Call Doctor</span>
                <span className="text-sm font-medium text-yellow-600">
                  {last30Days.summary.callDoctorRecommendations}
                </span>
              </div>
              <Progress 
                value={(last30Days.summary.callDoctorRecommendations / last30Days.summary.totalAssessments) * 100}
                className="h-2"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Emergency</span>
                <span className="text-sm font-medium text-red-600">
                  {last30Days.summary.emergencyRecommendations}
                </span>
              </div>
              <Progress 
                value={(last30Days.summary.emergencyRecommendations / last30Days.summary.totalAssessments) * 100}
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Impact Summary (6 Months)</CardTitle>
            <CardDescription>
              Estimated impact on reducing after-hours medical calls
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <div className="text-3xl font-bold text-green-700 dark:text-green-300">
                {last6Months.impactMetrics.callReductionRate}
              </div>
              <p className="text-sm text-green-600 dark:text-green-400">
                Call Reduction Rate
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Assessments resulting in home care guidance
              </p>
            </div>
            
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                {last6Months.impactMetrics.emergencyDetectionRate}
              </div>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                Emergency Detection Rate
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Critical conditions identified early
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Professional Benefits */}
      <Card>
        <CardHeader>
          <CardTitle>Clinical Impact for Healthcare Providers</CardTitle>
          <CardDescription>
            How PediTriage supports medical practice efficiency and patient outcomes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 border rounded-lg">
              <Users className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="font-semibold">Reduced Workload</div>
              <p className="text-sm text-muted-foreground">
                {last6Months.totalSummary.estimatedCallsAvoided} fewer after-hours calls to manage
              </p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <div className="font-semibold">Early Detection</div>
              <p className="text-sm text-muted-foreground">
                {last6Months.totalSummary.potentialEmergenciesIdentified} emergency situations identified promptly
              </p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="font-semibold">Better Outcomes</div>
              <p className="text-sm text-muted-foreground">
                Evidence-based guidance improves patient care quality
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}