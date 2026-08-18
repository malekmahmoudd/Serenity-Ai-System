/**
 * Backend client.
 *
 * Every auth route in this app is now a thin proxy to the FastAPI service.
 * Accounts, password hashing and tokens all live there, next to the database
 * that holds the conversations -- so a conversation can actually belong to a
 * person.
 *
 * What this replaced: lib/auth/dev-store.ts, an in-memory Map holding
 * PLAINTEXT passwords that died on every Next.js restart.
 */

export const API_BASE =
  process.env.BACKEND_URL ??
  process.env.NEXT_PUBLIC_API_BASE ??
  "http://127.0.0.1:8000";

type BackendResult<T> = { ok: true; data: T } | { ok: false; status: number; message: string };

export async function backendFetch<T>(
  path: string,
  init: RequestInit = {}
): Promise<BackendResult<T>> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...(init.headers ?? {}) },
      cache: "no-store",
    });

    const text = await res.text();
    const body = text ? JSON.parse(text) : {};

    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        // FastAPI puts the human-readable message in `detail`.
        message: body.detail ?? body.message ?? "Something went wrong.",
      };
    }
    return { ok: true, data: body as T };
  } catch {
    // The backend being down should not look like a credentials problem.
    return {
      ok: false,
      status: 503,
      message: "Could not reach the server. Please try again in a moment.",
    };
  }
}
