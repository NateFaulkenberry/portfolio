import type { NextConfig } from "next";

/**
 * GitHub Pages serves project sites from a sub-path (https://user.github.io/repo/),
 * while user sites and custom domains are served from the root. The deploy workflow
 * passes the correct value via BASE_PATH (from actions/configure-pages); locally it
 * defaults to "" so the site runs at http://localhost:3000/.
 */
const basePath = (process.env.BASE_PATH ?? "").replace(/\/+$/, "");

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: {
    // The Next.js image optimizer needs a server; static exports serve files as-is.
    unoptimized: true,
  },
  env: {
    // Exposed so components can prefix raw asset URLs (next/image does not do this).
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_SITE_URL: process.env.SITE_URL ?? "",
  },
};

export default nextConfig;
