const isSessionDebug =
  typeof process !== "undefined" &&
  process.env.NEXT_PUBLIC_DEBUG_SESSION === "1";

const isNavDebug =
  typeof process !== "undefined" && process.env.NEXT_PUBLIC_DEBUG_NAV === "1";

/** Client-only: session / auth tracing (enable with NEXT_PUBLIC_DEBUG_SESSION=1) */
export function debugSession(...args: unknown[]) {
  if (isSessionDebug && typeof window !== "undefined") {
    console.info("[session]", ...args);
  }
}

/** Client-only: navigation clicks (enable with NEXT_PUBLIC_DEBUG_NAV=1) */
export function debugNav(...args: unknown[]) {
  if (isNavDebug && typeof window !== "undefined") {
    console.info("[nav]", ...args);
  }
}
