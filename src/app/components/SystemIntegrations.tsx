import { useState, useEffect } from 'react';
import { Server, Database, Activity, CheckCircle2, AlertTriangle, Workflow } from 'lucide-react';

interface ServiceStatus {
    service: string;
    status: string;
    uptime_hours: number;
    last_check: string;
}

interface SystemHealth {
    overall_health: string;
    services: ServiceStatus[];
}

export function SystemIntegrations() {
    const [health, setHealth] = useState<SystemHealth | null>(null);

    useEffect(() => {
        const fetchHealth = async () => {
            try {
                const res = await fetch('http://localhost:8000/api/system/status');
                const data = await res.json();
                setHealth(data);
            } catch (e) {
                console.error("Error fetching system health:", e);
            }
        };

        fetchHealth();
        const interval = setInterval(fetchHealth, 5000); // Fetch every 5 seconds
        return () => clearInterval(interval);
    }, []);

    const getIcon = (service: string) => {
        if (service.includes('Database') || service.includes('Postgre')) return <Database className="w-5 h-5" />;
        if (service.includes('Gateway') || service.includes('FastAPI')) return <Server className="w-5 h-5" />;
        return <Workflow className="w-5 h-5" />;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Activity className="w-6 h-6 text-indigo-600" />
                        System Integrations Hub
                    </h2>
                    <p className="text-sm text-gray-500">Live monitoring of API, Database, and ML microservices</p>
                </div>

                <div className={`px-4 py-2 rounded-lg flex items-center gap-2 ${health?.overall_health === 'Good' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                    {health?.overall_health === 'Good' ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                    <span className="font-semibold uppercase text-sm">System Health: {health?.overall_health || 'Checking...'}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {health?.services.map((s, idx) => (
                    <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col hover:border-indigo-100 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-lg ${s.status === 'Healthy' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                                }`}>
                                {getIcon(s.service)}
                            </div>
                            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${s.status === 'Healthy' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'
                                }`}>
                                {s.status}
                            </span>
                        </div>

                        <h3 className="font-bold text-gray-900 mb-1">{s.service}</h3>
                        <p className="text-xs text-gray-500 mb-4">Connected API Endpoint: <span className="font-mono">localhost:{s.service.includes('Redis') ? '6379' : '8000'}</span></p>

                        <div className="mt-auto flex justify-between items-center text-xs font-medium text-gray-600 border-t border-gray-50 pt-3">
                            <span>Uptime: {s.uptime_hours}h</span>
                            <span className="flex items-center gap-1">Ping: <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span></span>
                        </div>
                    </div>
                ))}
                {!health && (
                    <div className="col-span-full py-12 text-center text-gray-400 font-medium animate-pulse">
                        Establishing connection to API Gateway...
                    </div>
                )}
            </div>

            {/* Event Stream Log */}
            <div className="mt-8 bg-slate-900 rounded-xl overflow-hidden shadow-lg border border-slate-700">
                <div className="bg-slate-800 px-4 py-3 border-b border-slate-700 flex justify-between items-center">
                    <span className="text-slate-300 font-mono text-sm tracking-wide">Live Event Processing Stream (Message Queue)</span>
                    <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                </div>
                <div className="p-4 h-48 overflow-y-auto space-y-2 font-mono text-xs">
                    <div className="text-emerald-400">[OK] <span className="text-slate-400 ml-2">[{new Date().toISOString()}]</span> Redis Queue: Pushed EnergyData Packet</div>
                    <div className="text-emerald-400">[OK] <span className="text-slate-400 ml-2">[{new Date().toISOString()}]</span> YOLOv8 Node: Processed Frame 4099</div>
                    <div className="text-blue-400">[INFO] <span className="text-slate-400 ml-2">[{new Date().toISOString()}]</span> XGBoost Engine: Re-calibrating demands</div>
                    <div className="text-emerald-400">[OK] <span className="text-slate-400 ml-2">[{new Date().toISOString()}]</span> API Gateway: Handled 14 requests/sec</div>
                    <div className="text-emerald-400 animate-pulse">[OK] <span className="text-slate-400 ml-2">Waiting for next event...</span></div>
                </div>
            </div>
        </div>
    );
}
