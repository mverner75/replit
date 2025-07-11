import { Home, Thermometer, Heart, Activity, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function HomeCareGuide() {
  const homeCareTopics = [
    {
      title: "Fever Management",
      icon: Thermometer,
      tips: [
        "Give acetaminophen or ibuprofen per package instructions",
        "Keep child hydrated with clear fluids",
        "Dress in light clothing to prevent overheating",
        "Monitor temperature every 2-4 hours"
      ],
      whenToCall: "Fever >102°F for more than 24 hours, or any fever in newborns"
    },
    {
      title: "Comfort Measures",
      icon: Heart,
      tips: [
        "Use cool mist humidifier for respiratory symptoms",
        "Offer frequent small sips of fluid for stomach issues",
        "Apply cool washcloth to forehead for fever",
        "Elevate head slightly for cough"
      ],
      whenToCall: "Child not improving after 48 hours of home care"
    },
    {
      title: "Activity & Rest",
      icon: Activity,
      tips: [
        "Allow plenty of rest and sleep",
        "Keep activities quiet and low-energy",
        "Watch for changes in alertness or behavior",
        "Maintain normal eating patterns if possible"
      ],
      whenToCall: "Unusual sleepiness or difficulty waking child"
    },
    {
      title: "When to Reassess",
      icon: Clock,
      tips: [
        "Check on child every 2-3 hours",
        "Take temperature if child feels warm",
        "Monitor breathing rate and effort",
        "Track fluid intake and wet diapers"
      ],
      whenToCall: "Any worsening of symptoms or new concerning signs"
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
        <Home className="w-5 h-5 mr-2 text-green-600" />
        Quick Home Care Guide
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {homeCareTopics.map((topic, index) => {
          const Icon = topic.icon;
          return (
            <Card key={index} className="border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center text-gray-800">
                  <Icon className="w-4 h-4 mr-2 text-blue-600" />
                  {topic.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-1">
                  {topic.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="text-sm text-gray-600 flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-3">
                  <p className="text-xs text-yellow-800">
                    <strong>Call doctor if:</strong> {topic.whenToCall}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}