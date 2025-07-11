import { AlertTriangle, Check } from "lucide-react";

export function EmergencyGuidelines() {
  const emergencySignals = [
    "Difficulty breathing or blue lips/face",
    "Unconsciousness or extreme lethargy", 
    "Seizures or convulsions",
    "Severe dehydration or vomiting blood",
    "Severe allergic reaction (anaphylaxis)",
    "High fever in newborns (under 2 months)"
  ];

  return (
    <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-6 mb-8">
      <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center">
        <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
        Call 911 Immediately If Your Child Has:
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {emergencySignals.map((signal, index) => (
          <div key={index} className="flex items-center text-sm text-red-700">
            <Check className="w-4 h-4 mr-2 flex-shrink-0" />
            {signal}
          </div>
        ))}
      </div>
    </div>
  );
}
