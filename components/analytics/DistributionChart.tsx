"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface DistributionChartProps {
  safeCount: number;
  warningCount: number;
  criticalCount: number;
}

export const DistributionChart: React.FC<DistributionChartProps> = ({
  safeCount,
  warningCount,
  criticalCount,
}) => {
  const total = safeCount + warningCount + criticalCount || 1;

  const data = [
    { name: "Safe / Baseline", value: safeCount, color: "#10b981", percent: ((safeCount / total) * 100).toFixed(1) },
    { name: "Warning / Vigilance", value: warningCount, color: "#f59e0b", percent: ((warningCount / total) * 100).toFixed(1) },
    { name: "Critical / High Risk", value: criticalCount, color: "#ef4444", percent: ((criticalCount / total) * 100).toFixed(1) },
  ];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
      <div>
        <h3 className="text-base font-bold text-slate-900">
          Status Distribution Breakdown
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Proportion of water sources categorized by current risk index
        </p>
      </div>

      <div className="h-60 w-full my-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload;
                  return (
                    <div className="rounded-lg border border-slate-200 bg-white p-2.5 shadow-lg text-xs">
                      <p className="font-semibold text-slate-900">{d.name}</p>
                      <p className="font-mono text-slate-700">
                        {d.value} sources ({d.percent}%)
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2 border-t border-slate-100 pt-3">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="font-medium text-slate-700">{item.name}</span>
            </div>
            <div className="font-mono font-bold text-slate-900">
              {item.value} <span className="text-[11px] font-normal text-slate-400">({item.percent}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
