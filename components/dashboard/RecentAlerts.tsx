"use client";

import React from "react";
import Link from "next/link";
import { WaterAlert } from "@/types/water";
import { getSeverityTheme, formatShortDate } from "@/lib/utils";
import { ArrowRight, CheckCircle2, ClipboardList } from "lucide-react";

interface RecentAlertsProps {
  alerts: WaterAlert[];
  onAcknowledge?: (alertId: string) => void;
  onAssignInspection?: (alert: WaterAlert) => void;
}

export const RecentAlerts: React.FC<RecentAlertsProps> = ({
  alerts,
  onAcknowledge,
  onAssignInspection,
}) => {
  const displayAlerts = alerts.slice(0, 4);

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-100 p-5 bg-slate-50/50">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-900 text-base">
              Active Water Alerts
            </h3>
            <span className="flex h-5 px-1.5 items-center justify-center rounded-full bg-rose-500 text-[11px] font-bold text-white shadow-xs">
              {alerts.length}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated threshold anomalies requiring administrative verification
          </p>
        </div>
        <Link
          href="/dashboard/alerts"
          className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1 hover:underline"
        >
          <span>Manage All Alerts</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="divide-y divide-slate-100">
        {displayAlerts.map((alert) => {
          const theme = getSeverityTheme(alert.severity);

          return (
            <div
              key={alert.id}
              className={`p-4 transition-colors hover:bg-slate-50/70 ${theme.borderLeft}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${theme.badgeBg}`}
                    >
                      {theme.label}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {alert.id}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500 font-mono">
                      {formatShortDate(alert.timestamp)}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm">
                    {alert.title}
                  </h4>

                  <p className="text-xs text-slate-600">
                    Source:{" "}
                    <Link
                      href={`/dashboard/sources/${alert.sourceId}`}
                      className="font-medium text-teal-700 hover:underline"
                    >
                      {alert.sourceName} ({alert.district})
                    </Link>
                  </p>
                </div>
              </div>

              {/* Triggered Parameters Chips */}
              <div className="mt-2.5 flex flex-wrap gap-2 text-xs">
                {alert.parametersTriggered.ph !== undefined && (
                  <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 font-mono">
                    pH: <strong>{alert.parametersTriggered.ph}</strong>
                  </span>
                )}
                {alert.parametersTriggered.tds !== undefined && (
                  <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 font-mono">
                    TDS: <strong>{alert.parametersTriggered.tds} ppm</strong>
                  </span>
                )}
                {alert.parametersTriggered.turbidity !== undefined && (
                  <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 font-mono">
                    Turbidity: <strong>{alert.parametersTriggered.turbidity} NTU</strong>
                  </span>
                )}
              </div>

              {/* Recommended Action Notice */}
              <div className="mt-2 text-xs text-slate-700 bg-amber-50/60 border border-amber-200/60 p-2 rounded-md">
                <span className="font-semibold text-amber-900">Recommended Action: </span>
                {alert.recommendedAction}
              </div>

              {/* Action Buttons */}
              <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/dashboard/sources/${alert.sourceId}`}
                    className="text-xs font-semibold text-[#0f2942] hover:underline"
                  >
                    View Source
                  </Link>
                </div>

                <div className="flex items-center gap-2">
                  {alert.status === "active" ? (
                    <>
                      {onAcknowledge && (
                        <button
                          onClick={() => onAcknowledge(alert.id)}
                          className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          <CheckCircle2 className="h-3 w-3 text-slate-400" />
                          <span>Acknowledge</span>
                        </button>
                      )}
                      {onAssignInspection && (
                        <button
                          onClick={() => onAssignInspection(alert)}
                          className="inline-flex items-center gap-1 rounded-md bg-[#0f2942] px-2.5 py-1 text-xs font-medium text-white hover:bg-[#163a5d] transition-colors cursor-pointer shadow-xs"
                        >
                          <ClipboardList className="h-3 w-3" />
                          <span>Assign Inspection</span>
                        </button>
                      )}
                    </>
                  ) : alert.status === "inspection_scheduled" ? (
                    <span className="text-xs font-medium text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded">
                      Inspection Dispatched ({alert.assignedOfficer?.split(" ")[1]})
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      Acknowledged
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
