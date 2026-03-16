import React from 'react';

type FallbackVariant = 'section' | 'reviews' | 'related-products' | 'cart-drawer' | 'inline';

interface DynamicLoadingFallbackProps {
  variant?: FallbackVariant;
  className?: string;
}

const Bone = ({ className = '' }: { className?: string }) => (
  <div className={`bg-gray-200 animate-pulse rounded ${className}`} />
);

const ReviewsSkeleton = () => (
  <div className="space-y-4 py-4 animate-pulse">
    <div className="flex items-center gap-3 mb-4">
      <Bone className="h-10 w-10 rounded-full" />
      <div className="space-y-2 flex-1">
        <Bone className="h-4 w-32" />
        <Bone className="h-3 w-20" />
      </div>
    </div>
    {[...Array(3)].map((_, i) => (
      <div key={i} className="space-y-2 border-b border-gray-100 pb-4">
        <div className="flex items-center gap-2">
          <Bone className="h-8 w-8 rounded-full" />
          <Bone className="h-3 w-24" />
          <Bone className="h-3 w-16" />
        </div>
        <Bone className="h-3 w-full" />
        <Bone className="h-3 w-3/4" />
      </div>
    ))}
  </div>
);

const RelatedProductsSkeleton = () => (
  <div className="space-y-5 animate-pulse">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="flex gap-4">
        <Bone className="w-20 h-20 rounded-2xl flex-shrink-0" />
        <div className="flex-1 space-y-2 py-1">
          <Bone className="h-3 w-3/4" />
          <Bone className="h-3 w-1/2" />
          <Bone className="h-3 w-1/4 mt-4" />
        </div>
      </div>
    ))}
  </div>
);

const CartDrawerSkeleton = () => (
  <div className="fixed inset-0 z-[999] bg-black/20 flex items-end sm:items-center justify-center">
    <div className="bg-white w-full sm:max-w-md sm:mx-4 sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col animate-pulse">
      <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
        <Bone className="h-5 w-5 rounded" />
        <Bone className="h-5 w-20" />
      </div>
      <div className="flex-1 p-4 space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Bone className="w-14 h-14 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Bone className="h-4 w-full" />
              <Bone className="h-4 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const InlineSkeleton = () => (
  <div className="flex items-center justify-center py-8">
    <div className="w-8 h-8 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
  </div>
);

const SectionFallback = () => (
  <div className="animate-pulse space-y-4 py-4">
    <Bone className="h-6 w-40" />
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg overflow-hidden border border-gray-100">
          <div className="aspect-square bg-gray-200" />
          <div className="p-3 space-y-2">
            <Bone className="h-4 w-full" />
            <Bone className="h-4 w-2/3" />
            <Bone className="h-5 w-16" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const DynamicLoadingFallback: React.FC<DynamicLoadingFallbackProps> = ({ variant = 'inline', className = '' }) => {
  const wrapperClass = className || '';

  const content = (() => {
    switch (variant) {
      case 'reviews': return <ReviewsSkeleton />;
      case 'related-products': return <RelatedProductsSkeleton />;
      case 'cart-drawer': return <CartDrawerSkeleton />;
      case 'section': return <SectionFallback />;
      case 'inline':
      default: return <InlineSkeleton />;
    }
  })();

  return wrapperClass ? <div className={wrapperClass}>{content}</div> : content;
};

export default DynamicLoadingFallback;
