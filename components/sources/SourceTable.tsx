"use client";

import React from "react";
import Link from "next/link";
import { WaterSource } from "@/types/water";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { formatShortDate } from "@/lib/utils";
import { ArrowUpDown, ExternalLink } from "lucide-react";

interface SourceTableProps {
  sources: WaterSource[];
  onSort?: (column: "name" | "qualityScore" | "lastUpdated" | "status") => void;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const SourceTable: React.FC<SourceTableProps> = ({
  sources,
  onSort,
  sortBy,
  sortOrder,
}) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs">
      <table className="w-full text-left text-xs sm:text-sm text-slate-600">
        <thead className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
          <tr>
            <th scope="col" className="px-4 py-3.5">
              Source ID / Name
            </th>
            <th scope="col" className="px-4 py-3.5">
              Location & District
            </th>
            <th
              scope="col"
              className={`px-4 py-3.5 cursor-pointer hover:text-slate-800 select-none ${
                sortBy === "status" ? "text-[#0f2942] font-black" : ""
              }`}
              onClick={() => onSort && onSort("status")}
            >
              <div className="flex items-center gap-1">
                <span>Status</span>
                <ArrowUpDown className={`h-3 w-3 ${sortBy === "status" ? "text-teal-700 font-bold" : ""}`} />
                {sortBy === "status" && (
                  <span className="text-[10px]">{sortOrder === "asc" ? "▲" : "▼"}</span>
                )}
              </div>
            </th>
            <th
              scope="col"
              className={`px-4 py-3.5 cursor-pointer hover:text-slate-800 select-none text-right ${
                sortBy === "qualityScore" ? "text-[#0f2942] font-black" : ""
              }`}
              onClick={() => onSort && onSort("qualityScore")}
            >
              <div className="flex items-center justify-end gap-1">
                <span>WQI Score</span>
                <ArrowUpDown className={`h-3 w-3 ${sortBy === "qualityScore" ? "text-teal-700 font-bold" : ""}`} />
                {sortBy === "qualityScore" && (
                  <span className="text-[10px]">{sortOrder === "asc" ? "▲" : "▼"}</span>
                )}
              </div>
            </th>
            <th scope="col" className="px-4 py-3.5 text-center">
              pH
            </th>
            <th scope="col" className="px-4 py-3.5 text-center">
              TDS (ppm)
            </th>
            <th scope="col" className="px-4 py-3.5 text-center">
              Turbidity (NTU)
            </th>
            <th
              scope="col"
              className={`px-4 py-3.5 cursor-pointer hover:text-slate-800 select-none hidden md:table-cell ${
                sortBy === "lastUpdated" ? "text-[#0f2942] font-black" : ""
              }`}
              onClick={() => onSort && onSort("lastUpdated")}
            >
              <div className="flex items-center gap-1">
                <span>Last Updated</span>
                <ArrowUpDown className={`h-3 w-3 ${sortBy === "lastUpdated" ? "text-teal-700 font-bold" : ""}`} />
                {sortBy === "lastUpdated" && (
                  <span className="text-[10px]">{sortOrder === "asc" ? "▲" : "▼"}</span>
                )}
              </div>
            </th>
            <th scope="col" className="px-4 py-3.5 text-right">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {sources.length === 0 ? (
            <tr>
              <td colSpan={9} className="px-4 py-8 text-center text-slate-400">
                No water sources matched the specified search and filter criteria.
              </td>
            </tr>
          ) : (
            sources.map((source) => (
              <tr
                key={source.id}
                className="hover:bg-slate-50/70 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="font-mono text-xs font-semibold text-slate-500">
                    {source.id}
                  </div>
                  <div className="font-bold text-slate-900 text-sm hover:text-teal-700 transition-colors line-clamp-1">
                    <Link href={`/dashboard/sources/${source.id}`}>
                      {source.name}
                    </Link>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {source.sourceType}
                  </div>
                </td>

                <td className="px-4 py-3">
                  <div className="font-medium text-slate-800">
                    {source.village}
                  </div>
                  <div className="text-xs text-slate-500">
                    {source.district}, {source.state}
                  </div>
                </td>

                <td className="px-4 py-3">
                  <StatusBadge status={source.status} />
                </td>

                <td className="px-4 py-3 text-right">
                  <span
                    className={`font-mono font-bold text-sm ${
                      source.qualityScore < 50
                        ? "text-rose-600"
                        : source.qualityScore < 75
                        ? "text-amber-600"
                        : "text-emerald-600"
                    }`}
                  >
                    {source.qualityScore}
                  </span>
                  <span className="text-[10px] text-slate-400 ml-0.5">/100</span>
                </td>

                <td className="px-4 py-3 text-center font-mono text-xs">
                  <span
                    className={
                      source.parameters.ph < 6.5 || source.parameters.ph > 8.5
                        ? "font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200"
                        : "text-slate-700"
                    }
                  >
                    {source.parameters.ph}
                  </span>
                </td>

                <td className="px-4 py-3 text-center font-mono text-xs">
                  <span
                    className={
                      source.parameters.tds > 1000
                        ? "font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200"
                        : source.parameters.tds > 500
                        ? "font-medium text-amber-600"
                        : "text-slate-700"
                    }
                  >
                    {source.parameters.tds}
                  </span>
                </td>

                <td className="px-4 py-3 text-center font-mono text-xs">
                  <span
                    className={
                      source.parameters.turbidity > 5.0
                        ? "font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200"
                        : "text-slate-700"
                    }
                  >
                    {source.parameters.turbidity}
                  </span>
                </td>

                <td className="px-4 py-3 text-xs text-slate-500 hidden md:table-cell font-mono">
                  {formatShortDate(source.lastUpdated)}
                </td>

                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/dashboard/sources/${source.id}`}
                    className="inline-flex items-center gap-1 rounded-md bg-[#0f2942] px-2.5 py-1 text-xs font-semibold text-white hover:bg-[#163a5d] transition-colors shadow-xs"
                  >
                    <span>Analyze</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
