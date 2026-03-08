import { AlertTriangle, TrendingUp, AlertCircle, Activity } from 'lucide-react';

const alerts = [
  {
    id: 1,
    type: 'warning',
    icon: TrendingUp,
    title: 'Peak Load Expected at 2:00 PM',
    description: 'Predicted demand surge of 520 kWh. Consider load shifting.',
    time: '10 min ago',
  },
  {
    id: 2,
    type: 'anomaly',
    icon: AlertCircle,
    title: 'Low Occupancy but High Energy Detected',
    description: 'Building B: 12% occupancy but consuming 85 kWh.',
    time: '25 min ago',
  },
  {
    id: 3,
    type: 'alert',
    icon: AlertTriangle,
    title: 'Possible HVAC Inefficiency',
    description: 'Zone 3 HVAC consuming 15% more than expected for current load.',
    time: '1 hour ago',
  },
  {
    id: 4,
    type: 'info',
    icon: Activity,
    title: 'Optimal Solar Window Active',
    description: 'Current solar generation exceeds demand. Opportunity to charge storage.',
    time: '2 hours ago',
  },
];

export function AlertsPanel() {
  const getAlertStyle = (type: string) => {
    switch (type) {
      case 'warning':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          icon: 'bg-amber-500',
          text: 'text-amber-900',
        };
      case 'anomaly':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          icon: 'bg-red-500',
          text: 'text-red-900',
        };
      case 'alert':
        return {
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          icon: 'bg-orange-500',
          text: 'text-orange-900',
        };
      default:
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          icon: 'bg-blue-500',
          text: 'text-blue-900',
        };
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Alerts & Anomaly Detection</h2>
        <p className="text-sm text-gray-500">Real-time system notifications and warnings</p>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => {
          const Icon = alert.icon;
          const style = getAlertStyle(alert.type);
          
          return (
            <div 
              key={alert.id}
              className={`${style.bg} border ${style.border} rounded-lg p-4`}
            >
              <div className="flex items-start gap-3">
                <div className={`${style.icon} w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className={`font-medium text-sm ${style.text}`}>{alert.title}</h3>
                    <span className="text-xs text-gray-500">{alert.time}</span>
                  </div>
                  <p className="text-sm text-gray-600">{alert.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
