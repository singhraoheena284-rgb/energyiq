import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Leaf, Zap, TrendingDown } from 'lucide-react';

const energySourceData = [
  { name: 'Solar Energy', value: 42, color: '#10b981' },
  { name: 'Grid (Renewable)', value: 28, color: '#3b82f6' },
  { name: 'Grid (Non-Renewable)', value: 30, color: '#6b7280' },
];

export function SustainabilityMetrics() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Sustainability Dashboard</h2>
        <p className="text-sm text-gray-500">Environmental impact and renewable energy metrics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Energy Source Distribution */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-4">Energy Source Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={energySourceData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {energySourceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-4">
            {energySourceData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="font-medium text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Impact Metrics */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Environmental Impact</h3>
          
          <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-emerald-700">Renewable Usage</p>
                <p className="text-2xl font-bold text-emerald-900">70%</p>
              </div>
            </div>
            <p className="text-xs text-emerald-600">+5% from last month</p>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-blue-700">Carbon Reduced</p>
                <p className="text-2xl font-bold text-blue-900">2.4 tons</p>
              </div>
            </div>
            <p className="text-xs text-blue-600">This week vs baseline</p>
          </div>

          <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-amber-700">Energy Saved</p>
                <p className="text-2xl font-bold text-amber-900">156 kWh</p>
              </div>
            </div>
            <p className="text-xs text-amber-600">Through optimization</p>
          </div>
        </div>
      </div>
    </div>
  );
}
