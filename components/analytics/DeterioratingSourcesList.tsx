import React from "react";
import Link from "next/link";
import { WaterSource } from "@/types/water";
import { TrendingDown, ArrowRight, MapPin } from "lucide-react";
import { StatusBadge } from "@/components/dashboard/StatusBadge";

interface DeterioratingSourcesListProps {
  sources: WaterSource[];
}

export const DeterioratingSourcesList: React.FC<DeterioratingSourcesListProps> = ({
  sources,
}) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-100 p-5 bg-rose-50/30">
        <div>
          <div className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-rose-600" />
            <h3 className="font-bold text-slate-900 text-base">
              Rapidly Deteriorating Sources (Watchlist)
            </h3>
            <span className="flex h-5 px-2 items-center justify-center rounded-full bg-rose-100 text-[11px] font-bold text-rose-800">
              {sources.length} flagged
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Sources experiencing a steep negative trajectory (&ge;15 point WQI drop) over 30 days
          </p>
        </div>
      </div>

      <div className="divide-y divide-slate-100">
        {sources.map((source) => {
          const initial = source.historicalReadings[0]?.qualityScore ?? source.qualityScore;
          const current = source.qualityScore;
          const drop = initial - current;
          const dropPercent = ((drop / initial) * 100).toFixed(0);

          return (
            <div
              key={source.id}
              className="p-4 transition-colors hover:bg-slate-50/70 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                    {source.id}
                  </span>
                  <StatusBadge status={source.status} />
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-slate-400" />
                    {source.village}, {source.district}
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 text-sm">
                  {source.name}
                </h4>

                <p className="text-xs text-slate-600 line-clamp-1">
                  Primary Risk Factor: {source.detectedIssues[0] || "Rapid chemical deviation"}
                </p>

                <div className="mt-1 text-xs text-slate-500 bg-slate-50 p-2 rounded border border-slate-100">
                  <span className="font-semibold text-slate-700">Directive: </span>
                  {source.recommendedAction}
                </div>
              </div>

              {/* Trajectory comparison stats */}
              <div className="flex md:flex-col items-center md:items-end justify-between gap-3 shrink-0 border-t md:border-t-0 pt-2 md:pt-0 border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="text-center">
                    <span className="text-[10px] uppercase text-slate-400 block font-semibold">
                      30d Ago
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-600">
                      {initial}
                    </span>
                  </div>

                  <span className="text-slate-300">→</span>

                  <div className="text-center">
                    <span className="text-[10px] uppercase text-slate-400 block font-semibold">
                      Current
                    </span>
                    <span className="font-mono text-sm font-black text-rose-600">
                      {current}
                    </span>
                  </div>

                  <div className="rounded-md bg-rose-50 px-2 py-1 border border-rose-200 text-rose-700 text-xs font-black font-mono">
                    -{drop} pts (-{dropPercent}%)
                  </div>
                </div>

                <Link
                  href={`/dashboard/sources/${source.id}`}
                  className="inline-flex items-center gap-1 rounded-lg bg-[#0f2942] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#163a5d] transition-colors"
                >
                  <span>Detailed Diagnostics</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
