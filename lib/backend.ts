import type { DowntimeEvent, DowntimeReason, Machine, ProductionRecord, Shift } from "@/lib/demo-data";
import { getDowntimeEvents, getMachines, getProductionRecords } from "@/lib/demo-data";
import type { FactoryOverview, OeeSummary } from "@/lib/oee";
import {
  calculateAvailability,
  getDowntimeMinutes,
  getFactoryOverview,
  getTotalDefective,
  getTotalUnits,
} from "@/lib/oee";

const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
const SHIFT_DURATION_MINUTES = 480;
const MAX_DOWNTIME_EVENT_MS = 24 * 60 * 60 * 1000;

export interface BackendOverviewData {
  machines: Machine[];
  records: ProductionRecord[];
  events: DowntimeEvent[];
}

export interface RawMachine {
  id?: string | number;
  name?: string | null;
  stage?: string | null;
  status?: string | null;
  shift?: string | null;
}

export interface RawReading {
  id?: string | number;
  machineId?: string | number;
  machine?: RawMachine | null;
  timestamp?: string | null;
  outputCount?: number;
  temperature?: number;
  shift?: string | null;
}

export interface RawDowntimeEvent {
  id?: string | number;
  machineId?: string | number;
  machine?: RawMachine | null;
  startTime?: string | null;
  endTime?: string | null;
  cause?: string | null;
  shift?: string | null;
}

export function mapMachines(raw: RawMachine[]): Machine[] {
  return raw.map((m) => {
    const status = String(m.status ?? "").toUpperCase();
    return {
      id: String(m.id ?? "1"),
      name: m.name || `Machine ${m.id}`,
      line: m.stage || "Line 1",
      shift: (m.shift || "Day") as Shift,
      status: status === "RUNNING" ? "Running" : status === "DOWN" ? "Down" : "Idle",
      idealCycleSeconds: 20,
    };
  });
}

export function mapRecords(raw: RawReading[]): ProductionRecord[] {
  const seen = new Set<string>();
  return raw
    .map((r) => ({
      id: `P-${r.id}`,
      machineId: String(r.machineId ?? r.machine?.id ?? "1"),
      line: r.machine?.stage ?? "Line 1",
      shift: (r.shift || "Day") as Shift,
      timestamp: r.timestamp ? new Date(r.timestamp).toISOString() : new Date().toISOString(),
      unitsProduced: r.outputCount ?? 0,
      defectiveUnits: Math.max(0, Math.round((r.outputCount ?? 0) * 0.02)),
      cycleTimeSeconds: 20,
    }))
    .filter((record) => {
      if (record.unitsProduced <= 0) {
        return false;
      }
      const key = `${record.machineId}|${record.timestamp}|${record.unitsProduced}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
}

interface MappedDowntimeEvent {
  id: string;
  machineId: string;
  line: string;
  shift: Shift;
  start: number;
  end: number;
  reason: DowntimeReason;
}

export function mapEvents(raw: RawDowntimeEvent[]): DowntimeEvent[] {
  const seen = new Set<string>();
  return raw
    .map(
      (e): MappedDowntimeEvent => ({
        id: `D-${e.id}`,
        machineId: String(e.machineId ?? e.machine?.id ?? ""),
        line: e.machine?.stage ?? "Line 1",
        shift: (e.shift || "Day") as Shift,
        start: e.startTime ? new Date(e.startTime).getTime() : Number.NaN,
        end: e.endTime ? new Date(e.endTime).getTime() : Number.NaN,
        reason: (e.cause || "Breakdown") as DowntimeReason,
      }),
    )
    .filter(
      (event) =>
        Boolean(event.machineId) &&
        Number.isFinite(event.start) &&
        Number.isFinite(event.end) &&
        event.end > event.start &&
        event.end - event.start <= MAX_DOWNTIME_EVENT_MS,
    )
    .filter((event) => {
      const key = `${event.machineId}|${event.start}|${event.end}|${event.reason}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    })
    .map((event) => ({
      id: event.id,
      machineId: event.machineId,
      line: event.line,
      shift: event.shift,
      start: new Date(event.start).toISOString(),
      end: new Date(event.end).toISOString(),
      reason: event.reason,
    }));
}

/**
 * Fetch machines, sensor readings and downtime events from the backend API
 * and map them into the frontend data model. Falls back to demo data when a
 * collection is empty, and throws when the backend itself is unreachable.
 */
export async function fetchBackendOverviewData(): Promise<BackendOverviewData> {
  if (!backendUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
  }

  const [machinesRes, readingsRes, eventsRes] = await Promise.all([
    fetch(`${backendUrl}/machines`, { cache: "no-store" }),
    fetch(`${backendUrl}/sensor-readings`, { cache: "no-store" }),
    fetch(`${backendUrl}/downtime-events`, { cache: "no-store" }),
  ]);

  if (!machinesRes.ok || !readingsRes.ok || !eventsRes.ok) {
    throw new Error("One or more backend requests failed");
  }

  const [rawMachines, rawReadings, rawEvents] = await Promise.all([
    machinesRes.json().catch(() => []),
    readingsRes.json().catch(() => []),
    eventsRes.json().catch(() => []),
  ]);

  const machines = Array.isArray(rawMachines) && rawMachines.length > 0 ? mapMachines(rawMachines) : getMachines();
  const records = Array.isArray(rawReadings) && rawReadings.length > 0 ? mapRecords(rawReadings) : getProductionRecords();
  const events = Array.isArray(rawEvents) && rawEvents.length > 0 ? mapEvents(rawEvents) : getDowntimeEvents();

  return { machines, records, events };
}

function pickNumber(map: Record<string, number> | null | undefined, keys: string[]): number | null {
  if (!map) {
    return null;
  }
  for (const key of keys) {
    const entry = Object.entries(map).find(([candidate]) => candidate.toLowerCase() === key.toLowerCase());
    if (entry && typeof entry[1] === "number" && Number.isFinite(entry[1])) {
      return entry[1];
    }
  }
  return null;
}

/**
 * Ask the backend to calculate OEE from the current production metrics via
 * POST /api/oee/calculate. Returns null when the endpoint is unavailable or
 * its response cannot be mapped to the OEE summary. When the backend model is
 * degenerate or disagrees with the local aggregation, falls back to the local
 * per-machine computation and reports source "local".
 */
export interface OeeCalculationResult {
  overview: FactoryOverview;
  source: "backend" | "local";
}

export async function calculateOeeFromBackend(data: BackendOverviewData): Promise<OeeCalculationResult | null> {
  if (!backendUrl) {
    return null;
  }

  const downtimeMinutes = getDowntimeMinutes(data.events);
  const unitsProduced = getTotalUnits(data.records);
  const defectiveUnits = getTotalDefective(data.records);
  const averageIdealCycle =
    data.machines.length > 0
      ? data.machines.reduce((sum, machine) => sum + machine.idealCycleSeconds, 0) / data.machines.length
      : 20;

  const metrics: Record<string, number> = {
    operatingTime: Math.max(0, SHIFT_DURATION_MINUTES - downtimeMinutes),
    plannedProductionTime: SHIFT_DURATION_MINUTES,
    idealCycleTime: averageIdealCycle / 60,
    totalCount: unitsProduced,
    goodCount: Math.max(0, unitsProduced - defectiveUnits),
  };

  try {
    const response = await fetch(`${backendUrl}/oee/calculate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(metrics),
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json().catch(() => null)) as Record<string, number> | null;
    if (!payload || typeof payload !== "object") {
      return null;
    }

    const toFraction = (value: number) => Math.max(0, Math.min(1, value > 1 ? value / 100 : value));

    const availability = pickNumber(payload, ["availability", "oeeAvailability"]);
    const performance = pickNumber(payload, ["performance", "oeePerformance"]);
    const quality = pickNumber(payload, ["quality", "oeeQuality"]);
    const oee = pickNumber(payload, ["oee", "overallOee"]);

    if (availability === null || performance === null || quality === null || oee === null) {
      return null;
    }

    const availabilityFraction = toFraction(availability);
    const performanceFraction = toFraction(performance);
    const qualityFraction = toFraction(quality);
    const oeeFraction = toFraction(oee);

    const local = getFactoryOverview(data.machines, data.records, data.events);

    // The backend model treats the factory as one shared 480-minute shift, so
    // it degenerates (OEE 0, or performance/availability unrelated to the real
    // downtime and recorded cycle times) whenever aggregate data is sparse or
    // contaminated by outliers. Only trust it when every metric is present and
    // it agrees with the per-machine aggregation within a small tolerance;
    // otherwise fall back to the consistent local computation.
    const localAvailability = calculateAvailability(downtimeMinutes);
    const backendModelIsSane =
      metrics.operatingTime > 0 &&
      metrics.totalCount > 0 &&
      oeeFraction > 0 &&
      performanceFraction > 0 &&
      qualityFraction > 0 &&
      Math.abs(availabilityFraction - localAvailability) <= 0.05 &&
      Math.abs(performanceFraction - local.overall.performance) <= 0.15;

    const overall: OeeSummary = {
      availability: availabilityFraction,
      performance: performanceFraction,
      quality: qualityFraction,
      oee: oeeFraction,
      downtimeMinutes,
      unitsProduced,
      defectiveUnits,
    };

    return {
      overview: { ...local, overall: backendModelIsSane ? overall : local.overall },
      source: backendModelIsSane ? "backend" : "local",
    };
  } catch {
    return null;
  }
}
