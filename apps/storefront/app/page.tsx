import type { Product } from '@repo/shared-types';
import { getApiBaseUrl } from '@repo/config';
import { ProductCard } from '@/components/ProductCard';

/**
 * Storefront Home Page
 *
 * Uses Incremental Static Regeneration (ISR) to fetch and cache
 * product data from the shared backend API.  The page is statically
 * generated at build time and revalidated every 60 seconds so that
 * new products appear without a full redeploy.
 */

async function getFeaturedProducts(tenantId: string): Promise<Product[]> {
  try {
    const apiUrl = getApiBaseUrl();
    const res = await fetch(
      `${apiUrl}/api/tenant-data/${tenantId}/secondary`,
      { next: { revalidate: 60 } }, // ISR: revalidate every 60 seconds
    );
    if (!res.ok) return [];
    const json = await res.json();
    return (json?.products ?? []).slice(0, 12);
  } catch {
    return [];
  }
}

export default async function HomePage() {
  // In production the tenant ID would come from subdomain resolution or env
  const tenantId = process.env.NEXT_PUBLIC_DEFAULT_TENANT_SLUG || 'demo';
  const products = await getFeaturedProducts(tenantId);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <section className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Welcome to Our Store
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            Discover amazing products at unbeatable prices. Fast delivery,
            secure checkout, and 24/7 customer support.
          </p>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          Featured Products
        </h2>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id || product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-500">
            <p className="text-lg">No products available yet.</p>
            <p className="text-sm mt-2">
              Products managed via the Admin Dashboard will appear here.
            </p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Storefront. Powered by the shared
            backend API.
          </p>
        </div>
      </footer>
    </main>
  );
}
