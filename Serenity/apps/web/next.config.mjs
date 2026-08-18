import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Monorepo root (Serenity/Serenity) — avoids Turbopack picking the wrong folder when multiple lockfiles exist (e.g. D:\\Serenity vs D:\\Serenity\\Serenity). */
const turbopackRoot = path.join(__dirname, "../..");

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  experimental: {
    // Fewer lucide modules per compile — stops Turbopack from re-traversing the giant icon barrel on every pass
    optimizePackageImports: ["lucide-react"],
  },
  turbopack: {
    root: turbopackRoot,
  },
};

export default nextConfig;
