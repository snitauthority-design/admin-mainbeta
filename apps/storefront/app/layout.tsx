import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { Providers } from '@/contexts/Providers';
import { getBootstrapData, getSecondaryData, resolveTenantId, resolveLogoUrl } from '@/lib/tenant-data';
import StorefrontHeader from '@/components/StorefrontHeader';
import StorefrontFooter from '@/components/StorefrontFooter';
import './globals.css';

export const metadata: Metadata = {
  title: 'Store',
  description: 'Online Store',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const tenantId = resolveTenantId(headersList.get('x-tenant-id'));

  let storeName = 'Store';
  let headerData: {
    categories: any[];
    websiteConfig: any;
    logo: string | null;
    tenantId: string;
  } = { categories: [], websiteConfig: {}, logo: null, tenantId };

  try {
    const [bootstrap, secondary] = await Promise.all([
      getBootstrapData(tenantId),
      getSecondaryData(tenantId),
    ]);

    const websiteConfig = bootstrap?.website_config || {};
    const logo = resolveLogoUrl(secondary?.logo);
    storeName = websiteConfig.storeName || websiteConfig.websiteName || 'Store';

    headerData = {
      categories: secondary?.categories || [],
      websiteConfig,
      logo,
      tenantId,
    };
  } catch (err) {
    console.error('[layout] Failed to fetch tenant data:', err);
  }

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{storeName}</title>
      </head>
      <body className="min-h-screen flex flex-col bg-white text-gray-900">
        <Providers>
          <StorefrontHeader
            categories={headerData.categories}
            websiteConfig={headerData.websiteConfig}
            logo={headerData.logo}
          />
          <main className="flex-1">{children}</main>
          <StorefrontFooter
            websiteConfig={headerData.websiteConfig}
            logo={headerData.logo}
            tenantId={headerData.tenantId}
          />
        </Providers>
      </body>
    </html>
  );
}
