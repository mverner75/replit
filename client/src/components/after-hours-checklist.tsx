import { CheckCircle, AlertCircle, Clock, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AfterHoursChecklist() {
  const checklistItems = [
    {
      title: "Before Calling",
      icon: Clock,
      items: [
        "Take your child's temperature",
        "Note when symptoms started",
        "Try home comfort measures first",
        "Have your child's weight ready",
        "List any medications given",
        "Prepare insurance information"
      ],
      color: "blue"
    },
    {
      title: "Call Doctor If",
      icon: Phone,
      items: [
        "Fever over 100.4°F in babies under 3 months",
        "Persistent high fever over 24 hours",
        "Severe pain or unusual behavior",
        "Signs of dehydration",
        "Breathing difficulties",
        "Your parental instinct says something is wrong"
      ],
      color: "orange"
    },
    {
      title: "Call 911 If",
      icon: AlertCircle,
      items: [
        "Child is unconscious or extremely lethargic",
        "Severe difficulty breathing or blue lips",
        "Seizures or convulsions",
        "Severe allergic reaction",
        "Heavy bleeding that won't stop",
        "Head injury with vomiting"
      ],
      color: "red"
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        After-Hours Decision Checklist
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {checklistItems.map((section, index) => {
          const Icon = section.icon;
          return (
            <Card key={index} className={`border-${section.color}-200 bg-${section.color}-50`}>
              <CardHeader className="pb-4">
                <CardTitle className={`text-base flex items-center text-${section.color}-800`}>
                  <Icon className={`w-5 h-5 mr-2 text-${section.color}-600`} />
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className={`text-sm text-${section.color}-700 flex items-start`}>
                      <CheckCircle className={`w-4 h-4 mr-2 mt-0.5 text-${section.color}-500 flex-shrink-0`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-gray-800 font-medium">Remember</p>
            <p className="text-sm text-gray-700 mt-1">
              This tool provides guidance only. Trust your parental instincts - you know your child best. 
              When in doubt, it's always better to seek professional medical advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}