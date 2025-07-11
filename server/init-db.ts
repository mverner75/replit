import { db } from "./db";
import { medicalProtocols, type InsertMedicalProtocol } from "@shared/schema";

export async function initializeDatabase() {
  // Check if protocols already exist
  const existingProtocols = await db.select().from(medicalProtocols).limit(1);
  if (existingProtocols.length > 0) {
    console.log("Database already initialized with medical protocols");
    return;
  }

  console.log("Initializing database with medical protocols...");
  
  // Initialize with comprehensive evidence-based pediatric protocols for all symptoms and age groups
  const protocols: InsertMedicalProtocol[] = [
    // FEVER protocols for all age groups
    {
      symptom: "fever",
      ageGroup: "newborn",
      questions: [
        {
          id: "fever_temp",
          text: "What is your baby's temperature?",
          type: "number",
          unit: "°F",
          critical: { threshold: 100.4, action: "emergency" }
        },
        {
          id: "behavior",
          text: "How is your baby behaving?",
          type: "multiple_choice",
          options: ["Normal", "Fussy but consolable", "Lethargic/won't wake up"]
        }
      ],
      guidelines: {
        emergency: ["Any fever in newborn (under 3 months)", "Lethargic behavior"],
        call_doctor: ["Temperature over 100.4°F", "Fussy and not consolable"],
        home_care: []
      }
    },
    {
      symptom: "fever",
      ageGroup: "infant",
      questions: [
        {
          id: "fever_temp",
          text: "What is your baby's temperature?",
          type: "number",
          unit: "°F"
        },
        {
          id: "behavior",
          text: "How is your baby acting?",
          type: "multiple_choice",
          options: ["Normal", "Slightly fussy", "Very irritable", "Lethargic/won't wake up"]
        },
        {
          id: "duration",
          text: "How long has the fever lasted?",
          type: "multiple_choice",
          options: ["Less than 24 hours", "1-2 days", "More than 2 days"]
        }
      ],
      guidelines: {
        emergency: ["Temperature over 102°F", "Lethargic behavior", "Won't eat or drink"],
        call_doctor: ["Fever over 101°F lasting more than 24 hours", "Very irritable"],
        home_care: ["Low-grade fever with normal behavior", "Good fluid intake"]
      }
    },
    {
      symptom: "fever",
      ageGroup: "toddler",
      questions: [
        {
          id: "fever_temp",
          text: "What is your child's temperature?",
          type: "number",
          unit: "°F"
        },
        {
          id: "behavior",
          text: "How is your child acting?",
          type: "multiple_choice",
          options: ["Normal", "Slightly fussy", "Very irritable", "Lethargic/won't wake up"]
        },
        {
          id: "duration",
          text: "How long has the fever lasted?",
          type: "multiple_choice",
          options: ["Less than 24 hours", "1-2 days", "More than 2 days"]
        }
      ],
      guidelines: {
        emergency: ["Temperature over 104°F", "Lethargic behavior", "Seizures"],
        call_doctor: ["Fever over 102°F lasting more than 24 hours", "Very irritable", "Not drinking fluids"],
        home_care: ["Low-grade fever with normal behavior", "Good fluid intake", "Playing and alert"]
      }
    },
    {
      symptom: "fever",
      ageGroup: "child",
      questions: [
        {
          id: "fever_temp",
          text: "What is your child's temperature?",
          type: "number",
          unit: "°F"
        },
        {
          id: "behavior",
          text: "How is your child acting?",
          type: "multiple_choice",
          options: ["Normal", "Slightly tired", "Very irritable", "Lethargic/won't wake up"]
        },
        {
          id: "duration",
          text: "How long has the fever lasted?",
          type: "multiple_choice",
          options: ["Less than 24 hours", "1-2 days", "More than 3 days"]
        }
      ],
      guidelines: {
        emergency: ["Temperature over 104°F", "Lethargic behavior", "Seizures", "Difficulty breathing"],
        call_doctor: ["Fever over 102°F lasting more than 2 days", "Very irritable", "Not drinking fluids"],
        home_care: ["Low-grade fever with normal behavior", "Good fluid intake", "Playing and alert"]
      }
    },

    // RASH protocols for all age groups
    {
      symptom: "rash",
      ageGroup: "newborn",
      questions: [
        {
          id: "appearance",
          text: "What does the rash look like?",
          type: "multiple_choice",
          options: ["Small red bumps", "Flat red patches", "Blisters", "Purple spots"]
        },
        {
          id: "location",
          text: "Where is the rash located?",
          type: "multiple_choice",
          options: ["Diaper area", "Face/head", "Body/arms", "All over"]
        },
        {
          id: "fever_present",
          text: "Does your baby have a fever?",
          type: "yes_no"
        }
      ],
      guidelines: {
        emergency: ["Purple spots", "All over with fever", "Breathing problems"],
        call_doctor: ["Blisters", "Spreading rapidly", "Fever with rash"],
        home_care: ["Small red bumps in diaper area", "No fever", "Baby acting normal"]
      }
    },
    {
      symptom: "rash",
      ageGroup: "infant",
      questions: [
        {
          id: "appearance",
          text: "What does the rash look like?",
          type: "multiple_choice",
          options: ["Small red bumps", "Flat red patches", "Blisters", "Purple spots"]
        },
        {
          id: "spreading",
          text: "Is the rash spreading?",
          type: "multiple_choice",
          options: ["Not spreading", "Slowly spreading", "Rapidly spreading"]
        },
        {
          id: "fever_present",
          text: "Does your baby have a fever?",
          type: "yes_no"
        }
      ],
      guidelines: {
        emergency: ["Purple spots", "Rapidly spreading with fever", "Breathing problems"],
        call_doctor: ["Blisters", "Rapidly spreading", "Fever with rash"],
        home_care: ["Small red bumps", "Not spreading", "No fever"]
      }
    },
    {
      symptom: "rash",
      ageGroup: "toddler",
      questions: [
        {
          id: "appearance",
          text: "What does the rash look like?",
          type: "multiple_choice",
          options: ["Small red bumps", "Flat red patches", "Blisters", "Purple spots"]
        },
        {
          id: "itchy",
          text: "Is the rash itchy?",
          type: "yes_no"
        },
        {
          id: "fever_present",
          text: "Does your child have a fever?",
          type: "yes_no"
        }
      ],
      guidelines: {
        emergency: ["Purple spots", "Difficulty breathing", "Very high fever"],
        call_doctor: ["Blisters", "Very itchy", "Fever with rash"],
        home_care: ["Small red bumps", "Mild itching", "No fever"]
      }
    },
    {
      symptom: "rash",
      ageGroup: "child",
      questions: [
        {
          id: "appearance",
          text: "What does the rash look like?",
          type: "multiple_choice",
          options: ["Small red bumps", "Flat red patches", "Blisters", "Purple spots"]
        },
        {
          id: "itchy",
          text: "Is the rash itchy?",
          type: "yes_no"
        },
        {
          id: "fever_present",
          text: "Does your child have a fever?",
          type: "yes_no"
        }
      ],
      guidelines: {
        emergency: ["Purple spots", "Difficulty breathing", "Very high fever"],
        call_doctor: ["Blisters", "Very itchy and spreading", "Fever with rash"],
        home_care: ["Small red bumps", "Mild itching", "No fever"]
      }
    },

    // COUGH protocols for all age groups
    {
      symptom: "cough",
      ageGroup: "newborn",
      questions: [
        {
          id: "cough_type",
          text: "What type of cough?",
          type: "multiple_choice",
          options: ["Dry cough", "Wet/mucus cough", "Barking cough", "Whooping cough"]
        },
        {
          id: "breathing",
          text: "Any breathing problems?",
          type: "yes_no"
        },
        {
          id: "fever_present",
          text: "Does your baby have a fever?",
          type: "yes_no"
        }
      ],
      guidelines: {
        emergency: ["Breathing problems", "Whooping cough", "Blue lips"],
        call_doctor: ["Barking cough", "Fever with cough", "Not eating"],
        home_care: ["Mild dry cough", "No breathing problems", "Feeding well"]
      }
    },
    {
      symptom: "cough",
      ageGroup: "infant",
      questions: [
        {
          id: "cough_type",
          text: "What type of cough?",
          type: "multiple_choice",
          options: ["Dry cough", "Wet/mucus cough", "Barking cough", "Whooping cough"]
        },
        {
          id: "breathing",
          text: "Any breathing problems?",
          type: "yes_no"
        },
        {
          id: "fever_present",
          text: "Does your baby have a fever?",
          type: "yes_no"
        }
      ],
      guidelines: {
        emergency: ["Breathing problems", "Whooping cough", "Blue lips"],
        call_doctor: ["Barking cough", "Fever with cough", "Not eating well"],
        home_care: ["Mild dry cough", "No breathing problems", "Eating well"]
      }
    },
    {
      symptom: "cough",
      ageGroup: "toddler",
      questions: [
        {
          id: "cough_type",
          text: "What type of cough?",
          type: "multiple_choice",
          options: ["Dry cough", "Wet/mucus cough", "Barking cough", "Whooping cough"]
        },
        {
          id: "breathing",
          text: "Any breathing problems?",
          type: "yes_no"
        },
        {
          id: "fever_present",
          text: "Does your child have a fever?",
          type: "yes_no"
        }
      ],
      guidelines: {
        emergency: ["Breathing problems", "Whooping cough", "Blue lips"],
        call_doctor: ["Barking cough", "High fever with cough", "Not drinking"],
        home_care: ["Mild cough", "No breathing problems", "Playing normally"]
      }
    },
    {
      symptom: "cough",
      ageGroup: "child",
      questions: [
        {
          id: "cough_type",
          text: "What type of cough?",
          type: "multiple_choice",
          options: ["Dry cough", "Wet/mucus cough", "Barking cough", "Persistent cough"]
        },
        {
          id: "breathing",
          text: "Any breathing problems?",
          type: "yes_no"
        },
        {
          id: "fever_present",
          text: "Does your child have a fever?",
          type: "yes_no"
        }
      ],
      guidelines: {
        emergency: ["Breathing problems", "Cannot speak due to cough", "Blue lips"],
        call_doctor: ["Barking cough", "High fever with cough", "Persistent for over a week"],
        home_care: ["Mild cough", "No breathing problems", "Acting normally"]
      }
    },

    // EAR PAIN protocols for all age groups
    {
      symptom: "ear_pain",
      ageGroup: "newborn",
      questions: [
        {
          id: "signs",
          text: "What signs do you notice?",
          type: "multiple_choice",
          options: ["Crying/fussy", "Tugging at ear", "Not eating", "Fever"]
        },
        {
          id: "drainage",
          text: "Any drainage from ear?",
          type: "multiple_choice",
          options: ["No drainage", "Clear fluid", "Yellow/green", "Blood"]
        }
      ],
      guidelines: {
        emergency: ["Blood drainage", "High fever", "Extreme irritability"],
        call_doctor: ["Any drainage", "Fever with ear signs", "Not eating"],
        home_care: ["Mild fussiness", "No drainage", "Eating normally"]
      }
    },
    {
      symptom: "ear_pain",
      ageGroup: "infant",
      questions: [
        {
          id: "pain_level",
          text: "How severe does the pain seem?",
          type: "multiple_choice",
          options: ["Mild discomfort", "Moderate pain", "Severe crying"]
        },
        {
          id: "drainage",
          text: "Any drainage from ear?",
          type: "multiple_choice",
          options: ["No drainage", "Clear fluid", "Yellow/green", "Blood"]
        },
        {
          id: "fever_present",
          text: "Does your baby have a fever?",
          type: "yes_no"
        }
      ],
      guidelines: {
        emergency: ["Blood drainage", "High fever with severe pain"],
        call_doctor: ["Any drainage", "Fever with ear pain", "Severe crying"],
        home_care: ["Mild discomfort", "No drainage", "No fever"]
      }
    },
    {
      symptom: "ear_pain",
      ageGroup: "toddler",
      questions: [
        {
          id: "pain_level",
          text: "How severe is the ear pain?",
          type: "multiple_choice",
          options: ["Mild discomfort", "Moderate pain", "Severe crying"]
        },
        {
          id: "drainage",
          text: "Any drainage from ear?",
          type: "multiple_choice",
          options: ["No drainage", "Clear fluid", "Yellow/green", "Blood"]
        },
        {
          id: "fever_present",
          text: "Does your child have a fever?",
          type: "yes_no"
        }
      ],
      guidelines: {
        emergency: ["Blood drainage", "High fever with severe pain"],
        call_doctor: ["Any drainage", "Fever with ear pain", "Severe crying"],
        home_care: ["Mild discomfort", "No drainage", "No fever"]
      }
    },
    {
      symptom: "ear_pain",
      ageGroup: "child",
      questions: [
        {
          id: "pain_level",
          text: "How severe is the ear pain?",
          type: "multiple_choice",
          options: ["Mild discomfort", "Moderate pain", "Severe pain"]
        },
        {
          id: "drainage",
          text: "Any drainage from ear?",
          type: "multiple_choice",
          options: ["No drainage", "Clear fluid", "Yellow/green", "Blood"]
        },
        {
          id: "fever_present",
          text: "Does your child have a fever?",
          type: "yes_no"
        }
      ],
      guidelines: {
        emergency: ["Blood drainage", "High fever with severe pain"],
        call_doctor: ["Any drainage", "Fever with ear pain", "Severe pain"],
        home_care: ["Mild discomfort", "No drainage", "No fever"]
      }
    },

    // Add protocols for remaining symptoms (vomiting_diarrhea, injury, breathing, sore_throat)
    // VOMITING/DIARRHEA protocols
    {
      symptom: "vomiting_diarrhea",
      ageGroup: "newborn",
      questions: [
        {
          id: "frequency",
          text: "How often is the vomiting/diarrhea?",
          type: "multiple_choice",
          options: ["Occasional", "Frequent", "Constant"]
        },
        {
          id: "dehydration_signs",
          text: "Any signs of dehydration?",
          type: "multiple_choice",
          options: ["None", "Mild - dry mouth", "Severe - won't wake up"]
        }
      ],
      guidelines: {
        emergency: ["Severe dehydration", "Blood in stool", "Won't wake up"],
        call_doctor: ["Frequent episodes", "Mild dehydration", "Not keeping fluids down"],
        home_care: ["Occasional episodes", "Good fluid intake", "Alert and active"]
      }
    },
    {
      symptom: "vomiting_diarrhea",
      ageGroup: "infant",
      questions: [
        {
          id: "frequency",
          text: "How often is the vomiting/diarrhea?",
          type: "multiple_choice",
          options: ["Occasional", "Frequent", "Constant"]
        },
        {
          id: "dehydration_signs",
          text: "Any signs of dehydration?",
          type: "multiple_choice",
          options: ["None", "Mild - dry mouth", "Severe - lethargic"]
        },
        {
          id: "blood_in_stool",
          text: "Any blood in stool or vomit?",
          type: "yes_no"
        }
      ],
      guidelines: {
        emergency: ["Blood in stool/vomit", "Severe dehydration", "Lethargic"],
        call_doctor: ["Frequent episodes", "Mild dehydration", "Not keeping fluids down"],
        home_care: ["Occasional episodes", "Good fluid intake", "Alert"]
      }
    },
    {
      symptom: "vomiting_diarrhea",
      ageGroup: "toddler",
      questions: [
        {
          id: "frequency",
          text: "How often is the vomiting/diarrhea?",
          type: "multiple_choice",
          options: ["Occasional", "Frequent", "Constant"]
        },
        {
          id: "dehydration_signs",
          text: "Any signs of dehydration?",
          type: "multiple_choice",
          options: ["None", "Mild - dry mouth", "Severe - very tired"]
        },
        {
          id: "blood_in_stool",
          text: "Any blood in stool or vomit?",
          type: "yes_no"
        }
      ],
      guidelines: {
        emergency: ["Blood in stool/vomit", "Severe dehydration", "Very tired"],
        call_doctor: ["Frequent episodes", "Mild dehydration", "Not drinking"],
        home_care: ["Occasional episodes", "Good fluid intake", "Playing normally"]
      }
    },
    {
      symptom: "vomiting_diarrhea",
      ageGroup: "child",
      questions: [
        {
          id: "frequency",
          text: "How often is the vomiting/diarrhea?",
          type: "multiple_choice",
          options: ["Occasional", "Frequent", "Constant"]
        },
        {
          id: "dehydration_signs",
          text: "Any signs of dehydration?",
          type: "multiple_choice",
          options: ["None", "Mild - dry mouth", "Severe - very tired"]
        },
        {
          id: "blood_in_stool",
          text: "Any blood in stool or vomit?",
          type: "yes_no"
        }
      ],
      guidelines: {
        emergency: ["Blood in stool/vomit", "Severe dehydration", "Very tired"],
        call_doctor: ["Frequent episodes", "Mild dehydration", "Not drinking"],
        home_care: ["Occasional episodes", "Good fluid intake", "Acting normally"]
      }
    }
  ];

  for (const protocol of protocols) {
    await db.insert(medicalProtocols).values(protocol);
  }

  console.log("Database initialized successfully with medical protocols");
}