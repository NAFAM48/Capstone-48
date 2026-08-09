import { NextResponse } from "next/server";

const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; password?: string };
    if (!body?.email || !body?.password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    if (!backendUrl) {
      return NextResponse.json({ error: "API is not configured." }, { status: 500 });
    }

    try {
      const response = await fetch(`${backendUrl}/auth/signup`, {
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
        return NextResponse.json({ message: "Account created successfully." });
      }

      return NextResponse.json(
        { error: result.error ?? result.message ?? "Failed to create account." },
        { status: response.status || 400 }
      );
    } catch {
      return NextResponse.json(
        { error: "Could not reach the server. Please try again later." },
        { status: 503 }
      );
    }
  } catch {
    return NextResponse.json({ error: "Unable to parse request body." }, { status: 400 });
  }
}
