import { useState } from "react";
import { Calculator, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function MedicationCalculator() {
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState("lbs");
  const [medication, setMedication] = useState("");

  const calculateDosage = () => {
    const weightValue = parseFloat(weight);
    if (isNaN(weightValue) || !medication) return null;

    const weightInKg = unit === "lbs" ? weightValue / 2.205 : weightValue;
    
    switch (medication) {
      case "acetaminophen":
        return `${(weightInKg * 10).toFixed(1)}mg every 4-6 hours`;
      case "ibuprofen":
        return `${(weightInKg * 5).toFixed(1)}mg every 6-8 hours (6+ months only)`;
      default:
        return null;
    }
  };

  const dosage = calculateDosage();

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Calculator className="w-5 h-5 mr-2 text-green-500" />
        Medication Dosage
      </h3>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="weight" className="text-sm font-medium text-gray-700">
              Child's Weight
            </Label>
            <Input
              id="weight"
              type="number"
              placeholder="25"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700">Unit</Label>
            <Select value={unit} onValueChange={setUnit}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lbs">lbs</SelectItem>
                <SelectItem value="kg">kg</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label className="text-sm font-medium text-gray-700">Medication</Label>
          <Select value={medication} onValueChange={setMedication}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select medication" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="acetaminophen">Acetaminophen (Tylenol)</SelectItem>
              <SelectItem value="ibuprofen">Ibuprofen (Advil/Motrin)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {dosage && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <span className="font-medium">Suggested Dosage:</span> {dosage}
            </p>
          </div>
        )}

        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-green-800">
                <span className="font-medium">Always verify dosage with:</span>
                <br />• Medication packaging
                <br />• Your pediatrician's instructions
                <br />• Pharmacist consultation
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
