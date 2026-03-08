import { Database, UploadCloud, RefreshCw, FileText } from 'lucide-react';

export function DatasetManager() {
    const datasets = [
        { id: 1, name: 'Campus_Energy_2023.csv', size: '45 MB', rows: '525,600', status: 'Cleaned', lastUpdated: '2 days ago' },
        { id: 2, name: 'HVAC_Sensors_Q1.csv', size: '128 MB', rows: '1,490,000', status: 'Processing Pipeline', lastUpdated: '1 hour ago' },
        { id: 3, name: 'Solar_Grid_Data.json', size: '12 MB', rows: '45,000', status: 'Raw', lastUpdated: 'Just now' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Database className="w-6 h-6 text-purple-600" />
                        Energy Dataset Service
                    </h2>
                    <p className="text-sm text-gray-500">Manage Pandas data pipelines and XGBoost training sets</p>
                </div>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2 text-sm">
                    <UploadCloud className="w-4 h-4" />
                    Upload Dataset
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col hover:border-purple-200 transition-colors">
                    <div className="text-purple-600 mb-2"><Database className="w-6 h-6" /></div>
                    <h3 className="text-gray-500 text-sm font-medium">PostgreSQL Storage</h3>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-gray-900">45%</span>
                        <span className="text-sm font-medium text-gray-400">used of 500GB</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 mt-4">
                        <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col hover:border-purple-200 transition-colors">
                    <div className="text-emerald-500 mb-2"><RefreshCw className="w-6 h-6" /></div>
                    <h3 className="text-gray-500 text-sm font-medium">Pipeline Status</h3>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-gray-900">Active</span>
                        <span className="text-sm font-medium text-emerald-600 truncate">Cleaning HVAC_Sensors...</span>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col hover:border-purple-200 transition-colors">
                    <div className="text-blue-500 mb-2"><FileText className="w-6 h-6" /></div>
                    <h3 className="text-gray-500 text-sm font-medium">Total Datasets</h3>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-gray-900">14</span>
                        <span className="text-sm font-medium text-gray-400">files indexed</span>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="font-semibold text-gray-800">Recent Data Sources</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-3">File Name</th>
                                <th className="px-6 py-3">Size</th>
                                <th className="px-6 py-3">Rows Indexed</th>
                                <th className="px-6 py-3">Pipeline Status</th>
                                <th className="px-6 py-3">Last Updated</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {datasets.map((ds) => (
                                <tr key={ds.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4 font-medium text-gray-900 flex flex-col">
                                        <span>{ds.name}</span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">{ds.size}</td>
                                    <td className="px-6 py-4 text-gray-500">{ds.rows}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${ds.status === 'Cleaned' ? 'bg-emerald-100 text-emerald-700' :
                                                ds.status === 'Raw' ? 'bg-gray-100 text-gray-600' :
                                                    'bg-blue-100 text-blue-700 animate-pulse'
                                            }`}>
                                            {ds.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">{ds.lastUpdated}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-purple-600 hover:text-purple-800 font-medium text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                            PROCESS
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
