import type { Role } from "@/lib/demo-data";

const users: Record<string, { password: string; role: Role }> = {
  "admin@nafam.com": { password: "demo", role: "Admin" },
  "manager@nafam.com": { password: "demo", role: "Plant Manager" },
  "viewer@nafam.com": { password: "demo", role: "Viewer" },
};

export function verifyLogin(email: string, password: string) {
  const normalized = email.trim().toLowerCase();
  const user = users[normalized];
  if (!user || password !== user.password) {
    return null;
  }
  return { email: normalized, role: user.role };
}

export function createSessionToken(role: Role) {
  return Buffer.from(JSON.stringify({ role, issuedAt: Date.now() })).toString("base64");
}

export function parseSessionToken(token: string) {
  try {
    const payload = Buffer.from(token, "base64").toString("utf8");
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
