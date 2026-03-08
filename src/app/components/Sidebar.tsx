import {
  LayoutDashboard,
  TrendingUp,
  Lightbulb,
  Leaf,
  FlaskConical,
  Settings,
  Camera,
  Database,
  Activity,
  CalendarIcon,
} from 'lucide-react';
import { Calendar } from './ui/calendar';
import { cn } from './ui/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedDate?: Date;
  onSelectDate?: (date: Date | undefined) => void;
}

const navigation = [
  { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
  { id: 'calendar', name: 'Calendar', icon: CalendarIcon },
  { id: 'forecast', name: 'Energy Forecast', icon: TrendingUp },
  { id: 'optimization', name: 'Optimization Insights', icon: Lightbulb },
  { id: 'sustainability', name: 'Sustainability Metrics', icon: Leaf },
  { id: 'simulation', name: 'Simulation', icon: FlaskConical },
  { id: 'occupancy', name: 'Occupancy Detection', icon: Camera },
  { id: 'datasets', name: 'Energy Datasets', icon: Database },
  { id: 'system', name: 'System Integrations', icon: Activity },
  { id: 'settings', name: 'Settings', icon: Settings },
];

export function Sidebar({ activeTab, setActiveTab, selectedDate, onSelectDate }: SidebarProps) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      {/* Logo & Title */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-gray-900">EnergyAI</h1>
            <p className="text-xs text-gray-500">Campus Optimizer</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <Icon className={cn('w-5 h-5', isActive && 'text-emerald-600')} />
                  <span className="text-sm">{item.name}</span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Calendar - only show small date picker when not on calendar tab */}
        {activeTab !== 'calendar' && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <CalendarIcon className="w-4 h-4 text-gray-500" />
            <span className="text-xs font-medium text-gray-700">Date</span>
          </div>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onSelectDate}
            className="rounded-lg border border-gray-200 bg-gray-50/50 p-2 [&_.rdp-month]:m-0 [&_.rdp-month_caption]:justify-center [&_.rdp-cell]:text-center [&_.rdp-day_button]:size-8 [&_.rdp-day_button]:text-xs"
            classNames={{
              months: 'flex flex-col',
              month: 'flex flex-col gap-2',
              caption: 'flex justify-center items-center',
              caption_label: 'text-sm font-medium text-gray-800',
              nav: 'flex items-center gap-0.5',
              nav_button: 'size-7 rounded border border-gray-200 bg-white hover:bg-gray-50 text-gray-600',
              nav_button_previous: 'absolute left-1',
              nav_button_next: 'absolute right-1',
              table: 'w-full',
              head_row: 'flex justify-around',
              head_cell: 'text-[10px] font-medium text-gray-500 w-8',
              row: 'flex w-full justify-around mt-0.5',
              cell: 'text-center text-xs',
              day: 'size-8 p-0 rounded-md hover:bg-emerald-100 aria-selected:bg-emerald-500 aria-selected:text-white',
              day_today: 'bg-emerald-50 font-medium',
              day_outside: 'text-gray-300',
              day_disabled: 'text-gray-300',
            }}
          />
        </div>
        )}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 flex-shrink-0">
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-4">
          <p className="text-xs font-medium text-gray-700 mb-1">AI Model Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs text-gray-600">Active & Learning</span>
          </div>
        </div>
      </div>
    </div>
  );
}
