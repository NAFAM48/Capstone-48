import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

export async function PUT(request: Request) {
  const user = requireAuth(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (backendUrl) {
    try {
      const response = await fetch(`${backendUrl}/notifications/read-all`, { method: "PUT" });
      if (response.ok) {
        return NextResponse.json({ user, updated: true });
      }
    } catch {
      // fall back to local mock response
    }
  }

  return NextResponse.json({ user, updated: true });
}
