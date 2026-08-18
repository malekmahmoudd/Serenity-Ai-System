import { Geist, Geist_Mono } from "next/font/google"

import "@workspace/ui/globals.css";
import "./web-tailwind-sources.css";
import { cn } from "@workspace/ui/lib/utils";
import Header from "@/components/header";
import { Footer } from "@/components/footer";
import { ThemeShell, SessionShell } from "@/components/providers";

const geist = Geist({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", geist.variable)}
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
