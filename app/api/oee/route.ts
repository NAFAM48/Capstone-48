import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getDowntimeEvents, getMachines, getProductionRecords } from "@/lib/demo-data";
import { getFactoryOverview } from "@/lib/oee";

export function GET(request: Request) {
  const user = requireAuth(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const machines = getMachines();
  const records = getProductionRecords();
  const events = getDowntimeEvents();
  const overview = getFactoryOverview(machines, records, events);

  return NextResponse.json({ user, overview });
}
