import { applyEventShiftOverrides, applyShiftOverrides } from "@/lib/shift-overrides";

function resolveApiUrl(input: RequestInfo) {
  if (typeof input !== "string") {
    return input;
  }

  // Keep local API routes on the Next.js BFF server
  if (input.startsWith("/api/")) {
    return input;
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  if (!baseUrl) {
    return input;
  }

  if (input.startsWith("/") && !input.startsWith("//")) {
    return `${baseUrl}${input}`;
  }

  return input;
}

export async function apiFetch<T>(input: RequestInfo, init: RequestInit = {}) {
  if (typeof window === "undefined") {
    throw new Error("apiFetch may only be used in the browser.");
  }

  const token = window.localStorage.getItem("nafam_token");
  if (!token) {
    throw new Error("Missing auth token. Please sign in again.");
  }

  const headers = new Headers(init.headers ?? undefined);
  headers.set("Authorization", `Bearer ${token}`);

  if (init.method && init.method.toUpperCase() !== "GET" && init.method.toUpperCase() !== "HEAD") {
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
  }

  const url = resolveApiUrl(input);
  const response = await fetch(url, { ...init, headers, credentials: "same-origin" });
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.error ?? response.statusText);
  }

  if (
    response.ok &&
    payload &&
    typeof payload === "object" &&
    Array.isArray((payload as { machines?: unknown[] }).machines)
  ) {
    (payload as { machines: Array<{ id?: string | number; shift?: string }> }).machines = applyShiftOverrides(
      (payload as { machines: Array<{ id?: string | number; shift?: string }> }).machines
    );
  }

  if (
    response.ok &&
    payload &&
    typeof payload === "object" &&
    Array.isArray((payload as { events?: unknown[] }).events)
  ) {
    (payload as { events: Array<{ id?: string | number; shift?: string }> }).events = applyEventShiftOverrides(
      (payload as { events: Array<{ id?: string | number; shift?: string }> }).events
    );
  }

  return payload as T;
}
