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
  
  // Initialize with evidence-based pediatric protocols
  const protocols: InsertMedicalProtocol[] = [
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
      symptom: "ear_pain",
      ageGroup: "toddler",
      questions: [
        {
          id: "pain_level",
          text: "How severe is the ear pain?",
          type: "multiple_choice",
          options: ["Mild discomfort", "Moderate pain", "Severe - child crying inconsolably"]
        },
        {
          id: "drainage",
          text: "Is there any drainage from the ear?",
          type: "multiple_choice",
          options: ["No drainage", "Clear fluid", "Yellow/green discharge", "Blood"]
        },
        {
          id: "fever_present",
          text: "Does your child have a fever?",
          type: "yes_no"
        }
      ],
      guidelines: {
        emergency: ["Blood drainage from ear", "High fever with severe pain"],
        call_doctor: ["Severe pain", "Fever with ear pain", "Any drainage"],
        home_care: ["Mild discomfort without fever", "No drainage"]
      }
    },
    {
      symptom: "breathing",
      ageGroup: "child",
      questions: [
        {
          id: "breathing_difficulty",
          text: "How is your child's breathing?",
          type: "multiple_choice",
          options: ["Normal", "Slightly fast", "Working hard to breathe", "Severe difficulty"]
        },
        {
          id: "color_changes",
          text: "Are there any color changes?",
          type: "yes_no"
        },
        {
          id: "speaking",
          text: "Can your child speak normally?",
          type: "multiple_choice",
          options: ["Normal speech", "Short sentences", "Few words", "Cannot speak"]
        }
      ],
      guidelines: {
        emergency: ["Severe breathing difficulty", "Blue lips or face", "Cannot speak"],
        call_doctor: ["Working hard to breathe", "Fast breathing", "Wheezing"],
        home_care: ["Mild cough with normal breathing"]
      }
    }
  ];

  for (const protocol of protocols) {
    await db.insert(medicalProtocols).values(protocol);
  }

  console.log("Database initialized successfully with medical protocols");
}