"use client";

import React, { useState, useEffect } from "react";
import { waterApi } from "@/lib/api";
import { WaterSource, WaterAlert, AnalyticsSummary } from "@/types/water";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { WaterQualityMapWrapper } from "@/components/dashboard/WaterQualityMapWrapper";
import { PrioritySources } from "@/components/dashboard/PrioritySources";
import { QualityTrendChart } from "@/components/dashboard/QualityTrendChart";
import { RecentAlerts } from "@/components/dashboard/RecentAlerts";
import { AssignInspectionModal } from "@/components/alerts/AssignInspectionModal";
import {
  Droplets,
  ShieldCheck,
  AlertTriangle,
  Flame,
  Activity,
  Download,
  RefreshCw,
} from "lucide-react";

export default function DashboardOverviewPage() {
  const [sources, setSources] = useState<WaterSource[]>([]);
  const [alerts, setAlerts] = useState<WaterAlert[]>([]);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [selectedAlertForInspection, setSelectedAlertForInspection] = useState<WaterAlert | null>(null);
  const [isInspectionModalOpen, setIsInspectionModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadDashboardData = async () => {
    setIsRefreshing(true);
    try {
      const [fetchedSources, fetchedAlerts, analytics] = await Promise.all([
        waterApi.getWaterSources(),
        waterApi.getAlerts({ status: "active" }),
        waterApi.getAnalytics(),
      ]);
      setSources(fetchedSources);
      setAlerts(fetchedAlerts);
      setSummary(analytics.summary);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      waterApi.getWaterSources(),
      waterApi.getAlerts({ status: "active" }),
      waterApi.getAnalytics(),
    ]).then(([fetchedSources, fetchedAlerts, analytics]) => {
      if (isMounted) {
        setSources(fetchedSources);
        setAlerts(fetchedAlerts);
        setSummary(analytics.summary);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleAcknowledgeAlert = async (alertId: string) => {
    await waterApi.acknowledgeAlert(alertId);
    setAlerts((prev) => prev.filter((a) => a.id !== alertId));
  };

  const handleOpenAssignInspection = (alert: WaterAlert) => {
    setSelectedAlertForInspection(alert);
    setIsInspectionModalOpen(true);
  };

  const handleConfirmInspection = async (alertId: string, officer: string, dueDate: string) => {
    await waterApi.assignInspection(alertId, officer, dueDate);
    setAlerts((prev) => prev.filter((a) => a.id !== alertId));
  };

  const handleExportData = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "ID,Name,Village,District,State,Status,WQI,pH,TDS,Turbidity\n" +
      sources
        .map(
          (s) =>
            `"${s.id}","${s.name}","${s.village}","${s.district}","${s.state}","${s.status}",${s.qualityScore},${s.parameters.ph},${s.parameters.tds},${s.parameters.turbidity}`
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `JalSuraksha_Surveillance_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="National Water Surveillance Overview"
        description="Comprehensive decision support telemetry for public health authorities across distributed water supply sources."
        badge={
          <span className="rounded-md bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-800 border border-teal-200">
            National Grid
          </span>
        }
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={loadDashboardData}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shadow-xs"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-teal-600" : ""}`} />
              <span>Refresh Telemetry</span>
            </button>
            <button
              onClick={handleExportData}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#0f2942] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#163a5d] transition-colors cursor-pointer shadow-xs"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        }
      />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Monitored Sources"
          value={summary?.totalSources ?? 24}
          subtitle="Real-time sensor telemetry points"
          icon={Droplets}
          variant="navy"
          trend={{
            value: "100%",
            isPositive: true,
            label: "reporting continuously",
          }}
        />
        <StatCard
          title="Safe Sources"
          value={summary?.safeCount ?? 10}
          subtitle="Conforming to baseline potable standards"
          icon={ShieldCheck}
          variant="safe"
          trend={{
            value: "41.6%",
            isPositive: true,
            label: "of active intake network",
          }}
        />
        <StatCard
          title="Warning / Vigilance"
          value={summary?.warningCount ?? 7}
          subtitle="Approaching standard parameter limits"
          icon={AlertTriangle}
          variant="warning"
          trend={{
            value: "29.2%",
            isPositive: false,
            label: "sanitary surveillance advised",
          }}
        />
        <StatCard
          title="Critical / High Risk"
          value={summary?.criticalCount ?? 7}
          subtitle="Severe deterioration or contamination"
          icon={Flame}
          variant="critical"
          trend={{
            value: "Action Required",
            isPositive: false,
            label: "field verification priority",
          }}
        />
      </div>

      {/* Map Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Geospatial Water Quality Surveillance
            </h3>
            <p className="text-xs text-slate-500">
              Interactive geographic cluster showing real-time source parameters and risk statuses across India
            </p>
          </div>
        </div>
        <WaterQualityMapWrapper sources={sources} height="480px" />
      </div>

      {/* Trend and Alerts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Quality Trends (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <QualityTrendChart />
          <PrioritySources sources={sources} />
        </div>

        {/* Right Column: Recent Priority Alerts (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <RecentAlerts
            alerts={alerts}
            onAcknowledge={handleAcknowledgeAlert}
            onAssignInspection={handleOpenAssignInspection}
          />

          {/* Quick Guidance Box */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Activity className="h-4 w-4 text-teal-600" />
              Standard Operating Procedure (SOP) Notice
            </h4>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Sensor readings provide continuous early-warning diagnostics of water quality deterioration. Sensor data alone does not certify biological safety. Always dispatch accredited laboratory teams for formal confirmation before changing civil water supply statuses.
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-medium text-slate-600">
              <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                • Laboratory verification recommended
              </span>
              <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                • Field inspection recommended
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Assign Inspection Modal */}
      <AssignInspectionModal
        alert={selectedAlertForInspection}
        isOpen={isInspectionModalOpen}
        onClose={() => setIsInspectionModalOpen(false)}
        onConfirm={handleConfirmInspection}
      />
    </div>
  );
}
