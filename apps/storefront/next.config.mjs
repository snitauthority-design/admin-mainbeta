import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for Docker deployments
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
  // Trace from monorepo root so hoisted node_modules are included in standalone
  outputFileTracingRoot: path.join(__dirname, '../../'),
  typescript: {
    // Matches admin-next config; strict checking done via tsc in CI
    ignoreBuildErrors: true,
  },
  transpilePackages: ['@repo/shared-types', '@repo/config', 'admin-next'],
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  webpack: (config, { webpack }) => {
    // Resolve admin-next's @ alias so its internal imports work when transpiled
    const adminNextSrc = path.resolve(__dirname, '../../admin-next/src');
    config.resolve.alias['@admin'] = adminNextSrc;

    // Replace Vite's import.meta.env used by admin-next modules (cdnConfig, imageUrlHelper)
    config.plugins.push(
      new webpack.DefinePlugin({
        'import.meta.env.VITE_API_BASE_URL': JSON.stringify(process.env.NEXT_PUBLIC_API_BASE_URL || ''),
        'import.meta.env.VITE_CDN_BASE_URL': JSON.stringify(process.env.NEXT_PUBLIC_CDN_BASE_URL || ''),
        'import.meta.env.VITE_CDN_ENABLED': JSON.stringify(process.env.NEXT_PUBLIC_CDN_ENABLED || ''),
        'import.meta.env.VITE_CDN_IMAGE_FIT': JSON.stringify(process.env.NEXT_PUBLIC_CDN_IMAGE_FIT || ''),
        'import.meta.env.VITE_CDN_IMAGE_FORMAT': JSON.stringify(process.env.NEXT_PUBLIC_CDN_IMAGE_FORMAT || ''),
        'import.meta.env.VITE_CDN_IMAGE_QUALITY': JSON.stringify(process.env.NEXT_PUBLIC_CDN_IMAGE_QUALITY || ''),
        'import.meta.env.VITE_CDN_IMAGE_TRANSFORM': JSON.stringify(process.env.NEXT_PUBLIC_CDN_IMAGE_TRANSFORM || ''),
        'import.meta.env.VITE_CDN_IMAGE_URL': JSON.stringify(process.env.NEXT_PUBLIC_CDN_IMAGE_URL || ''),
        'import.meta.env.VITE_CDN_PROVIDER': JSON.stringify(process.env.NEXT_PUBLIC_CDN_PROVIDER || ''),
        'import.meta.env.VITE_CDN_STATIC_URL': JSON.stringify(process.env.NEXT_PUBLIC_CDN_STATIC_URL || ''),
        'import.meta.env.VITE_CDN_CACHE_DEFAULT': JSON.stringify(process.env.NEXT_PUBLIC_CDN_CACHE_DEFAULT || ''),
        'import.meta.env.VITE_CDN_CACHE_IMAGES': JSON.stringify(process.env.NEXT_PUBLIC_CDN_CACHE_IMAGES || ''),
        'import.meta.env.VITE_CDN_CACHE_STATIC': JSON.stringify(process.env.NEXT_PUBLIC_CDN_CACHE_STATIC || ''),
        'import.meta.env.VITE_PRIMARY_DOMAIN': JSON.stringify(process.env.NEXT_PUBLIC_PRIMARY_DOMAIN || ''),
        'import.meta.env.MODE': JSON.stringify(process.env.NODE_ENV || 'development'),
        'import.meta.env.DEV': JSON.stringify(process.env.NODE_ENV !== 'production'),
        'import.meta.env.PROD': JSON.stringify(process.env.NODE_ENV === 'production'),
        'import.meta.env.SSR': JSON.stringify(false),
      })
    );

    return config;
  },

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
