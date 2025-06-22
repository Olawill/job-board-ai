import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    dynamicIO: true,
  },
  // transpilePackages: ['next-mdx-remote']
};

export default nextConfig;
