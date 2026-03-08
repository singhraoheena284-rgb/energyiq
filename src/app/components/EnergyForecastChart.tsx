import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';

const generateForecastData = () => {
  const data = [];
  const now = new Date();
  
  // Historical data (past 12 hours)
  for (let i = -12; i < 0; i++) {
    const hour = new Date(now);
    hour.setHours(now.getHours() + i);
    data.push({
      time: hour.getHours() + ':00',
      historical: 350 + Math.random() * 100 + (i > -6 ? 50 : 0),
      predicted: null,
    });
  }
  
  // Current
  data.push({
    time: now.getHours() + ':00',
    historical: 420,
    predicted: 420,
  });
  
  // Predicted data (next 12 hours)
  for (let i = 1; i <= 12; i++) {
    const hour = new Date(now);
    hour.setHours(now.getHours() + i);
    const baseValue = 380 + Math.random() * 120;
    const peakFactor = (i >= 4 && i <= 7) ? 100 : 0; // Peak around afternoon
    data.push({
      time: hour.getHours() + ':00',
      historical: null,
      predicted: baseValue + peakFactor,
    });
  }
  
  return data;
};

export function EnergyForecastChart() {
  const data = generateForecastData();

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Energy Consumption Forecast</h2>
        <p className="text-sm text-gray-500">24-hour historical and predicted energy usage</p>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorHistorical" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
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
          <Legend 
            wrapperStyle={{ fontSize: '12px' }}
          />
          <Area
            type="monotone"
            dataKey="historical"
            stroke="#3b82f6"
            strokeWidth={2}
            fill="url(#colorHistorical)"
            name="Historical"
            connectNulls={false}
          />
          <Area
            type="monotone"
            dataKey="predicted"
            stroke="#10b981"
            strokeWidth={2}
            strokeDasharray="5 5"
            fill="url(#colorPredicted)"
            name="Predicted"
            connectNulls={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
