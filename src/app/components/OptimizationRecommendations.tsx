import { Sun, Wind, Lightbulb, Thermometer, Users, Calendar } from 'lucide-react';

const recommendations = [
  {
    id: 1,
    icon: Sun,
    title: 'Shift Lab Sessions to Peak Solar Hours',
    description: 'Schedule energy-intensive lab work between 10am-3pm to maximize solar usage',
    savings: '18% energy cost reduction',
    priority: 'high',
    colorClass: 'bg-amber-500',
  },
  {
    id: 2,
    icon: Thermometer,
    title: 'Reduce HVAC Load During Peak Demand',
    description: 'Adjust temperature setpoints by 2°C during 2-4pm peak hours',
    savings: '12% peak load reduction',
    priority: 'high',
    colorClass: 'bg-red-500',
  },
  {
    id: 3,
    icon: Lightbulb,
    title: 'Smart Lighting in Low Occupancy Areas',
    description: 'Auto-dim lights in Building C (current occupancy: 15%)',
    savings: '8 kWh/hour saved',
    priority: 'medium',
    colorClass: 'bg-blue-500',
  },
  {
    id: 4,
    icon: Calendar,
    title: 'Optimize Weekend Operations',
    description: 'Reduce facility operations on low-attendance weekends',
    savings: '25% weekend savings',
    priority: 'medium',
    colorClass: 'bg-purple-500',
  },
];

export function OptimizationRecommendations() {
  const getPriorityBadge = (priority: string) => {
    if (priority === 'high') {
      return 'bg-red-50 text-red-600 border-red-200';
    }
    return 'bg-amber-50 text-amber-600 border-amber-200';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">AI-Powered Optimization Recommendations</h2>
        <p className="text-sm text-gray-500">Intelligent suggestions to reduce energy consumption</p>
      </div>

      <div className="space-y-4">
        {recommendations.map((rec) => {
          const Icon = rec.icon;
          return (
            <div 
              key={rec.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className={`${rec.colorClass} w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-gray-900 text-sm">{rec.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityBadge(rec.priority)}`}>
                      {rec.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                      {rec.savings}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
