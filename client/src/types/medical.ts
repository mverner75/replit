export type AgeGroup = "newborn" | "infant" | "toddler" | "child";
export type Symptom = "fever" | "rash" | "cough" | "ear_pain" | "vomiting_diarrhea" | "injury" | "breathing" | "sore_throat";
export type UrgencyLevel = "low" | "medium" | "high" | "emergency";
export type Recommendation = "home_care" | "call_doctor" | "emergency";

export interface Question {
  id: string;
  text: string;
  type: "yes_no" | "multiple_choice" | "number" | "text";
  options?: string[];
  unit?: string;
  critical?: {
    threshold: number;
    action: string;
  };
}

export interface SymptomResponse {
  questionId: string;
  value: string | number | boolean;
}

export interface AssessmentData {
  ageGroup: AgeGroup;
  symptoms: Symptom[];
  responses: SymptomResponse[];
}

export interface Guidelines {
  emergency: string[];
  call_doctor: string[];
  home_care: string[];
}
