import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

/**
 * Best-effort cascade: the backend rejects machine deletion while child
 * records (downtime events, production records) still reference it, so we
 * delete those first. Sensor readings have no DELETE endpoint in the backend
 * API, so machines with telemetry may still be undeletable — that case is
 * surfaced as a clear error to the caller.
 */
async function deleteChildRecords(machineId: number) {
  const resources = ["downtime-events", "production-records"] as const;
  for (const resource of resources) {
    try {
      const response = await fetch(`${backendUrl}/${resource}`, { cache: "no-store" });
      if (!response.ok) {
        continue;
      }
      const items = (await response.json().catch(() => [])) as Array<{
        id?: string | number;
        machineId?: string | number;
      }>;
      for (const item of items) {
        if (Number(item.machineId) !== machineId) {
          continue;
        }
        await fetch(`${backendUrl}/${resource}/${item.id}`, { method: "DELETE" }).catch(() => null);
      }
    } catch {
      // ignore per-resource cleanup errors; the machine DELETE decides the outcome
    }
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = requireAuth(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  if (!backendUrl) {
    return NextResponse.json({ user, id, deleted: true });
  }

  const machineId = Number(id);
  if (!Number.isInteger(machineId) || machineId <= 0) {
    return NextResponse.json({ user, error: "Invalid machine id." }, { status: 400 });
  }

  await deleteChildRecords(machineId);

  try {
    const response = await fetch(`${backendUrl}/machines/${machineId}`, { method: "DELETE" });
    if (response.status === 404) {
      return NextResponse.json({ user, error: "Machine not found." }, { status: 404 });
    }
    if (response.ok) {
      return NextResponse.json({ user, id, deleted: true });
    }

    const message = await response.text().catch(() => "");
    if (response.status === 500) {
      return NextResponse.json(
        {
          user,
          error:
            "Machine could not be deleted because it still has sensor readings (telemetry) attached, and the backend does not expose an endpoint to remove them. Delete the machine's sensor readings in the backend first.",
        },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { user, error: message || `Backend refused to delete machine (${response.status}).` },
      { status: response.status }
    );
  } catch {
    return NextResponse.json({ user, error: "Unable to reach backend." }, { status: 502 });
  }
}
