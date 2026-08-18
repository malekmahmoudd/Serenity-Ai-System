import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/server/backend";
import { logApiRequest } from "@/lib/server/api-request-log";

/**
 * Proxies to the FastAPI service, which hashes the password with scrypt and
 * stores the account alongside the conversations.
 *
 * Registration signs you straight in -- the backend returns a token.
 */
export async function POST(request: Request) {
  logApiRequest("auth/register", request);

  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    const result = await backendFetch<{ token: string; user: unknown }>(
      "/auth/register",
      {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      }
    );

    if (!result.ok) {
      return NextResponse.json(
        { message: result.message },
        { status: result.status }
      );
    }

    return NextResponse.json(result.data);
  } catch {
    return NextResponse.json(
      { message: "Registration failed" },
      { status: 400 }
    );
  }
}
