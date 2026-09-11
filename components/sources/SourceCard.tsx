import React from "react";
import Link from "next/link";
import { WaterSource } from "@/types/water";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { formatShortDate } from "@/lib/utils";
import { ArrowRight, MapPin } from "lucide-react";

interface SourceCardProps {
  source: WaterSource;
}

export const SourceCard: React.FC<SourceCardProps> = ({ source }) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-mono font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
            {source.id}
          </span>
          <StatusBadge status={source.status} />
        </div>

        <h3 className="font-bold text-slate-900 text-base line-clamp-1">
          {source.name}
        </h3>

        <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
          <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span className="truncate">
            {source.village}, {source.district}, {source.state}
          </span>
        </div>

        {/* Key parameter snapshot */}
        <div className="mt-4 grid grid-cols-3 gap-2 bg-slate-50/80 p-2.5 rounded-lg border border-slate-100 text-center text-xs">
          <div>
            <div className="text-[10px] text-slate-400 uppercase">pH</div>
            <div className="font-bold text-slate-800">{source.parameters.ph}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase">TDS</div>
            <div className="font-bold text-slate-800">{source.parameters.tds}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase">Turbidity</div>
            <div className="font-bold text-slate-800">{source.parameters.turbidity}</div>
          </div>
        </div>

        {source.detectedIssues.length > 0 && (
          <div className="mt-3 text-xs text-rose-700 bg-rose-50/60 p-2 rounded-md border border-rose-100 line-clamp-2">
            ⚠️ {source.detectedIssues[0]}
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-slate-500">
          <span className="text-[11px]">Updated {formatShortDate(source.lastUpdated)}</span>
        </div>
        <Link
          href={`/dashboard/sources/${source.id}`}
          className="inline-flex items-center gap-1 font-semibold text-[#0f2942] hover:text-[#163a5d] hover:underline"
        >
          <span>View Diagnostics</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
};
