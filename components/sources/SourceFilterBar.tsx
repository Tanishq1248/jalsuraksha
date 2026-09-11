"use client";

import React from "react";
import { Input } from "@/components/ui/Input";
import { WaterStatus } from "@/types/water";
import { Search, Filter, LayoutGrid, List, RotateCcw } from "lucide-react";

interface SourceFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: WaterStatus | "all";
  onStatusChange: (status: WaterStatus | "all") => void;
  districtFilter: string;
  onDistrictChange: (district: string) => void;
  districts: string[];
  anomalyFilter: string;
  onAnomalyChange: (anomaly: string) => void;
  viewMode: "table" | "grid";
  onViewModeChange: (mode: "table" | "grid") => void;
  onReset: () => void;
  totalFiltered: number;
}

export const SourceFilterBar: React.FC<SourceFilterBarProps> = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  districtFilter,
  onDistrictChange,
  districts,
  anomalyFilter,
  onAnomalyChange,
  viewMode,
  onViewModeChange,
  onReset,
  totalFiltered,
}) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search Bar */}
        <div className="flex-1">
          <Input
            placeholder="Search water source by name, ID, village, or district..."
            icon={<Search className="h-4 w-4" />}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 shrink-0 self-end md:self-auto">
          <button
            onClick={() => onViewModeChange("table")}
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              viewMode === "table"
                ? "bg-white text-slate-900 shadow-xs font-semibold"
                : "text-slate-500 hover:text-slate-800"
            }`}
            title="Table View"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            onClick={() => onViewModeChange("grid")}
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              viewMode === "grid"
                ? "bg-white text-slate-900 shadow-xs font-semibold"
                : "text-slate-500 hover:text-slate-800"
            }`}
            title="Grid View"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Filter Selectors Row */}
      <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-1 text-slate-500 font-semibold uppercase text-[10px] tracking-wider mr-1">
          <Filter className="h-3 w-3" />
          <span>Filters:</span>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200">
          {(["all", "safe", "warning", "critical"] as const).map((st) => (
            <button
              key={st}
              onClick={() => onStatusChange(st)}
              className={`px-2.5 py-1 rounded-md capitalize font-medium transition-all cursor-pointer ${
                statusFilter === st
                  ? "bg-[#0f2942] text-white shadow-xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* District Filter Dropdown */}
        <select
          value={districtFilter}
          onChange={(e) => onDistrictChange(e.target.value)}
          className="h-8 rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-slate-700 focus:outline-none focus:border-[#0f2942] cursor-pointer"
        >
          <option value="all">All Districts ({districts.length})</option>
          {districts.map((dist) => (
            <option key={dist} value={dist}>
              {dist}
            </option>
          ))}
        </select>

        {/* Parameter Anomaly Filter */}
        <select
          value={anomalyFilter}
          onChange={(e) => onAnomalyChange(e.target.value)}
          className="h-8 rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-slate-700 focus:outline-none focus:border-[#0f2942] cursor-pointer"
        >
          <option value="all">All Parameters</option>
          <option value="low_ph">Acidic pH (&lt; 6.5)</option>
          <option value="high_ph">Alkaline pH (&gt; 8.5)</option>
          <option value="high_tds">High TDS (&gt; 1000 ppm)</option>
          <option value="high_turbidity">High Turbidity (&gt; 5 NTU)</option>
        </select>

        {/* Reset button */}
        {(search || statusFilter !== "all" || districtFilter !== "all" || anomalyFilter !== "all") && (
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset</span>
          </button>
        )}

        <div className="ml-auto text-xs text-slate-500 font-medium">
          Showing <strong>{totalFiltered}</strong> water sources
        </div>
      </div>
    </div>
  );
};
