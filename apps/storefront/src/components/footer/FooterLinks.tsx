'use client';

import React from 'react';
import Link from 'next/link';

interface FooterLink {
  id: string;
  label: string;
  url: string;
}

interface FooterLinksProps {
  title: string;
  links: FooterLink[];
}

export default function FooterLinks({ title, links }: FooterLinksProps) {
  if (links.length === 0) return null;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <ul className="space-y-2">
        {links.map((link) => (
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
  );
}
