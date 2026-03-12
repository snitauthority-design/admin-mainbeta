// @ts-nocheck — Vite SSR entry, not used by Next.js
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { HelmetProvider } from 'react-helmet-async';

// SSR-safe minimal shell - avoids useLayoutEffect warnings from third-party libs
// The full App hydrates on the client side
export function render(url: string = '/') {
  const helmetContext = {};
  
  // Render a minimal shell for SEO - client will hydrate the full app
  const html = renderToString(
    <StaticRouter location={url}>
      <HelmetProvider context={helmetContext}>
        <div id="root">
          {/* Minimal loading shell - full app hydrates on client */}
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900" />
        </div>
      </HelmetProvider>
    </StaticRouter>
  );
  
  return { html, head: (helmetContext as any).helmet };
}
