"use client";

import React, { useState } from "react";
import { DistrictSummary } from "@/types/water";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface DistrictComparisonChartProps {
  districts: DistrictSummary[];
}

export const DistrictComparisonChart: React.FC<DistrictComparisonChartProps> = ({
  districts,
}) => {
  const [sortMode, setSortMode] = useState<"lowest" | "highest">("lowest");

  const sortedDistricts = [...districts]
    .sort((a, b) =>
      sortMode === "lowest" ? a.avgScore - b.avgScore : b.avgScore - a.avgScore
    )
    .slice(0, 10);

  const getBarColor = (score: number) => {
    if (score < 50) return "#ef4444";
    if (score < 75) return "#f59e0b";
    return "#10b981";
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            District Water Quality Index (WQI) Benchmark
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Comparative analysis identifying districts with elevated contamination risk
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium">
          <button
            onClick={() => setSortMode("lowest")}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              sortMode === "lowest"
                ? "bg-white text-slate-900 shadow-xs font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Highest Risk First
          </button>
          <button
            onClick={() => setSortMode("highest")}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              sortMode === "highest"
                ? "bg-white text-slate-900 shadow-xs font-semibold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Safest First
          </button>
        </div>
      </div>

      <div className="h-72 w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sortedDistricts}
            margin={{ top: 10, right: 10, left: -20, bottom: 25 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="district"
              stroke="#94a3b8"
              fontSize={11}
              interval={0}
              angle={-25}
              textAnchor="end"
            />
            <YAxis
              domain={[0, 100]}
              stroke="#94a3b8"
              fontSize={11}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload as DistrictSummary;
                  return (
                    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-lg text-xs">
                      <p className="font-bold text-slate-900">
                        {d.district}, {d.state}
                      </p>
                      <p className="mt-1 font-mono text-slate-700">
                        Average WQI:{" "}
                        <span
                          className="font-bold"
                          style={{ color: getBarColor(d.avgScore) }}
                        >
                          {d.avgScore} / 100
                        </span>
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Total Sites: {d.total} (Safe: {d.safe}, Warn: {d.warning}, Crit: {d.critical})
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="avgScore" radius={[4, 4, 0, 0]}>
              {sortedDistricts.map((entry, index) => (
                <Cell key={`bar-${index}`} fill={getBarColor(entry.avgScore)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-2.5">
        <span className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-rose-500" />
          <span>&lt;50 Critical</span>
          <span className="inline-block h-2 w-2 rounded-full bg-amber-500 ml-2" />
          <span>50-74 Vigilance</span>
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 ml-2" />
          <span>&ge;75 Safe</span>
        </span>
        <span className="text-slate-400">Sampled from 24 active monitoring stations</span>
      </div>
    </div>
  );
};
