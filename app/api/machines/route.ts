import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getDowntimeEvents, getMachines, getProductionRecords } from "@/lib/demo-data";

export function GET(request: Request) {
  const user = requireAuth(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const machines = getMachines();
  const records = getProductionRecords();
  const events = getDowntimeEvents();

  return NextResponse.json({ user, machines, records, events });
}
