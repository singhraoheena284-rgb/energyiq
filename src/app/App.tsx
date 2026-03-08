import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { KPICard } from './components/KPICard';
import { EnergyForecastChart } from './components/EnergyForecastChart';
import { DemandVsSolarChart } from './components/DemandVsSolarChart';
import { AIInsightsPanel } from './components/AIInsightsPanel';
import { OptimizationRecommendations } from './components/OptimizationRecommendations';
import { AlertsPanel } from './components/AlertsPanel';
import { SustainabilityMetrics } from './components/SustainabilityMetrics';
import { SimulationPanel } from './components/SimulationPanel';
import { OccupancyDetection } from './components/OccupancyDetection';
import { DatasetManager } from './components/DatasetManager';
import { SystemIntegrations } from './components/SystemIntegrations';
import { CalendarPage } from './components/CalendarPage';
import { Zap, TrendingUp, Sun, Leaf } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [energyData, setEnergyData] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    const fetchEnergy = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/energy/current');
        const data = await res.json();
        setEnergyData(data);
      } catch (e) {
        console.error("Failed to fetch energy data:", e);
      }
    };
    fetchEnergy();
    const interval = setInterval(fetchEnergy, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Energy Analytics Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">
                Real-time monitoring and AI-powered optimization insights
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-gray-500">Last Updated</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date().toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">AI</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-8">
          {activeTab === 'dashboard' && (
            <>
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <KPICard
                  title="Current Energy Consumption"
                  value={energyData ? energyData.consumption_kwh.toString() : "..."}
                  unit="kWh"
                  icon={Zap}
                  trend="+8%"
                  trendDirection="up"
                  colorClass="bg-gradient-to-br from-blue-500 to-blue-600"
                />
                <KPICard
                  title="Predicted Peak Demand Today"
                  value={energyData ? energyData.predicted_demand_kwh.toString() : "..."}
                  unit="kWh"
                  icon={TrendingUp}
                  trend="at 2:00 PM"
                  trendDirection="up"
                  colorClass="bg-gradient-to-br from-orange-500 to-red-500"
                />
                <KPICard
                  title="Solar Energy Generation"
                  value={energyData ? energyData.solar_generation_kwh.toString() : "..."}
                  unit="kWh"
                  icon={Sun}
                  trend="-5%"
                  trendDirection="down"
                  colorClass="bg-gradient-to-br from-amber-500 to-yellow-500"
                />
                <KPICard
                  title="Estimated Carbon Emissions"
                  value={energyData ? energyData.carbon_emissions_kg.toString() : "..."}
                  unit="kg CO₂"
                  icon={Leaf}
                  trend="-12%"
                  trendDirection="down"
                  colorClass="bg-gradient-to-br from-emerald-500 to-green-600"
                />
              </div>

              {/* Main Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <EnergyForecastChart />
                <DemandVsSolarChart />
              </div>

              {/* AI Insights & Alerts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <AIInsightsPanel />
                <AlertsPanel />
              </div>

              {/* Optimization & Sustainability */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <OptimizationRecommendations />
                <SustainabilityMetrics />
              </div>

              {/* Simulation Panel */}
              <SimulationPanel />
            </>
          )}

          {activeTab === 'calendar' && (
            <div className="space-y-6">
              <CalendarPage />
            </div>
          )}

          {activeTab === 'forecast' && (
            <div className="space-y-6">
              <EnergyForecastChart />
              <DemandVsSolarChart />
              <AIInsightsPanel />
            </div>
          )}

          {activeTab === 'optimization' && (
            <div className="space-y-6">
              <OptimizationRecommendations />
              <AlertsPanel />
            </div>
          )}

          {activeTab === 'sustainability' && (
            <div className="space-y-6">
              <SustainabilityMetrics />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DemandVsSolarChart />
                <AIInsightsPanel />
              </div>
            </div>
          )}

          {activeTab === 'simulation' && (
            <div className="space-y-6">
              <SimulationPanel />
              <EnergyForecastChart />
            </div>
          )}

          {activeTab === 'occupancy' && (
            <div className="space-y-6">
              <OccupancyDetection />
            </div>
          )}

          {activeTab === 'datasets' && (
            <div className="space-y-6">
              <DatasetManager />
            </div>
          )}

          {activeTab === 'system' && (
            <div className="space-y-6">
              <SystemIntegrations />
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">System Settings</h2>
              <p className="text-gray-600">Configuration and preferences coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
