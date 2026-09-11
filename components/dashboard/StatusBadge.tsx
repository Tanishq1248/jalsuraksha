import React from "react";
import { WaterStatus } from "@/types/water";
import { getStatusTheme, cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: WaterStatus;
  className?: string;
  showDot?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className,
  showDot = true,
}) => {
  const theme = getStatusTheme(status);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border",
        theme.badgeBg,
        className
      )}
    >
      {showDot && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            theme.indicatorBg,
            status === "critical" && "animate-pulse"
          )}
        />
      )}
      <span>{theme.label.split(" / ")[0]}</span>
    </span>
  );
};
