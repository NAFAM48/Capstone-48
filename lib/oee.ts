import type { DowntimeEvent, Machine, ProductionRecord } from "@/lib/demo-data";

const SHIFT_DURATION_MINUTES = 480;

export function calculateAvailability(downtimeMinutes: number) {
  if (downtimeMinutes < 0) {
    return 0;
  }
  return Math.max(0, Math.min(1, 1 - downtimeMinutes / SHIFT_DURATION_MINUTES));
}

export function calculatePerformance(idealCycleSeconds: number, actualCycleTimeSeconds: number) {
  if (idealCycleSeconds <= 0 || actualCycleTimeSeconds <= 0) {
    return 0;
  }
  return Math.max(0, Math.min(1, idealCycleSeconds / actualCycleTimeSeconds));
}

export function calculateQuality(goodUnits: number, totalUnits: number) {
  if (totalUnits <= 0) {
    return 0;
  }
  return Math.max(0, Math.min(1, goodUnits / totalUnits));
}

export function calculateOee(availability: number, performance: number, quality: number) {
  return Math.max(0, Math.min(1, availability * performance * quality));
}

function toMinutes(durationMs: number) {
  return durationMs / 60000;
}

export function getDowntimeMinutes(events: DowntimeEvent[]) {
  return events.reduce((sum, event) => sum + toMinutes(new Date(event.end).getTime() - new Date(event.start).getTime()), 0);
}

export function getAverageCycleTime(records: ProductionRecord[]) {
  if (records.length === 0) {
    return 0;
  }
  const totalTime = records.reduce((sum, record) => sum + record.cycleTimeSeconds, 0);
  return totalTime / records.length;
}

export function getTotalUnits(records: ProductionRecord[]) {
  return records.reduce((sum, record) => sum + record.unitsProduced, 0);
}

export function getTotalDefective(records: ProductionRecord[]) {
  return records.reduce((sum, record) => sum + record.defectiveUnits, 0);
}

export interface OeeSummary {
  availability: number;
  performance: number;
  quality: number;
  oee: number;
  downtimeMinutes: number;
  unitsProduced: number;
  defectiveUnits: number;
}

export interface MachineSummary {
  machine: Machine;
  summary: OeeSummary;
}

export interface FactoryOverview {
  overall: OeeSummary;
  trend: Array<{ label: string; value: number }>;
  throughputByLine: Array<{ line: string; units: number }>;
  downtimePareto: Array<{ reason: string; minutes: number }>;
}

export function summarizeByMachine(machines: Machine[], records: ProductionRecord[], events: DowntimeEvent[]) {
  return machines.map((machine) => {
    const machineRecords = records.filter((record) => record.machineId === machine.id);
    const machineEvents = events.filter((event) => event.machineId === machine.id);
    const downtimeMinutes = getDowntimeMinutes(machineEvents);
    const averageCycleTime = getAverageCycleTime(machineRecords) || machine.idealCycleSeconds;
    const units = getTotalUnits(machineRecords);
    const defective = getTotalDefective(machineRecords);

    const availability = calculateAvailability(downtimeMinutes);
    const performance = calculatePerformance(machine.idealCycleSeconds, averageCycleTime);
    const quality = calculateQuality(units - defective, units);
    const oee = calculateOee(availability, performance, quality);

    return {
      machine,
      summary: {
        availability,
        performance,
        quality,
        oee,
        downtimeMinutes,
        unitsProduced: units,
        defectiveUnits: defective,
      },
    };
  });
}

export function summarizeByLine(records: ProductionRecord[]) {
  const map = new Map<string, number>();
  records.forEach((record) => {
    map.set(record.line, (map.get(record.line) ?? 0) + record.unitsProduced);
  });
  return Array.from(map, ([line, units]) => ({ line, units }));
}

export function summarizeDowntimeByReason(events: DowntimeEvent[]) {
  const map = new Map<string, number>();
  events.forEach((event) => {
    const minutes = toMinutes(new Date(event.end).getTime() - new Date(event.start).getTime());
    map.set(event.reason, (map.get(event.reason) ?? 0) + minutes);
  });
  return Array.from(map, ([reason, minutes]) => ({ reason, minutes })).sort((a, b) => b.minutes - a.minutes);
}

export function getFactoryOverview(machines: Machine[], records: ProductionRecord[], events: DowntimeEvent[]): FactoryOverview {
  const summaries = summarizeByMachine(machines, records, events);
  const activeSummaries = summaries.filter((item) => item.summary.unitsProduced > 0);
  const overall = activeSummaries.reduce<OeeSummary>(
    (acc, item) => ({
      availability: acc.availability + item.summary.availability,
      performance: acc.performance + item.summary.performance,
      quality: acc.quality + item.summary.quality,
      oee: acc.oee + item.summary.oee,
      downtimeMinutes: acc.downtimeMinutes + item.summary.downtimeMinutes,
      unitsProduced: acc.unitsProduced + item.summary.unitsProduced,
      defectiveUnits: acc.defectiveUnits + item.summary.defectiveUnits,
    }),
    { availability: 0, performance: 0, quality: 0, oee: 0, downtimeMinutes: 0, unitsProduced: 0, defectiveUnits: 0 },
  );

  const machineCount = activeSummaries.length || 1;
  const averageAvailability = overall.availability / machineCount;
  const averagePerformance = overall.performance / machineCount;
  const averageQuality = overall.quality / machineCount;
  const averageOee = calculateOee(averageAvailability, averagePerformance, averageQuality);

  const trend = machines.map((machine) => {
    const row = summaries.find((entry) => entry.machine.id === machine.id);
    return { label: machine.name, value: Math.round((row?.summary.oee ?? 0) * 100) };
  });

  return {
    overall: {
      availability: averageAvailability,
      performance: averagePerformance,
      quality: averageQuality,
      oee: averageOee,
      downtimeMinutes: overall.downtimeMinutes,
      unitsProduced: overall.unitsProduced,
      defectiveUnits: overall.defectiveUnits,
    },
    trend,
    throughputByLine: summarizeByLine(records),
    downtimePareto: summarizeDowntimeByReason(events),
  };
}
