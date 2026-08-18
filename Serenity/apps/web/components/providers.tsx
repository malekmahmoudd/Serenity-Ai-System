"use client";

import { ThemeProvider } from "next-themes";
import { SessionProvider } from "@/lib/contexts/session-context";

/** Wraps the app for `next-themes`. Keep session state *outside* this shell’s header/footer when possible — see layout. */
export function ThemeShell({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}

/** Auth/session context — wrap **main content only** so the header is not re-rendered on every user/loading change. */
export function SessionShell({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
