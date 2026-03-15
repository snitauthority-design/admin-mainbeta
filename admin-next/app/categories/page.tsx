'use client';

/**
 * Categories Page
 * Route: /categories
 * 
 * Daraz-style category browser with left sidebar categories
 * and right panel showing subcategories for the selected category.
 * Opened from mobile bottom navigation menu button.
 */
import { Suspense, useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../providers';
import { ArrowLeft, Search, Grid, ChevronRight } from 'lucide-react';
import { normalizeImageUrl } from '@/utils/imageUrlHelper';
import dynamic from 'next/dynamic';

const MobileBottomNav = dynamic(
  () => import('@/components/store/MobileBottomNav').then(m => ({ default: m.MobileBottomNav })),
  { ssr: false }
);

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function CategoriesPage() {
  const router = useRouter();
  const app = useApp();

  const activeCategories = useMemo(() => {
    return (app.categories || [])
      .filter(c => !c.status || c.status === 'Active')
      .sort((a, b) => (a.serial ?? Infinity) - (b.serial ?? Infinity));
  }, [app.categories]);

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  // Select first category by default once loaded
  const effectiveCategoryId = selectedCategoryId || (activeCategories.length > 0 ? activeCategories[0].id : null);

  const selectedCategory = useMemo(() => {
    return activeCategories.find(c => c.id === effectiveCategoryId) || null;
  }, [activeCategories, effectiveCategoryId]);

  const subcategoriesForSelected = useMemo(() => {
    if (!effectiveCategoryId) return [];
    return (app.subCategories || [])
      .filter(sc => sc.categoryId === effectiveCategoryId && (!sc.status || sc.status === 'Active'))
      .sort((a, b) => (a.serial ?? Infinity) - (b.serial ?? Infinity));
  }, [app.subCategories, effectiveCategoryId]);

  const handleCategorySelect = useCallback((categoryId: string) => {
    setSelectedCategoryId(categoryId);
  }, []);

  const handleSubcategoryClick = useCallback((subcategoryName: string) => {
    const slug = slugify(subcategoryName);
    router.push(`/all-products?category=${slug}`);
  }, [router]);

  const handleCategoryClick = useCallback((categoryName: string) => {
    const slug = slugify(categoryName);
    router.push(`/all-products?category=${slug}`);
  }, [router]);

  const themeColor = app.websiteConfig?.themeColor || '#F97316';

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft size={22} className="text-gray-700 dark:text-gray-200" />
        </button>
        <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex-1">
          Categories
        </h1>
        <button
          onClick={() => router.push('/all-products')}
          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Search products"
        >
          <Search size={22} className="text-gray-700 dark:text-gray-200" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden pb-20">
        {/* Left Sidebar - Categories List */}
        <div className="w-[100px] sm:w-[120px] flex-shrink-0 overflow-y-auto bg-gray-50 dark:bg-gray-800/50 border-r border-gray-200 dark:border-gray-700">
          {activeCategories.map((category) => {
            const isSelected = category.id === effectiveCategoryId;
            return (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className={`w-full flex flex-col items-center gap-1.5 px-2 py-3 text-center transition-all relative ${
                  isSelected
                    ? 'bg-white dark:bg-gray-900'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'
                }`}
              >
                {/* Active indicator bar */}
                {isSelected && (
                  <div
                    className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r"
                    style={{ backgroundColor: themeColor }}
                  />
                )}

                {/* Category icon/image */}
                <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden bg-gray-100 dark:bg-gray-700">
                  {category.image ? (
                    <img
                      src={normalizeImageUrl(category.image)}
                      alt={category.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : category.icon ? (
                    <img
                      src={normalizeImageUrl(category.icon)}
                      alt={category.name}
                      className="w-6 h-6 object-contain"
                      loading="lazy"
                    />
                  ) : (
                    <Grid size={18} className="text-gray-400" />
                  )}
                </div>

                {/* Category name */}
                <span
                  className={`text-[11px] leading-tight line-clamp-2 ${
                    isSelected
                      ? 'font-semibold'
                      : 'font-medium text-gray-600 dark:text-gray-400'
                  }`}
                  style={isSelected ? { color: themeColor } : undefined}
                >
                  {category.name}
                </span>
              </button>
            );
          })}

          {activeCategories.length === 0 && (
            <div className="p-4 text-center text-sm text-gray-400">
              No categories
            </div>
          )}
        </div>

        {/* Right Panel - Subcategories Grid */}
        <div className="flex-1 overflow-y-auto p-3">
          {selectedCategory && (
            <>
              {/* Category header with View All */}
              <button
                onClick={() => handleCategoryClick(selectedCategory.slug || selectedCategory.name)}
                className="flex items-center justify-between w-full mb-3 px-1"
              >
                <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                  {selectedCategory.name}
                </h2>
                <span className="text-xs flex items-center gap-0.5" style={{ color: themeColor }}>
                  View All <ChevronRight size={14} />
                </span>
              </button>

              {/* Subcategories Grid */}
              {subcategoriesForSelected.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {subcategoriesForSelected.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => handleSubcategoryClick(sub.name)}
                      className="flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      {/* Subcategory image placeholder */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                        {selectedCategory.image ? (
                          <img
                            src={normalizeImageUrl(selectedCategory.image)}
                            alt={sub.name}
                            className="w-full h-full object-cover opacity-70"
                            loading="lazy"
                          />
                        ) : (
                          <Grid size={20} className="text-gray-300" />
                        )}
                      </div>
                      <span className="text-[11px] sm:text-xs text-gray-700 dark:text-gray-300 text-center leading-tight line-clamp-2 font-medium">
                        {sub.name}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                /* No subcategories - show the category itself as clickable */
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="w-24 h-24 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden mb-3">
                    {selectedCategory.image ? (
                      <img
                        src={normalizeImageUrl(selectedCategory.image)}
                        alt={selectedCategory.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <Grid size={32} className="text-gray-300" />
                    )}
                  </div>
                  <button
                    onClick={() => handleCategoryClick(selectedCategory.slug || selectedCategory.name)}
                    className="text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                    style={{ color: themeColor, backgroundColor: `${themeColor}15` }}
                  >
                    Browse {selectedCategory.name}
                  </button>
                </div>
              )}
            </>
          )}

          {!selectedCategory && activeCategories.length > 0 && (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              Select a category
            </div>
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <Suspense fallback={null}>
        <MobileBottomNav
          onHomeClick={() => router.push('/')}
          onCartClick={() => router.push('/')}
          onAccountClick={() => app.user ? router.push('/profile') : app.setIsLoginOpen(true)}
          onMenuClick={() => { window.scrollTo(0, 0); }}
          cartCount={app.cartItems.length}
          websiteConfig={app.websiteConfig}
          onChatClick={app.handleOpenChat}
          user={app.user}
          onLogoutClick={app.handleLogout}
          activeTab="menu"
        />
      </Suspense>
    </div>
  );
}
