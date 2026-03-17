import { ProductImageGallery } from "./ProductImageGallery";
import { ProductInfo } from "./ProductInfo";
import { MobileProductActions } from "./MobileProductActions";

interface ProductDetailsBannerProps {
  product: {
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    galleryImages?: string[];
    rating?: number;
    reviews?: number;
    category?: string;
    tags?: string[];
    sku?: string;
    variantGroups?: Array<{
      title: string;
      isMandatory?: boolean;
      options: Array<{ attribute: string; extraPrice: number; image?: string }>;
    }>;
  };
  currency: string;
  quantity: number;
  onQuantityChange: (delta: number) => void;
  selectedVariants: Record<string, string>;
  onVariantSelect: (groupTitle: string, attribute: string) => void;
  discountPercent: number;
  discountAmount: number;
  onAddToCart?: () => void;
  onCheckout?: () => void;
  onBack?: () => void;
}

export const ProductDetailsBanner = ({
  product,
  currency,
  quantity,
  onQuantityChange,
  selectedVariants,
  onVariantSelect,
  discountPercent,
  discountAmount,
  onAddToCart,
  onCheckout,
  onBack,
}: ProductDetailsBannerProps) => {
  const allImages = [product.image, ...(product.galleryImages || [])].filter(Boolean);
  const discountLabel = discountPercent > 0 ? `-${discountPercent}% OFF` : undefined;

  return (
    <div className="box-border caret-transparent">
      <div className="box-border caret-transparent gap-x-[15px] grid grid-cols-[repeat(1,1fr)] gap-y-[15px] md:grid-cols-[repeat(2,1fr)]">
        <div className="box-border caret-transparent min-h-[auto] min-w-[auto]">
          <ProductImageGallery
            variant="single"
            mainImageSrc={product.image}
            mainImageAlt={product.name}
            discountLabel={discountLabel}
            iconSrc="https://c.animaapp.com/mmuqu4tvxu5PfK/assets/icon-12.svg"
            outerClassVariant="relative box-border caret-transparent flex justify-center border border-neutral-200 rounded-[15px] border-solid"
            innerContainerClass="static box-content caret-black h-auto min-h-0 min-w-0 w-auto md:relative md:aspect-auto md:box-border md:caret-transparent md:h-[330px] md:min-h-[auto] md:min-w-[auto] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-[500px] md:overflow-hidden md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]"
          />
          {allImages.length > 1 && (
            <ProductImageGallery
              variant="gallery"
              mainImageSrc=""
              mainImageAlt=""
              outerClassVariant="static box-content caret-black mt-0 md:relative md:aspect-auto md:box-border md:caret-transparent md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:overflow-hidden md:[mask-position:0%] md:bg-left-top md:mt-5 md:scroll-m-0 md:scroll-p-[auto]"
              innerContainerClass="box-content caret-black gap-x-[normal] block gap-y-[normal] md:aspect-auto md:box-border md:caret-transparent md:gap-x-2.5 md:flex md:overscroll-x-auto md:overscroll-y-auto md:gap-y-2.5 md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]"
              galleryImages={allImages.map((src, i) => ({ src, alt: `${product.name} ${i + 1}` }))}
            />
          )}
        </div>
        <ProductInfo
          product={product}
          currency={currency}
          quantity={quantity}
          onQuantityChange={onQuantityChange}
          selectedVariants={selectedVariants}
          onVariantSelect={onVariantSelect}
          discountAmount={discountAmount}
          onAddToCart={onAddToCart}
          onCheckout={onCheckout}
        />
      </div>
      <MobileProductActions onAddToCart={onAddToCart} onCheckout={onCheckout} onBack={onBack} />
      <div className="box-border caret-transparent"></div>
    </div>
  );
};
