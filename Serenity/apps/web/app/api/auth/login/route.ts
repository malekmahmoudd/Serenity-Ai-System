import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/server/backend";
import { logApiRequest } from "@/lib/server/api-request-log";

/**
 * Proxies to the FastAPI service, which verifies the scrypt hash and returns a
 * signed JWT.
 *
 * The backend deliberately gives the same error for "no such account" and
 * "wrong password", so this endpoint cannot be used to discover which email
 * addresses have accounts.
 */
export async function POST(request: Request) {
  logApiRequest("auth/login", request);

  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required." },
        { status: 400 }
      );
    }

    const result = await backendFetch<{ token: string; user: unknown }>(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
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
      { message: "Login failed" },
      { status: 401 }
    );
  }
}
