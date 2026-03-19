import type { Metadata } from 'next';
import { headers } from 'next/headers';
import './globals.css';
import { Providers } from '@/contexts/Providers';
import StorefrontHeader from '@/components/StorefrontHeader';
import StorefrontFooter from '@/components/StorefrontFooter';
import {
  getBootstrapData,
  getSecondaryData,
  resolveTenantId,
  resolveLogoUrl,
} from '@/lib/tenant-data';

export const metadata: Metadata = {
  title: 'Storefront',
  description: 'E-commerce Storefront powered by Next.js',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch tenant data for header/footer
  const headerList = await headers();
  const tenantId = resolveTenantId(headerList.get('x-tenant-id'));

  const [bootstrap, secondary] = await Promise.all([
    getBootstrapData(tenantId),
    getSecondaryData(tenantId),
  ]);

  const logo = resolveLogoUrl(secondary.logo);

  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&family=Montserrat:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased font-sans flex flex-col min-h-screen">
        <Providers>
          <StorefrontHeader
            logo={logo}
            websiteConfig={bootstrap.website_config}
            categories={secondary.categories}
            tenantId={tenantId}
          />
          <main className="flex-1">{children}</main>
          <StorefrontFooter
            logo={logo}
            websiteConfig={bootstrap.website_config}
            tenantId={tenantId}
          />
        </Providers>
      </body>
    </html>
  );
}
