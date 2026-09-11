"use client";

import dynamic from "next/dynamic";
import React from "react";
import { WaterSource } from "@/types/water";
import { Navigation } from "lucide-react";

const DynamicWaterQualityMap = dynamic(
  () => import("@/components/dashboard/WaterQualityMap"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[520px] w-full items-center justify-center rounded-xl bg-slate-100 border border-slate-200 animate-pulse text-slate-500 text-sm font-medium">
        <div className="flex flex-col items-center gap-2">
          <Navigation className="h-6 w-6 animate-spin text-teal-600" />
          <span>Loading Geospatial Surveillance Grid...</span>
        </div>
      </div>
    ),
  }
);

interface WaterQualityMapWrapperProps {
  sources: WaterSource[];
  selectedSourceId?: string;
  height?: string;
  initialCenter?: [number, number];
  initialZoom?: number;
}

export const WaterQualityMapWrapper: React.FC<WaterQualityMapWrapperProps> = (props) => {
  return <DynamicWaterQualityMap {...props} />;
};

export default WaterQualityMapWrapper;
