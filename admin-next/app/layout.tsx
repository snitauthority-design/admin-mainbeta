import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppProvider } from './providers';
import { GlobalErrorListener } from '@/components/GlobalErrorListener';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'E-Commerce Store',
  description: 'Multi-tenant e-commerce platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to Google Fonts — saves ~100-200ms on DNS + TLS handshake */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/*
          Core fonts loaded via <link> in <head> instead of @import in CSS.
          @import creates a waterfall: HTML → CSS file → @import CSS → font files
          <link> in <head> allows parallel discovery: HTML → (CSS file + Font CSS) → font files
          This alone can save 200-500ms on initial load.
          Reduced to essential weights only (removed 300 which is rarely used).
        */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Lato:wght@400;700;900&family=Poppins:wght@400;500;600;700&display=swap"
        />
      </head>
      <body className="min-h-screen bg-gray-50" suppressHydrationWarning>
        <AppProvider>
          <GlobalErrorListener>
            {children}
          </GlobalErrorListener>
        </AppProvider>
      </body>
    </html>
  );
}
