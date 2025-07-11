import { Thermometer, Scan, Wind, ChevronRight } from "lucide-react";
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
      badge: "90% of calls"
    },
    {
      id: "rash" as Symptom,
      title: "Rash",
      description: "Skin changes including red spots, bumps, or irritated areas",
      icon: Scan,
      color: "orange",
      gradient: "from-orange-50 to-yellow-50",
      border: "border-orange-200", 
      badge: "Common concern"
    },
    {
      id: "cough" as Symptom,
      title: "Cough",
      description: "Persistent coughing, difficulty breathing, or chest congestion",
      icon: Wind,
      color: "blue",
      gradient: "from-blue-50 to-indigo-50",
      border: "border-blue-200",
      badge: "Frequent issue"
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        What symptoms is your child experiencing?
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {symptoms.map((symptom) => {
          const Icon = symptom.icon;
          return (
            <div
              key={symptom.id}
              onClick={() => onSymptomSelect(symptom.id)}
              className={`symptom-card bg-gradient-to-br ${symptom.gradient} border ${symptom.border} rounded-lg p-6 cursor-pointer`}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-12 h-12 bg-${symptom.color}-100 rounded-full flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 text-${symptom.color}-600`} />
                </div>
                <h4 className={`text-lg font-semibold text-${symptom.color}-800`}>
                  {symptom.title}
                </h4>
              </div>
              <p className={`text-sm text-${symptom.color}-700 mb-4`}>
                {symptom.description}
              </p>
              <div className="flex items-center justify-between">
                <span className={`bg-${symptom.color}-100 text-${symptom.color}-600 px-2 py-1 rounded-full text-sm`}>
                  {symptom.badge}
                </span>
                <ChevronRight className={`w-4 h-4 text-${symptom.color}-600`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
