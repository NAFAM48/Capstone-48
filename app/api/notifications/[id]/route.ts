import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { mapNotification, type BackendNotification } from "../_shared";

const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = requireAuth(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  if (backendUrl) {
    try {
      const response = await fetch(`${backendUrl}/notifications/${id}/read`, { method: "PUT" });
      if (response.status === 404) {
        return NextResponse.json({ user, error: "Notification not found." }, { status: 404 });
      }
      const data = await response.json().catch(() => null);
      if (response.ok && data && typeof data === "object") {
        return NextResponse.json({ user, notification: mapNotification(data as BackendNotification) });
      }
    } catch {
      // fall back to local mock response
    }
  }

  return NextResponse.json({ user, notification: { id, read: true } });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = requireAuth(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  if (backendUrl) {
    try {
      const response = await fetch(`${backendUrl}/notifications/${id}`, { method: "DELETE" });
      if (response.status === 404) {
        return NextResponse.json({ user, error: "Notification not found." }, { status: 404 });
      }
      if (response.ok) {
        return NextResponse.json({ user, id, deleted: true });
      }
    } catch {
      // fall back to local mock response
    }
  }

  return NextResponse.json({ user, id, deleted: true });
}
