'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  MessageCircle,
  Globe,
} from 'lucide-react';

interface SocialMedia {
  id: string;
  platform: string;
  url: string;
}

interface FooterBrandProps {
  logo?: string | null;
  storeName: string;
  description?: string;
  socialMedia?: SocialMedia[];
  primaryColor?: string;
}

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

export default function FooterBrand({
  logo,
  storeName,
  description = 'Your trusted online shopping destination. Quality products at great prices.',
  socialMedia = [],
  primaryColor = '#4ea674',
}: FooterBrandProps) {
  return (
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
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
      {socialMedia.length > 0 && (
        <div className="flex items-center gap-3 pt-2">
          {socialMedia.map((social) => (
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
  );
}
