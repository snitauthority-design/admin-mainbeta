/**
 * Error Reporter Utility
 * Shows error toasts with a "Send to WhatsApp" button for reporting errors.
 * Uses the same WhatsApp number as the global error boundary (01798923162).
 */
import React from 'react';
import toast from 'react-hot-toast';

const WHATSAPP_PHONE = '8801798923162';

/**
 * Build a WhatsApp URL with a pre-filled error message
 */
export const buildErrorWhatsAppUrl = (context: string, errorMessage: string, details?: string): string => {
  const timestamp = new Date().toISOString();
  const page = typeof window !== 'undefined' ? window.location.href : 'unknown';
  const message = [
    `🚨 *Error Report*`,
    ``,
    `*Context:* ${context}`,
    `*Time:* ${timestamp}`,
    `*Page:* ${page}`,
    `*Error:* ${errorMessage}`,
    details ? `\n*Details:* ${details}` : '',
  ].filter(Boolean).join('\n');

  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
};

/**
 * Show an error toast with a WhatsApp "Send" report button.
 * The toast stays visible for 8 seconds so the user has time to click the button.
 */
export const showErrorWithWhatsApp = (
  context: string,
  errorMessage: string,
  details?: string
): void => {
  const whatsappUrl = buildErrorWhatsAppUrl(context, errorMessage, details);

  toast(
    (t) => React.createElement('div', { style: { display: 'flex', flexDirection: 'column' as const, gap: '8px', maxWidth: '300px' } },
      React.createElement('span', { style: { fontSize: '13px', color: '#991b1b', fontWeight: 500 } }, errorMessage),
      React.createElement('a', {
        href: whatsappUrl,
        target: '_blank',
        rel: 'noopener noreferrer',
        onClick: () => toast.dismiss(t.id),
        style: {
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          fontSize: '12px',
          fontWeight: 600,
          color: 'white',
          backgroundColor: '#25D366',
          borderRadius: '6px',
          textDecoration: 'none',
          width: 'fit-content',
          cursor: 'pointer',
        },
      }, '📱 Send Error Report')
    ),
    { duration: 8000, icon: '❌' }
  );
};
