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

  const response = await fetch(input, { ...init, headers, credentials: "same-origin" });
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.error ?? response.statusText);
  }

  return payload as T;
}
