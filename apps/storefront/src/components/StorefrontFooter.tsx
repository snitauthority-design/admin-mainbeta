'use client';

import React from 'react';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Linkedin, Youtube, MessageCircle } from 'lucide-react';

interface StorefrontFooterProps {
  websiteConfig: any;
  logo: string | null;
  tenantId: string;
}

export default function StorefrontFooter({ websiteConfig, logo, tenantId }: StorefrontFooterProps) {
  const storeName = websiteConfig?.storeName || websiteConfig?.websiteName || 'Store';
  const phones = websiteConfig?.phones || [];
  const emails = websiteConfig?.emails || [];
  const addresses = websiteConfig?.addresses || [];
  const socialLinks = websiteConfig?.socialLinks || [];

  const quickLinks = websiteConfig?.footerQuickLinks || [
    { label: 'Home', url: '/' },
    { label: 'Terms and Conditions', url: '/termsnconditions' },
    { label: 'Return Policy', url: '/returnpolicy' },
  ];

  const usefulLinks = websiteConfig?.footerUsefulLinks || [
    { label: 'About Us', url: '/about' },
    { label: 'Privacy Policy', url: '/privacy' },
  ];

  const buildWhatsAppLink = (rawNumber?: string | null) => {
    if (!rawNumber) return null;
    const sanitized = rawNumber.trim().replace(/[^0-9]/g, '');
    return sanitized ? `https://wa.me/${sanitized}` : null;
  };

  const whatsappLink = buildWhatsAppLink(websiteConfig?.whatsappNumber || phones[0]);

  const getSocialIcon = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('facebook')) return <Facebook size={18} />;
    if (p.includes('instagram')) return <Instagram size={18} />;
    if (p.includes('twitter') || p.includes('x')) return <Twitter size={18} />;
    if (p.includes('linkedin')) return <Linkedin size={18} />;
    if (p.includes('youtube')) return <Youtube size={18} />;
    if (p.includes('whatsapp')) return <MessageCircle size={18} />;
    return null;
  };

  return (
    <>
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand */}
            <div>
              {logo ? (
                <img src={logo} alt={storeName} className="h-10 w-auto mb-4 brightness-0 invert" />
              ) : (
                <h3 className="text-xl font-bold text-white mb-4">{storeName}</h3>
              )}
              <p className="text-sm text-gray-400 mb-4">
                {websiteConfig?.shortDescription || `Welcome to ${storeName}`}
              </p>
              {socialLinks.length > 0 && (
                <div className="flex items-center gap-3">
                  {socialLinks.map((social: any, i: number) => {
                    const icon = getSocialIcon(social.platform || social.type || '');
                    if (!icon) return null;
                    return (
                      <a
                        key={i}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        {icon}
                      </a>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {quickLinks.map((link: any, i: number) => (
                  <li key={i}>
                    <a href={link.url} className="text-sm text-gray-400 hover:text-white transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Useful Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Useful Links</h4>
              <ul className="space-y-2">
                {usefulLinks.map((link: any, i: number) => (
                  <li key={i}>
                    <a href={link.url} className="text-sm text-gray-400 hover:text-white transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-semibold mb-4">Contact Us</h4>
              <div className="space-y-3 text-sm">
                {phones[0] && (
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-gray-400 flex-shrink-0" />
                    <a href={`tel:${phones[0]}`} className="text-gray-400 hover:text-white transition-colors">
                      {phones[0]}
                    </a>
                  </div>
                )}
                {emails[0] && (
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-gray-400 flex-shrink-0" />
                    <a href={`mailto:${emails[0]}`} className="text-gray-400 hover:text-white transition-colors">
                      {emails[0]}
                    </a>
                  </div>
                )}
                {addresses[0] && (
                  <div className="flex items-start gap-2">
                    <MapPin size={16} className="text-gray-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-400">{addresses[0]}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
            <p>© {new Date().getFullYear()} {storeName}. All rights reserved.</p>
            {websiteConfig?.showPoweredBy !== false && (
              <p>
                Powered by{' '}
                <a
                  href="https://systemnextit.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  SystemNext IT
                </a>
              </p>
            )}
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp button */}
      {whatsappLink && (
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg transition-colors"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle size={24} />
        </a>
      )}
    </>
  );
}
