import React, { useState, useEffect } from 'react';
import { useLanguage, formatNumber } from '../../context/LanguageContext';
import type { Language } from '../../context/LanguageContext';
import { OrderAnalyticsProps } from './types';

// Figma icon assets (hosted on CDN)
const ICONS = {
  productsOnHand: 'https://hdnfltv.com/image/nitimages/streamline-flex_production-belt-time__2_.webp',
  totalOrders: 'https://hdnfltv.com/image/nitimages/lets-icons_order-light__2_.webp',
  reservedPrice: 'https://hdnfltv.com/image/nitimages/solar_tag-price-linear__2_.webp',
  lowStock: 'https://hdnfltv.com/image/nitimages/hugeicons_hot-price__5_.webp',
  toBeReviewed: 'https://hdnfltv.com/image/nitimages/mage_preview__1_.webp',
  netProfit: 'https://hdnfltv.com/image/nitimages/solar_tag-price-linear__2_.webp',
};

const StatCard = ({
  value,
  label,
  iconUrl,
  language,
}: {
  value: number | string;
  label: string;
  iconUrl: string;
  language: Language;
}) => (
  <div className="bg-[#f9f9f9] dark:bg-gray-700 rounded-lg min-h-[52px] xs:min-h-[60px] sm:h-[68px] flex items-center justify-between px-2.5 xs:px-3 sm:px-4 py-2 overflow-hidden">
    <div className="flex flex-col justify-center min-w-0">
      <span className="text-base xs:text-lg sm:text-xl lg:text-[24px] font-medium font-['Poppins'] leading-tight text-black dark:text-white truncate tabular-nums">
        {typeof value === 'number' ? formatNumber(value, language) : value}
      </span>
      <span className="text-[10px] xs:text-[11px] sm:text-[12px] font-medium font-['Poppins'] text-black dark:text-gray-300 truncate">
        {label}
      </span>
    </div>
    <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-11 sm:h-11 bg-white dark:bg-gray-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
      <img src={iconUrl} alt={label} className="w-5 h-5 xs:w-6 xs:h-6 sm:w-8 sm:h-8 object-contain" />
    </div>
  </div>
);

const OrderAnalytics: React.FC<OrderAnalyticsProps> = ({
  totalProducts,
  totalOrders,
  totalRevenue,
  lowStockProducts,
  toBeReviewed,
  reservedPrice = 0,
  netProfit,
  notifications = [],
}) => {
  const { language, setLanguage: setLang, t } = useLanguage();
  const [currentNotificationIndex, setCurrentNotificationIndex] = useState(0);

  const now = new Date();
  const currentDay = now.toLocaleDateString('en-US', { weekday: 'short' });
  const currentDate = now.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' });
  const netProfitValue = typeof netProfit === 'number' ? netProfit : totalRevenue - reservedPrice;

  const displayNotifications =
    notifications.length > 0
      ? notifications
      : [{ id: '1', image: 'https://hdnfltv.com/image/nitimages/pasted_1770753032030.webp', title: 'গ্রিপ দিল পাতা' }];

  useEffect(() => {
    if (displayNotifications.length <= 1) return;
    const id = setInterval(() => {
      setCurrentNotificationIndex(prev => (prev + 1) % displayNotifications.length);
    }, 5000);
    return () => clearInterval(id);
  }, [displayNotifications.length]);

  return (
    <div className="w-full font-['Poppins']">
      {/* Title */}
      <h2 className="text-sm xs:text-base font-semibold text-black dark:text-white mb-2 xs:mb-3 sm:mb-4">
        Order Analytics
      </h2>

      {/* Body: left cards + right notification */}
      <div className="flex flex-col lg:flex-row gap-2 xs:gap-3">

        {/* Left: two rows of stat cards */}
        <div className="flex-1 flex flex-col gap-2 xs:gap-3 min-w-0">

          {/* Row 1 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 xs:gap-3">
            {/* Products on Hands */}
            <StatCard
              value={totalProducts}
              label={t('products_on_hand') || 'Products on Hands'}
              iconUrl={ICONS.productsOnHand}
              language={language}
            />

            {/* Total Orders */}
            <StatCard
              value={totalOrders}
              label={t('total_orders') || 'Total Orders'}
              iconUrl={ICONS.totalOrders}
              language={language}
            />

            {/* Language Switcher */}
            <div className="bg-[#f9f9f9] dark:bg-gray-700 rounded-lg min-h-[52px] xs:min-h-[60px] sm:h-[68px] flex flex-col justify-center px-2.5 xs:px-3 sm:px-4 py-2 overflow-hidden">
              <span className="text-[12px] font-normal text-black dark:text-gray-300 mb-1.5">
                {t('language') || 'Language'}
              </span>
              <div className="w-[92px] h-[26px] rounded-[24px] border border-white dark:border-gray-500 flex items-center px-[3px] relative">
                {/* Active pill */}
                <div
                  className="absolute h-[18px] w-[43px] bg-white dark:bg-gray-500 rounded-[20px] transition-all duration-200 shadow-sm"
                  style={{ left: language === 'en' ? 3 : 46 }}
                />
                <button
                  onClick={() => setLang('en')}
                  className="relative z-10 flex-1 text-[12px] text-black dark:text-white text-center leading-[26px]"
                >
                  Eng
                </button>
                <button
                  onClick={() => setLang('bn')}
                  className="relative z-10 flex-1 text-[12px] text-black dark:text-white text-center leading-[26px]"
                >
                  বাংলা
                </button>
              </div>
            </div>

            {/* Date / Day */}
            <div className="min-h-[52px] xs:min-h-[60px] sm:h-[68px]">
              <div className="w-full h-full relative bg-[#F9F9F9] dark:bg-gray-700 overflow-hidden rounded-lg">
                <div className="absolute w-[120px] h-[120px] xs:w-[140px] xs:h-[140px] sm:w-[160px] sm:h-[160px] left-5 top-4 xs:top-5 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full" />
                <div className="absolute left-2 xs:left-2.5 sm:left-3 top-2 xs:top-2.5 sm:top-3 text-sm xs:text-base font-medium font-['Poppins'] text-black dark:text-white">
                  {currentDate}
                </div>
                <div className="absolute left-[50px] xs:left-[55px] sm:left-[68px] top-7 xs:top-8 sm:top-[34px] text-lg xs:text-xl sm:text-2xl font-medium font-['Poppins'] text-white">
                  {currentDay}
                </div>
              </div>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 xs:gap-3">
            <StatCard
              value={reservedPrice || totalRevenue}
              label={t('reserved_price') || 'Reserved Price'}
              iconUrl={ICONS.reservedPrice}
              language={language}
            />
            <StatCard
              value={lowStockProducts}
              label={t('low_stock') || 'Low Stock'}
              iconUrl={ICONS.lowStock}
              language={language}
            />
            <StatCard
              value={toBeReviewed}
              label={t('to_be_reviewed') || 'To be Reviewed'}
              iconUrl={ICONS.toBeReviewed}
              language={language}
            />
            <StatCard
              value={`৳${formatNumber(netProfitValue, language)}`}
              label="Net Profit"
              iconUrl={ICONS.netProfit}
              language={language}
            />
            
          </div>
        </div>

        {/* Right: Important Notification */}
        <div className="w-full lg:w-[262px] flex-shrink-0">
          <div className="bg-[#f9f9f9] dark:bg-gray-700 rounded-lg h-full p-3 xs:p-4 flex flex-col">
            <span className="text-[11px] xs:text-[12px] font-normal text-black dark:text-gray-300 mb-2 xs:mb-3">
              Important Notification
            </span>

            {/* White notification card */}
            <div className="bg-white dark:bg-gray-600 rounded-[8px] overflow-hidden flex-1 flex flex-col items-center justify-center">
              {displayNotifications[currentNotificationIndex]?.image ? (
                <img
                  src={displayNotifications[currentNotificationIndex].image}
                  alt="notification"
                  className="w-full h-full object-contain p-2"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <span className="text-[11px] text-gray-400 p-2">
                  {displayNotifications[currentNotificationIndex]?.title}
                </span>
              )}
            </div>
            

            {/* Pagination dots */}
            <div className="flex justify-center items-center gap-1 mt-3">
              {displayNotifications.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentNotificationIndex(idx)}
                  className={`rounded-full transition-all ${
                    idx === currentNotificationIndex
                      ? 'w-5 h-2 bg-gradient-to-r from-sky-400 to-blue-500'
                      : 'w-[6px] h-[6px] bg-gray-300 dark:bg-gray-500'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrderAnalytics;
