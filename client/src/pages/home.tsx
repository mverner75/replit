import { useState } from "react";
import { useLocation } from "wouter";
import { AgeGroup, Symptom } from "@/types/medical";
import { Header } from "@/components/header";
import { AgeSelector } from "@/components/age-selector";
import { SymptomCards } from "@/components/symptom-cards";
import { TemperatureConverter } from "@/components/temperature-converter";
import { MedicationCalculator } from "@/components/medication-calculator";
import { EmergencyGuidelines } from "@/components/emergency-guidelines";
import { Info, ExternalLink } from "lucide-react";

export default function Home() {
  const [, setLocation] = useLocation();
  const [selectedAge, setSelectedAge] = useState<AgeGroup | null>(null);

  const handleSymptomSelect = (symptom: Symptom) => {
    if (!selectedAge) {
      alert("Please select your child's age group first.");
      return;
    }
    setLocation(`/assessment/${symptom}/${selectedAge}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Welcome to PediTriage
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get guidance for common pediatric symptoms when your doctor's office is closed. 
              Our evidence-based tool helps you decide between home care and professional medical attention.
            </p>
          </div>
          
          {/* Disclaimer */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-800 font-medium">Important Disclaimer</p>
                <p className="text-sm text-blue-700 mt-1">
                  This tool provides general guidance only and does not replace professional medical judgment. 
                  Always trust your instincts and seek immediate medical care if you're concerned about your child's health.
                </p>
              </div>
            </div>
          </div>
        </div>

        <AgeSelector selectedAge={selectedAge} onAgeSelect={setSelectedAge} />
        
        <SymptomCards onSymptomSelect={handleSymptomSelect} />

        {/* Quick Tools */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <TemperatureConverter />
          <MedicationCalculator />
        </div>

        <EmergencyGuidelines />

        {/* Resources Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Resources</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Children's Hospital Colorado</h4>
              <p className="text-sm text-gray-600 mb-3">24/7 pediatric advice line with experienced nurses</p>
              <a 
                href="https://www.childrenscolorado.org/" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
              >
                Learn More <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">ChildrensMD App</h4>
              <p className="text-sm text-gray-600 mb-3">Free pediatric symptom checker used by 10,000+ practices</p>
              <a 
                href="https://www.childrenscolorado.org/conditions-and-advice/parenting/childrens-mobile-app/" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
              >
                Download App <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">HealthyChildren.org</h4>
              <p className="text-sm text-gray-600 mb-3">American Academy of Pediatrics official parenting resource</p>
              <a 
                href="https://www.healthychildren.org/" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
              >
                Visit Site <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-sm text-gray-500">
              © 2024 PediTriage. This tool is for educational purposes only and does not replace professional medical advice.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Always consult with your pediatrician for medical concerns.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
