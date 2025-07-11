import { useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertTriangle, Phone, Home, CheckCircle } from "lucide-react";
import { Assessment } from "@shared/schema";
import { determineUrgency } from "@/lib/medical-protocols";

export default function Results() {
  const [, params] = useRoute("/results/:id");
  const [, setLocation] = useLocation();
  const assessmentId = params?.id;

  const { data: assessment, isLoading, error } = useQuery<Assessment>({
    queryKey: ["/api/assessments", assessmentId],
    enabled: !!assessmentId,
  });

  useEffect(() => {
    if (!assessmentId) {
      setLocation("/");
    }
  }, [assessmentId, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  if (error || !assessment) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-red-600 mb-4">
                Unable to load assessment results. Please try again.
              </p>
              <Button onClick={() => setLocation("/")}>Return Home</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // For this demo, we'll analyze the responses to determine urgency
  const symptom = assessment.symptoms[0] as string;
  const guidelines = {
    emergency: ["Difficulty breathing", "High fever in newborn", "Severe symptoms"],
    call_doctor: ["Persistent symptoms", "Concerning behavior", "Moderate fever"],
    home_care: ["Mild symptoms", "Normal behavior", "Improving condition"]
  };
  
  const urgencyAnalysis = determineUrgency(
    symptom as any,
    assessment.ageGroup as any,
    assessment.responses as any,
    guidelines
  );

  const getRecommendationContent = () => {
    switch (urgencyAnalysis.recommendation) {
      case "emergency":
        return {
          icon: <AlertTriangle className="w-8 h-8 text-red-600" />,
          title: "Seek Emergency Care Immediately",
          description: "Your child's symptoms require immediate medical attention. Call 911 or go to the nearest emergency room.",
          color: "red",
          actions: (
            <div className="space-y-3">
              <Button 
                onClick={() => window.location.href = 'tel:911'}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                <Phone className="w-4 h-4 mr-2" />
                Call 911
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setLocation("/")}
                className="w-full"
              >
                Return Home
              </Button>
            </div>
          )
        };
      
      case "call_doctor":
        return {
          icon: <Phone className="w-8 h-8 text-orange-600" />,
          title: "Contact Your Doctor",
          description: "Your child's symptoms warrant professional medical evaluation. Contact your pediatrician or after-hours nurse line.",
          color: "orange",
          actions: (
            <div className="space-y-3">
              <Button className="w-full bg-orange-600 hover:bg-orange-700">
                <Phone className="w-4 h-4 mr-2" />
                Call Doctor
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setLocation("/")}
                className="w-full"
              >
                Return Home
              </Button>
            </div>
          )
        };
      
      default:
        return {
          icon: <CheckCircle className="w-8 h-8 text-green-600" />,
          title: "Home Care Recommended",
          description: "Your child's symptoms can likely be managed with home care. Monitor closely and contact your doctor if symptoms worsen.",
          color: "green",
          actions: (
            <div className="space-y-3">
              <Button 
                variant="outline" 
                onClick={() => setLocation("/")}
                className="w-full"
              >
                <Home className="w-4 h-4 mr-2" />
                Return Home
              </Button>
            </div>
          )
        };
    }
  };

  const recommendation = getRecommendationContent();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Assessment Results</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Recommendation Summary */}
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                {recommendation.icon}
              </div>
              
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {recommendation.title}
                </h2>
                <p className="text-gray-600">
                  {recommendation.description}
                </p>
              </div>

              <Badge 
                variant={urgencyAnalysis.urgency === "emergency" ? "destructive" : "secondary"}
                className={`text-sm px-3 py-1 ${
                  urgencyAnalysis.urgency === "emergency" 
                    ? 'bg-red-100 text-red-800' 
                    : urgencyAnalysis.urgency === "high"
                    ? 'bg-orange-100 text-orange-800'
                    : 'bg-green-100 text-green-800'
                }`}
              >
                {urgencyAnalysis.urgency.toUpperCase()} PRIORITY
              </Badge>
            </div>

            {/* Assessment Details */}
            <div className="border-t pt-6">
              <h3 className="font-medium text-gray-900 mb-3">Assessment Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Symptom:</span>
                  <span className="capitalize font-medium">{symptom}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Age Group:</span>
                  <span className="capitalize font-medium">{assessment.ageGroup}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Completed:</span>
                  <span className="font-medium">
                    {new Date(assessment.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Reasoning */}
            {urgencyAnalysis.reasoning.length > 0 && (
              <div className="border-t pt-6">
                <h3 className="font-medium text-gray-900 mb-3">Why This Recommendation?</h3>
                <ul className="space-y-2 text-sm">
                  {urgencyAnalysis.reasoning.map((reason, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="border-t pt-6">
              {recommendation.actions}
            </div>

            {/* Important Note */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Remember:</strong> This assessment is for guidance only. Always trust your parental instincts. 
                If you're concerned about your child's health, don't hesitate to seek professional medical care.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
