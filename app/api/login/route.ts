import { NextResponse } from "next/server";
import { verifyLogin, createSessionToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; password?: string };
    if (!body?.email || !body?.password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const user = verifyLogin(body.email, body.password);
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const token = createSessionToken(user.role);
    return NextResponse.json({ token, role: user.role, email: user.email });
  } catch {
    return NextResponse.json({ error: "Unable to parse request body." }, { status: 400 });
  }
}
