import { useState, useCallback } from "react";
import { ProductDetailsBanner } from "./ProductDetailsBanner";
import { ProductTabs } from "./ProductTabs";
import { RelatedProducts } from "./RelatedProducts";

export interface GadgetsProductDetailProps {
  product: {
    id: number;
    name: string;
    price: number;
    originalPrice?: number;
    discount?: string | number;
    rating?: number;
    reviews?: number;
    category?: string;
    image: string;
    galleryImages?: string[];
    description?: string;
    videoUrl?: string;
    tags?: string[];
    sku?: string;
    stock?: number;
    variantGroups?: Array<{
      title: string;
      isMandatory?: boolean;
      options: Array<{ attribute: string; extraPrice: number; image?: string }>;
    }>;
    details?: Array<{ type: string; description: string }>;
    shortDescription?: string;
  };
  relatedProducts?: Array<{
    id: number;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    rating?: number;
    slug?: string;
  }>;
  categories?: Array<{ name: string; slug?: string; image?: string; icon?: string }>;
  currency?: string;
  onAddToCart?: () => void;
  onCheckout?: () => void;
  onBack?: () => void;
  onProductClick?: (productId: number) => void;
  onCategoryClick?: (categorySlug: string) => void;
}

export const ProductDetails = ({
  product,
  relatedProducts = [],
  categories = [],
  currency = "৳",
  onAddToCart,
  onCheckout,
  onBack,
  onProductClick,
  onCategoryClick,
}: GadgetsProductDetailProps) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

  const handleQuantityChange = useCallback((delta: number) => {
    setQuantity(prev => Math.max(1, prev + delta));
  }, []);

  const handleVariantSelect = useCallback((groupTitle: string, attribute: string) => {
    setSelectedVariants(prev => ({ ...prev, [groupTitle]: attribute }));
  }, []);

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const discountAmount = product.originalPrice && product.originalPrice > product.price
    ? product.originalPrice - product.price
    : 0;

  return (
    <div className="box-border caret-transparent">
      <div className="box-border caret-transparent">
        <div className="box-border caret-transparent max-w-[1340px] w-[95%] mx-auto">
          <div className="box-border caret-transparent gap-x-0 grid grid-cols-[1fr] gap-y-0 pt-[9px] md:gap-x-[15px] md:grid-cols-[3fr_1fr] md:gap-y-[15px] md:pt-[25px]">
            <div className="box-border caret-transparent min-h-[auto] min-w-[auto]">
              <ProductDetailsBanner
                product={product}
                currency={currency}
                quantity={quantity}
                onQuantityChange={handleQuantityChange}
                selectedVariants={selectedVariants}
                onVariantSelect={handleVariantSelect}
                discountPercent={discountPercent}
                discountAmount={discountAmount}
                onAddToCart={onAddToCart}
                onCheckout={onCheckout}
                onBack={onBack}
              />
              <ProductTabs
                description={product.description}
                videoUrl={product.videoUrl}
                details={product.details}
              />
            </div>
            <RelatedProducts
              products={relatedProducts}
              categories={categories}
              currency={currency}
              onProductClick={onProductClick}
              onCategoryClick={onCategoryClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
