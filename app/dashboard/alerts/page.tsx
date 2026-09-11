"use client";

import React, { useState, useEffect, useMemo } from "react";
import { waterApi } from "@/lib/api";
import { WaterAlert, AlertSeverity, AlertStatus } from "@/types/water";
import { PageHeader } from "@/components/layout/PageHeader";
import { AlertCard } from "@/components/alerts/AlertCard";
import { AlertFilters } from "@/components/alerts/AlertFilters";
import { AssignInspectionModal } from "@/components/alerts/AssignInspectionModal";
import { StatCard } from "@/components/dashboard/StatCard";
import {
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  Send,
  Bell,
} from "lucide-react";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<WaterAlert[]>([]);
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState<AlertSeverity | "all">("all");
  const [statusFilter, setStatusFilter] = useState<AlertStatus | "all">("all");
  const [selectedAlertForInspection, setSelectedAlertForInspection] = useState<WaterAlert | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    waterApi.getAlerts().then((res) => setAlerts(res));
  }, []);

  const counts = useMemo(() => {
    return {
      total: alerts.length,
      critical: alerts.filter((a) => a.severity === "critical").length,
      warning: alerts.filter((a) => a.severity === "warning").length,
      active: alerts.filter((a) => a.status === "active").length,
    };
  }, [alerts]);

  const filteredAlerts = useMemo(() => {
    let list = [...alerts];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.sourceName.toLowerCase().includes(q) ||
          a.sourceId.toLowerCase().includes(q) ||
          a.district.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q)
      );
    }

    if (severityFilter !== "all") {
      list = list.filter((a) => a.severity === severityFilter);
    }

    if (statusFilter !== "all") {
      list = list.filter((a) => a.status === statusFilter);
    }

    return list;
  }, [alerts, search, severityFilter, statusFilter]);

  const handleAcknowledge = async (id: string) => {
    const updated = await waterApi.acknowledgeAlert(id);
    if (updated) {
      setAlerts((prev) => prev.map((a) => (a.id === id ? updated : a)));
    }
  };

  const handleOpenAssignModal = (alert: WaterAlert) => {
    setSelectedAlertForInspection(alert);
    setIsModalOpen(true);
  };

  const handleConfirmInspection = async (alertId: string, officer: string, dueDate: string) => {
    const updated = await waterApi.assignInspection(alertId, officer, dueDate);
    if (updated) {
      setAlerts((prev) => prev.map((a) => (a.id === alertId ? updated : a)));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Administrative Water Alerts & Action Dispatch"
        description="Automated multi-parameter threshold violations requiring administrative review, laboratory sampling, and field inspection deployment."
        badge={
          <span className="rounded-md bg-rose-50 px-2.5 py-0.5 text-xs font-bold text-rose-800 border border-rose-200">
            {counts.active} Active Violations
          </span>
        }
      />

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Alerts"
          value={counts.active}
          subtitle="Unacknowledged threshold breaches"
          icon={AlertOctagon}
          variant="critical"
        />
        <StatCard
          title="Critical Alerts"
          value={counts.critical}
          subtitle="Immediate action recommended"
          icon={AlertTriangle}
          variant="critical"
        />
        <StatCard
          title="Vigilance Warnings"
          value={counts.warning}
          subtitle="Approaching permissible ceilings"
          icon={Bell}
          variant="warning"
        />
        <StatCard
          title="Inspections Scheduled"
          value={alerts.filter((a) => a.status === "inspection_scheduled").length}
          subtitle="Field personnel dispatched"
          icon={Send}
          variant="navy"
        />
      </div>

      {/* Filters Bar */}
      <AlertFilters
        search={search}
        onSearchChange={setSearch}
        severityFilter={severityFilter}
        onSeverityChange={setSeverityFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        counts={counts}
      />

      {/* Alert Cards Feed */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-500">
            <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto mb-2" />
            <h4 className="font-bold text-slate-800 text-base">No Alerts Match Your Filters</h4>
            <p className="text-xs text-slate-400 mt-1">
              All monitored water quality parameters for the selected filters are operating within expected margins.
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onAcknowledge={handleAcknowledge}
              onAssignInspection={handleOpenAssignModal}
            />
          ))
        )}
      </div>

      {/* Field Inspection Dispatch Modal */}
      <AssignInspectionModal
        alert={selectedAlertForInspection}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmInspection}
      />
    </div>
  );
}
