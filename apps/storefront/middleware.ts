import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSharedCookieDomain } from '@repo/config';

/**
 * Storefront Middleware
 *
 * Resolves the current tenant from the subdomain so that pages
 * can load tenant-specific data without extra client-side logic.
 *
 * For example: store1.myapp.com → tenantId = 'store1'
 */

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const cookieDomain = getSharedCookieDomain(hostname);

  // Resolve tenant from subdomain
  const host = hostname.split(':')[0]; // Strip port
  const parts = host.split('.');
  let tenantSlug = process.env.NEXT_PUBLIC_DEFAULT_TENANT_SLUG || 'demo';

  // Extract tenant from subdomain:
  //   store1.myapp.com → store1 (parts.length > 2)
  //   store1.localhost  → store1 (parts.length === 2, last part is localhost)
  if (parts.length > 2) {
    tenantSlug = parts[0];
  } else if (parts.length === 2 && parts[1] === 'localhost') {
    tenantSlug = parts[0];
  }

  // Set headers for downstream usage
  const response = NextResponse.next();
  response.headers.set('x-tenant-id', tenantSlug);
  response.headers.set('x-cookie-domain', cookieDomain);

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
