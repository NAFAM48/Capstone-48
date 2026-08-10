import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import type { DowntimeEvent } from "@/lib/demo-data";
import { getDowntimeEvents } from "@/lib/demo-data";
import { toBackendEventPayload } from "./_shared";
import { mapEvents, type RawDowntimeEvent } from "@/lib/backend";

const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

export async function GET(request: Request) {
  const user = requireAuth(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!backendUrl) {
    return NextResponse.json({ user, events: getDowntimeEvents() });
  }

  try {
    const response = await fetch(`${backendUrl}/downtime-events`, { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Backend downtime fetch failed");
    }
    const rawEvents = await response.json().catch(() => []);
    const events = Array.isArray(rawEvents) ? mapEvents(rawEvents as RawDowntimeEvent[]) : getDowntimeEvents();
    return NextResponse.json({ user, events });
  } catch (error) {
    console.error("Downtime event fetch failed:", error);
    return NextResponse.json({ user, events: getDowntimeEvents() });
  }
}

export async function POST(request: Request) {
  const user = requireAuth(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as Partial<DowntimeEvent>;
    if (!body.machineId || !body.reason || !body.start || !body.end) {
      return NextResponse.json({ error: "Missing or invalid downtime payload." }, { status: 400 });
    }

    const startTime = Date.parse(body.start);
    const endTime = Date.parse(body.end);
    if (Number.isNaN(startTime) || Number.isNaN(endTime) || startTime >= endTime) {
      return NextResponse.json({ error: "Downtime start and end timestamps must be valid and start before end." }, { status: 400 });
    }

    if (backendUrl) {
      try {
        const machineId = await resolveMachineId(body.machineId);
        if (machineId === null) {
          return NextResponse.json({ error: `Unknown machine "${body.machineId}".` }, { status: 400 });
        }

        const response = await fetch(`${backendUrl}/downtime-events`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            toBackendEventPayload({
              machineId,
              start: new Date(startTime).toISOString(),
              end: new Date(endTime).toISOString(),
              cause: body.reason,
              shift: body.shift ?? "Day",
            })
          ),
        });
        const payload = await response.json().catch(() => null);
        if (response.ok) {
          return NextResponse.json(payload, { status: 201 });
        }
      } catch {
        // fall back to local mock response
      }
    }

    return NextResponse.json({ status: "accepted", event: { ...body, id: `new-${Date.now()}` } }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }
}

async function resolveMachineId(machineId: string): Promise<number | null> {
  const numeric = Number(machineId);
  if (Number.isInteger(numeric) && numeric > 0) {
    return numeric;
  }

  if (!backendUrl) {
    return null;
  }

  const response = await fetch(`${backendUrl}/machines`, { cache: "no-store" });
  if (!response.ok) {
    return null;
  }

  const machines = (await response.json().catch(() => [])) as Array<{ id: number; name?: string; stage?: string }>;
  const match = machines.find((machine) => String(machine.id) === machineId || machine.name === machineId);
  return match?.id ?? null;
}
