"use client";

/**
 * Root error boundary -- catches render crashes ANYWHERE the therapy/new
 * boundary doesn't reach: layout.tsx, the header, providers, any other route.
 *
 * Next.js requires this file to render its own <html>/<body>, because if the
 * root layout itself is what crashed, there is no longer a layout to nest
 * inside. That's why this duplicates a little markup rather than reusing
 * components from elsewhere in the app -- those components may be part of
 * what just broke.
 */

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[global] render error:", error);
  }, [error]);

  return (
    <html>
      <body style={{ margin: 0, background: "#0b1120", color: "#e2e8f0" }}>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <div style={{ maxWidth: 420, textAlign: "center" }}>
            <h2 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: 12 }}>
              Something went wrong
            </h2>
            <p
              style={{
                fontSize: "0.875rem",
                color: "#94a3b8",
                lineHeight: 1.6,
                marginBottom: 24,
              }}
            >
              Please try again. If you need to talk to someone right now:
              ambulance <strong style={{ color: "#e2e8f0" }}>123</strong>{" "}
              &middot; mental health support{" "}
              <strong style={{ color: "#e2e8f0" }}>16328</strong>
            </p>
            <button
              onClick={reset}
              style={{
                background: "#10b981",
                color: "#04111f",
                fontWeight: 600,
                fontSize: "0.875rem",
                padding: "10px 20px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
              }}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
