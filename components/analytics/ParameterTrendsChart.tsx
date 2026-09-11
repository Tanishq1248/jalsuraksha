"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const multiParamData = [
  { week: "Week 1 (12 Aug)", avgPH: 7.2, avgTDS: 620, avgTurbidity: 3.4 },
  { week: "Week 2 (19 Aug)", avgPH: 7.0, avgTDS: 680, avgTurbidity: 4.1 },
  { week: "Week 3 (26 Aug)", avgPH: 6.8, avgTDS: 740, avgTurbidity: 5.2 },
  { week: "Week 4 (02 Sep)", avgPH: 6.7, avgTDS: 810, avgTurbidity: 6.0 },
  { week: "Week 5 (10 Sep)", avgPH: 6.6, avgTDS: 875, avgTurbidity: 6.9 },
];

export const ParameterTrendsChart: React.FC = () => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
      <div className="border-b border-slate-100 pb-3">
        <h3 className="text-base font-bold text-slate-900">
          Cross-Parameter Anomaly Correlation
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Systemic trend showing inverse correlation between pH acidification and TDS/Turbidity elevation
        </p>
      </div>

      <div className="h-72 w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={multiParamData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="week" stroke="#94a3b8" fontSize={11} />
            <YAxis
              yAxisId="tds"
              orientation="left"
              stroke="#0f2942"
              fontSize={11}
              domain={[400, 1100]}
              tickFormatter={(v) => `${v} ppm`}
            />
            <YAxis
              yAxisId="ph"
              orientation="right"
              stroke="#0d9488"
              fontSize={11}
              domain={[5.5, 8.5]}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                fontSize: "12px",
                border: "1px solid #e2e8f0",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
            <Line
              yAxisId="tds"
              type="monotone"
              dataKey="avgTDS"
              name="Avg TDS (ppm)"
              stroke="#0f2942"
              strokeWidth={2.5}
              dot={{ r: 4 }}
            />
            <Line
              yAxisId="ph"
              type="monotone"
              dataKey="avgPH"
              name="Avg pH Level"
              stroke="#0d9488"
              strokeWidth={2.5}
              dot={{ r: 4 }}
            />
            <Line
              yAxisId="ph"
              type="monotone"
              dataKey="avgTurbidity"
              name="Avg Turbidity (NTU)"
              stroke="#f59e0b"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-2.5">
        <span>Trend Observation: Average TDS risen +41.1% over the past 30 days</span>
        <span className="text-teal-700 font-medium">Early Warning System Active</span>
      </div>
    </div>
  );
};
