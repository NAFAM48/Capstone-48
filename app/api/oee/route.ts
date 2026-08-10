import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getDowntimeEvents, getMachines, getProductionRecords } from "@/lib/demo-data";
import { getFactoryOverview } from "@/lib/oee";
import { calculateOeeFromBackend, fetchBackendOverviewData } from "@/lib/backend";

function buildLocalOverview() {
  return getFactoryOverview(getMachines(), getProductionRecords(), getDowntimeEvents());
}

export async function GET(request: Request) {
  const user = requireAuth(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await fetchBackendOverviewData();
    return NextResponse.json({ user, overview: getFactoryOverview(data.machines, data.records, data.events) });
  } catch (error) {
    console.error("Backend OEE fetch failed, falling back to mock data:", error);
    return NextResponse.json({ user, overview: buildLocalOverview() });
  }
}

export async function POST(request: Request) {
  const user = requireAuth(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await fetchBackendOverviewData();
    const result = await calculateOeeFromBackend(data);
    if (result) {
      return NextResponse.json({ user, overview: result.overview, source: result.source });
    }
    console.warn("Backend OEE calculation unavailable, falling back to local computation.");
    return NextResponse.json({
      user,
      overview: getFactoryOverview(data.machines, data.records, data.events),
      source: "local",
    });
  } catch (error) {
    console.error("Backend OEE calculation failed, falling back to mock data:", error);
    return NextResponse.json({ user, overview: buildLocalOverview(), source: "local" });
  }
}
