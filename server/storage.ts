import { assessments, medicalProtocols, type Assessment, type InsertAssessment, type MedicalProtocol, type InsertMedicalProtocol } from "@shared/schema";

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

export const storage = new MemStorage();
