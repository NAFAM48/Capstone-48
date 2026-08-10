import type { DowntimeEvent, DowntimeReason, Shift } from "@/lib/demo-data";

export interface BackendDowntimeEvent {
  id?: number;
  machine?: { id?: number; name?: string; stage?: string; status?: string };
  machineId?: string | number;
  line?: string;
  shift?: string;
  startTime?: string;
  endTime?: string;
  start?: string;
  end?: string;
  cause?: string;
  reason?: string;
}

export function mapBackendEvent(event: BackendDowntimeEvent, fallbackId?: string): DowntimeEvent {
  return {
    id: event.id !== undefined && event.id !== null ? String(event.id) : fallbackId ?? `D-${Date.now()}`,
    machineId: String(event.machine?.id ?? event.machineId ?? "unknown"),
    line: event.machine?.stage ?? event.line ?? "Line 1",
    shift: (event.shift ?? "Day") as Shift,
    start: event.startTime ?? event.start ?? new Date().toISOString(),
    end: event.endTime ?? event.end ?? new Date().toISOString(),
    reason: (event.cause ?? event.reason ?? "Breakdown") as DowntimeReason,
  };
}

export interface DowntimeEventPayload {
  machineId: number;
  start: string;
  end: string;
  cause: string;
  shift?: string;
}

export function toBackendEventPayload(payload: DowntimeEventPayload) {
  return {
    machineId: payload.machineId,
    startTime: new Date(payload.start).toISOString(),
    endTime: new Date(payload.end).toISOString(),
    cause: payload.cause,
    ...(payload.shift ? { shift: payload.shift } : {}),
  };
}
