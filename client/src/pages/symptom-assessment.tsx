import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft, ArrowRight } from "lucide-react";
import { AgeGroup, Symptom, Question, SymptomResponse } from "@/types/medical";
import { queryClient, apiRequest } from "@/lib/queryClient";

export default function SymptomAssessment() {
  const [, params] = useRoute("/assessment/:symptom/:ageGroup");
  const [, setLocation] = useLocation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<SymptomResponse[]>([]);
  const [currentValue, setCurrentValue] = useState<string>("");

  const symptom = params?.symptom as Symptom;
  const ageGroup = params?.ageGroup as AgeGroup;

  const { data: protocol, isLoading, error } = useQuery({
    queryKey: ["/api/protocols", symptom, ageGroup],
    enabled: !!(symptom && ageGroup),
  });

  const createAssessmentMutation = useMutation({
    mutationFn: async (assessmentData: any) => {
      const response = await apiRequest("POST", "/api/assessments", assessmentData);
      return response.json();
    },
    onSuccess: (data) => {
      setLocation(`/results/${data.id}`);
    }
  });

  useEffect(() => {
    if (!symptom || !ageGroup) {
      setLocation("/");
    }
  }, [symptom, ageGroup, setLocation]);

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

  if (error || !protocol) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-red-600 mb-4">
                Unable to load assessment protocol. Please try again or contact support.
              </p>
              <Button onClick={() => setLocation("/")}>Return Home</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const questions = protocol.questions as Question[];
  const currentQ = questions[currentQuestion];

  const handleNext = () => {
    if (!currentValue) return;

    const response: SymptomResponse = {
      questionId: currentQ.id,
      value: currentQ.type === "number" ? parseFloat(currentValue) : currentValue,
    };

    const newResponses = [...responses];
    const existingIndex = newResponses.findIndex(r => r.questionId === currentQ.id);
    
    if (existingIndex >= 0) {
      newResponses[existingIndex] = response;
    } else {
      newResponses.push(response);
    }
    
    setResponses(newResponses);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setCurrentValue("");
    } else {
      // Complete assessment
      const assessmentData = {
        ageGroup,
        symptoms: [symptom],
        responses: newResponses,
        recommendation: "pending",
        urgencyLevel: "pending",
      };
      
      createAssessmentMutation.mutate(assessmentData);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      const previousResponse = responses.find(r => r.questionId === questions[currentQuestion - 1].id);
      setCurrentValue(previousResponse?.value?.toString() || "");
    } else {
      setLocation("/");
    }
  };

  const renderQuestionInput = () => {
    switch (currentQ.type) {
      case "yes_no":
        return (
          <RadioGroup value={currentValue} onValueChange={setCurrentValue}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="yes" />
              <Label htmlFor="yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="no" />
              <Label htmlFor="no">No</Label>
            </div>
          </RadioGroup>
        );
      
      case "multiple_choice":
        return (
          <RadioGroup value={currentValue} onValueChange={setCurrentValue}>
            {currentQ.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );
      
      case "number":
        return (
          <div>
            <Input
              type="number"
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              placeholder={currentQ.unit ? `Enter value in ${currentQ.unit}` : "Enter number"}
              className="w-full"
            />
            {currentQ.unit && (
              <p className="text-sm text-gray-500 mt-1">Unit: {currentQ.unit}</p>
            )}
          </div>
        );
      
      default:
        return (
          <Input
            type="text"
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            placeholder="Enter your response"
            className="w-full"
          />
        );
    }
  };

  const isLastQuestion = currentQuestion === questions.length - 1;
  const canProceed = currentValue !== "";

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="capitalize">
                {symptom} Assessment - {ageGroup}
              </CardTitle>
              <span className="text-sm text-gray-500">
                {currentQuestion + 1} of {questions.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              />
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div>
              <Label className="text-lg font-medium text-gray-900 mb-4 block">
                {currentQ.text}
              </Label>
              {renderQuestionInput()}
            </div>

            {currentQ.critical && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">
                  <strong>Important:</strong> If the value is {currentQ.critical.threshold} or higher, 
                  seek immediate medical attention.
                </p>
              </div>
            )}

            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>

              <Button
                onClick={handleNext}
                disabled={!canProceed || createAssessmentMutation.isPending}
                className="flex items-center"
              >
                {createAssessmentMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : isLastQuestion ? (
                  "Complete Assessment"
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
