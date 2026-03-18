/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
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
