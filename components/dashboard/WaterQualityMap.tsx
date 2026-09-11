"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { WaterSource, WaterStatus } from "@/types/water";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { ExternalLink, Navigation } from "lucide-react";

interface WaterQualityMapProps {
  sources: WaterSource[];
  selectedSourceId?: string;
  height?: string;
  initialCenter?: [number, number];
  initialZoom?: number;
}

// Function to generate customized SVG markers using L.divIcon
const createCustomMarker = (status: WaterStatus, isSelected = false) => {
  const colors = {
    safe: {
      bg: "#10b981",
      border: "#059669",
      shadow: "rgba(16, 185, 129, 0.4)",
      label: "Safe",
    },
    warning: {
      bg: "#f59e0b",
      border: "#d97706",
      shadow: "rgba(245, 158, 11, 0.4)",
      label: "Warn",
    },
    critical: {
      bg: "#ef4444",
      border: "#dc2626",
      shadow: "rgba(239, 68, 68, 0.5)",
      label: "Crit",
    },
  };

  const config = colors[status];
  const size = isSelected ? 34 : 26;

  const html = `
    <div style="
      position: relative;
      width: ${size}px;
      height: ${size}px;
      display: flex;
      align-items: center;
      justify-content: center;
      transform: translate(-50%, -50%);
    ">
      ${
        status === "critical"
          ? `<div style="
              position: absolute;
              width: ${size + 14}px;
              height: ${size + 14}px;
              border-radius: 50%;
              background-color: ${config.shadow};
              animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
            "></div>`
          : ""
      }
      <div style="
        width: ${size}px;
        height: ${size}px;
        background-color: ${config.bg};
        border: 2.5px solid #ffffff;
        border-radius: 50%;
        box-shadow: 0 4px 10px ${config.shadow};
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: ${isSelected ? "11px" : "9px"};
        font-weight: 700;
        cursor: pointer;
        transition: transform 0.15s ease;
      ">
        ${status === "critical" ? "!" : ""}
      </div>
    </div>
  `;

  return L.divIcon({
    className: "custom-water-marker",
    html: html,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
};

const emptySubscribe = () => () => {};

export const WaterQualityMap: React.FC<WaterQualityMapProps> = ({
  sources,
  selectedSourceId,
  height = "520px",
  initialCenter = [22.8, 79.5], // Geographic center of India
  initialZoom = 5,
}) => {
  const [filter, setFilter] = useState<"all" | WaterStatus>("all");
  const mounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const filteredSources = sources.filter((s) => {
    if (filter === "all") return true;
    return s.status === filter;
  });

  if (!mounted) {
    return (
      <div
        className="flex items-center justify-center rounded-xl bg-slate-100 border border-slate-200 animate-pulse text-slate-400 text-sm font-medium"
        style={{ height }}
      >
        <div className="flex flex-col items-center gap-2">
          <Navigation className="h-6 w-6 animate-spin text-teal-600" />
          <span>Initializing Geospatial Surveillance Map...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-white shadow-xs">
      {/* Map Filter Controls Floating Bar */}
      <div className="absolute top-3 right-3 z-[1000] flex items-center gap-1.5 bg-white/95 p-1.5 rounded-lg border border-slate-200 shadow-md backdrop-blur-xs text-xs font-medium">
        <span className="hidden sm:inline-block text-slate-500 px-2 text-[11px] uppercase tracking-wider font-semibold">
          Map Filter:
        </span>
        <button
          onClick={() => setFilter("all")}
          className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
            filter === "all"
              ? "bg-[#0f2942] text-white font-semibold"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          All ({sources.length})
        </button>
        <button
          onClick={() => setFilter("safe")}
          className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
            filter === "safe"
              ? "bg-emerald-600 text-white font-semibold"
              : "text-emerald-700 hover:bg-emerald-50"
          }`}
        >
          Safe ({sources.filter((s) => s.status === "safe").length})
        </button>
        <button
          onClick={() => setFilter("warning")}
          className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
            filter === "warning"
              ? "bg-amber-600 text-white font-semibold"
              : "text-amber-700 hover:bg-amber-50"
          }`}
        >
          Warning ({sources.filter((s) => s.status === "warning").length})
        </button>
        <button
          onClick={() => setFilter("critical")}
          className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
            filter === "critical"
              ? "bg-rose-600 text-white font-semibold"
              : "text-rose-700 hover:bg-rose-50"
          }`}
        >
          Critical ({sources.filter((s) => s.status === "critical").length})
        </button>
      </div>

      {/* Leaflet Map */}
      <div style={{ height, width: "100%" }}>
        <MapContainer
          center={initialCenter}
          zoom={initialZoom}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
        >
          {/* CartoDB Positron / OSM clean tile layer */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />

          {filteredSources.map((source) => {
            const isSelected = source.id === selectedSourceId;
            const customIcon = createCustomMarker(source.status, isSelected);

            return (
              <Marker
                key={source.id}
                position={[source.latitude, source.longitude]}
                icon={customIcon}
              >
                <Popup>
                  <div className="p-3.5 w-64 max-w-xs text-slate-800">
                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2 mb-2">
                      <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                        {source.id}
                      </span>
                      <StatusBadge status={source.status} />
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm leading-snug">
                      {source.name}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {source.village}, {source.district}, {source.state}
                    </p>

                    {/* Sensor Metric Grid */}
                    <div className="grid grid-cols-3 gap-1.5 my-3 bg-slate-50 p-2 rounded-lg border border-slate-100 text-center">
                      <div>
                        <div className="text-[10px] text-slate-400 font-medium">pH</div>
                        <div className="text-xs font-bold text-slate-800">
                          {source.parameters.ph}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 font-medium">TDS</div>
                        <div className="text-xs font-bold text-slate-800">
                          {source.parameters.tds} <span className="text-[9px]">ppm</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 font-medium">Turbidity</div>
                        <div className="text-xs font-bold text-slate-800">
                          {source.parameters.turbidity} <span className="text-[9px]">NTU</span>
                        </div>
                      </div>
                    </div>

                    {/* Action button */}
                    <Link
                      href={`/dashboard/sources/${source.id}`}
                      className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#0f2942] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#163a5d] transition-colors shadow-xs"
                    >
                      <span>View Full Diagnostics</span>
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};

export default WaterQualityMap;
