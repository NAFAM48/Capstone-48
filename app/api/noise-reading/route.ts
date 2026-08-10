import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

type BackendNoiseReading = {
  id?: string | number;
  machine?: { id?: string | number; name?: string | null; stage?: string | null };
  timestamp?: string;
  noiseLevel?: number;
  isAnomaly?: boolean;
};

export type FrontendNoiseReading = {
  id: string;
  machineId: string;
  machineName: string;
  line: string;
  timestamp: string;
  noiseLevel: number;
  isAnomaly: boolean;
};

function mapNoiseReading(reading: BackendNoiseReading): FrontendNoiseReading {
  return {
    id: reading.id != null ? String(reading.id) : `N-${Date.now()}`,
    machineId: String(reading.machine?.id ?? "unknown"),
    machineName: reading.machine?.name ?? "Unknown machine",
    line: reading.machine?.stage ?? "Line 1",
    timestamp: reading.timestamp ? new Date(reading.timestamp).toISOString() : new Date().toISOString(),
    noiseLevel: typeof reading.noiseLevel === "number" ? reading.noiseLevel : 0,
    isAnomaly: Boolean(reading.isAnomaly),
  };
}

export async function GET(request: Request) {
  const user = requireAuth(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!backendUrl) {
    return NextResponse.json({ noiseReadings: [] });
  }

  try {
    const response = await fetch(`${backendUrl}/noise-reading`, { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Backend noise readings fetch failed");
    }
    const rawReadings = await response.json().catch(() => []);
    const noiseReadings = Array.isArray(rawReadings)
      ? rawReadings.map((reading: BackendNoiseReading) => mapNoiseReading(reading))
      : [];
    return NextResponse.json({ noiseReadings });
  } catch (error) {
    console.error("Noise readings fetch failed:", error);
    return NextResponse.json({ noiseReadings: [] });
  }
}

export async function POST(request: Request) {
  const user = requireAuth(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      machineId?: string | number;
      machine?: { id?: string | number };
      timestamp?: string;
      noiseLevel?: string | number;
      isAnomaly?: boolean;
    };

    const machineId = Number(body.machineId ?? body.machine?.id);
    if (!Number.isInteger(machineId) || machineId <= 0) {
      return NextResponse.json({ error: "A valid machineId is required." }, { status: 400 });
    }
    const noiseLevel = Number(body.noiseLevel);
    if (!Number.isFinite(noiseLevel) || noiseLevel < 0) {
      return NextResponse.json({ error: "noiseLevel must be a non-negative number." }, { status: 400 });
    }

    const payload = {
      machine: { id: machineId },
      timestamp: body.timestamp ? new Date(body.timestamp).toISOString() : new Date().toISOString(),
      noiseLevel,
      isAnomaly: Boolean(body.isAnomaly),
    };

    if (backendUrl) {
      try {
        const response = await fetch(`${backendUrl}/noise-reading`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await response.json().catch(() => null);
        if (response.ok) {
          return NextResponse.json(data, { status: 201 });
        }
      } catch {
        // fall back to local mock response
      }
    }

    return NextResponse.json(
      { status: "accepted", noiseReading: { ...payload, id: `new-${Date.now()}` } },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }
}
