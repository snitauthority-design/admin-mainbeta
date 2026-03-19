import { headers } from 'next/headers';
import { getBootstrapData, resolveTenantId } from '@/lib/tenant-data';
import StaticPageClient from '@/components/StaticPageClient';
import { notFound } from 'next/navigation';

export const revalidate = 60;

const VALID_SLUGS = [
  'about', 'about-us',
  'privacy', 'privacy-policy',
  'terms', 'termsnconditions', 'terms-and-conditions',
  'return', 'returnpolicy', 'return-policy', 'refund',
  'contact',
];

interface StaticPageProps {
  params: Promise<{ slug: string }>;
}

export default async function StaticPage({ params }: StaticPageProps) {
  const { slug } = await params;

  if (!VALID_SLUGS.includes(slug)) {
    notFound();
  }

  const headersList = await headers();
  const tenantId = resolveTenantId(headersList.get('x-tenant-id'));
  const bootstrap = await getBootstrapData(tenantId);
  const websiteConfig = bootstrap?.website_config || {};

  return <StaticPageClient slug={slug} websiteConfig={websiteConfig} />;
}
