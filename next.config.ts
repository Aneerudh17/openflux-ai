import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['cswsbvxwthvwktvnoouc.supabase.co']
  }
};

export default nextConfig;
