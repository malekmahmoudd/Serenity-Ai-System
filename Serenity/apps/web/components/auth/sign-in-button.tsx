"use client";

import Link from "next/link";
import { buttonVariants } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { debugNav } from "@/lib/debug";

interface SignInButtonProps {
  className?: string;
}

export function SignInButton({ className }: SignInButtonProps) {
  return (
    <Link
      href="/login"
      className={cn(buttonVariants(), "relative z-[1]", className)}
      prefetch={true}
      onClick={() => debugNav("Sign In →", "/login")}
    >
      Sign In
    </Link>
  );
}