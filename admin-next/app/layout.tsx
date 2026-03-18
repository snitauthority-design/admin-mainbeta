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
