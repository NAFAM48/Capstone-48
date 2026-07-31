import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({ status: "ok", name: "NAFAM OEE Control", message: "Health check passed" });
}
