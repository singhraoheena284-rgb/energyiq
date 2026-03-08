import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string;
  unit: string;
  icon: LucideIcon;
  trend?: string;
  trendDirection?: 'up' | 'down';
  colorClass: string;
}

export function KPICard({ 
  title, 
  value, 
  unit, 
  icon: Icon, 
  trend, 
  trendDirection,
  colorClass 
}: KPICardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 ${colorClass} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            trendDirection === 'up' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
          }`}>
            {trend}
          </span>
        )}
      </div>
      <h3 className="text-sm text-gray-600 mb-2">{title}</h3>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-gray-900">{value}</span>
        <span className="text-sm text-gray-500">{unit}</span>
      </div>
    </div>
  );
}
