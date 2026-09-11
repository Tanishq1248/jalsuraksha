"use client";

import React from "react";
import { AlertSeverity, AlertStatus } from "@/types/water";
import { Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/Input";

interface AlertFiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  severityFilter: AlertSeverity | "all";
  onSeverityChange: (sev: AlertSeverity | "all") => void;
  statusFilter: AlertStatus | "all";
  onStatusChange: (status: AlertStatus | "all") => void;
  counts: {
    total: number;
    critical: number;
    warning: number;
    active: number;
  };
}

export const AlertFilters: React.FC<AlertFiltersProps> = ({
  search,
  onSearchChange,
  severityFilter,
  onSeverityChange,
  statusFilter,
  onStatusChange,
  counts,
}) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="flex-1">
          <Input
            placeholder="Search alerts by title, source name, or anomaly description..."
            icon={<Search className="h-4 w-4" />}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Status Dropdown */}
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value as AlertStatus | "all")}
          className="h-9 rounded-lg border border-slate-300 bg-white px-3 text-xs sm:text-sm text-slate-700 focus:outline-none focus:border-[#0f2942] cursor-pointer"
        >
          <option value="all">All States</option>
          <option value="active">Active Only ({counts.active})</option>
          <option value="acknowledged">Acknowledged</option>
          <option value="inspection_scheduled">Inspection Scheduled</option>
        </select>
      </div>

      {/* Severity Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
        <span className="text-slate-500 font-semibold uppercase text-[10px] tracking-wider mr-1 flex items-center gap-1">
          <Filter className="h-3 w-3" />
          <span>Severity:</span>
        </span>

        <button
          onClick={() => onSeverityChange("all")}
          className={`px-3 py-1 rounded-md font-medium transition-all cursor-pointer ${
            severityFilter === "all"
              ? "bg-[#0f2942] text-white shadow-xs font-semibold"
              : "text-slate-600 hover:text-slate-900 bg-slate-50"
          }`}
        >
          All ({counts.total})
        </button>

        <button
          onClick={() => onSeverityChange("critical")}
          className={`px-3 py-1 rounded-md font-medium transition-all cursor-pointer ${
            severityFilter === "critical"
              ? "bg-rose-600 text-white shadow-xs font-semibold"
              : "text-rose-700 hover:bg-rose-50 bg-rose-50/50"
          }`}
        >
          Critical ({counts.critical})
        </button>

        <button
          onClick={() => onSeverityChange("warning")}
          className={`px-3 py-1 rounded-md font-medium transition-all cursor-pointer ${
            severityFilter === "warning"
              ? "bg-amber-600 text-white shadow-xs font-semibold"
              : "text-amber-700 hover:bg-amber-50 bg-amber-50/50"
          }`}
        >
          Warning ({counts.warning})
        </button>
      </div>
    </div>
  );
};
