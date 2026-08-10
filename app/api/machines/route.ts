import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getDowntimeEvents, getMachines, getProductionRecords } from "@/lib/demo-data";
import {
  type RawDowntimeEvent,
  type RawMachine,
  type RawReading,
  mapEvents,
  mapMachines,
  mapRecords,
} from "@/lib/backend";

const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

export async function GET(request: Request) {
  const user = requireAuth(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!backendUrl) {
    return NextResponse.json({
      user,
      machines: getMachines(),
      records: getProductionRecords(),
      events: getDowntimeEvents(),
    });
  }

  try {
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

    // Map backend machines/readings/events to the frontend data model,
    // reusing the same hygienic mappers as the OEE overview
    const machines = Array.isArray(rawMachines) && rawMachines.length > 0
      ? mapMachines(rawMachines as RawMachine[])
      : getMachines();

    const records = Array.isArray(rawReadings) && rawReadings.length > 0
      ? mapRecords(rawReadings as RawReading[])
      : getProductionRecords();

    const events = Array.isArray(rawEvents) && rawEvents.length > 0
      ? mapEvents(rawEvents as RawDowntimeEvent[])
      : getDowntimeEvents();

    return NextResponse.json({ user, machines, records, events });
  } catch (error) {
    console.error("Backend fetch failed, falling back to mock data:", error);
    return NextResponse.json({
      user,
      machines: getMachines(),
      records: getProductionRecords(),
      events: getDowntimeEvents(),
    });
  }
}

export async function POST(request: Request) {
  const user = requireAuth(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, line, shift, status } = body as { name?: string; line?: string; shift?: string; status?: string };

    if (!name || !line || !shift || !status) {
      return NextResponse.json({ error: "Missing machine fields." }, { status: 400 });
    }

    const newMachine = {
      id: `new-${Date.now()}`,
      name,
      line,
      shift,
      status,
      idealCycleSeconds: 20,
    };

    if (backendUrl) {
      try {
        const response = await fetch(`${backendUrl}/machines`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, stage: line, status: status.toUpperCase(), shift }),
        });
        const payload = await response.json().catch(() => null);
        if (response.ok) {
          return NextResponse.json(payload, { status: 201 });
        }
      } catch {
        // fall back to local mock response
      }
    }

    return NextResponse.json(newMachine, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }
}

