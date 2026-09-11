import React from "react";
import Link from "next/link";
import { WaterSource } from "@/types/water";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { AlertCircle, ArrowRight, MapPin } from "lucide-react";

interface PrioritySourcesProps {
  sources: WaterSource[];
}

export const PrioritySources: React.FC<PrioritySourcesProps> = ({ sources }) => {
  // Filter for critical and warning, sorted by lowest quality score first
  const priorityList = [...sources]
    .filter((s) => s.status === "critical" || s.status === "warning")
    .sort((a, b) => a.qualityScore - b.qualityScore)
    .slice(0, 5);

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-100 p-5 bg-slate-50/50">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-900 text-base">
              Priority Sources for Action
            </h3>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-100 text-[11px] font-bold text-rose-700">
              {priorityList.length}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Sources exhibiting lowest Water Quality Index (WQI) requiring intervention
          </p>
        </div>
        <Link
          href="/dashboard/sources?status=critical"
          className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1 hover:underline"
        >
          <span>View All Critical</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="divide-y divide-slate-100">
        {priorityList.map((source) => (
          <div
            key={source.id}
            className="p-4 transition-colors hover:bg-slate-50/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
          >
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                  {source.id}
                </span>
                <StatusBadge status={source.status} />
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-500">{source.sourceType}</span>
              </div>

              <h4 className="font-bold text-slate-900 text-sm truncate">
                {source.name}
              </h4>

              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-slate-400" />
                  {source.village}, {source.district}, {source.state}
                </span>
              </div>

              {source.detectedIssues.length > 0 && (
                <div className="flex items-start gap-1.5 text-xs text-rose-700 bg-rose-50/70 px-2.5 py-1 rounded-md border border-rose-100/80 mt-1">
                  <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                  <span className="line-clamp-1">{source.detectedIssues[0]}</span>
                </div>
              )}
            </div>

            {/* Score and Action */}
            <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                  WQI Score
                </span>
                <span
                  className={`text-lg font-black ${
                    source.qualityScore < 50
                      ? "text-rose-600"
                      : source.qualityScore < 75
                      ? "text-amber-600"
                      : "text-emerald-600"
                  }`}
                >
                  {source.qualityScore}
                  <span className="text-xs font-normal text-slate-400">/100</span>
                </span>
              </div>

              <Link
                href={`/dashboard/sources/${source.id}`}
                className="inline-flex items-center justify-center gap-1 rounded-lg bg-[#0f2942] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#163a5d] transition-colors"
              >
                <span>Diagnose</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
