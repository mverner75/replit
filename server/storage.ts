import { assessments, medicalProtocols, type Assessment, type InsertAssessment, type MedicalProtocol, type InsertMedicalProtocol } from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  getAssessment(id: number): Promise<Assessment | undefined>;
  createAssessment(assessment: InsertAssessment): Promise<Assessment>;
  getMedicalProtocol(symptom: string, ageGroup: string): Promise<MedicalProtocol | undefined>;
  getAllMedicalProtocols(): Promise<MedicalProtocol[]>;
  createMedicalProtocol(protocol: InsertMedicalProtocol): Promise<MedicalProtocol>;
}

export class MemStorage implements IStorage {
  private assessments: Map<number, Assessment>;
  private medicalProtocols: Map<string, MedicalProtocol>;
  private currentAssessmentId: number;
  private currentProtocolId: number;

  constructor() {
    this.assessments = new Map();
    this.medicalProtocols = new Map();
    this.currentAssessmentId = 1;
    this.currentProtocolId = 1;
    this.initializeMedicalProtocols();
  }

  private initializeMedicalProtocols() {
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
            text: "How is your baby acting?",
            type: "multiple_choice",
            options: ["Normal/alert", "Fussy but consolable", "Very fussy/hard to console", "Lethargic/won't wake up"]
          }
        ],
        guidelines: {
          emergency: ["Any fever ≥100.4°F (38°C)", "Lethargic or won't wake up", "Difficulty breathing"],
          call_doctor: ["Fever with unusual fussiness", "Poor feeding", "Rash with fever"],
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
            id: "duration",
            text: "How long has the fever lasted?",
            type: "multiple_choice",
            options: ["Less than 24 hours", "1-2 days", "2-3 days", "More than 3 days"]
          },
          {
            id: "behavior",
            text: "How is your baby acting?",
            type: "multiple_choice",
            options: ["Normal when fever down", "Fussy but consolable", "Very irritable", "Lethargic"]
          }
        ],
        guidelines: {
          emergency: ["Fever ≥102°F (38.9°C) under 6 months", "Difficulty breathing", "Severe lethargy"],
          call_doctor: ["Fever >48 hours", "Fever with rash", "Poor feeding", "Vomiting"],
          home_care: ["Low-grade fever with normal behavior", "Good hydration", "Normal feeding"]
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
            options: ["Small red spots", "Large red patches", "Raised bumps", "Blisters", "Purple spots"]
          },
          {
            id: "fever",
            text: "Does your child have a fever with the rash?",
            type: "yes_no"
          },
          {
            id: "spreading",
            text: "Is the rash spreading?",
            type: "multiple_choice",
            options: ["Not spreading", "Slowly spreading", "Rapidly spreading"]
          }
        ],
        guidelines: {
          emergency: ["Purple spots (petechiae)", "Rash with high fever", "Difficulty breathing", "Rapidly spreading rash"],
          call_doctor: ["Rash with fever", "Blisters", "Very itchy rash", "Rash after new medication"],
          home_care: ["Mild diaper rash", "Small patches without fever", "Dry skin patches"]
        }
      },
      {
        symptom: "cough",
        ageGroup: "child",
        questions: [
          {
            id: "breathing",
            text: "Is your child having trouble breathing?",
            type: "yes_no"
          },
          {
            id: "duration",
            text: "How long has the cough lasted?",
            type: "multiple_choice",
            options: ["Less than 1 week", "1-2 weeks", "2-3 weeks", "More than 3 weeks"]
          },
          {
            id: "type",
            text: "What type of cough is it?",
            type: "multiple_choice",
            options: ["Dry cough", "Wet/productive cough", "Barking cough", "Whooping sound"]
          }
        ],
        guidelines: {
          emergency: ["Difficulty breathing", "Blue lips or face", "Severe wheezing", "Can't speak in sentences"],
          call_doctor: ["Persistent cough >2 weeks", "Fever with cough", "Coughing up blood", "Barking cough"],
          home_care: ["Mild dry cough", "Recent cold symptoms", "Cough improving over time"]
        }
      },
      // Ear Pain protocols
      {
        symptom: "ear_pain",
        ageGroup: "infant",
        questions: [
          {
            id: "pain_level",
            text: "How would you describe your child's ear pain?",
            type: "multiple_choice",
            options: ["Mild discomfort", "Moderate pain", "Severe pain/crying", "Extreme pain"]
          },
          {
            id: "fever_with_ear",
            text: "Does your child have a fever with the ear pain?",
            type: "yes_no"
          },
          {
            id: "drainage",
            text: "Is there any discharge coming from the ear?",
            type: "multiple_choice",
            options: ["No discharge", "Clear fluid", "Yellow/green discharge", "Blood"]
          },
          {
            id: "hearing_changes",
            text: "Have you noticed any hearing changes?",
            type: "yes_no"
          }
        ],
        guidelines: {
          emergency: ["Blood from ear", "Severe pain with high fever", "Signs of meningitis"],
          call_doctor: ["Moderate to severe pain", "Fever with ear pain", "Yellow/green discharge", "Hearing changes"],
          home_care: ["Mild ear discomfort", "No fever", "No discharge"]
        }
      },
      // Vomiting/Diarrhea protocols
      {
        symptom: "vomiting_diarrhea",
        ageGroup: "toddler",
        questions: [
          {
            id: "duration_gi",
            text: "How long have the symptoms lasted?",
            type: "multiple_choice",
            options: ["Less than 6 hours", "6-12 hours", "12-24 hours", "More than 24 hours"]
          },
          {
            id: "dehydration_signs",
            text: "Are there signs of dehydration?",
            type: "multiple_choice",
            options: ["None - normal activity", "Mild - less active", "Moderate - very sleepy", "Severe - won't wake up"]
          },
          {
            id: "blood_in_stool",
            text: "Is there blood in the vomit or stool?",
            type: "yes_no"
          },
          {
            id: "fluid_intake",
            text: "Is your child able to keep fluids down?",
            type: "multiple_choice",
            options: ["Yes, drinking normally", "Some fluids staying down", "Very little staying down", "Nothing staying down"]
          }
        ],
        guidelines: {
          emergency: ["Blood in vomit/stool", "Severe dehydration", "Nothing staying down >12 hours", "Severe abdominal pain"],
          call_doctor: ["Moderate dehydration", "Symptoms >24 hours", "Unable to keep most fluids down"],
          home_care: ["Mild symptoms", "Good fluid intake", "Normal activity level"]
        }
      },
      // Minor Injury protocols
      {
        symptom: "injury",
        ageGroup: "child",
        questions: [
          {
            id: "injury_type",
            text: "What type of injury occurred?",
            type: "multiple_choice",
            options: ["Cut/scrape", "Bump/bruise", "Sprain/strain", "Possible fracture", "Head injury", "Burn"]
          },
          {
            id: "injury_severity",
            text: "How severe is the injury?",
            type: "multiple_choice",
            options: ["Minor - small cut/bruise", "Moderate - larger wound", "Severe - deep cut/deformity", "Very severe - bone visible"]
          },
          {
            id: "bleeding",
            text: "Is there active bleeding?",
            type: "multiple_choice",
            options: ["No bleeding", "Stopped bleeding", "Light bleeding", "Heavy bleeding that won't stop"]
          },
          {
            id: "consciousness",
            text: "Is your child fully alert and responsive?",
            type: "yes_no"
          }
        ],
        guidelines: {
          emergency: ["Heavy bleeding won't stop", "Loss of consciousness", "Severe deformity", "Head injury with vomiting"],
          call_doctor: ["Deep cuts needing stitches", "Possible fracture", "Burns larger than quarter", "Persistent pain"],
          home_care: ["Minor cuts/scrapes", "Small bruises", "Light bleeding stopped"]
        }
      },
      // Breathing Difficulties
      {
        symptom: "breathing",
        ageGroup: "child",
        questions: [
          {
            id: "breathing_difficulty",
            text: "How is your child's breathing?",
            type: "multiple_choice",
            options: ["Normal breathing", "Slightly labored", "Moderate difficulty", "Severe difficulty"]
          },
          {
            id: "wheezing",
            text: "Is there wheezing or whistling sounds?",
            type: "yes_no"
          },
          {
            id: "color_changes",
            text: "Are the lips or face turning blue?",
            type: "yes_no"
          },
          {
            id: "speaking",
            text: "Can your child speak in full sentences?",
            type: "multiple_choice",
            options: ["Yes, normal speech", "Short phrases only", "Single words only", "Cannot speak"]
          }
        ],
        guidelines: {
          emergency: ["Blue lips/face", "Cannot speak", "Severe breathing difficulty", "Unresponsive"],
          call_doctor: ["Moderate breathing difficulty", "Persistent wheezing", "Short phrases only"],
          home_care: ["Mild breathing changes", "Normal color", "Can speak normally"]
        }
      },
      // Sore Throat
      {
        symptom: "sore_throat",
        ageGroup: "child",
        questions: [
          {
            id: "throat_pain",
            text: "How severe is the throat pain?",
            type: "multiple_choice",
            options: ["Mild scratchiness", "Moderate pain", "Severe pain swallowing", "Cannot swallow"]
          },
          {
            id: "fever_throat",
            text: "Is there a fever with the sore throat?",
            type: "yes_no"
          },
          {
            id: "white_patches",
            text: "Do you see white patches or pus on the throat?",
            type: "yes_no"
          },
          {
            id: "swollen_glands",
            text: "Are the neck glands swollen?",
            type: "yes_no"
          },
          {
            id: "difficulty_breathing_throat",
            text: "Is there any difficulty breathing or swallowing?",
            type: "multiple_choice",
            options: ["No difficulty", "Mild difficulty swallowing", "Significant difficulty", "Cannot swallow/breathe"]
          }
        ],
        guidelines: {
          emergency: ["Cannot swallow/breathe", "Severe difficulty breathing", "High fever with severe pain"],
          call_doctor: ["White patches with fever", "Severe pain", "Swollen glands", "Difficulty swallowing"],
          home_care: ["Mild throat pain", "No fever", "Can swallow normally"]
        }
      }
    ];

    protocols.forEach(protocol => {
      this.createMedicalProtocol(protocol);
    });
  }

  async getAssessment(id: number): Promise<Assessment | undefined> {
    return this.assessments.get(id);
  }

  async createAssessment(insertAssessment: InsertAssessment): Promise<Assessment> {
    const id = this.currentAssessmentId++;
    const assessment: Assessment = {
      ...insertAssessment,
      id,
      createdAt: new Date().toISOString(),
    };
    this.assessments.set(id, assessment);
    return assessment;
  }

  async getMedicalProtocol(symptom: string, ageGroup: string): Promise<MedicalProtocol | undefined> {
    const key = `${symptom}-${ageGroup}`;
    return this.medicalProtocols.get(key);
  }

  async getAllMedicalProtocols(): Promise<MedicalProtocol[]> {
    return Array.from(this.medicalProtocols.values());
  }

  async createMedicalProtocol(insertProtocol: InsertMedicalProtocol): Promise<MedicalProtocol> {
    const id = this.currentProtocolId++;
    const protocol: MedicalProtocol = {
      ...insertProtocol,
      id,
    };
    const key = `${protocol.symptom}-${protocol.ageGroup}`;
    this.medicalProtocols.set(key, protocol);
    return protocol;
  }
}

export class DatabaseStorage implements IStorage {
  async getAssessment(id: number): Promise<Assessment | undefined> {
    const [assessment] = await db.select().from(assessments).where(eq(assessments.id, id));
    return assessment || undefined;
  }

  async createAssessment(insertAssessment: InsertAssessment): Promise<Assessment> {
    const [assessment] = await db
      .insert(assessments)
      .values({
        ...insertAssessment,
        createdAt: new Date().toISOString()
      })
      .returning();
    return assessment;
  }

  async getMedicalProtocol(symptom: string, ageGroup: string): Promise<MedicalProtocol | undefined> {
    const [protocol] = await db
      .select()
      .from(medicalProtocols)
      .where(and(eq(medicalProtocols.symptom, symptom), eq(medicalProtocols.ageGroup, ageGroup)));
    return protocol || undefined;
  }

  async getAllMedicalProtocols(): Promise<MedicalProtocol[]> {
    return await db.select().from(medicalProtocols);
  }

  async createMedicalProtocol(insertProtocol: InsertMedicalProtocol): Promise<MedicalProtocol> {
    const [protocol] = await db
      .insert(medicalProtocols)
      .values(insertProtocol)
      .returning();
    return protocol;
  }
}

export const storage = new DatabaseStorage();
