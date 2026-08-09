export type MachineStatus = "Running" | "Idle" | "Down";
export type DowntimeReason = "Changeover" | "Breakdown" | "Maintenance" | "Quality";
export type Shift = "Day" | "Night";
export type Role = "Admin" | "Plant Manager" | "Viewer";

export interface Machine {
  id: string;
  name: string;
  line: string;
  shift: Shift;
  status: MachineStatus;
  idealCycleSeconds: number;
}

export interface ProductionRecord {
  id: string;
  machineId: string;
  line: string;
  shift: Shift;
  timestamp: string;
  unitsProduced: number;
  defectiveUnits: number;
  cycleTimeSeconds: number;
}

export interface DowntimeEvent {
  id: string;
  machineId: string;
  line: string;
  shift: Shift;
  start: string;
  end: string;
  reason: DowntimeReason;
}

export const machines: Machine[] = [
  { id: "M-01", name: "Assembly Press 1", line: "Line 1", shift: "Day", status: "Running", idealCycleSeconds: 20 },
  { id: "M-02", name: "Assembly Press 2", line: "Line 1", shift: "Day", status: "Running", idealCycleSeconds: 20 },
  { id: "M-03", name: "Injection Mold 1", line: "Line 2", shift: "Night", status: "Idle", idealCycleSeconds: 18 },
  { id: "M-04", name: "Injection Mold 2", line: "Line 2", shift: "Night", status: "Down", idealCycleSeconds: 18 },
  { id: "M-05", name: "Paint Line", line: "Line 3", shift: "Day", status: "Running", idealCycleSeconds: 22 },
  { id: "M-06", name: "Quality Scan", line: "Line 3", shift: "Day", status: "Running", idealCycleSeconds: 16 },
];

export const productionRecords: ProductionRecord[] = [
  { id: "P-101", machineId: "M-01", line: "Line 1", shift: "Day", timestamp: "2026-07-30T08:20:00Z", unitsProduced: 76, defectiveUnits: 2, cycleTimeSeconds: 20 },
  { id: "P-102", machineId: "M-02", line: "Line 1", shift: "Day", timestamp: "2026-07-30T09:05:00Z", unitsProduced: 80, defectiveUnits: 1, cycleTimeSeconds: 19 },
  { id: "P-103", machineId: "M-03", line: "Line 2", shift: "Night", timestamp: "2026-07-30T10:10:00Z", unitsProduced: 68, defectiveUnits: 3, cycleTimeSeconds: 19 },
  { id: "P-104", machineId: "M-04", line: "Line 2", shift: "Night", timestamp: "2026-07-30T11:15:00Z", unitsProduced: 0, defectiveUnits: 0, cycleTimeSeconds: 0 },
  { id: "P-105", machineId: "M-05", line: "Line 3", shift: "Day", timestamp: "2026-07-30T09:45:00Z", unitsProduced: 90, defectiveUnits: 4, cycleTimeSeconds: 22 },
  { id: "P-106", machineId: "M-06", line: "Line 3", shift: "Day", timestamp: "2026-07-30T12:00:00Z", unitsProduced: 88, defectiveUnits: 1, cycleTimeSeconds: 16 },
  { id: "P-107", machineId: "M-01", line: "Line 1", shift: "Day", timestamp: "2026-07-30T12:45:00Z", unitsProduced: 72, defectiveUnits: 2, cycleTimeSeconds: 21 },
  { id: "P-108", machineId: "M-02", line: "Line 1", shift: "Day", timestamp: "2026-07-30T13:30:00Z", unitsProduced: 79, defectiveUnits: 0, cycleTimeSeconds: 20 },
];

export const downtimeEvents: DowntimeEvent[] = [
  { id: "D-201", machineId: "M-03", line: "Line 2", shift: "Night", start: "2026-07-30T09:00:00Z", end: "2026-07-30T09:35:00Z", reason: "Changeover" },
  { id: "D-202", machineId: "M-04", line: "Line 2", shift: "Night", start: "2026-07-30T10:00:00Z", end: "2026-07-30T11:30:00Z", reason: "Breakdown" },
  { id: "D-203", machineId: "M-05", line: "Line 3", shift: "Day", start: "2026-07-30T11:10:00Z", end: "2026-07-30T11:35:00Z", reason: "Maintenance" },
  { id: "D-204", machineId: "M-06", line: "Line 3", shift: "Day", start: "2026-07-30T11:40:00Z", end: "2026-07-30T12:00:00Z", reason: "Quality" },
];

export const getMachines = () => machines;
export const getProductionRecords = () => productionRecords;
export const getDowntimeEvents = () => downtimeEvents;
export const getMachineById = (id: string) => machines.find((machine) => machine.id === id);
