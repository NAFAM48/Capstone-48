import { NextResponse } from "next/server";
import { verifyLogin, createSessionToken } from "@/lib/auth";

const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

const ROLE_MAP: Record<string, string> = {
  OPERATOR: "Viewer",
  Admin: "Admin",
  "Plant Manager": "Plant Manager",
  Viewer: "Viewer",
};

function normalizeRole(role?: string) {
  return (ROLE_MAP[role ?? ""] ?? role ?? "Viewer") as "Admin" | "Plant Manager" | "Viewer";
}

function buildResponse(email: string, role: string) {
  const normalizedRole = normalizeRole(role);
  const token = createSessionToken(normalizedRole);
  return NextResponse.json({ token, role: normalizedRole, email });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; password?: string };
    if (!body?.email || !body?.password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    if (backendUrl) {
      try {
        const response = await fetch(`${backendUrl}/auth/signin`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: body.email, password: body.password }),
          cache: "no-store",
        });

        const contentType = response.headers.get("content-type") ?? "";
        const result = contentType.includes("application/json")
          ? await response.json().catch(() => ({}))
          : { error: await response.text().catch(() => "Request failed.") };

        if (response.ok) {
          return buildResponse(result.email ?? body.email, result.role ?? "Viewer");
        }

        return NextResponse.json(
          { error: result.error ?? result.message ?? "Invalid credentials." },
          { status: response.status === 401 ? 401 : response.status }
        );
      } catch {
        // Backend unreachable — fall through to local demo accounts.
      }
    }

    const user = verifyLogin(body.email, body.password);
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    return buildResponse(user.email, user.role);
  } catch {
    return NextResponse.json({ error: "Unable to parse request body." }, { status: 400 });
  }
}
