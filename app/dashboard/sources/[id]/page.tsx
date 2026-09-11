"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { waterApi } from "@/lib/api";
import { WaterSource, WaterAlert } from "@/types/water";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { ParameterCard } from "@/components/sources/ParameterCard";
import { WaterQualityMapWrapper } from "@/components/dashboard/WaterQualityMapWrapper";
import { AssignInspectionModal } from "@/components/alerts/AssignInspectionModal";
import { Button } from "@/components/ui/Button";
import { formatDate, getStatusTheme } from "@/lib/utils";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  AlertOctagon,
  CheckCircle2,
  FileCheck2,
  Send,
  ShieldAlert,
  Printer,
  ChevronRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function SourceDetailPage() {
  const params = useParams();
  const sourceId = params?.id as string;

  const [source, setSource] = useState<WaterSource | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInspectionModalOpen, setIsInspectionModalOpen] = useState(false);
  const [advisorySent, setAdvisorySent] = useState(false);

  useEffect(() => {
    if (sourceId) {
      waterApi.getWaterSourceById(sourceId).then((res) => {
        setSource(res);
        setLoading(false);
      });
    }
  }, [sourceId]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center text-slate-500 text-sm font-medium">
        Loading water source diagnostics dossier...
      </div>
    );
  }

  if (!source) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
        <h3 className="text-lg font-bold text-slate-900">Source Not Found</h3>
        <p className="text-xs text-slate-500 mt-1">
          The requested water source identifier does not exist in the surveillance registry.
        </p>
        <Link
          href="/dashboard/sources"
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#0f2942] px-4 py-2 text-xs font-semibold text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Sources Registry</span>
        </Link>
      </div>
    );
  }

  const theme = getStatusTheme(source.status);

  // Synthetic alert representation for modal trigger
  const syntheticAlert: WaterAlert = {
    id: `DISPATCH-${source.id}`,
    sourceId: source.id,
    sourceName: source.name,
    district: source.district,
    village: source.village,
    severity: source.status === "critical" ? "critical" : "warning",
    title: `Field Inspection & Verification for ${source.name}`,
    description: source.detectedIssues.join("; ") || "Routine water quality compliance verification.",
    timestamp: source.lastUpdated,
    parametersTriggered: source.parameters,
    recommendedAction: source.recommendedAction,
    status: "active",
  };

  const handlePrintDossier = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link
          href="/dashboard/sources"
          className="flex items-center gap-1 hover:text-slate-900 font-medium transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Water Sources</span>
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-400" />
        <span className="font-mono text-slate-700">{source.id}</span>
        <ChevronRight className="h-3 w-3 text-slate-400" />
        <span className="text-slate-900 font-semibold truncate max-w-xs">{source.name}</span>
      </nav>

      {/* Hero Header Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-2">
              <span className="font-mono text-xs font-bold bg-slate-900 text-white px-2.5 py-1 rounded-md">
                {source.id}
              </span>
              <StatusBadge status={source.status} />
              <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 border border-slate-200">
                {source.sourceType}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {source.name}
            </h1>

            <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-600">
              <span className="flex items-center gap-1 font-medium">
                <MapPin className="h-3.5 w-3.5 text-teal-600" />
                {source.village}, {source.district}, {source.state}
              </span>
              <span className="text-slate-300">•</span>
              <span className="font-mono text-slate-500">
                Lat: {source.latitude.toFixed(4)}, Long: {source.longitude.toFixed(4)}
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1 font-medium text-slate-500">
                <Calendar className="h-3.5 w-3.5" />
                Updated: {formatDate(source.lastUpdated)}
              </span>
            </div>
          </div>

          {/* WQI Gauge & Quick Action */}
          <div className="flex items-center gap-4 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100">
            <div className="text-left lg:text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Water Quality Index (WQI)
              </span>
              <div className="flex items-baseline gap-1 lg:justify-end">
                <span className={`text-4xl font-black ${theme.accent}`}>
                  {source.qualityScore}
                </span>
                <span className="text-sm font-semibold text-slate-400">/100</span>
              </div>
              <span className="text-xs font-medium text-slate-500">
                {theme.description}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => setIsInspectionModalOpen(true)}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#0f2942] px-4 py-2 text-xs font-semibold text-white hover:bg-[#163a5d] shadow-xs cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Assign Inspection</span>
              </button>
              <button
                onClick={handlePrintDossier}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer shadow-xs"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print Dossier</span>
              </button>
            </div>
          </div>
        </div>

        {/* Administrative Details strip */}
        <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block">Estimated Population Served:</span>
            <span className="font-semibold text-slate-800">
              {source.populationServed?.toLocaleString("en-IN") || "Community Tap"} citizens
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">Surveillance Agency:</span>
            <span className="font-semibold text-slate-800">
              {source.monitoringAgency || "Public Health Engineering Department"}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">Testing Protocol:</span>
            <span className="font-semibold text-slate-800">
              Continuous IoT Multi-Probe Sensor (BOD/TDS/Optical)
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">Intervention Priority:</span>
            <span
              className={`font-semibold ${
                source.status === "critical"
                  ? "text-rose-600"
                  : source.status === "warning"
                  ? "text-amber-600"
                  : "text-emerald-600"
              }`}
            >
              {source.status === "critical"
                ? "Priority Level 1 (Immediate)"
                : source.status === "warning"
                ? "Priority Level 2 (Vigilance)"
                : "Routine Schedule"}
            </span>
          </div>
        </div>
      </div>

      {/* Parameter Cards Grid */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">
            Real-Time Parameter Diagnostics
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            Calibrated against Bureau of Indian Standards (IS 10500:2012)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <ParameterCard
            paramKey="ph"
            value={source.parameters.ph}
            label="Acidity / pH"
          />
          <ParameterCard
            paramKey="tds"
            value={source.parameters.tds}
            label="Total Dissolved Solids"
          />
          <ParameterCard
            paramKey="turbidity"
            value={source.parameters.turbidity}
            label="Turbidity"
          />
          <ParameterCard
            paramKey="temperature"
            value={source.parameters.temperature}
            label="Temperature"
          />
          <ParameterCard
            paramKey="chlorine"
            value={source.parameters.chlorine ?? 0.0}
            label="Residual Chlorine"
          />
        </div>
      </div>

      {/* Historical Trend Chart */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Historical 30-Day Trend Analysis
            </h3>
            <p className="text-xs text-slate-500">
              Sensor telemetry readings sampled over the preceding 5 weekly intervals
            </p>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={source.historicalReadings}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
              <YAxis yAxisId="left" stroke="#94a3b8" fontSize={11} domain={[0, 100]} />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#94a3b8"
                fontSize={11}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  fontSize: "12px",
                  border: "1px solid #e2e8f0",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="qualityScore"
                name="WQI Score (0-100)"
                stroke="#0f2942"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="ph"
                name="pH Level"
                stroke="#0d9488"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="turbidity"
                name="Turbidity (NTU)"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Decision Support Sections: Issues & Recommended Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Detected Issues */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-3">
            <AlertOctagon className="h-5 w-5 text-rose-600" />
            <span>Detected Sensor Anomalies & Issues</span>
          </h3>

          {source.detectedIssues.length === 0 ? (
            <div className="rounded-lg bg-emerald-50 p-4 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <span>
                No anomalies detected. Sensor parameters fall within standard drinking water tolerance margins.
              </span>
            </div>
          ) : (
            <div className="space-y-2.5">
              {source.detectedIssues.map((issue, idx) => (
                <div
                  key={idx}
                  className="rounded-lg bg-rose-50/70 p-3 border border-rose-200/80 text-xs text-rose-900 flex items-start gap-2"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-200 text-[11px] font-bold text-rose-800">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed font-medium">{issue}</span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 rounded-lg bg-slate-50 p-3 border border-slate-100 text-[11px] text-slate-500">
            <strong>Decision Guidance:</strong> Sensor telemetry indicates physical and chemical variation. To confirm microbial safety and trace mineral toxicology, formal laboratory testing is required.
          </div>
        </div>

        {/* Recommended Government Action */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-3">
              <FileCheck2 className="h-5 w-5 text-[#0f2942]" />
              <span>Recommended Administrative Action</span>
            </h3>

            <div className="rounded-lg bg-amber-50/80 p-4 border border-amber-200 text-xs text-amber-900">
              <span className="font-bold text-amber-950 block mb-1">
                Surveillance Directive:
              </span>
              <p className="leading-relaxed">{source.recommendedAction}</p>
            </div>

            {advisorySent && (
              <div className="mt-3 rounded-lg bg-emerald-50 p-2.5 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Precautionary Public Health Advisory broadcasted to Gram Panchayat.</span>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2.5">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsInspectionModalOpen(true)}
              className="bg-[#0f2942]"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Dispatch Mobile Testing Unit</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAdvisorySent(true)}
            >
              <ShieldAlert className="h-3.5 w-3.5 text-amber-600" />
              <span>Issue Precautionary Advisory</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Geospatial Site Location */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Geospatial Site Position
            </h3>
            <p className="text-xs text-slate-500">
              Coordinates: {source.latitude}°N, {source.longitude}°E ({source.village}, {source.district})
            </p>
          </div>
        </div>
        <WaterQualityMapWrapper
          sources={[source]}
          selectedSourceId={source.id}
          initialCenter={[source.latitude, source.longitude]}
          initialZoom={9}
          height="320px"
        />
      </div>

      {/* Field Inspection Dispatch Modal */}
      <AssignInspectionModal
        alert={syntheticAlert}
        isOpen={isInspectionModalOpen}
        onClose={() => setIsInspectionModalOpen(false)}
        onConfirm={() => {
          setIsInspectionModalOpen(false);
        }}
      />
    </div>
  );
}
