'use client';

import React from 'react';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';

interface FooterContactProps {
  phone?: string;
  email?: string;
  address?: string;
  whatsappNumber?: string;
}

export default function FooterContact({
  phone,
  email,
  address,
  whatsappNumber,
}: FooterContactProps) {
  const whatsappLink = whatsappNumber
    ? `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`
    : null;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
      <ul className="space-y-3">
        {phone && (
          <li>
            <a
              href={`tel:${phone}`}
              className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2"
            >
              <Phone size={16} />
              {phone}
            </a>
          </li>
        )}
        {email && (
          <li>
            <a
              href={`mailto:${email}`}
              className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2"
            >
              <Mail size={16} />
              {email}
            </a>
          </li>
        )}
        {address && (
          <li className="text-gray-400 text-sm flex items-start gap-2">
            <MapPin size={16} className="flex-shrink-0 mt-0.5" />
            <span>{address}</span>
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
    </div>
  );
}
