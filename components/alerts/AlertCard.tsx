"use client";

import React from "react";
import Link from "next/link";
import { WaterAlert } from "@/types/water";
import { getSeverityTheme, formatDate } from "@/lib/utils";
import {
  AlertTriangle,
  AlertOctagon,
  Info,
  CheckCircle2,
  Send,
  ExternalLink,
  MapPin,
  Calendar,
  UserCheck,
} from "lucide-react";

interface AlertCardProps {
  alert: WaterAlert;
  onAcknowledge?: (id: string) => void;
  onAssignInspection?: (alert: WaterAlert) => void;
}

export const AlertCard: React.FC<AlertCardProps> = ({
  alert,
  onAcknowledge,
  onAssignInspection,
}) => {
  const theme = getSeverityTheme(alert.severity);

  const getSeverityIcon = () => {
    switch (alert.severity) {
      case "critical":
        return <AlertOctagon className="h-5 w-5 text-rose-600" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-600" />;
      case "info":
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  return (
    <div
      className={`rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:shadow-md ${theme.borderLeft}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          {getSeverityIcon()}
          <span
            className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${theme.badgeBg}`}
          >
            {theme.label}
          </span>
          <span className="font-mono text-xs text-slate-400">
            {alert.id}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Calendar className="h-3.5 w-3.5" />
          <span>{formatDate(alert.timestamp)}</span>
        </div>
      </div>

      <div className="mt-3">
        <h3 className="text-base font-bold text-slate-900 leading-snug">
          {alert.title}
        </h3>
        <p className="mt-1 text-xs text-slate-600 leading-relaxed">
          {alert.description}
        </p>
      </div>

      {/* Source Location */}
      <div className="mt-3 flex items-center gap-2 text-xs text-slate-600">
        <span className="font-semibold text-slate-700">Source:</span>
        <Link
          href={`/dashboard/sources/${alert.sourceId}`}
          className="font-bold text-[#0f2942] hover:underline flex items-center gap-1"
        >
          <span>
            {alert.sourceName} ({alert.sourceId})
          </span>
          <ExternalLink className="h-3 w-3 text-slate-400" />
        </Link>
        <span className="text-slate-300">•</span>
        <span className="flex items-center gap-1 text-slate-500">
          <MapPin className="h-3 w-3 text-slate-400" />
          {alert.village}, {alert.district}
        </span>
      </div>

      {/* Triggered Sensor Parameters */}
      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        {alert.parametersTriggered.ph !== undefined && (
          <div className="flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 border border-slate-200">
            <span className="text-slate-500">pH:</span>
            <span className="font-mono font-bold text-slate-900">
              {alert.parametersTriggered.ph}
            </span>
          </div>
        )}
        {alert.parametersTriggered.tds !== undefined && (
          <div className="flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 border border-slate-200">
            <span className="text-slate-500">TDS:</span>
            <span className="font-mono font-bold text-slate-900">
              {alert.parametersTriggered.tds} ppm
            </span>
          </div>
        )}
        {alert.parametersTriggered.turbidity !== undefined && (
          <div className="flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 border border-slate-200">
            <span className="text-slate-500">Turbidity:</span>
            <span className="font-mono font-bold text-slate-900">
              {alert.parametersTriggered.turbidity} NTU
            </span>
          </div>
        )}
      </div>

      {/* Recommended Action Directive */}
      <div className="mt-3.5 rounded-lg bg-amber-50/70 p-3 border border-amber-200/80 text-xs text-amber-950">
        <span className="font-bold uppercase tracking-wider text-[10px] text-amber-800 block mb-0.5">
          Recommended Next Action:
        </span>
        <p className="leading-relaxed font-medium">{alert.recommendedAction}</p>
      </div>

      {/* Assignment status indicator */}
      {alert.status === "inspection_scheduled" && (
        <div className="mt-3 rounded-lg bg-purple-50 p-2.5 border border-purple-200 text-xs text-purple-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-purple-600" />
            <span>
              Inspection Assigned: <strong>{alert.assignedOfficer}</strong>
            </span>
          </div>
          <span className="text-[11px] font-mono font-semibold text-purple-700">
            Target: {alert.dueDate}
          </span>
        </div>
      )}

      {/* Action Buttons Toolbar */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
        <Link
          href={`/dashboard/sources/${alert.sourceId}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#0f2942] hover:underline"
        >
          <span>View Source Telemetry</span>
          <ExternalLink className="h-3 w-3" />
        </Link>

        <div className="flex items-center gap-2">
          {alert.status === "active" && onAcknowledge && (
            <button
              onClick={() => onAcknowledge(alert.id)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shadow-xs"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-slate-500" />
              <span>Acknowledge</span>
            </button>
          )}

          {alert.status !== "inspection_scheduled" && onAssignInspection && (
            <button
              onClick={() => onAssignInspection(alert)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#0f2942] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#163a5d] transition-colors cursor-pointer shadow-xs"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Assign Inspection</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
