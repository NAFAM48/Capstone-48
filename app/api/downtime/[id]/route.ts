import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import type { DowntimeEvent } from "@/lib/demo-data";
import { getDowntimeEvents } from "@/lib/demo-data";
import { mapBackendEvent, toBackendEventPayload, type BackendDowntimeEvent } from "../_shared";

const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

function findFallbackEvent(id: string) {
  const key = id.startsWith("D-") ? id : `D-${id}`;
  return getDowntimeEvents().find((event) => event.id === key || event.id === id);
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

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = requireAuth(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  if (backendUrl) {
    try {
      const response = await fetch(`${backendUrl}/downtime-events/${id}`, { cache: "no-store" });
      if (response.status === 404) {
        return NextResponse.json({ user, error: "Downtime event not found." }, { status: 404 });
      }
      if (!response.ok) {
        throw new Error("Backend downtime fetch failed");
      }
      const raw = await response.json().catch(() => null);
      if (raw && typeof raw === "object") {
        return NextResponse.json({ user, event: mapBackendEvent(raw as BackendDowntimeEvent) });
      }
    } catch (error) {
      console.error("Downtime event fetch failed:", error);
    }
  }

  const fallback = findFallbackEvent(id);
  if (!fallback) {
    return NextResponse.json({ user, error: "Downtime event not found." }, { status: 404 });
  }
  return NextResponse.json({ user, event: fallback });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = requireAuth(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  try {
    const body = (await request.json()) as Partial<DowntimeEvent>;
    if (!body.machineId || !body.reason || !body.start || !body.end) {
      return NextResponse.json({ error: "Missing or invalid downtime payload." }, { status: 400 });
    }

    const startTime = Date.parse(body.start);
    const endTime = Date.parse(body.end);
    if (Number.isNaN(startTime) || Number.isNaN(endTime) || startTime >= endTime) {
      return NextResponse.json(
        { error: "Downtime start and end timestamps must be valid and start before end." },
        { status: 400 }
      );
    }

    if (backendUrl) {
      try {
        const machineId = await resolveMachineId(body.machineId);
        if (machineId === null) {
          return NextResponse.json({ error: `Unknown machine "${body.machineId}".` }, { status: 400 });
        }

        const response = await fetch(`${backendUrl}/downtime-events/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            toBackendEventPayload({
              machineId,
              start: new Date(startTime).toISOString(),
              end: new Date(endTime).toISOString(),
              cause: body.reason,
              shift: body.shift,
            })
          ),
        });
        const payload = await response.json().catch(() => null);
        if (response.ok && payload && typeof payload === "object") {
          return NextResponse.json({ user, event: mapBackendEvent(payload as BackendDowntimeEvent) });
        }
        if (response.status === 404) {
          return NextResponse.json({ user, error: "Downtime event not found." }, { status: 404 });
        }
      } catch {
        // fall back to local mock response
      }
    }

    return NextResponse.json({ user, event: { ...body, id } as DowntimeEvent }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = requireAuth(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  if (backendUrl) {
    try {
      const response = await fetch(`${backendUrl}/downtime-events/${id}`, { method: "DELETE" });
      if (response.status === 404) {
        return NextResponse.json({ user, error: "Downtime event not found." }, { status: 404 });
      }
      if (response.ok) {
        return NextResponse.json({ user, id, deleted: true });
      }
    } catch {
      // fall back to local mock response
    }
  }

  return NextResponse.json({ user, id, deleted: true });
}
