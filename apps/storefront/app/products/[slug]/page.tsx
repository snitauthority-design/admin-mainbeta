import { headers } from 'next/headers';
import { getBootstrapData, resolveTenantId } from '@/lib/tenant-data';
import ProductDetailClient from '@/components/ProductDetailClient';
import { notFound } from 'next/navigation';

export const revalidate = 60;

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const headersList = await headers();
  const tenantId = resolveTenantId(headersList.get('x-tenant-id'));

  const bootstrap = await getBootstrapData(tenantId);
  const products = bootstrap?.products || [];
  const product = products.find(
    (p: any) => p.slug === slug || p._id === slug
  );

  if (!product) {
    notFound();
  }

  const websiteConfig = bootstrap?.website_config || {};

  return (
    <ProductDetailClient
      product={product}
      products={products}
      websiteConfig={websiteConfig}
      tenantId={tenantId}
    />
  );
}
