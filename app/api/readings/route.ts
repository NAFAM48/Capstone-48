import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

async function resolveMachineId(input: string | number | undefined): Promise<number | null> {
  const raw = Number(input);
  if (Number.isInteger(raw) && raw > 0) {
    return raw;
  }
  if (!input || !backendUrl) {
    return null;
  }
  try {
    const response = await fetch(`${backendUrl}/machines`);
    const rawMachines = await response.json().catch(() => []);
    const match = (Array.isArray(rawMachines) ? rawMachines : []).find(
      (m: { id?: string | number; name?: string | null }) => m.name === String(input)
    );
    return match && Number.isInteger(Number(match.id)) ? Number(match.id) : null;
  } catch {
    return null;
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
      outputCount?: string | number;
      temperature?: string | number | null;
      timestamp?: string;
    };

    const machineId = await resolveMachineId(body.machineId ?? body.machine?.id);
    const outputCount = Number(body.outputCount);
    const temperature =
      body.temperature === undefined || body.temperature === null || body.temperature === ""
        ? null
        : Number(body.temperature);

    if (machineId === null) {
      return NextResponse.json({ error: `Unknown machine "${body.machineId}".` }, { status: 400 });
    }
    if (!Number.isInteger(outputCount) || outputCount < 0) {
      return NextResponse.json({ error: "Output count must be a non-negative integer." }, { status: 400 });
    }
    if (temperature !== null && !Number.isFinite(temperature)) {
      return NextResponse.json({ error: "Temperature must be a valid number." }, { status: 400 });
    }

    const payload = {
      machineId,
      timestamp: body.timestamp ? new Date(body.timestamp).toISOString() : new Date().toISOString(),
      outputCount,
      temperature,
    };

    if (backendUrl) {
      try {
        const response = await fetch(`${backendUrl}/sensor-readings`, {
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
      { status: "accepted", reading: { ...payload, id: `new-${Date.now()}` } },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }
}
