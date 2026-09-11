import {
  WaterSource,
  WaterAlert,
  DistrictSummary,
  AnalyticsSummary,
  WaterStatus,
  AlertStatus,
} from "@/types/water";
import {
  MOCK_WATER_SOURCES,
  MOCK_ALERTS,
  DISTRICT_SUMMARIES,
  MOCK_ANALYTICS_SUMMARY,
} from "@/data/mockWaterData";

// In-memory mutable arrays for session interactivity (acknowledge, assign inspection)
const sourcesStore: WaterSource[] = [...MOCK_WATER_SOURCES];
const alertsStore: WaterAlert[] = [...MOCK_ALERTS];

export interface WaterSourcesQuery {
  search?: string;
  status?: WaterStatus | "all";
  district?: string;
  sortBy?: "name" | "qualityScore" | "lastUpdated" | "status";
  sortOrder?: "asc" | "desc";
}

export interface AlertsQuery {
  severity?: "critical" | "warning" | "info" | "all";
  status?: AlertStatus | "all";
  district?: string;
}

/**
 * Water Quality Surveillance API Client
 * Designed for immediate drop-in replacement with real fetch/Axios calls.
 */
export const waterApi = {
  // GET /water-sources
  getWaterSources: async (query?: WaterSourcesQuery): Promise<WaterSource[]> => {
    let result = [...sourcesStore];

    if (query?.search) {
      const q = query.search.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.id.toLowerCase().includes(q) ||
          s.village.toLowerCase().includes(q) ||
          s.district.toLowerCase().includes(q) ||
          s.state.toLowerCase().includes(q)
      );
    }

    if (query?.status && query.status !== "all") {
      result = result.filter((s) => s.status === query.status);
    }

    if (query?.district && query.district !== "all") {
      result = result.filter((s) => s.district === query.district);
    }

    if (query?.sortBy) {
      result.sort((a, b) => {
        const order = query.sortOrder === "desc" ? -1 : 1;
        if (query.sortBy === "qualityScore") {
          return (a.qualityScore - b.qualityScore) * order;
        }
        if (query.sortBy === "lastUpdated") {
          return (new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime()) * order;
        }
        return a.name.localeCompare(b.name) * order;
      });
    }

    return result;
  },

  // GET /water-sources/:id
  getWaterSourceById: async (id: string): Promise<WaterSource | null> => {
    const found = sourcesStore.find((s) => s.id.toLowerCase() === id.toLowerCase());
    return found || null;
  },

  // GET /alerts
  getAlerts: async (query?: AlertsQuery): Promise<WaterAlert[]> => {
    let result = [...alertsStore];

    if (query?.severity && query.severity !== "all") {
      result = result.filter((a) => a.severity === query.severity);
    }

    if (query?.status && query.status !== "all") {
      result = result.filter((a) => a.status === query.status);
    }

    if (query?.district && query.district !== "all") {
      result = result.filter((a) => a.district === query.district);
    }

    return result;
  },

  // PATCH /alerts/:id/acknowledge
  acknowledgeAlert: async (id: string): Promise<WaterAlert | null> => {
    const index = alertsStore.findIndex((a) => a.id === id);
    if (index === -1) return null;
    alertsStore[index] = {
      ...alertsStore[index],
      status: "acknowledged",
    };
    return alertsStore[index];
  },

  // POST /alerts/:id/assign-inspection
  assignInspection: async (
    id: string,
    officer: string,
    dueDate: string
  ): Promise<WaterAlert | null> => {
    const index = alertsStore.findIndex((a) => a.id === id);
    if (index === -1) return null;
    alertsStore[index] = {
      ...alertsStore[index],
      status: "inspection_scheduled",
      assignedOfficer: officer,
      dueDate: dueDate,
    };
    return alertsStore[index];
  },

  // GET /analytics
  getAnalytics: async (): Promise<{
    summary: AnalyticsSummary;
    districtSummaries: DistrictSummary[];
    deterioratingSources: WaterSource[];
  }> => {
    // Sources where latest quality score is significantly lower than 30 days ago
    const deteriorating = sourcesStore.filter((s) => {
      if (s.historicalReadings.length < 2) return false;
      const initial = s.historicalReadings[0].qualityScore;
      const current = s.qualityScore;
      return initial - current >= 15;
    });

    return {
      summary: {
        ...MOCK_ANALYTICS_SUMMARY,
        totalSources: sourcesStore.length,
        safeCount: sourcesStore.filter((s) => s.status === "safe").length,
        warningCount: sourcesStore.filter((s) => s.status === "warning").length,
        criticalCount: sourcesStore.filter((s) => s.status === "critical").length,
        activeAlerts: alertsStore.filter((a) => a.status === "active").length,
        deterioratingCount: deteriorating.length,
      },
      districtSummaries: DISTRICT_SUMMARIES,
      deterioratingSources: deteriorating,
    };
  },
};
