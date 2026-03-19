import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import StaticPageClient from '@/components/StaticPageClient';
import { getBootstrapData, resolveTenantId } from '@/lib/tenant-data';

// All valid static page slugs (must match StaticPageContent's staticPageMap)
const VALID_SLUGS = new Set([
  'about',
  'about-us',
  'privacy',
  'privacy-policy',
  'terms',
  'termsnconditions',
  'terms-and-conditions',
  'returnpolicy',
  'return-policy',
  'refund',
  'refund-policy',
  'contact',
  'faq',
]);

interface Props {
  params: Promise<{ page: string }>;
}

export default async function StaticPage({ params }: Props) {
  const { page } = await params;

  if (!VALID_SLUGS.has(page)) {
    notFound();
  }

  const headerList = await headers();
  const tenantId = resolveTenantId(headerList.get('x-tenant-id'));
  const bootstrap = await getBootstrapData(tenantId);

  return <StaticPageClient websiteConfig={bootstrap.website_config} />;
}
