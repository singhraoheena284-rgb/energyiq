import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const generateDemandData = () => {
  const hours = ['6am', '8am', '10am', '12pm', '2pm', '4pm', '6pm', '8pm'];
  return hours.map((hour, index) => ({
    time: hour,
    demand: 300 + Math.random() * 200 + (index >= 3 && index <= 5 ? 100 : 0),
    solar: index >= 2 && index <= 6 ? 150 + Math.random() * 150 : Math.random() * 50,
  }));
};

export function DemandVsSolarChart() {
  const data = generateDemandData();

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Energy Demand vs Solar Generation</h2>
        <p className="text-sm text-gray-500">Real-time comparison of campus demand and renewable supply</p>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorSolar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="time" 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            label={{ value: 'kWh', angle: -90, position: 'insideLeft', style: { fontSize: '12px' } }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '12px'
            }}
          />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          <Area
            type="monotone"
            dataKey="demand"
            stackId="1"
            stroke="#f59e0b"
            fill="url(#colorDemand)"
            name="Campus Demand"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="solar"
            stackId="2"
            stroke="#10b981"
            fill="url(#colorSolar)"
            name="Solar Generation"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
