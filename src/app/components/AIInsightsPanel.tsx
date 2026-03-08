import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const insightsData = [
  { factor: 'Temperature', impact: 85, color: '#ef4444' },
  { factor: 'Occupancy', impact: 72, color: '#f59e0b' },
  { factor: 'Time of Day', impact: 68, color: '#3b82f6' },
  { factor: 'Schedule', impact: 55, color: '#8b5cf6' },
  { factor: 'Weather', impact: 42, color: '#06b6d4' },
  { factor: 'Events', impact: 38, color: '#10b981' },
];

export function AIInsightsPanel() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-semibold text-gray-900">AI Feature Impact Analysis</h2>
          <span className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded-full font-medium">
            ML Model v2.4
          </span>
        </div>
        <p className="text-sm text-gray-500">Factors influencing energy consumption predictions</p>
      </div>
      
      <ResponsiveContainer width="100%" height={280}>
        <BarChart 
          data={insightsData} 
          layout="vertical"
          margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            type="number"
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            domain={[0, 100]}
            label={{ value: 'Impact Score', position: 'insideBottom', offset: -5, style: { fontSize: '12px' } }}
          />
          <YAxis 
            type="category"
            dataKey="factor" 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '12px'
            }}
          />
          <Bar dataKey="impact" name="Impact Score" radius={[0, 8, 8, 0]}>
            {insightsData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
