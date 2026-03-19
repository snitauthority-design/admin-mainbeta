import { getApiBaseUrl } from '@repo/config';
import { notFound } from 'next/navigation';
import Image from 'next/image';

/**
 * Dynamic product detail page using ISR.
 *
 * Fetches products from the bootstrap endpoint (which actually contains products).
 * Unknown slugs are rendered on-demand and cached.
 * Pages revalidate every 60 seconds for fresh data.
 */

interface Params {
  slug: string;
}

async function getProducts(tenantId: string): Promise<any[]> {
  try {
    const apiUrl = getApiBaseUrl();
    const res = await fetch(
      `${apiUrl}/api/tenant-data/${tenantId}/bootstrap`,
      { next: { revalidate: 60 } },
    );
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data?.products ?? [];
  } catch {
    return [];
  }
}

async function getProduct(slug: string): Promise<any | null> {
  const tenantId = process.env.NEXT_PUBLIC_DEFAULT_TENANT_SLUG || 'demo';
  const products = await getProducts(tenantId);
  return products.find((p: any) => p.slug === slug) ?? null;
}

/** Maximum number of product pages to pre-render at build time via SSG. */
const MAX_PRERENDERED_PRODUCTS = 50;

export async function generateStaticParams(): Promise<Params[]> {
  try {
    const tenantId = process.env.NEXT_PUBLIC_DEFAULT_TENANT_SLUG || 'demo';
    const products = await getProducts(tenantId);
    return products.slice(0, MAX_PRERENDERED_PRODUCTS).map((p: any) => ({ slug: p.slug }));
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

  // Support both admin-next field names (title, image, galleryImages, salePrice)
  // and shared-types field names (name, images, price)
  const productName = product.title || product.name || 'Product';
  const productPrice = product.salePrice || product.price || 0;
  const originalPrice = product.price && product.salePrice && product.price > product.salePrice ? product.price : product.compareAtPrice;
  const productDescription = product.description?.replace?.(/<[^>]*>/g, '') || '';
  const productStock = product.stock ?? product.quantity ?? 0;

  // Image handling: support both schemas
  const primaryImage = product.galleryImages?.[0]
    || product.images?.find((img: any) => img.isPrimary)
    || product.images?.[0];
  const imageUrl = typeof primaryImage === 'string' ? primaryImage : primaryImage?.url;
  const imageAlt = typeof primaryImage === 'string' ? productName : (primaryImage?.alt || productName);

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <a href="/" className="hover:text-primary transition-colors">
            Home
          </a>
          <span>/</span>
          <a href="/all-products" className="hover:text-primary transition-colors">
            Products
          </a>
          <span>/</span>
          <span className="text-gray-900 font-medium">{productName}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={imageAlt}
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
              {productName}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-2xl font-bold text-primary">
                ৳{productPrice.toLocaleString()}
              </span>
              {originalPrice && originalPrice > productPrice && (
                <span className="text-lg text-gray-400 line-through">
                  ৳{originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {productDescription && (
              <p className="text-gray-600 leading-relaxed mb-6">
                {productDescription}
              </p>
            )}

            <div className="flex items-center gap-2 mb-6">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  productStock > 0
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {productStock > 0 ? `In Stock (${productStock})` : 'Out of Stock'}
              </span>
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Available Variants
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v: any) => (
                    <button
                      key={v.id || v._id || v.name}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:border-primary transition-colors"
                    >
                      {v.name} – ৳{(v.salePrice || v.price || 0).toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <button
                className="flex-1 px-8 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                disabled={productStock <= 0}
              >
                Add to Cart
              </button>
              <button
                className="px-8 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                disabled={productStock <= 0}
              >
                Buy Now
              </button>
            </div>

            {/* Product Details */}
            <div className="mt-8 border-t border-gray-200 pt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Details</h3>
              <dl className="space-y-3">
                {product.category && (
                  <div className="flex">
                    <dt className="text-sm font-medium text-gray-500 w-32">Category:</dt>
                    <dd className="text-sm text-gray-900">{product.category}</dd>
                  </div>
                )}
                {product.brand && (
                  <div className="flex">
                    <dt className="text-sm font-medium text-gray-500 w-32">Brand:</dt>
                    <dd className="text-sm text-gray-900">{product.brand}</dd>
                  </div>
                )}
                {product.sku && (
                  <div className="flex">
                    <dt className="text-sm font-medium text-gray-500 w-32">SKU:</dt>
                    <dd className="text-sm text-gray-900">{product.sku}</dd>
                  </div>
                )}
                <div className="flex">
                  <dt className="text-sm font-medium text-gray-500 w-32">Stock:</dt>
                  <dd className="text-sm text-gray-900">{productStock} units</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
