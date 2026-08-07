import type { Role } from "@/lib/demo-data";

const users: Record<string, { password: string; role: Role }> = {
  "admin@nafam.com": { password: "demo", role: "Admin" },
  "manager@nafam.com": { password: "demo", role: "Plant Manager" },
  "viewer@nafam.com": { password: "demo", role: "Viewer" },
};

function base64Encode(value: string) {
  if (typeof Buffer !== "undefined" && typeof Buffer.from === "function") {
    return Buffer.from(value, "utf8").toString("base64");
  }
  if (typeof globalThis.btoa === "function") {
    return globalThis.btoa(value);
  }
  throw new Error("No base64 encoder available.");
}

function base64Decode(value: string) {
  if (typeof Buffer !== "undefined" && typeof Buffer.from === "function") {
    return Buffer.from(value, "base64").toString("utf8");
  }
  if (typeof globalThis.atob === "function") {
    return globalThis.atob(value);
  }
  throw new Error("No base64 decoder available.");
}

export function verifyLogin(email: string, password: string) {
  const normalized = email.trim().toLowerCase();
  const user = users[normalized];
  if (!user || password !== user.password) {
    return null;
  }
  return { email: normalized, role: user.role };
}

export function createSessionToken(role: Role) {
  return base64Encode(JSON.stringify({ role, issuedAt: Date.now() }));
}

export function parseSessionToken(token: string) {
  try {
    const payload = base64Decode(token);
    const parsed = JSON.parse(payload) as { role: Role; issuedAt: number };
    if (!parsed?.role) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function requireAuth(request: Request) {
  const header = request.headers.get("authorization") ?? "";
  const parts = header.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return null;
  }
  return parseSessionToken(parts[1]);
}
