// Utility/helper functions for FigmaProductList

/** Normalize an image URL to ensure it has a leading slash or full URL */
export const normalizeImageUrl = (url: string): string => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/')) return url;
  return `/${url}`;
};

/** Detect if the parsed CSV headers match the Daraz/Lazada export format */
export const isDarazFormat = (headers: string[]): boolean => {
  const advancedHeaders = ['Product Name(English)', '*Product Name(English)', 'Product Images1', '*Product Images1', 'Main Description'];
  const basicHeaders = ['SellerSKU', '*SellerSKU', 'Seller SKU', '*Seller SKU', 'Image 1', 'Image1', '*Image 1', '*Image1', 'Short Description', '*Short Description', 'Package Weight', '*Package Weight', 'Package Content', '*Package Content', 'Color Family'];
  const normalizedHeaders = headers.map(h => h.replace(/^\*/, '').trim());
  const hasAdvanced = advancedHeaders.some(h => normalizedHeaders.some(header => header.includes(h.replace('*', ''))));
  const hasBasic = basicHeaders.some(h => normalizedHeaders.some(header => header === h.replace('*', '').trim()));
  const hasProductName = normalizedHeaders.some(h => h === 'Product Name' || h === 'Product Name(English)');
  const hasImageOrSku = normalizedHeaders.some(h => /^Image\s*\d/i.test(h) || /SellerSKU|Seller SKU/i.test(h));
  return hasAdvanced || hasBasic || (hasProductName && hasImageOrSku);
};

/** Strip HTML tags to get plain text */
export const stripHtmlTags = (html: string): string => {
  if (!html) return '';
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

/** Get the store front URL for a given subdomain */
export const getStoreUrl = (subdomain?: string): string => {
  if (!subdomain) return '';
  const isLocalhost = window.location.hostname.includes('localhost');
  if (isLocalhost) return `http://${subdomain}.localhost:3000`;
  return `https://${subdomain}.allinbangla.com`;
};
