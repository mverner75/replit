import { AgeGroup, Symptom, UrgencyLevel, Recommendation, SymptomResponse, Guidelines } from "@/types/medical";

export function determineUrgency(
  symptom: Symptom,
  ageGroup: AgeGroup,
  responses: SymptomResponse[],
  guidelines: Guidelines
): { urgency: UrgencyLevel; recommendation: Recommendation; reasoning: string[] } {
  
  const reasoning: string[] = [];
  
  // Emergency conditions
  if (checkEmergencyConditions(symptom, ageGroup, responses, guidelines)) {
    reasoning.push("Emergency conditions detected requiring immediate medical attention");
    return { urgency: "emergency", recommendation: "emergency", reasoning };
  }
  
  // Call doctor conditions
  if (checkCallDoctorConditions(symptom, ageGroup, responses, guidelines)) {
    reasoning.push("Symptoms warrant professional medical evaluation");
    return { urgency: "high", recommendation: "call_doctor", reasoning };
  }
  
  // Home care appropriate
  reasoning.push("Symptoms can likely be managed with home care");
  return { urgency: "low", recommendation: "home_care", reasoning };
}

function checkEmergencyConditions(
  symptom: Symptom,
  ageGroup: AgeGroup,
  responses: SymptomResponse[],
  guidelines: Guidelines
): boolean {
  
  // Fever emergency conditions
  if (symptom === "fever") {
    const tempResponse = responses.find(r => r.questionId === "fever_temp");
    const temp = tempResponse?.value as number;
    
    if (ageGroup === "newborn" && temp >= 100.4) return true;
    if (ageGroup === "infant" && temp >= 102) return true;
    
    const behaviorResponse = responses.find(r => r.questionId === "behavior");
    if (behaviorResponse?.value === "Lethargic/won't wake up") return true;
  }
  
  // Breathing difficulties
  const breathingResponse = responses.find(r => r.questionId === "breathing");
  const colorResponse = responses.find(r => r.questionId === "color_changes");
  const speakingResponse = responses.find(r => r.questionId === "speaking");
  
  if (breathingResponse?.value === true || breathingResponse?.value === "yes") return true;
  if (colorResponse?.value === true || colorResponse?.value === "yes") return true;
  if (speakingResponse?.value === "Cannot speak") return true;
  
  // Rash emergency conditions
  if (symptom === "rash") {
    const appearanceResponse = responses.find(r => r.questionId === "appearance");
    if (appearanceResponse?.value === "Purple spots") return true;
    
    const spreadingResponse = responses.find(r => r.questionId === "spreading");
    if (spreadingResponse?.value === "Rapidly spreading") return true;
  }
  
  // Ear pain emergency conditions
  if (symptom === "ear_pain") {
    const drainageResponse = responses.find(r => r.questionId === "drainage");
    if (drainageResponse?.value === "Blood") return true;
  }
  
  // Vomiting/Diarrhea emergency conditions
  if (symptom === "vomiting_diarrhea") {
    const bloodResponse = responses.find(r => r.questionId === "blood_in_stool");
    const dehydrationResponse = responses.find(r => r.questionId === "dehydration_signs");
    const fluidResponse = responses.find(r => r.questionId === "fluid_intake");
    
    if (bloodResponse?.value === true || bloodResponse?.value === "yes") return true;
    if (dehydrationResponse?.value === "Severe - won't wake up") return true;
    if (fluidResponse?.value === "Nothing staying down") return true;
  }
  
  // Injury emergency conditions
  if (symptom === "injury") {
    const severityResponse = responses.find(r => r.questionId === "injury_severity");
    const bleedingResponse = responses.find(r => r.questionId === "bleeding");
    const consciousnessResponse = responses.find(r => r.questionId === "consciousness");
    
    if (severityResponse?.value === "Very severe - bone visible") return true;
    if (bleedingResponse?.value === "Heavy bleeding that won't stop") return true;
    if (consciousnessResponse?.value === false || consciousnessResponse?.value === "no") return true;
  }
  
  // Sore throat emergency conditions
  if (symptom === "sore_throat") {
    const difficultyResponse = responses.find(r => r.questionId === "difficulty_breathing_throat");
    if (difficultyResponse?.value === "Cannot swallow/breathe") return true;
  }
  
  return false;
}

function checkCallDoctorConditions(
  symptom: Symptom,
  ageGroup: AgeGroup,
  responses: SymptomResponse[],
  guidelines: Guidelines
): boolean {
  
  // Duration-based concerns
  const durationResponse = responses.find(r => r.questionId === "duration");
  if (durationResponse?.value === "More than 3 days" || durationResponse?.value === "More than 3 weeks") {
    return true;
  }
  
  // Fever with rash
  const feverResponse = responses.find(r => r.questionId === "fever");
  if (feverResponse?.value === true || feverResponse?.value === "yes") {
    return true;
  }
  
  // Concerning behaviors
  const behaviorResponse = responses.find(r => r.questionId === "behavior");
  if (behaviorResponse?.value === "Very fussy/hard to console" || 
      behaviorResponse?.value === "Very irritable") {
    return true;
  }
  
  return false;
}

export function getAgeGroupInfo(ageGroup: AgeGroup) {
  const info = {
    newborn: {
      label: "Newborn",
      description: "0-2 months",
      color: "blue",
      feverThreshold: 100.4,
      specialConcerns: ["Any fever requires immediate evaluation", "Feeding difficulties", "Excessive sleepiness"]
    },
    infant: {
      label: "Infant", 
      description: "2-12 months",
      color: "green",
      feverThreshold: 101,
      specialConcerns: ["High fever", "Poor feeding", "Unusual fussiness"]
    },
    toddler: {
      label: "Toddler",
      description: "1-3 years", 
      color: "yellow",
      feverThreshold: 102,
      specialConcerns: ["Persistent symptoms", "Breathing difficulties", "Dehydration"]
    },
    child: {
      label: "Child",
      description: "3+ years",
      color: "purple", 
      feverThreshold: 102,
      specialConcerns: ["Severe symptoms", "Breathing problems", "Persistent illness"]
    }
  };
  
  return info[ageGroup];
}
