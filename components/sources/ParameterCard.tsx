import React from "react";
import { WaterStatus } from "@/types/water";
import { PARAMETER_STANDARDS, getStatusTheme } from "@/lib/utils";
import { Check, AlertTriangle, AlertOctagon } from "lucide-react";

interface ParameterCardProps {
  paramKey: "ph" | "tds" | "turbidity" | "temperature" | "chlorine";
  value: number;
  label: string;
}

export const ParameterCard: React.FC<ParameterCardProps> = ({
  paramKey,
  value,
  label,
}) => {
  const standardInfo = PARAMETER_STANDARDS[paramKey];
  const evaluation = standardInfo ? standardInfo.evaluate(value) : { status: "safe" as WaterStatus, note: "Normal" };
  const theme = getStatusTheme(evaluation.status);

  const getStatusIcon = (status: WaterStatus) => {
    switch (status) {
      case "safe":
        return <Check className="h-4 w-4 text-emerald-600" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-600" />;
      case "critical":
        return <AlertOctagon className="h-4 w-4 text-rose-600" />;
    }
  };

  return (
    <div
      className={`rounded-xl border bg-white p-4 shadow-xs transition-all hover:shadow-md ${
        evaluation.status === "critical"
          ? "border-rose-200 bg-rose-50/20"
          : evaluation.status === "warning"
          ? "border-amber-200 bg-amber-50/20"
          : "border-slate-200"
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {label}
          </span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className={`text-2xl font-black ${theme.accent}`}>
              {value}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {standardInfo?.unit}
            </span>
          </div>
        </div>

        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${theme.badgeBg}`}>
          {getStatusIcon(evaluation.status)}
        </div>
      </div>

      <div className="mt-3 space-y-1.5 border-t border-slate-100 pt-2.5 text-xs">
        <div className="flex items-center justify-between text-slate-500">
          <span>Acceptable Limit:</span>
          <span className="font-mono text-slate-700 font-medium">
            {standardInfo?.standard} {standardInfo?.unit}
          </span>
        </div>
        <div className="flex items-center justify-between text-slate-500">
          <span>Permissible Ceiling:</span>
          <span className="font-mono text-slate-700 font-medium">
            {standardInfo?.permissible} {standardInfo?.unit}
          </span>
        </div>
      </div>

      <div className={`mt-2.5 rounded-md px-2 py-1 text-[11px] font-medium border ${theme.badgeBg}`}>
        {evaluation.note}
      </div>
    </div>
  );
};
