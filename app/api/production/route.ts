import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import type { ProductionRecord } from "@/lib/demo-data";

export async function POST(request: Request) {
  const user = requireAuth(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as Partial<ProductionRecord>;
    if (!body.machineId || !body.line || !body.shift || typeof body.unitsProduced !== "number" || typeof body.defectiveUnits !== "number" || typeof body.cycleTimeSeconds !== "number") {
      return NextResponse.json({ error: "Missing or invalid production payload." }, { status: 400 });
    }

    if (body.unitsProduced < 0 || body.defectiveUnits < 0 || body.defectiveUnits > body.unitsProduced || body.cycleTimeSeconds <= 0) {
      return NextResponse.json({ error: "Production values must be positive and defects cannot exceed units produced." }, { status: 400 });
    }

    return NextResponse.json({ status: "accepted", record: { ...body, timestamp: new Date().toISOString(), id: `new-${Date.now()}` } }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }
}
