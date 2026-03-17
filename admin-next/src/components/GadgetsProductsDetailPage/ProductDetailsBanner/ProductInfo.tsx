import { ProductVariants } from "./ProductVariants";
import { ProductQuantitySelector } from "./ProductQuantitySelector";
import { ProductMeta } from "./ProductMeta";

interface ProductInfoProps {
  product: {
    name: string;
    price: number;
    originalPrice?: number;
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
  discountAmount: number;
  onAddToCart?: () => void;
  onCheckout?: () => void;
}

export const ProductInfo = ({
  product,
  currency,
  quantity,
  onQuantityChange,
  selectedVariants,
  onVariantSelect,
  discountAmount,
  onAddToCart,
  onCheckout,
}: ProductInfoProps) => {
  const rating = product.rating || 0;
  const reviewCount = product.reviews || 0;
  const formattedPrice = `${currency} ${product.price.toLocaleString()}`;
  const formattedOriginal = product.originalPrice ? `${currency} ${product.originalPrice.toLocaleString()}` : '';
  const formattedDiscount = discountAmount > 0 ? `${currency} ${discountAmount.toLocaleString()} Off` : '';

  return (
    <div className="relative box-border caret-transparent min-h-[auto] min-w-[auto] w-full">
      <div className="bg-white box-border caret-transparent border border-neutral-200 p-2.5 rounded-[15px] border-solid md:bg-transparent md:p-0 md:rounded-none md:border-0 md:border-none md:border-black">
        <div className="box-border caret-transparent">
          <h2 className="text-zinc-800 text-base font-normal box-border caret-transparent flow-root leading-5 break-words text-ellipsis overflow-hidden md:text-[26px] md:font-bold md:block md:leading-[normal] md:text-clip md:break-normal md:overflow-visible">
            {product.name}
          </h2>
          <div className="items-center box-border caret-transparent gap-x-[5px] flex gap-y-[5px] py-[5px]">
            <div className="box-border caret-transparent min-h-[auto] min-w-[auto]">
              <div className="box-border caret-transparent">
                <div className="box-border caret-transparent gap-x-1 flex gap-y-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <img
                      key={star}
                      src={star <= rating
                        ? "https://c.animaapp.com/mmuqu4tvxu5PfK/assets/icon-13.svg"
                        : "https://c.animaapp.com/mmuqu4tvxu5PfK/assets/icon-13.svg"}
                      alt="Star"
                      className="box-border caret-transparent h-[9px] align-baseline w-[9px] md:h-4 md:w-4"
                      style={star > rating ? { opacity: 0.3 } : undefined}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="box-border caret-transparent min-h-[auto] min-w-[auto]">
              <span className="text-neutral-400/60 box-border caret-transparent">
                {" "}
                ({reviewCount} reviews){" "}
              </span>
            </div>
          </div>
          <div className="items-center box-border caret-transparent gap-x-[7px] flex gap-y-[7px]">
            <div className="box-border caret-transparent min-h-[auto] min-w-[auto]">
              <p className="text-lime-500 text-[46px] font-black box-border caret-transparent">
                {formattedPrice}
              </p>
            </div>
            {discountAmount > 0 && (
              <div className="box-border caret-transparent min-h-[auto] min-w-[auto] p-[5px]">
                <p className="text-amber-300 text-xs font-medium box-border caret-transparent">
                  {" "}
                  {formattedDiscount}{" "}
                </p>
                <p className="text-neutral-400/60 text-2xl font-bold box-border caret-transparent">
                  <del className="box-border caret-transparent line-through">
                    {formattedOriginal}
                  </del>
                </p>
              </div>
            )}
          </div>
          {product.variantGroups && product.variantGroups.length > 0 && (
            <ProductVariants
              variantGroups={product.variantGroups}
              selectedVariants={selectedVariants}
              onVariantSelect={onVariantSelect}
            />
          )}
          <div className="box-border caret-transparent hidden">
            <div className="box-border caret-transparent">!</div>
            <span className="box-border caret-transparent">
              Select Colour of this product.
            </span>
          </div>
          <ProductQuantitySelector
            quantity={quantity}
            onQuantityChange={onQuantityChange}
            onAddToCart={onAddToCart}
            onCheckout={onCheckout}
          />
          <ProductMeta
            category={product.category}
            tags={product.tags}
            sku={product.sku}
          />
        </div>
      </div>
    </div>
  );
};
