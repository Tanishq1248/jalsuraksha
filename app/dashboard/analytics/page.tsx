"use client";

import React, { useState, useEffect } from "react";
import { waterApi } from "@/lib/api";
import { WaterSource, DistrictSummary, AnalyticsSummary } from "@/types/water";
import { PageHeader } from "@/components/layout/PageHeader";
import { DistributionChart } from "@/components/analytics/DistributionChart";
import { DistrictComparisonChart } from "@/components/analytics/DistrictComparisonChart";
import { ParameterTrendsChart } from "@/components/analytics/ParameterTrendsChart";
import { DeterioratingSourcesList } from "@/components/analytics/DeterioratingSourcesList";
import { QualityTrendChart } from "@/components/dashboard/QualityTrendChart";
import { StatCard } from "@/components/dashboard/StatCard";
import {
  TrendingDown,
  ShieldCheck,
  Building2,
  Activity,
  Download,
} from "lucide-react";

export default function AnalyticsPage() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [districts, setDistricts] = useState<DistrictSummary[]>([]);
  const [deteriorating, setDeteriorating] = useState<WaterSource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    waterApi.getAnalytics().then((data) => {
      setSummary(data.summary);
      setDistricts(data.districtSummaries);
      setDeteriorating(data.deterioratingSources);
      setLoading(false);
    });
  }, []);

  if (loading || !summary) {
    return (
      <div className="flex h-96 items-center justify-center text-slate-500 text-sm font-medium">
        Loading national analytical aggregates...
      </div>
    );
  }

  const handleExportAnalyticsReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Predictive Analytics & Decision Intelligence"
        description="Comprehensive regional risk profiling, multi-parameter correlation, and early-warning detection of deteriorating water resources."
        badge={
          <span className="rounded-md bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-800 border border-teal-200">
            Decision Support Model
          </span>
        }
        actions={
          <button
            onClick={handleExportAnalyticsReport}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#0f2942] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#163a5d] transition-colors shadow-xs cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Generate Executive Report</span>
          </button>
        }
      />

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Average National WQI"
          value={`${summary.averageWQI}`}
          subtitle="Out of 100 benchmark index"
          icon={Activity}
          variant="navy"
          trend={{
            value: "-9.2 pts",
            isPositive: false,
            label: "vs previous month baseline",
          }}
        />
        <StatCard
          title="Deteriorating Trajectory"
          value={summary.deterioratingCount}
          subtitle="Sources with steep quality drop"
          icon={TrendingDown}
          variant="critical"
          trend={{
            value: "25.0%",
            isPositive: false,
            label: "of network on watchlist",
          }}
        />
        <StatCard
          title="Compliant Baseline"
          value={summary.safeCount}
          subtitle="Sustained potable quality"
          icon={ShieldCheck}
          variant="safe"
          trend={{
            value: "10 sources",
            isPositive: true,
            label: "uninterrupted compliance",
          }}
        />
        <StatCard
          title="Monitored Districts"
          value={districts.length}
          subtitle="Administrative surveillance units"
          icon={Building2}
          variant="default"
        />
      </div>

      {/* Top Visualizations Row: Quality Trends & Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <QualityTrendChart />
        </div>
        <div className="lg:col-span-4">
          <DistributionChart
            safeCount={summary.safeCount}
            warningCount={summary.warningCount}
            criticalCount={summary.criticalCount}
          />
        </div>
      </div>

      {/* Second Visualizations Row: District Comparison & Parameter Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DistrictComparisonChart districts={districts} />
        <ParameterTrendsChart />
      </div>

      {/* Deteriorating Sources Watchlist */}
      <div>
        <DeterioratingSourcesList sources={deteriorating} />
      </div>

      {/* Public Health Advisory Guidelines */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-xs text-slate-600 leading-relaxed">
        <h4 className="font-bold text-slate-800 text-sm mb-1">
          Government Protocol & Compliance Standard (Jal Jeevan Mission / CPCB)
        </h4>
        <p>
          Water quality index computations are evaluated continuously based on temperature-compensated pH, electro-conductivity TDS calibration, and laser turbidimetry. A source flagged under the <strong>Deteriorating Watchlist</strong> automatically initiates priority laboratory sample acquisition protocols. Civil drinking water distribution authorities must coordinate alternate tanker services whenever critical chemical or turbidity thresholds persist beyond 24 hours.
        </p>
      </div>
    </div>
  );
}
