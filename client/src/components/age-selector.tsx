import { User } from "lucide-react";
import { AgeGroup } from "@/types/medical";
import { getAgeGroupInfo } from "@/lib/medical-protocols";

interface AgeSelectorProps {
  selectedAge: AgeGroup | null;
  onAgeSelect: (age: AgeGroup) => void;
}

export function AgeSelector({ selectedAge, onAgeSelect }: AgeSelectorProps) {
  const ageGroups: AgeGroup[] = ["newborn", "infant", "toddler", "child"];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        First, select your child's age group:
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {ageGroups.map((age) => {
          const info = getAgeGroupInfo(age);
          const isSelected = selectedAge === age;
          
          return (
            <button
              key={age}
              onClick={() => onAgeSelect(age)}
              className={`age-selector p-4 border-2 rounded-lg text-center transition-colors ${
                isSelected 
                  ? 'selected border-blue-600 bg-blue-600 text-white' 
                  : 'border-gray-200 hover:border-blue-600'
              }`}
            >
              <div className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center ${
                isSelected 
                  ? 'bg-blue-100' 
                  : `bg-${info.color}-100`
              }`}>
                <User className={`w-6 h-6 ${
                  isSelected 
                    ? 'text-blue-600' 
                    : `text-${info.color}-600`
                }`} />
              </div>
              <p className="font-medium text-sm">{info.label}</p>
              <p className={`text-xs ${isSelected ? 'text-blue-100' : 'text-gray-500'}`}>
                {info.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
