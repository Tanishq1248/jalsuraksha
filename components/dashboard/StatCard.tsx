import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: "default" | "safe" | "warning" | "critical" | "navy";
  trend?: {
    value: string;
    isPositive: boolean;
    label: string;
  };
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = "default",
  trend,
  onClick,
}) => {
  const variantThemes = {
    default: {
      border: "border-slate-200",
      iconBg: "bg-slate-100 text-slate-700",
      accent: "text-slate-900",
      highlight: "bg-slate-50",
    },
    navy: {
      border: "border-slate-800",
      iconBg: "bg-[#0f2942]/10 text-[#0f2942]",
      accent: "text-[#0f2942]",
      highlight: "bg-slate-50",
    },
    safe: {
      border: "border-emerald-200",
      iconBg: "bg-emerald-50 text-emerald-600",
      accent: "text-emerald-700",
      highlight: "bg-emerald-50/30",
    },
    warning: {
      border: "border-amber-200",
      iconBg: "bg-amber-50 text-amber-600",
      accent: "text-amber-700",
      highlight: "bg-amber-50/30",
    },
    critical: {
      border: "border-rose-200",
      iconBg: "bg-rose-50 text-rose-600",
      accent: "text-rose-700",
      highlight: "bg-rose-50/30",
    },
  };

  const theme = variantThemes[variant];

  return (
    <div
      onClick={onClick}
      className={cn(
        "relative rounded-xl border bg-white p-5 shadow-xs transition-all duration-150 hover:shadow-md",
        theme.border,
        onClick && "cursor-pointer"
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={cn("text-3xl font-extrabold tracking-tight", theme.accent)}>
              {value}
            </span>
          </div>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
          )}
        </div>
        <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl", theme.iconBg)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      {trend && (
        <div className="mt-3 flex items-center gap-1.5 text-xs border-t border-slate-100 pt-2.5">
          <span
            className={cn(
              "font-semibold",
              trend.isPositive ? "text-emerald-600" : "text-rose-600"
            )}
          >
            {trend.value}
          </span>
          <span className="text-slate-400">{trend.label}</span>
        </div>
      )}
    </div>
  );
};
