'use client';

import React, { useCallback } from 'react';
import { MessageCircle } from 'lucide-react';
import FooterBrand from './footer/FooterBrand';
import FooterLinks from './footer/FooterLinks';
import FooterContact from './footer/FooterContact';
import FooterNewsletter from './footer/FooterNewsletter';

interface FooterLink {
  id: string;
  label: string;
  url: string;
}

interface SocialMedia {
  id: string;
  platform: string;
  url: string;
}

interface StorefrontFooter2Props {
  logo?: string | null;
  websiteConfig?: any;
  tenantId?: string;
}

// Default footer links
const defaultQuickLinks: FooterLink[] = [
  { id: '1', label: 'Home', url: '/' },
  { id: '2', label: 'Terms and Conditions', url: '/termsnconditions' },
  { id: '3', label: 'Return Policy', url: '/returnpolicy' },
];

const defaultUsefulLinks: FooterLink[] = [
  { id: '1', label: 'About Us', url: '/about' },
  { id: '2', label: 'Privacy Policy', url: '/privacy' },
  { id: '3', label: 'FAQ', url: '/faq' },
  { id: '4', label: 'Track Order', url: '/track' },
];

export default function StorefrontFooter2({
  logo,
  websiteConfig,
  tenantId,
}: StorefrontFooter2Props) {
  const storeName = websiteConfig?.websiteName || 'Store';
  const primaryColor = websiteConfig?.colors?.primary || '#4ea674';
  const currentYear = new Date().getFullYear();

  // Get footer links with fallback
  const quickLinks = websiteConfig?.footerQuickLinks?.length > 0
    ? websiteConfig.footerQuickLinks.filter((l: any) => l.label && l.url)
    : defaultQuickLinks;

  const usefulLinks = websiteConfig?.footerUsefulLinks?.length > 0
    ? websiteConfig.footerUsefulLinks.filter((l: any) => l.label && l.url)
    : defaultUsefulLinks;

  const socialMedia: SocialMedia[] = websiteConfig?.socialMedia?.filter(
    (s: any) => s.platform && s.url
  ) || [];

  const whatsappLink = websiteConfig?.whatsappNumber
    ? `https://wa.me/${websiteConfig.whatsappNumber.replace(/[^0-9]/g, '')}`
    : null;

  const handleNewsletterSubmit = useCallback(async (email: string) => {
    // TODO: Implement actual newsletter API call
    console.log('Newsletter subscription:', email);
    alert('Thank you for subscribing!');
  }, []);

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-[1400px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <FooterBrand
            logo={logo}
            storeName={storeName}
            description={websiteConfig?.footerDescription}
            socialMedia={socialMedia}
            primaryColor={primaryColor}
          />

          {/* Quick Links */}
          <FooterLinks title="Quick Links" links={quickLinks} />

          {/* Useful Links */}
          <FooterLinks title="Useful Links" links={usefulLinks} />

          {/* Contact & Newsletter */}
          <div className="space-y-6">
            <FooterContact
              phone={websiteConfig?.contactPhone}
              email={websiteConfig?.contactEmail}
              address={websiteConfig?.address}
              whatsappNumber={websiteConfig?.whatsappNumber}
            />
            {websiteConfig?.showNewsletterSignup !== false && (
              <FooterNewsletter
                onSubmit={handleNewsletterSubmit}
                primaryColor={primaryColor}
              />
            )}
          </div>
        </div>

        {/* Payment Methods */}
        {websiteConfig?.showPaymentMethods !== false && (
          <div className="border-t border-gray-800 pt-6 pb-6">
            <div className="flex flex-wrap items-center justify-center gap-4">
              <span className="text-sm text-gray-400">We Accept:</span>
              <div className="flex items-center gap-3">
                {['Visa', 'Mastercard', 'bKash', 'Nagad', 'COD'].map((method) => (
                  <div
                    key={method}
                    className="px-3 py-1.5 bg-gray-800 rounded text-xs font-medium"
                  >
                    {method}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Copyright */}
        {!websiteConfig?.hideCopyright && (
          <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            {!websiteConfig?.hideCopyrightText && (
              <p className="text-sm text-gray-500">
                © {currentYear}{' '}
                <span className="font-medium text-white">{storeName}</span>. All
                rights reserved.
              </p>
            )}
            {websiteConfig?.showPoweredBy && (
              <a
                href="https://systemnextit.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-400 hover:text-blue-400 transition-colors"
              >
                Powered by SystemNext IT
              </a>
            )}
          </div>
        )}
      </div>

      {/* Floating Chat Button */}
      {whatsappLink && websiteConfig?.showFloatingChat !== false && (
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white hover:scale-110 transition-transform z-50"
          style={{ backgroundColor: '#25D366' }}
          title="Chat on WhatsApp"
        >
          <MessageCircle size={28} />
        </a>
      )}
    </footer>
  );
}
