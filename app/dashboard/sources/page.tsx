"use client";

import React, { useState, useEffect, useMemo } from "react";
import { waterApi } from "@/lib/api";
import { WaterSource, WaterStatus } from "@/types/water";
import { PageHeader } from "@/components/layout/PageHeader";
import { SourceFilterBar } from "@/components/sources/SourceFilterBar";
import { SourceTable } from "@/components/sources/SourceTable";
import { SourceCard } from "@/components/sources/SourceCard";
import { Download } from "lucide-react";

export default function SourcesListPage() {
  const [sources, setSources] = useState<WaterSource[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<WaterStatus | "all">("all");
  const [districtFilter, setDistrictFilter] = useState("all");
  const [anomalyFilter, setAnomalyFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"name" | "qualityScore" | "lastUpdated" | "status">("qualityScore");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  useEffect(() => {
    waterApi.getWaterSources().then((res) => setSources(res));
  }, []);

  // Compute unique districts
  const districts = useMemo(() => {
    const list = Array.from(new Set(sources.map((s) => s.district))).sort();
    return list;
  }, [sources]);

  // Handle column sort
  const handleSort = (column: "name" | "qualityScore" | "lastUpdated" | "status") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  // Filter and sort sources
  const filteredSources = useMemo(() => {
    let list = [...sources];

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.id.toLowerCase().includes(q) ||
          s.village.toLowerCase().includes(q) ||
          s.district.toLowerCase().includes(q) ||
          s.state.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      list = list.filter((s) => s.status === statusFilter);
    }

    // District filter
    if (districtFilter !== "all") {
      list = list.filter((s) => s.district === districtFilter);
    }

    // Anomaly filter
    if (anomalyFilter === "low_ph") {
      list = list.filter((s) => s.parameters.ph < 6.5);
    } else if (anomalyFilter === "high_ph") {
      list = list.filter((s) => s.parameters.ph > 8.5);
    } else if (anomalyFilter === "high_tds") {
      list = list.filter((s) => s.parameters.tds > 1000);
    } else if (anomalyFilter === "high_turbidity") {
      list = list.filter((s) => s.parameters.turbidity > 5.0);
    }

    // Sorting
    list.sort((a, b) => {
      const order = sortOrder === "asc" ? 1 : -1;
      if (sortBy === "qualityScore") {
        return (a.qualityScore - b.qualityScore) * order;
      }
      if (sortBy === "lastUpdated") {
        return (new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime()) * order;
      }
      if (sortBy === "status") {
        const priority = { critical: 1, warning: 2, safe: 3 };
        return (priority[a.status] - priority[b.status]) * order;
      }
      return a.name.localeCompare(b.name) * order;
    });

    return list;
  }, [sources, search, statusFilter, districtFilter, anomalyFilter, sortBy, sortOrder]);

  const handleResetFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setDistrictFilter("all");
    setAnomalyFilter("all");
  };

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "ID,Name,Village,District,State,Status,WQI,pH,TDS,Turbidity,LastUpdated\n" +
      filteredSources
        .map(
          (s) =>
            `"${s.id}","${s.name}","${s.village}","${s.district}","${s.state}","${s.status}",${s.qualityScore},${s.parameters.ph},${s.parameters.tds},${s.parameters.turbidity},"${s.lastUpdated}"`
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `JalSuraksha_Water_Sources_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Monitored Water Sources"
        description="Comprehensive registry of rural and peri-urban water supply intakes under continuous sensor surveillance."
        badge={
          <span className="rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 border border-slate-200 font-mono">
            {sources.length} Total Registered Sources
          </span>
        }
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        }
      />

      {/* Filter and Search controls */}
      <SourceFilterBar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        districtFilter={districtFilter}
        onDistrictChange={setDistrictFilter}
        districts={districts}
        anomalyFilter={anomalyFilter}
        onAnomalyChange={setAnomalyFilter}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onReset={handleResetFilters}
        totalFiltered={filteredSources.length}
      />

      {/* Content Rendering: Table vs Grid */}
      {viewMode === "table" ? (
        <SourceTable
          sources={filteredSources}
          onSort={handleSort}
          sortBy={sortBy}
          sortOrder={sortOrder}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSources.map((source) => (
            <SourceCard key={source.id} source={source} />
          ))}
        </div>
      )}
    </div>
  );
}
