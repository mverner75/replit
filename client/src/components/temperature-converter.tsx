import { useState } from "react";
import { Thermometer, ArrowRightLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function TemperatureConverter() {
  const [fahrenheit, setFahrenheit] = useState("");
  const [celsius, setCelsius] = useState("");

  const handleFahrenheitChange = (value: string) => {
    setFahrenheit(value);
    const f = parseFloat(value);
    if (!isNaN(f)) {
      const c = (f - 32) * 5/9;
      setCelsius(c.toFixed(1));
    } else {
      setCelsius("");
    }
  };

  const handleCelsiusChange = (value: string) => {
    setCelsius(value);
    const c = parseFloat(value);
    if (!isNaN(c)) {
      const f = (c * 9/5) + 32;
      setFahrenheit(f.toFixed(1));
    } else {
      setFahrenheit("");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Thermometer className="w-5 h-5 mr-2 text-red-500" />
        Temperature Converter
      </h3>
      <div className="space-y-4">
        <div className="flex space-x-4">
          <div className="flex-1">
            <Label htmlFor="fahrenheit" className="text-sm font-medium text-gray-700">
              Fahrenheit
            </Label>
            <Input
              id="fahrenheit"
              type="number"
              placeholder="98.6"
              value={fahrenheit}
              onChange={(e) => handleFahrenheitChange(e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="flex items-end">
            <ArrowRightLeft className="w-6 h-6 text-gray-400 mb-2" />
          </div>
          <div className="flex-1">
            <Label htmlFor="celsius" className="text-sm font-medium text-gray-700">
              Celsius
            </Label>
            <Input
              id="celsius"
              type="number"
              placeholder="37.0"
              value={celsius}
              onChange={(e) => handleCelsiusChange(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-sm text-yellow-800">
            <span className="font-medium">Fever Guidelines:</span>
            <br />• Under 2 months: 100.4°F (38°C) or higher
            <br />• 2-6 months: 101°F (38.3°C) or higher  
            <br />• Over 6 months: 102°F (38.9°C) or higher
          </p>
        </div>
      </div>
    </div>
  );
}
