import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

type BackendAlert = {
  id?: string | number;
  machine?: { id?: string | number; name?: string | null; stage?: string | null };
  timestamp?: string;
  message?: string;
  severity?: string;
  resolved?: boolean;
};

export type FrontendAlert = {
  id: string;
  machineId: string;
  machineName: string;
  line: string;
  timestamp: string;
  message: string;
  severity: string;
  resolved: boolean;
};

function mapAlert(alert: BackendAlert): FrontendAlert {
  return {
    id: alert.id != null ? String(alert.id) : `A-${Date.now()}`,
    machineId: String(alert.machine?.id ?? "unknown"),
    machineName: alert.machine?.name ?? "Unknown machine",
    line: alert.machine?.stage ?? "Line 1",
    timestamp: alert.timestamp ? new Date(alert.timestamp).toISOString() : new Date().toISOString(),
    message: alert.message ?? "No message",
    severity: alert.severity ?? "LOW",
    resolved: Boolean(alert.resolved),
  };
}

export async function GET(request: Request) {
  const user = requireAuth(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!backendUrl) {
    return NextResponse.json({ alerts: [] });
  }

  try {
    const response = await fetch(`${backendUrl}/alerts`, { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Backend alerts fetch failed");
    }
    const rawAlerts = await response.json().catch(() => []);
    const alerts = Array.isArray(rawAlerts) ? rawAlerts.map((alert: BackendAlert) => mapAlert(alert)) : [];
    return NextResponse.json({ alerts });
  } catch (error) {
    console.error("Alerts fetch failed:", error);
    return NextResponse.json({ alerts: [] });
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
      message?: string;
      severity?: string;
      timestamp?: string;
      resolved?: boolean;
    };

    const machineId = Number(body.machineId ?? body.machine?.id);
    if (!Number.isInteger(machineId) || machineId <= 0) {
      return NextResponse.json({ error: "A valid machineId is required." }, { status: 400 });
    }
    if (!body.message?.trim()) {
      return NextResponse.json({ error: "Alert message is required." }, { status: 400 });
    }

    const payload = {
      machine: { id: machineId },
      timestamp: body.timestamp ? new Date(body.timestamp).toISOString() : new Date().toISOString(),
      message: body.message,
      severity: body.severity ?? "LOW",
      resolved: Boolean(body.resolved),
    };

    if (backendUrl) {
      try {
        const response = await fetch(`${backendUrl}/alerts`, {
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

    return NextResponse.json({ status: "accepted", alert: { ...payload, id: `new-${Date.now()}` } }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }
}
