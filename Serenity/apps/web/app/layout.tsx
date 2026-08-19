import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "@workspace/ui/globals.css";
import "./web-tailwind-sources.css";

import { cn } from "@workspace/ui/lib/utils";
import Header from "@/components/header";
import { Footer } from "@/components/footer";
import { ThemeShell, SessionShell } from "@/components/providers";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

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
        fontSans.variable,
        fontMono.variable,
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
