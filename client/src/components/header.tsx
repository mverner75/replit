import { Stethoscope, Phone, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  const handleEmergencyCall = () => {
    if (confirm('Are you experiencing a medical emergency? Click OK to call 911.')) {
      window.location.href = 'tel:911';
    }
  };

  return (
    <header className="bg-gradient-to-r from-primary to-secondary text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
              <Stethoscope className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">PediTriage</h1>
              <p className="text-blue-100 text-sm font-medium">Professional After Hours Pediatric Care Guidance</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-2 bg-white/10 rounded-lg px-3 py-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">24/7 Guidance</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 rounded-lg px-3 py-2">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">Evidence-Based</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="hidden sm:block text-right">
              <p className="text-xs text-blue-100">Medical Emergency?</p>
              <p className="text-xs text-blue-100 font-medium">Call immediately</p>
            </div>
          
            <Button 
              onClick={handleEmergencyCall}
              className="bg-red-600 hover:bg-red-700 text-white emergency-pulse shadow-lg"
            >
              <Phone className="w-5 h-5 mr-2" />
              Emergency
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
