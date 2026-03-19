'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  logo?: string | null;
  storeName: string;
  primaryColor?: string;
}

export default function Logo({ logo, storeName, primaryColor = '#4ea674' }: LogoProps) {
  return (
    <Link href="/" className="flex items-center gap-3 flex-shrink-0">
      {logo ? (
        <div className="relative w-32 h-10 sm:w-40 sm:h-12">
          <Image
            src={logo}
            alt={storeName}
            fill
            className="object-contain"
            sizes="(max-width: 640px) 128px, 160px"
            priority
          />
        </div>
      ) : (
        <div className="text-xl sm:text-2xl font-bold" style={{ color: primaryColor }}>
          {storeName}
        </div>
      )}
    </Link>
  );
}
