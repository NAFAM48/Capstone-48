import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import type { DowntimeEvent } from "@/lib/demo-data";

export async function POST(request: Request) {
  const user = requireAuth(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as Partial<DowntimeEvent>;
    if (!body.machineId || !body.line || !body.shift || !body.reason || !body.start || !body.end) {
      return NextResponse.json({ error: "Missing or invalid downtime payload." }, { status: 400 });
    }

    const startTime = Date.parse(body.start);
    const endTime = Date.parse(body.end);
    if (Number.isNaN(startTime) || Number.isNaN(endTime) || startTime >= endTime) {
      return NextResponse.json({ error: "Downtime start and end timestamps must be valid and start before end." }, { status: 400 });
    }

    return NextResponse.json({ status: "accepted", event: { ...body, id: `new-${Date.now()}` } }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }
}
