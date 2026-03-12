import React from 'react';
import { Heart } from 'lucide-react';
import { normalizeImageUrl } from '../../../utils/imageUrlHelper';
import type { WebsiteConfig } from '../../../types';
import { useLanguage } from '../../../context/LanguageContext';

// Custom SVG icon URLs
const ICON_TRANSLATE = 'https://details-snit.vercel.app/images/translate.svg';
const ICON_SEARCH = 'https://details-snit.vercel.app/images/search-01.svg';
const ICON_CART = 'https://details-snit.vercel.app/images/shopping-cart-02.svg';

interface MobileHeaderBarProps {
  resolvedHeaderLogo: string | null;
  logoKey: string;
  onHomeClick?: () => void;
  wishlistBadgeCount: number;
  cartBadgeCount: number;
  onWishlistOpen: () => void;
  onCartOpen: () => void;
  onAccountClick?: () => void;
  onMenuOpen: () => void;
  onSearchOpen: () => void;
  websiteConfig?: WebsiteConfig;
}

// Style 1: Default - Clean modern with frosted glass effect
const MobileHeaderStyle1: React.FC<MobileHeaderBarProps> = ({
  resolvedHeaderLogo, logoKey, onHomeClick, wishlistBadgeCount, cartBadgeCount,
  onWishlistOpen, onCartOpen, onAccountClick, onMenuOpen, onSearchOpen, websiteConfig
}) => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'bn' : 'en');
  };

  return (
  <header className="md:hidden bg-white/95 backdrop-blur-md w-full max-w-[560px] mx-auto px-2.5 py-1.5 border-b border-gray-100/60 sticky top-0 z-50">
    <div className="flex items-center justify-between">
      <button type="button" className="flex items-center group" onClick={onHomeClick}>
        {resolvedHeaderLogo ? (
          <img key={logoKey} src={normalizeImageUrl(resolvedHeaderLogo)} alt={websiteConfig?.websiteName || 'Store logo'} className="max-h-[36px] w-auto max-w-[130px] object-contain group-active:scale-95" />
        ) : (
          <h1 className="text-base font-black tracking-tight text-theme-primary">{websiteConfig?.websiteName || 'My Store'}</h1>
        )}
      </button>
      <div className="flex items-center">
        <button type="button" className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-600 active:scale-95" onClick={toggleLanguage} aria-label="Change language" title={language === 'en' ? 'বাংলা তে দেখুন' : 'Switch to English'}>
          <img src={ICON_TRANSLATE} alt="Language" className="w-5 h-5" />
        </button>
        <button type="button" className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-600 active:scale-95" onClick={onSearchOpen} aria-label="Search">
          <img src={ICON_SEARCH} alt="Search" className="w-5 h-5" />
        </button>
        <button type="button" className="relative w-9 h-9 flex items-center justify-center rounded-lg text-gray-600 active:scale-95" onClick={onCartOpen} aria-label="Cart">
          <img src={ICON_CART} alt="Cart" className="w-5 h-5" />
          {cartBadgeCount > 0 && <span className="absolute top-0.5 right-0.5 bg-theme-primary text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center">{cartBadgeCount > 9 ? '9+' : cartBadgeCount}</span>}
        </button>
      </div>
    </div>
  </header>
  );
};

// Style 2: Compact - Minimal with centered logo
const MobileHeaderStyle2: React.FC<MobileHeaderBarProps> = ({
  resolvedHeaderLogo, logoKey, onHomeClick, wishlistBadgeCount, cartBadgeCount,
  onWishlistOpen, onCartOpen, onMenuOpen, onSearchOpen, websiteConfig
}) => (
  <header className="md:hidden bg-white w-full max-w-[560px] mx-auto px-2.5 py-1.5 border-b border-gray-200 sticky top-0 z-50">
    <div className="flex items-center justify-between">
      <button type="button" className="flex items-center justify-center" onClick={onHomeClick}>
        {resolvedHeaderLogo ? (
          <img key={logoKey} src={normalizeImageUrl(resolvedHeaderLogo)} alt={websiteConfig?.websiteName || 'Logo'} className="max-h-[36px] w-auto max-w-[130px] object-contain" />
        ) : (
          <h1 className="text-base font-bold text-gray-900">{websiteConfig?.websiteName || 'Store'}</h1>
        )}
      </button>
      <div className="flex items-center">
        <button type="button" className="w-9 h-9 flex items-center justify-center text-gray-700" onClick={onSearchOpen}>
          <img src={ICON_SEARCH} alt="Search" className="w-5 h-5" />
        </button>
        <button type="button" className="relative w-9 h-9 flex items-center justify-center text-gray-700" onClick={onCartOpen}>
          <img src={ICON_CART} alt="Cart" className="w-5 h-5" />
          {cartBadgeCount > 0 && <span className="absolute top-0.5 right-0.5 bg-rose-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{cartBadgeCount}</span>}
        </button>
      </div>
    </div>
  </header>
);

// Style 3: Gradient - Colorful gradient background
const MobileHeaderStyle3: React.FC<MobileHeaderBarProps> = ({
  resolvedHeaderLogo, logoKey, onHomeClick, wishlistBadgeCount, cartBadgeCount,
  onWishlistOpen, onCartOpen, onAccountClick, onMenuOpen, onSearchOpen, websiteConfig
}) => (
  <header className="md:hidden bg-gradient-theme-via w-full max-w-[560px] mx-auto px-2.5 py-1.5 sticky top-0 z-50 shadow-lg">
    <div className="flex items-center justify-between">
      <button type="button" className="flex items-center group" onClick={onHomeClick}>
        {resolvedHeaderLogo ? (
          <img key={logoKey} src={normalizeImageUrl(resolvedHeaderLogo)} alt={websiteConfig?.websiteName || 'Logo'} className="max-h-[36px] w-auto max-w-[130px] object-contain brightness-0 invert" />
        ) : (
          <h1 className="text-base font-bold text-white">{websiteConfig?.websiteName || 'Store'}</h1>
        )}
      </button>
      <div className="flex items-center">
        <button type="button" className="w-9 h-9 flex items-center justify-center rounded-lg text-white/90 active:scale-95" onClick={onSearchOpen}>
          <img src={ICON_SEARCH} alt="Search" className="w-5 h-5 brightness-0 invert" />
        </button>
        <button type="button" className="relative w-9 h-9 flex items-center justify-center rounded-lg text-white/90 active:scale-95" onClick={onWishlistOpen}>
          <Heart size={19} strokeWidth={2} />
          {wishlistBadgeCount > 0 && <span className="absolute top-0.5 right-0.5 bg-white text-theme-primary text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{wishlistBadgeCount}</span>}
        </button>
        <button type="button" className="relative w-9 h-9 flex items-center justify-center rounded-lg text-white/90 active:scale-95" onClick={onCartOpen}>
          <img src={ICON_CART} alt="Cart" className="w-5 h-5 brightness-0 invert" />
          {cartBadgeCount > 0 && <span className="absolute top-0.5 right-0.5 bg-white text-theme-primary text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{cartBadgeCount}</span>}
        </button>
      </div>
    </div>
  </header>
);

// Style 4: E-commerce Pro - With integrated search bar
const MobileHeaderStyle4: React.FC<MobileHeaderBarProps> = ({
  resolvedHeaderLogo, logoKey, onHomeClick, cartBadgeCount,
  onCartOpen, onMenuOpen, onSearchOpen, websiteConfig
}) => (
  <header className="md:hidden bg-white w-full max-w-[560px] mx-auto border-b border-gray-200 sticky top-0 z-50">
    <div className="px-2.5 py-1.5 flex items-center gap-2">
      <button type="button" className="flex items-center group" onClick={onHomeClick}>
        {resolvedHeaderLogo ? (
          <img key={logoKey} src={normalizeImageUrl(resolvedHeaderLogo)} alt={websiteConfig?.websiteName || 'Logo'} className="max-h-[32px] w-auto max-w-[110px] object-contain" />
        ) : (
          <h1 className="text-sm font-bold text-theme-primary">{websiteConfig?.websiteName || 'Store'}</h1>
        )}
      </button>
      <button type="button" className="flex-1 flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-gray-400 text-xs" onClick={onSearchOpen}>
        <img src={ICON_SEARCH} alt="Search" className="w-3.5 h-3.5" />
        <span>Search products...</span>
      </button>
      <button type="button" className="relative w-9 h-9 flex items-center justify-center text-gray-700" onClick={onCartOpen}>
        <img src={ICON_CART} alt="Cart" className="w-5 h-5" />
        {cartBadgeCount > 0 && <span className="absolute top-0.5 right-0.5 bg-theme-primary text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{cartBadgeCount}</span>}
      </button>
    </div>
  </header>
);

// Style 5: Dark Mode - Sleek dark theme
const MobileHeaderStyle5: React.FC<MobileHeaderBarProps> = ({
  resolvedHeaderLogo, logoKey, onHomeClick, wishlistBadgeCount, cartBadgeCount,
  onWishlistOpen, onCartOpen, onAccountClick, onMenuOpen, onSearchOpen, websiteConfig
}) => (
  <header className="md:hidden bg-gray-900 w-full max-w-[560px] mx-auto px-2.5 py-1.5 sticky top-0 z-50 shadow-lg">
    <div className="flex items-center justify-between">
      <button type="button" className="flex items-center group" onClick={onHomeClick}>
        {resolvedHeaderLogo ? (
          <img key={logoKey} src={normalizeImageUrl(resolvedHeaderLogo)} alt={websiteConfig?.websiteName || 'Logo'} className="max-h-[36px] w-auto max-w-[130px] object-contain brightness-0 invert" />
        ) : (
          <h1 className="text-base font-bold text-white">{websiteConfig?.websiteName || 'Store'}</h1>
        )}
      </button>
      <div className="flex items-center">
        <button type="button" className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-300 active:scale-95" onClick={onSearchOpen}>
          <img src={ICON_SEARCH} alt="Search" className="w-5 h-5 brightness-0 invert" />
        </button>
        <button type="button" className="relative w-9 h-9 flex items-center justify-center rounded-lg text-gray-300 active:scale-95" onClick={onWishlistOpen}>
          <Heart size={19} strokeWidth={1.8} />
          {wishlistBadgeCount > 0 && <span className="absolute top-0.5 right-0.5 bg-rose-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{wishlistBadgeCount}</span>}
        </button>
        <button type="button" className="relative w-9 h-9 flex items-center justify-center rounded-lg text-gray-300 active:scale-95" onClick={onCartOpen}>
          <img src={ICON_CART} alt="Cart" className="w-5 h-5 brightness-0 invert" />
          {cartBadgeCount > 0 && <span className="absolute top-0.5 right-0.5 bg-cyan-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{cartBadgeCount}</span>}
        </button>
      </div>
    </div>
  </header>
);

// Style 6: Vibrant Orange Gradient - Figma design
const MobileHeaderStyle6: React.FC<MobileHeaderBarProps> = ({
  resolvedHeaderLogo, logoKey, onHomeClick, wishlistBadgeCount, cartBadgeCount,
  onWishlistOpen, onCartOpen, onAccountClick, onMenuOpen, onSearchOpen, websiteConfig
}) => (
  <header className="md:hidden bg-gradient-to-r from-[#FF6A00] to-[#FF9F1C] w-full max-w-[560px] mx-auto px-2.5 py-1.5 sticky top-0 z-50 shadow-lg">
    <div className="flex items-center justify-between">
      <button type="button" className="flex items-center group" onClick={onHomeClick}>
        {resolvedHeaderLogo ? (
          <img key={logoKey} src={normalizeImageUrl(resolvedHeaderLogo)} alt={websiteConfig?.websiteName || 'Logo'} className="max-h-[36px] w-auto max-w-[130px] object-contain brightness-0 invert group-active:scale-95" />
        ) : (
          <h1 className="text-base font-bold text-white font-['Poppins']">{websiteConfig?.websiteName || 'My Store'}</h1>
        )}
      </button>
      <div className="flex items-center">
        <button type="button" className="w-9 h-9 flex items-center justify-center rounded-lg text-white/90 active:scale-95" onClick={onSearchOpen} aria-label="Search">
          <img src={ICON_SEARCH} alt="Search" className="w-5 h-5 brightness-0 invert" />
        </button>
        <button type="button" className="relative w-9 h-9 flex items-center justify-center rounded-lg text-white/90 active:scale-95" onClick={onWishlistOpen} aria-label="Wishlist">
          <Heart size={19} strokeWidth={2} />
          {wishlistBadgeCount > 0 && <span className="absolute top-0.5 right-0.5 bg-white text-orange-600 text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{wishlistBadgeCount}</span>}
        </button>
        <button type="button" className="relative w-9 h-9 flex items-center justify-center rounded-lg text-white/90 active:scale-95" onClick={onCartOpen} aria-label="Cart">
          <img src={ICON_CART} alt="Cart" className="w-5 h-5 brightness-0 invert" />
          {cartBadgeCount > 0 && <span className="absolute top-0.5 right-0.5 bg-white text-orange-600 text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{cartBadgeCount}</span>}
        </button>
      </div>
    </div>
  </header>
);

export const MobileHeaderBar: React.FC<MobileHeaderBarProps> = (props) => {
  const style = props.websiteConfig?.mobileHeaderStyle || 'style1';
  
  switch (style) {
    case 'style2':
      return <MobileHeaderStyle2 {...props} />;
    case 'style3':
      return <MobileHeaderStyle3 {...props} />;
    case 'style4':
      return <MobileHeaderStyle4 {...props} />;
    case 'style5':
      return <MobileHeaderStyle5 {...props} />;
    case 'style6':
      return <MobileHeaderStyle6 {...props} />;
    case 'style1':
    default:
      return <MobileHeaderStyle1 {...props} />;
  }
};