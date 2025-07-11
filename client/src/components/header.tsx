import { Stethoscope, Phone, Shield, Clock, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";

export function Header() {
  const [location] = useLocation();
  
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
            <Link href="/">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <Stethoscope className="w-7 h-7 text-primary" />
              </div>
            </Link>
            <div>
              <Link href="/">
                <h1 className="text-2xl font-bold tracking-tight hover:text-blue-100 transition-colors cursor-pointer">PediTriage</h1>
              </Link>
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
            <Link href="/analytics">
              <div className={`flex items-center space-x-2 rounded-lg px-3 py-2 cursor-pointer transition-colors ${
                location === '/analytics' ? 'bg-white/20' : 'bg-white/10 hover:bg-white/15'
              }`}>
                <BarChart3 className="w-4 h-4" />
                <span className="text-sm font-medium">Analytics</span>
              </div>
            </Link>
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
