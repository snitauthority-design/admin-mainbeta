import type { NextConfig } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001";

const nextConfig: NextConfig = {
  devIndicators: false,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
