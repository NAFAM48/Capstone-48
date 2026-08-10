const MACHINE_KEY = "nafam_shift_overrides";
const EVENT_KEY = "nafam_shift_overrides_events";

function readMap(key: string): Record<string, string> {
  if (typeof window === "undefined") {
    return {};
  }
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

function writeMap(key: string, map: Record<string, string>): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(key, JSON.stringify(map));
}

export function getShiftOverrides(): Record<string, string> {
  return readMap(MACHINE_KEY);
}

export function setShiftOverride(machineId: string | number, shift: string): void {
  const map = readMap(MACHINE_KEY);
  map[String(machineId)] = shift;
  writeMap(MACHINE_KEY, map);
}

export function getEventShiftOverrides(): Record<string, string> {
  return readMap(EVENT_KEY);
}

export function setEventShiftOverride(eventId: string | number, shift: string): void {
  const map = readMap(EVENT_KEY);
  map[String(eventId)] = shift;
  writeMap(EVENT_KEY, map);
}

function eventIdKey(id: string | number | undefined): string | null {
  if (id === undefined || id === null || id === "") {
    return null;
  }
  const raw = String(id);
  return raw.startsWith("D-") ? raw.slice(2) : raw;
}

export function applyShiftOverrides<T extends { id?: string | number; shift?: string }>(items: T[]): T[] {
  const overrides = readMap(MACHINE_KEY);
  if (Object.keys(overrides).length === 0) {
    return items;
  }
  return items.map((item) =>
    item && item.id != null && overrides[String(item.id)] ? { ...item, shift: overrides[String(item.id)] } : item
  );
}

export function applyEventShiftOverrides<T extends { id?: string | number; shift?: string }>(items: T[]): T[] {
  const overrides = readMap(EVENT_KEY);
  if (Object.keys(overrides).length === 0) {
    return items;
  }
  return items.map((item) => {
    const key = eventIdKey(item?.id);
    return key && overrides[key] ? { ...item, shift: overrides[key] } : item;
  });
}
