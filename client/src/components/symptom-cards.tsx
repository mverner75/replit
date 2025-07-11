import { Thermometer, Scan, Wind, Ear, Droplet, Bandage, Heart, Stethoscope, ChevronRight } from "lucide-react";
import { Symptom } from "@/types/medical";

interface SymptomCardsProps {
  onSymptomSelect: (symptom: Symptom) => void;
}

export function SymptomCards({ onSymptomSelect }: SymptomCardsProps) {
  const symptoms = [
    {
      id: "fever" as Symptom,
      title: "Fever",
      description: "Temperature above normal, feeling warm, chills, or sweating",
      icon: Thermometer,
      color: "red",
      gradient: "from-red-50 to-pink-50",
      border: "border-red-200",
      badge: "Most common"
    },
    {
      id: "rash" as Symptom,
      title: "Rash",
      description: "Skin changes including red spots, bumps, or irritated areas",
      icon: Scan,
      color: "orange",
      gradient: "from-orange-50 to-yellow-50",
      border: "border-orange-200", 
      badge: "Frequent"
    },
    {
      id: "cough" as Symptom,
      title: "Cough",
      description: "Persistent coughing, difficulty breathing, or chest congestion",
      icon: Wind,
      color: "blue",
      gradient: "from-blue-50 to-indigo-50",
      border: "border-blue-200",
      badge: "Common"
    },
    {
      id: "ear_pain" as Symptom,
      title: "Ear Pain",
      description: "Ear discomfort, pain, or hearing changes",
      icon: Ear,
      color: "purple",
      gradient: "from-purple-50 to-violet-50",
      border: "border-purple-200",
      badge: "After-hours call"
    },
    {
      id: "vomiting_diarrhea" as Symptom,
      title: "Vomiting/Diarrhea",
      description: "Stomach upset, nausea, vomiting, or loose stools",
      icon: Droplet,
      color: "green",
      gradient: "from-green-50 to-emerald-50",
      border: "border-green-200",
      badge: "GI symptoms"
    },
    {
      id: "injury" as Symptom,
      title: "Minor Injury",
      description: "Cuts, scrapes, bumps, sprains, or minor accidents",
      icon: Bandage,
      color: "gray",
      gradient: "from-gray-50 to-slate-50",
      border: "border-gray-200",
      badge: "30% of visits"
    },
    {
      id: "breathing" as Symptom,
      title: "Breathing Issues",
      description: "Difficulty breathing, wheezing, or chest tightness",
      icon: Heart,
      color: "cyan",
      gradient: "from-cyan-50 to-sky-50",
      border: "border-cyan-200",
      badge: "Emergency watch"
    },
    {
      id: "sore_throat" as Symptom,
      title: "Sore Throat",
      description: "Throat pain, difficulty swallowing, or swollen glands",
      icon: Stethoscope,
      color: "pink",
      gradient: "from-pink-50 to-rose-50",
      border: "border-pink-200",
      badge: "Strep concern"
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        What symptoms is your child experiencing?
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {symptoms.map((symptom) => {
          const Icon = symptom.icon;
          return (
            <div
              key={symptom.id}
              onClick={() => onSymptomSelect(symptom.id)}
              className={`symptom-card bg-gradient-to-br ${symptom.gradient} border ${symptom.border} rounded-lg p-4 cursor-pointer hover:shadow-md transition-all`}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className={`w-12 h-12 bg-${symptom.color}-100 rounded-full flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 text-${symptom.color}-600`} />
                </div>
                <h4 className={`text-base font-semibold text-${symptom.color}-800`}>
                  {symptom.title}
                </h4>
                <p className={`text-xs text-${symptom.color}-700 leading-relaxed`}>
                  {symptom.description}
                </p>
                <div className="flex items-center justify-between w-full pt-2">
                  <span className={`bg-${symptom.color}-100 text-${symptom.color}-600 px-2 py-1 rounded-full text-xs`}>
                    {symptom.badge}
                  </span>
                  <ChevronRight className={`w-4 h-4 text-${symptom.color}-600`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
