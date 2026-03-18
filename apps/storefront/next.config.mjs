/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for Docker deployments
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
  typescript: {
    // Matches admin-next config; strict checking done via tsc in CI
    ignoreBuildErrors: true,
  },
  transpilePackages: ['@repo/shared-types', '@repo/config'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.cloudflare.com' },
      { protocol: 'https', hostname: 'imagedelivery.net' },
      ...(process.env.NEXT_PUBLIC_PRIMARY_DOMAIN
        ? [{ protocol: 'https', hostname: `**.${process.env.NEXT_PUBLIC_PRIMARY_DOMAIN}` }]
        : []),
    ],
  },
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || '',
  },
};

export default nextConfig;
