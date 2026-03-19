'use client';

import React, { useState } from 'react';
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Send,
  Globe,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

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

interface StorefrontFooterProps {
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

// Social icon mapper
const getSocialIcon = (platform: string): React.ReactNode => {
  const normalizedPlatform = platform.toLowerCase();

  switch (normalizedPlatform) {
    case 'facebook':
    case 'fb':
      return <Facebook size={20} />;
    case 'instagram':
    case 'ig':
      return <Instagram size={20} />;
    case 'twitter':
    case 'x':
      return <Twitter size={20} />;
    case 'linkedin':
      return <Linkedin size={20} />;
    case 'youtube':
    case 'yt':
      return <Youtube size={20} />;
    case 'whatsapp':
      return <MessageCircle size={20} />;
    default:
      return <Globe size={20} />;
  }
};

export default function StorefrontFooter({
  logo,
  websiteConfig,
  tenantId,
}: StorefrontFooterProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const socialMedia = websiteConfig?.socialMedia?.filter(
    (s: any) => s.platform && s.url
  ) || [];

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    // Newsletter submission logic would go here
    setTimeout(() => {
      setIsSubmitting(false);
      setEmail('');
      alert('Thank you for subscribing!');
    }, 1000);
  };

  // Build WhatsApp link
  const whatsappLink = websiteConfig?.whatsappNumber
    ? `https://wa.me/${websiteConfig.whatsappNumber.replace(/[^0-9]/g, '')}`
    : null;

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-[1400px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              {logo ? (
                <div className="relative w-40 h-12">
                  <Image
                    src={logo}
                    alt={storeName}
                    fill
                    className="object-contain brightness-0 invert"
                    sizes="160px"
                  />
                </div>
              ) : (
                <div className="text-2xl font-bold" style={{ color: primaryColor }}>
                  {storeName}
                </div>
              )}
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              {websiteConfig?.footerDescription ||
                'Your trusted online shopping destination. Quality products at great prices.'}
            </p>
            {/* Social Media */}
            {socialMedia.length > 0 && (
              <div className="flex items-center gap-3 pt-2">
                {socialMedia.map((social: SocialMedia) => (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
                    title={social.platform}
                  >
                    {getSocialIcon(social.platform)}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link: FooterLink) => (
                <li key={link.id}>
                  <Link
                    href={link.url}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Useful Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Useful Links</h3>
            <ul className="space-y-2">
              {usefulLinks.map((link: FooterLink) => (
                <li key={link.id}>
                  <Link
                    href={link.url}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 mb-6">
              {websiteConfig?.contactPhone && (
                <li>
                  <a
                    href={`tel:${websiteConfig.contactPhone}`}
                    className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2"
                  >
                    <Phone size={16} />
                    {websiteConfig.contactPhone}
                  </a>
                </li>
              )}
              {websiteConfig?.contactEmail && (
                <li>
                  <a
                    href={`mailto:${websiteConfig.contactEmail}`}
                    className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2"
                  >
                    <Mail size={16} />
                    {websiteConfig.contactEmail}
                  </a>
                </li>
              )}
              {websiteConfig?.address && (
                <li className="text-gray-400 text-sm flex items-start gap-2">
                  <MapPin size={16} className="flex-shrink-0 mt-0.5" />
                  <span>{websiteConfig.address}</span>
                </li>
              )}
              {whatsappLink && (
                <li>
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2"
                  >
                    <MessageCircle size={16} />
                    WhatsApp
                  </a>
                </li>
              )}
            </ul>

            {/* Newsletter */}
            {websiteConfig?.showNewsletterSignup !== false && (
              <div>
                <h4 className="text-sm font-semibold mb-2">Newsletter</h4>
                <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 rounded-lg text-white font-medium transition-colors disabled:opacity-50"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <Send size={16} />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Payment Methods */}
        {websiteConfig?.showPaymentMethods !== false && (
          <div className="border-t border-gray-800 pt-6 pb-6">
            <div className="flex flex-wrap items-center justify-center gap-4">
              <span className="text-sm text-gray-400">We Accept:</span>
              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 bg-gray-800 rounded text-xs font-medium">
                  Visa
                </div>
                <div className="px-3 py-1.5 bg-gray-800 rounded text-xs font-medium">
                  Mastercard
                </div>
                <div className="px-3 py-1.5 bg-gray-800 rounded text-xs font-medium">
                  bKash
                </div>
                <div className="px-3 py-1.5 bg-gray-800 rounded text-xs font-medium">
                  Nagad
                </div>
                <div className="px-3 py-1.5 bg-gray-800 rounded text-xs font-medium">
                  COD
                </div>
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
