import { NextResponse } from "next/server";
import { logApiRequest } from "@/lib/server/api-request-log";

/**
 * Logout is client-side: the token is a stateless JWT, so there is nothing on
 * the server to destroy. The client discards it.
 *
 * A stolen token stays valid until it expires (SERENITY_JWT_TTL_HOURS, 7 days
 * by default). If you need immediate revocation later, add a denylist of jti
 * values checked at verify time.
 */
export async function POST(request: Request) {
  logApiRequest("auth/logout", request);
  return NextResponse.json({ ok: true });
}
