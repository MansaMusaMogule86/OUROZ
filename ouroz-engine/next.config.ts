import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Prevent Next.js from walking up to the parent OUROZ directory */
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
