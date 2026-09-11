"use client";

import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const trendData = [
  { date: "12 Aug", avgWQI: 76.4, safeCount: 14, warningCount: 5, criticalCount: 5 },
  { date: "19 Aug", avgWQI: 74.2, safeCount: 13, warningCount: 6, criticalCount: 5 },
  { date: "26 Aug", avgWQI: 71.8, safeCount: 12, warningCount: 6, criticalCount: 6 },
  { date: "02 Sep", avgWQI: 69.1, safeCount: 11, warningCount: 7, criticalCount: 6 },
  { date: "10 Sep", avgWQI: 67.2, safeCount: 10, warningCount: 7, criticalCount: 7 },
];

export const QualityTrendChart: React.FC = () => {
  const [metric, setMetric] = useState<"wqi" | "counts">("wqi");

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h3 className="font-bold text-slate-900 text-base">
            National Water Quality Trends
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            30-day temporal aggregate tracking WQI index progression across monitored sites
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium self-start sm:self-auto">
          <button
            onClick={() => setMetric("wqi")}
            className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
              metric === "wqi"
                ? "bg-white text-slate-900 shadow-xs font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Average WQI
          </button>
          <button
            onClick={() => setMetric("counts")}
            className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
              metric === "counts"
                ? "bg-white text-slate-900 shadow-xs font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Source Status Breakdown
          </button>
        </div>
      </div>

      <div className="h-72 w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          {metric === "wqi" ? (
            <AreaChart
              data={trendData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="wqiGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0f2942" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#0f2942" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="date"
                tickLine={false}
                stroke="#94a3b8"
                fontSize={11}
              />
              <YAxis
                domain={[40, 100]}
                tickLine={false}
                stroke="#94a3b8"
                fontSize={11}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-lg text-xs">
                        <p className="font-semibold text-slate-800">{label} 2026</p>
                        <p className="mt-1 font-mono text-slate-900">
                          Average WQI: <span className="font-bold text-teal-700">{payload[0].value}</span> / 100
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1">
                          Calculated across all 24 monitored sources
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="avgWQI"
                name="Average WQI"
                stroke="#0f2942"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#wqiGradient)"
              />
            </AreaChart>
          ) : (
            <AreaChart
              data={trendData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" tickLine={false} stroke="#94a3b8" fontSize={11} />
              <YAxis tickLine={false} stroke="#94a3b8" fontSize={11} />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  fontSize: "12px",
                  border: "1px solid #e2e8f0",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
              <Area
                type="monotone"
                dataKey="safeCount"
                name="Safe"
                stackId="1"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.8}
              />
              <Area
                type="monotone"
                dataKey="warningCount"
                name="Warning"
                stackId="1"
                stroke="#f59e0b"
                fill="#f59e0b"
                fillOpacity={0.8}
              />
              <Area
                type="monotone"
                dataKey="criticalCount"
                name="Critical"
                stackId="1"
                stroke="#ef4444"
                fill="#ef4444"
                fillOpacity={0.8}
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-2.5">
        <span>Surveillance cadence: 7-day cyclical sensor calibration</span>
        <span className="text-amber-600 font-medium">Notice: -9.2 WQI net shift over past 30 days</span>
      </div>
    </div>
  );
};
