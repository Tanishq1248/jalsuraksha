import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { WaterStatus, AlertSeverity } from "@/types/water";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
}

export function formatShortDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });
  } catch {
    return dateString;
  }
}

export function getStatusTheme(status: WaterStatus) {
  switch (status) {
    case "safe":
      return {
        label: "Safe / Acceptable",
        badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
        indicatorBg: "bg-emerald-500",
        cardBorder: "border-emerald-200",
        accent: "text-emerald-600",
        hex: "#10b981",
        description: "Parameters align with standard drinking water baseline",
      };
    case "warning":
      return {
        label: "Warning / Vigilance",
        badgeBg: "bg-amber-50 text-amber-700 border-amber-200",
        indicatorBg: "bg-amber-500",
        cardBorder: "border-amber-200",
        accent: "text-amber-600",
        hex: "#f59e0b",
        description: "Parameters approaching permissible threshold limits",
      };
    case "critical":
      return {
        label: "Critical / High Risk",
        badgeBg: "bg-rose-50 text-rose-700 border-rose-200",
        indicatorBg: "bg-rose-500",
        cardBorder: "border-rose-200",
        accent: "text-rose-600",
        hex: "#ef4444",
        description: "Contamination or severe deterioration detected",
      };
  }
}

export function getSeverityTheme(severity: AlertSeverity) {
  switch (severity) {
    case "critical":
      return {
        badgeBg: "bg-rose-100 text-rose-800 border-rose-300",
        iconColor: "text-rose-600",
        borderLeft: "border-l-4 border-l-rose-600",
        label: "Critical Alert",
      };
    case "warning":
      return {
        badgeBg: "bg-amber-100 text-amber-800 border-amber-300",
        iconColor: "text-amber-600",
        borderLeft: "border-l-4 border-l-amber-500",
        label: "Vigilance Warning",
      };
    case "info":
      return {
        badgeBg: "bg-blue-100 text-blue-800 border-blue-300",
        iconColor: "text-blue-600",
        borderLeft: "border-l-4 border-l-blue-500",
        label: "Surveillance Advisory",
      };
  }
}

export interface ParameterBenchmark {
  standard: string;
  permissible: string;
  unit: string;
  evaluate: (val: number) => { status: WaterStatus; note: string };
}

export const PARAMETER_STANDARDS: Record<string, ParameterBenchmark> = {
  ph: {
    standard: "6.5 - 8.5",
    permissible: "6.5 - 8.5",
    unit: "pH",
    evaluate: (val: number) => {
      if (val >= 6.5 && val <= 8.5) {
        return { status: "safe", note: "Optimal neutral range" };
      }
      if ((val >= 6.0 && val < 6.5) || (val > 8.5 && val <= 9.0)) {
        return { status: "warning", note: val < 6.5 ? "Slightly acidic" : "Mild alkaline trend" };
      }
      return { status: "critical", note: val < 6.0 ? "High acidity detected" : "Severe alkalinity" };
    },
  },
  tds: {
    standard: "< 500",
    permissible: "< 2000",
    unit: "ppm (mg/L)",
    evaluate: (val: number) => {
      if (val <= 500) {
        return { status: "safe", note: "Desirable mineral content" };
      }
      if (val <= 1000) {
        return { status: "warning", note: "Elevated dissolved solids" };
      }
      return { status: "critical", note: "Excessive mineralization / salinity" };
    },
  },
  turbidity: {
    standard: "< 1.0",
    permissible: "< 5.0",
    unit: "NTU",
    evaluate: (val: number) => {
      if (val <= 2.0) {
        return { status: "safe", note: "Clear optical transparency" };
      }
      if (val <= 5.0) {
        return { status: "warning", note: "Moderate suspended particles" };
      }
      return { status: "critical", note: "Severe particulate suspension / runoff" };
    },
  },
  temperature: {
    standard: "20 - 30",
    permissible: "15 - 35",
    unit: "°C",
    evaluate: (val: number) => {
      if (val >= 20 && val <= 32) {
        return { status: "safe", note: "Normal ambient range" };
      }
      return { status: "warning", note: "Thermal variance noted" };
    },
  },
  chlorine: {
    standard: "0.2 - 0.5",
    permissible: "0.2 - 1.0",
    unit: "mg/L",
    evaluate: (val: number) => {
      if (val >= 0.2 && val <= 0.6) {
        return { status: "safe", note: "Adequate residual disinfection" };
      }
      if (val < 0.2) {
        return { status: "warning", note: "Sub-optimal residual chlorine" };
      }
      return { status: "warning", note: "Elevated chlorine concentration" };
    },
  },
};
