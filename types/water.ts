export type WaterStatus = 'safe' | 'warning' | 'critical';

export interface WaterParameters {
  ph: number;               // Standard: 6.5 - 8.5
  tds: number;              // Total Dissolved Solids in ppm (< 500 acceptable, > 1000 critical)
  turbidity: number;        // in NTU (< 5 acceptable, > 10 critical)
  temperature: number;      // in °C
  chlorine?: number;        // in mg/L (0.2 - 1.0)
  dissolvedOxygen?: number; // in mg/L (> 5 recommended)
}

export interface HistoricalReading {
  date: string;             // ISO or 'YYYY-MM-DD'
  ph: number;
  tds: number;
  turbidity: number;
  qualityScore: number;     // 0-100 Water Quality Index
}

export type SourceType = 'Borewell' | 'River Intake' | 'Panchayat Tank' | 'Open Well' | 'Canal Supply';

export interface WaterSource {
  id: string;
  name: string;
  village: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  status: WaterStatus;
  qualityScore: number;     // 0 to 100
  parameters: WaterParameters;
  lastUpdated: string;
  historicalReadings: HistoricalReading[];
  detectedIssues: string[];
  recommendedAction: string;
  sourceType: SourceType;
  populationServed?: number;
  monitoringAgency?: string;
}

export type AlertSeverity = 'critical' | 'warning' | 'info';
export type AlertStatus = 'active' | 'acknowledged' | 'inspection_scheduled' | 'resolved';

export interface WaterAlert {
  id: string;
  sourceId: string;
  sourceName: string;
  district: string;
  village: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  timestamp: string;
  parametersTriggered: Partial<WaterParameters>;
  recommendedAction: string;
  status: AlertStatus;
  assignedOfficer?: string;
  dueDate?: string;
}

export interface DistrictSummary {
  district: string;
  state: string;
  total: number;
  safe: number;
  warning: number;
  critical: number;
  avgScore: number;
}

export interface AnalyticsSummary {
  totalSources: number;
  safeCount: number;
  warningCount: number;
  criticalCount: number;
  averageWQI: number;
  activeAlerts: number;
  pendingInspections: number;
  deterioratingCount: number;
}
