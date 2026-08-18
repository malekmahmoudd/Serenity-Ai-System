import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/server/backend";
import { logApiRequest } from "@/lib/server/api-request-log";

/**
 * Verifies the caller's token against the FastAPI service.
 *
 * The token is a signed JWT, so the backend checks the signature without a
 * database round trip. This route still asks the backend rather than decoding
 * locally, so the signing secret stays in exactly one place.
 */
export async function GET(request: Request) {
  logApiRequest("auth/me", request);

  const auth = request.headers.get("authorization");
  const token = auth?.startsWith("Bearer ") ? auth.slice(7).trim() : null;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const result = await backendFetch<{ id: string; email: string; name: string }>(
    "/auth/me",
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!result.ok) {
    return NextResponse.json(
      { message: result.message },
      { status: result.status }
    );
  }

  return NextResponse.json({ user: result.data });
}
