import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { mapNotification, type BackendNotification } from "./_shared";

const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

export async function GET(request: Request) {
  const user = requireAuth(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!backendUrl) {
    return NextResponse.json({ user, notifications: [] });
  }

  try {
    const response = await fetch(`${backendUrl}/notifications`, { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Backend notifications fetch failed");
    }
    const rawNotifications = await response.json().catch(() => []);
    const notifications = Array.isArray(rawNotifications)
      ? rawNotifications.map((notification: BackendNotification) => mapNotification(notification))
      : [];
    return NextResponse.json({ user, notifications });
  } catch (error) {
    console.error("Notifications fetch failed:", error);
    return NextResponse.json({ user, notifications: [] });
  }
}

export async function POST(request: Request) {
  const user = requireAuth(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      machineId?: string | number | null;
      title?: string;
      message?: string;
      type?: string;
      severity?: string;
    };

    if (!body.title?.trim() && !body.message?.trim()) {
      return NextResponse.json({ error: "Notification title or message is required." }, { status: 400 });
    }

    const machineId = body.machineId === undefined || body.machineId === null || body.machineId === ""
      ? undefined
      : Number(body.machineId);

    const payload: Record<string, string | number> = {
      title: body.title?.trim() || body.message?.trim() || "Notification",
      message: body.message?.trim() ?? "",
      type: body.type ?? "INFO",
      severity: body.severity ?? "LOW",
    };
    if (machineId !== undefined && Number.isFinite(machineId)) {
      payload.machineId = machineId;
    }

    if (backendUrl) {
      try {
        const response = await fetch(`${backendUrl}/notifications`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await response.json().catch(() => null);
        if (response.ok && data && typeof data === "object") {
          return NextResponse.json(mapNotification(data as BackendNotification), { status: 201 });
        }
      } catch {
        // fall back to local mock response
      }
    }

    return NextResponse.json(
      {
        id: `new-${Date.now()}`,
        machineId: machineId !== undefined ? String(machineId) : "all",
        machineName: "Factory",
        title: payload.title,
        message: payload.message,
        type: payload.type,
        severity: payload.severity,
        read: false,
        createdAt: new Date().toISOString(),
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }
}
