import React, { useState, useEffect } from 'react';
import { Calendar } from './ui/calendar';
import { CalendarIcon, Zap, Lightbulb, Clock, Sun, Wind } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

interface DaySummary {
  day: string;
  classes: number;
  status: 'free' | 'normal' | 'peak';
}

interface HourlyPoint {
  time: string;
  classes: number;
  is_peak: boolean;
}

interface PeakHoursResponse {
  [day: string]: { hourly: HourlyPoint[]; peak_times: string[] };
}

interface ScheduleRow {
  start_time: string;
  end_time: string;
  room_address: string;
  course: string;
  students: number;
}

interface TrendPoint extends HourlyPoint {
  students?: number;
  occupancy_level?: string;
  power_phase?: string;
  ac_suggestion?: string;
}

interface DayRecommendation {
  type: string;
  title: string;
  detail: string;
}

export function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [calendarSummary, setCalendarSummary] = useState<DaySummary[]>([]);
  const [peakHours, setPeakHours] = useState<PeakHoursResponse | null>(null);
  const [daySchedule, setDaySchedule] = useState<ScheduleRow[]>([]);
  const [dayTrends, setDayTrends] = useState<{ hourly: TrendPoint[]; peak_times: string[] } | null>(null);
  const [dayRecommendations, setDayRecommendations] = useState<DayRecommendation[]>([]);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch('http://localhost:8000/analysis/calendar-summary');
        const data = await res.json();
        setCalendarSummary(data);
      } catch (e) {
        console.error('Failed to fetch calendar summary', e);
      }
    };
    const fetchPeak = async () => {
      try {
        const res = await fetch('http://localhost:8000/analysis/peak-hours');
        const data = await res.json();
        setPeakHours(data);
      } catch (e) {
        console.error('Failed to fetch peak hours', e);
      }
    };
    fetchSummary();
    fetchPeak();
  }, []);

  useEffect(() => {
    const w = selectedDate ? WEEKDAYS[selectedDate.getDay()] : null;
    if (!w) return;
    const fetchDay = async () => {
      try {
        const [schedRes, trendsRes, recRes] = await Promise.all([
          fetch(`http://localhost:8000/analysis/day-schedule?weekday=${encodeURIComponent(w)}`),
          fetch(`http://localhost:8000/analysis/day-trends?weekday=${encodeURIComponent(w)}`),
          fetch(`http://localhost:8000/analysis/day-recommendations?weekday=${encodeURIComponent(w)}`),
        ]);
        const sched = await schedRes.json();
        const trends = await trendsRes.json();
        const recs = await recRes.json();
        setDaySchedule(Array.isArray(sched) ? sched : []);
        setDayTrends(trends && trends.hourly ? trends : null);
        setDayRecommendations(Array.isArray(recs) ? recs : []);
      } catch (e) {
        console.error('Failed to fetch day data', e);
        setDaySchedule([]);
        setDayTrends(null);
        setDayRecommendations([]);
      }
    };
    fetchDay();
  }, [selectedDate?.getDay()]);

  const selectedWeekday = selectedDate ? WEEKDAYS[selectedDate.getDay()] : null;
  const daySummary = calendarSummary.find((s) => s.day === selectedWeekday);
  const hourlyData = dayTrends?.hourly?.length
    ? dayTrends.hourly.map((h) => ({ time: h.time, classes: h.classes, is_peak: h.is_peak }))
    : (selectedWeekday ? (peakHours?.[selectedWeekday]?.hourly ?? []) : []);
  const peakTimes = dayTrends?.peak_times?.length
    ? dayTrends.peak_times
    : (selectedWeekday ? (peakHours?.[selectedWeekday]?.peak_times ?? []) : []);

  const peakDayNames = new Set(
    calendarSummary.filter((s) => s.status === 'peak').map((s) => s.day)
  );
  const modifiers = {
    peak: (date: Date) => peakDayNames.has(WEEKDAYS[date.getDay()]),
    today: (date: Date) => {
      const t = new Date();
      return date.getDate() === t.getDate() && date.getMonth() === t.getMonth() && date.getFullYear() === t.getFullYear();
    },
  };
  const modifiersClassNames = {
    peak: 'ring-2 ring-red-400 ring-offset-2 bg-red-50',
    today: 'bg-emerald-100 font-semibold',
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <CalendarIcon className="w-6 h-6 text-emerald-600" />
          Schedule & energy calendar
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Based on schedule_data (student timetable). Red = peak hours with higher predicted energy use.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Pick a date</h3>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            modifiers={modifiers}
            modifiersClassNames={modifiersClassNames}
            className="rounded-lg border-0 [&_.rdp-day_button]:size-9"
          />
          <p className="text-xs text-gray-500 mt-3">
            <span className="inline-block w-3 h-3 rounded-full bg-red-100 ring-2 ring-red-400 mr-1 align-middle" />
            Ring = peak weekday (most classes)
          </p>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {selectedWeekday && (
            <>
              {/* Schedule chunk: rooms, lecture timing */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-800 mb-2">How we operate — {selectedWeekday}</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Sample from schedule_data: rooms used, lecture timing, occupancy (student count).
                </p>
                {daySchedule.length > 0 ? (
                  <div className="overflow-x-auto max-h-48 overflow-y-auto border border-gray-100 rounded-lg">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="px-3 py-2 text-left font-medium text-gray-600">Start</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-600">End</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-600">Room</th>
                          <th className="px-3 py-2 text-left font-medium text-gray-600">Course</th>
                          <th className="px-3 py-2 text-right font-medium text-gray-600">Students</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {daySchedule.map((row, idx) => (
                          <tr key={idx} className="hover:bg-gray-50/50">
                            <td className="px-3 py-2 font-mono text-gray-800">{row.start_time}</td>
                            <td className="px-3 py-2 font-mono text-gray-800">{row.end_time}</td>
                            <td className="px-3 py-2 text-gray-700 truncate max-w-[120px]" title={row.room_address}>{row.room_address?.trim() || '—'}</td>
                            <td className="px-3 py-2 text-gray-700 truncate max-w-[180px]" title={row.course}>{row.course || '—'}</td>
                            <td className="px-3 py-2 text-right font-medium text-gray-800">{row.students ?? '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm py-4">No schedule entries for this day.</p>
                )}
              </div>

              {/* Peak hours + trends (occupancy, power, AC) */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500" />
                  Peak hours — {selectedWeekday}
                  {daySummary && (
                    <span className="text-sm font-normal text-gray-500">
                      ({daySummary.classes} classes · {daySummary.status})
                    </span>
                  )}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Red bars = predicted higher energy use (busiest class slots). Use off-peak times to optimize.
                </p>
                {hourlyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={hourlyData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} label={{ value: 'Classes', angle: -90, position: 'insideLeft', fontSize: 11 }} />
                      <Tooltip
                        content={({ active, payload, label }) =>
                          active && payload?.[0] ? (
                            <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2 text-sm min-w-[160px]">
                              <p className="font-medium">{label}</p>
                              <p>{payload[0].value} classes</p>
                              {payload[0].payload?.is_peak && <p className="text-red-600">Peak (high energy)</p>}
                              {dayTrends?.hourly && (() => {
                                const point = dayTrends.hourly.find((h) => h.time === label);
                                if (!point) return null;
                                return (
                                  <>
                                    <p className="text-gray-600 mt-1">Occupancy: {point.occupancy_level}</p>
                                    <p className="text-gray-600">Power: {point.power_phase}</p>
                                    <p className="text-gray-600">AC: {point.ac_suggestion}</p>
                                  </>
                                );
                              })()}
                            </div>
                          ) : null
                        }
                      />
                      <Bar dataKey="classes" radius={[4, 4, 0, 0]}>
                        {hourlyData.map((entry, index) => (
                          <Cell
                            key={index}
                            fill={entry.is_peak ? '#dc2626' : '#34d399'}
                            stroke={entry.is_peak ? '#b91c1c' : '#10b981'}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-500 text-sm py-8 text-center">No schedule data for this day.</p>
                )}
                {peakTimes.length > 0 && (
                  <p className="text-xs text-red-600 mt-2">
                    Peak times: {peakTimes.join(', ')}
                  </p>
                )}
                {(dayTrends?.hourly?.length ?? 0) > 0 && (
                  <p className="text-xs text-gray-500 mt-2">
                    Trends: occupancy (low/medium/high), power phase, and AC suggestion (setback / pre_cool / peak_cooling) — see tooltip on chart.
                  </p>
                )}
              </div>

              {/* Dynamic recommendations from schedule_data */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                  Recommendations for {selectedWeekday} (from schedule data)
                </h3>
                {dayRecommendations.length > 0 ? (
                  <ul className="space-y-4">
                    {dayRecommendations.map((rec, idx) => {
                      const Icon = rec.type === 'hvac' ? Wind : rec.type === 'ac' ? Zap : rec.type === 'solar' ? Sun : rec.type === 'stagger' ? Clock : Lightbulb;
                      return (
                        <li key={idx} className="flex gap-3">
                          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                            <Icon className="w-4 h-4 text-amber-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800 text-sm">{rec.title}</p>
                            <p className="text-xs text-gray-600 mt-0.5">{rec.detail}</p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm">No recommendations for this day.</p>
                )}
              </div>
            </>
          )}
          {!selectedWeekday && (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
              Select a date to see peak hours and optimization tips.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
