import type { Product } from '@repo/shared-types';
import { getApiBaseUrl } from '@repo/config';
import { notFound } from 'next/navigation';
import Image from 'next/image';

/**
 * Dynamic product detail page using ISR.
 *
 * `generateStaticParams` pre-renders known products at build time.
 * Unknown slugs are rendered on-demand and cached (fallback: 'blocking').
 * Pages revalidate every 60 seconds for fresh data.
 */

interface Params {
  slug: string;
}

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const apiUrl = getApiBaseUrl();
    const tenantId = process.env.NEXT_PUBLIC_DEFAULT_TENANT_SLUG || 'demo';
    const res = await fetch(
      `${apiUrl}/api/tenant-data/${tenantId}/secondary`,
      { next: { revalidate: 60 } },
    );
    if (!res.ok) return null;
    const json = await res.json();
    const products: Product[] = json?.products ?? [];
    return products.find((p) => p.slug === slug) ?? null;
  } catch {
    return null;
  }
}

export async function generateStaticParams(): Promise<Params[]> {
  try {
    const apiUrl = getApiBaseUrl();
    const tenantId = process.env.NEXT_PUBLIC_DEFAULT_TENANT_SLUG || 'demo';
    const res = await fetch(
      `${apiUrl}/api/tenant-data/${tenantId}/secondary`,
    );
    if (!res.ok) return [];
    const json = await res.json();
    const products: Product[] = json?.products ?? [];
    return products.slice(0, 50).map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const primaryImage = product.images?.find((img) => img.isPrimary) ?? product.images?.[0];

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
            {primaryImage?.url ? (
              <Image
                src={primaryImage.url}
                alt={primaryImage.alt || product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No image available
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-2xl font-bold text-primary">
                ৳{product.price.toLocaleString()}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-lg text-gray-400 line-through">
                  ৳{product.compareAtPrice.toLocaleString()}
                </span>
              )}
            </div>

            {product.description && (
              <p className="text-gray-600 leading-relaxed mb-6">
                {product.description}
              </p>
            )}

            <div className="flex items-center gap-2 mb-6">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  product.stock > 0
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
              </span>
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Available Variants
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:border-primary transition-colors"
                    >
                      {v.name} – ৳{v.price.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              className="w-full sm:w-auto px-8 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
              disabled={product.stock <= 0}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
