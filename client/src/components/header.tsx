import { AlertTriangle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  const handleEmergencyCall = () => {
    if (confirm('Are you experiencing a medical emergency? Click OK to call 911.')) {
      window.location.href = 'tel:911';
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">PediTriage</h1>
              <p className="text-sm text-gray-500">After Hours Pediatric Care</p>
            </div>
          </div>
          
          <Button 
            onClick={handleEmergencyCall}
            className="bg-red-600 hover:bg-red-700 text-white emergency-pulse"
          >
            <Phone className="w-5 h-5 mr-2" />
            Emergency
          </Button>
        </div>
      </div>
    </header>
  );
}
