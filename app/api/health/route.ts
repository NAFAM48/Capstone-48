import { NextResponse } from "next/server";

const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
const backendRoot = backendUrl?.replace(/\/api$/, "");

export async function GET() {
  if (backendRoot) {
    try {
      const response = await fetch(`${backendRoot}/health`, { signal: AbortSignal.timeout(10000) });
      const data = await response.json().catch(() => null);
      if (response.ok && data?.status === "UP") {
        return NextResponse.json({
          status: "ok",
          name: "NAFAM OEE Control",
          message: "Health check passed",
          backend: data,
        });
      }
      return NextResponse.json({
        status: "degraded",
        name: "NAFAM OEE Control",
        message: `Backend responded with HTTP ${response.status}.`,
        backend: data,
      });
    } catch {
      return NextResponse.json({
        status: "unreachable",
        name: "NAFAM OEE Control",
        message: "Backend API is unreachable.",
      });
    }
  }
  return NextResponse.json({ status: "ok", name: "NAFAM OEE Control", message: "Health check passed" });
}
