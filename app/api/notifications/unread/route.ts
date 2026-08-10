import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { mapNotification, type BackendNotification } from "../_shared";

const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

export async function GET(request: Request) {
  const user = requireAuth(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!backendUrl) {
    return NextResponse.json({ user, notifications: [] });
  }

  try {
    const response = await fetch(`${backendUrl}/notifications/unread`, { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Backend unread notifications fetch failed");
    }
    const rawNotifications = await response.json().catch(() => []);
    const notifications = Array.isArray(rawNotifications)
      ? rawNotifications.map((notification: BackendNotification) => mapNotification(notification))
      : [];
    return NextResponse.json({ user, notifications });
  } catch (error) {
    console.error("Unread notifications fetch failed:", error);
    return NextResponse.json({ user, notifications: [] });
  }
}
