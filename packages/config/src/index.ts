/**
 * @repo/config
 *
 * Shared configuration utilities for the monorepo.
 * Both the Admin Dashboard and Storefront apps use these helpers
 * to resolve API URLs, handle cookie domains, and configure CORS.
 */

// ─── App URLs ────────────────────────────────────────────────────────

/**
 * Known application identifiers within the monorepo.
 */
export type AppName = 'admin' | 'storefront' | 'backend';

export interface AppConfig {
  /** Default development port */
  port: number;
  /** Subdomain prefix used in production (e.g. admin → admin.example.com) */
  subdomain: string;
}

/**
 * Default ports for each app during local development.
 */
export const APP_DEFAULTS: Record<AppName, AppConfig> = {
  admin: { port: 3000, subdomain: 'admin' },
  storefront: { port: 3001, subdomain: 'store' },
  backend: { port: 5001, subdomain: 'api' },
};

// ─── Shared Cookie Domain ────────────────────────────────────────────

/**
 * Derive the cookie domain from a hostname so that auth cookies are
 * shared across subdomains.
 *
 * For example:
 *   admin.myapp.com  → .myapp.com
 *   store.myapp.com  → .myapp.com
 *   localhost         → localhost (no dot prefix)
 *
 * @param hostname – current `window.location.hostname` or request host
 */
export function getSharedCookieDomain(hostname: string): string {
  // localhost – no cross-subdomain needed
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return hostname;
  }

  // IP address – return as-is
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(hostname)) {
    return hostname;
  }

  // Strip port if present
  const host = hostname.split(':')[0];

  const parts = host.split('.');
  // For subdomains like admin.example.com → .example.com
  // For bare domain like example.com → .example.com
  if (parts.length >= 2) {
    return '.' + parts.slice(-2).join('.');
  }

  return host;
}

// ─── CORS Origins ────────────────────────────────────────────────────

/**
 * Well-known domain patterns allowed by the backend CORS configuration.
 * These are kept in sync with the patterns in backend/src/index.ts.
 */
export const KNOWN_ORIGIN_PATTERNS: RegExp[] = [
  /^https?:\/\/([a-z0-9-]+\.)?systemnextit\.com$/i,
  /^https?:\/\/([a-z0-9-]+\.)?systemnextit\.website$/i,
  /^https?:\/\/([a-z0-9-]+\.)?cartnget\.shop$/i,
  /^https?:\/\/([a-z0-9-]+\.)?shopbdit\.com$/i,
  /^https?:\/\/([a-z0-9-]+\.)?allinbangla\.com$/i,
  /^https?:\/\/([a-z0-9-]+\.)?localhost(:\d+)?$/i,
];

/**
 * Check whether a given origin is allowed by the known patterns or a
 * list of extra allowed origins (from env ALLOWED_ORIGINS).
 */
export function isOriginAllowed(
  origin: string,
  extraOrigins: string[] = [],
): boolean {
  if (KNOWN_ORIGIN_PATTERNS.some((p) => p.test(origin))) return true;
  if (extraOrigins.includes(origin)) return true;
  // Support wildcard entries like https://*.myapp.com
  // Escape regex metacharacters before converting wildcard * to .*
  return extraOrigins.some((allowed) => {
    if (!allowed.includes('*')) return false;
    const escaped = allowed.replace(/[.+?^${}()|\\[\]]/g, '\\$&').replace(/\\\*/g, '.*');
    return new RegExp('^' + escaped + '$').test(origin);
  });
}

// ─── API URL Resolver ────────────────────────────────────────────────

/**
 * Build the backend API base URL from environment variables.
 * Works on both client (browser) and server (Node.js).
 */
export function getApiBaseUrl(): string {
  // Next.js / Vite public env
  if (typeof process !== 'undefined') {
    const envUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      process.env.VITE_API_BASE_URL ||
      '';
    if (envUrl) return envUrl;
  }

  // Fallback for local development
  return `http://localhost:${APP_DEFAULTS.backend.port}`;
}
