import { useState } from 'react';
import { Users, Thermometer, Calendar, Zap } from 'lucide-react';

export function SimulationPanel() {
  const [occupancy, setOccupancy] = useState(75);
  const [temperature, setTemperature] = useState(22);
  const [scheduleShift, setScheduleShift] = useState(0);

  // Calculate simulated energy based on inputs
  const baseEnergy = 450;
  const occupancyImpact = (occupancy / 100) * 150;
  const temperatureImpact = Math.abs(temperature - 21) * 15;
  const scheduleImpact = Math.abs(scheduleShift) * 8;
  
  const simulatedEnergy = Math.round(baseEnergy + occupancyImpact + temperatureImpact - scheduleImpact);
  const energyChange = simulatedEnergy - 520; // Compare to baseline of 520 kWh

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">What-If Scenario Simulation</h2>
        <p className="text-sm text-gray-500">Adjust parameters to predict energy consumption changes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="space-y-6">
          {/* Occupancy Control */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Campus Occupancy</label>
                <p className="text-xs text-gray-500">{occupancy}% capacity</p>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={occupancy}
              onChange={(e) => setOccupancy(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Temperature Control */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                <Thermometer className="w-4 h-4 text-white" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">HVAC Setpoint</label>
                <p className="text-xs text-gray-500">{temperature}°C</p>
              </div>
            </div>
            <input
              type="range"
              min="18"
              max="26"
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>18°C</span>
              <span>26°C</span>
            </div>
          </div>

          {/* Schedule Shift Control */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Schedule Shift</label>
                <p className="text-xs text-gray-500">
                  {scheduleShift > 0 ? `+${scheduleShift} hours` : scheduleShift < 0 ? `${scheduleShift} hours` : 'No shift'}
                </p>
              </div>
            </div>
            <input
              type="range"
              min="-3"
              max="3"
              value={scheduleShift}
              onChange={(e) => setScheduleShift(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>-3h</span>
              <span>+3h</span>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-emerald-700 font-medium">Predicted Energy Usage</p>
              <p className="text-3xl font-bold text-emerald-900">{simulatedEnergy}</p>
              <p className="text-sm text-emerald-600">kWh</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Change from Baseline</span>
                <span className={`text-lg font-bold ${energyChange < 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {energyChange > 0 ? '+' : ''}{energyChange} kWh
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${energyChange < 0 ? 'bg-green-500' : 'bg-red-500'}`}
                  style={{ width: `${Math.min(Math.abs(energyChange / 520 * 100), 100)}%` }}
                />
              </div>
            </div>

            <div className="bg-white rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">Cost Impact</p>
              <p className="text-xl font-bold text-gray-900">
                {energyChange < 0 ? '-' : '+'}${Math.abs(Math.round(energyChange * 0.12))}
              </p>
              <p className="text-xs text-gray-500">@ $0.12/kWh</p>
            </div>

            <div className="bg-white rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">Carbon Impact</p>
              <p className="text-xl font-bold text-gray-900">
                {energyChange < 0 ? '-' : '+'}
                {Math.abs(Math.round(energyChange * 0.5))} kg CO₂
              </p>
              <p className="text-xs text-gray-500">Estimated emissions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
