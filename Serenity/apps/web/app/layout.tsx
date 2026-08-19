import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

import "@workspace/ui/globals.css";
import "./web-tailwind-sources.css";

import { cn } from "@workspace/ui/lib/utils";
import Header from "@/components/header";
import { Footer } from "@/components/footer";
import { ThemeShell, SessionShell } from "@/components/providers";

export const metadata: Metadata = {
  title: "SerenityX",
  description: "Your AI companion for emotional well-being.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased font-sans",
        GeistSans.variable,
        GeistMono.variable,
      )}
    >
      <body>
        <ThemeShell>
          <Header />
          <SessionShell>
            <main className="relative">{children}</main>
          </SessionShell>
          <Footer />
        </ThemeShell>
      </body>
    </html>
  );
}
