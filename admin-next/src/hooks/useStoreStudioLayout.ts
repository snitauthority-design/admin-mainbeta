import { useState, useEffect, useCallback, useMemo } from 'react';
import type { WebsiteConfig } from '../types';

interface UseStoreStudioLayoutProps {
  tenantId?: string;
  websiteConfig?: WebsiteConfig;
}

interface UseStoreStudioLayoutReturn {
  useCustomLayout: boolean;
  customLayoutLoading: boolean;
  customLayoutData: any;
  storeStudioEnabled: boolean;
  productDisplayOrder: number[];
  effectiveWebsiteConfig: WebsiteConfig | undefined;
}

export const useStoreStudioLayout = ({
  tenantId,
  websiteConfig,
}: UseStoreStudioLayoutProps): UseStoreStudioLayoutReturn => {
  const [useCustomLayout, setUseCustomLayout] = useState(false);
  const [customLayoutLoading, setCustomLayoutLoading] = useState(true);
  const [customLayoutData, setCustomLayoutData] = useState(null);
  const [storeStudioEnabled, setStoreStudioEnabled] = useState(false);
  const [productDisplayOrder, setProductDisplayOrder] = useState<number[]>([]);
  const [storeStudioStyles, setStoreStudioStyles] = useState<Record<string, string> | null>(null);

  // Shared function to check and update custom layout state
  const checkAndUpdateCustomLayout = useCallback(async (logPrefix = '') => {
    if (!tenantId) return;
    
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
      // Use single batch endpoint instead of 3 parallel calls for faster loading
      const batchRes = await fetch(
        `${API_BASE_URL}/api/tenant-data/${tenantId}/store_studio_batch`
      );
      
      if (batchRes.ok) {
        const contentType = batchRes.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
          console.warn('[StoreHome] API returned non-JSON response, using default layout');
          setCustomLayoutData(null);
          setUseCustomLayout(false);
          setCustomLayoutLoading(false);
          return;
        }
        const batchResult = await batchRes.json();
        const { config: configData, layout: layoutData, styles: stylesData } = batchResult.data || {};
        
        const isStoreStudioEnabled = configData?.enabled || false;
        const hasCustomLayout = layoutData?.sections?.length > 0;
        const displayOrder = configData?.productDisplayOrder || [];
        
        // Store the config and layout data to pass to StoreFrontRenderer
        setStoreStudioEnabled(isStoreStudioEnabled);
        setProductDisplayOrder(displayOrder);

        // Set store studio style customizations
        if (isStoreStudioEnabled && stylesData && typeof stylesData === 'object') {
          setStoreStudioStyles(stylesData);
        } else {
          setStoreStudioStyles(null);
        }
        
        // When store studio is enabled, always use StoreFrontRenderer
        // (blank page if no layout configured, custom layout if configured)
        // When disabled, fallback to admin customization config
        if (isStoreStudioEnabled) {
          setCustomLayoutData(hasCustomLayout ? layoutData : { sections: [] });
          setUseCustomLayout(true);
          if (hasCustomLayout) {
            console.log(`[StoreHome]${logPrefix} Using custom layout from Store Studio`);
          } else {
            console.log(`[StoreHome]${logPrefix} Store Studio enabled but no layout configured, showing blank`);
          }
        } else {
          setCustomLayoutData(null);
          setUseCustomLayout(false);
          setStoreStudioStyles(null);
          console.log(`[StoreHome]${logPrefix} Store Studio is disabled, using default layout`);
        }
      }
    } catch (e) {
      console.log(`[StoreHome]${logPrefix} Error checking layout, using default:`, e);
    }
  }, [tenantId]);

  // Check if tenant has store studio enabled and a custom layout saved (only on mount)
  useEffect(() => {
    const initCustomLayout = async () => {
      if (!tenantId) {
        setCustomLayoutLoading(false);
        return;
      }
      await checkAndUpdateCustomLayout();
      setCustomLayoutLoading(false);
    };
    initCustomLayout();
  }, [tenantId, checkAndUpdateCustomLayout]);

  // Merge store studio style customizations with websiteConfig when studio is enabled
  const effectiveWebsiteConfig = useMemo<WebsiteConfig | undefined>(() => {
    if (!storeStudioEnabled || !storeStudioStyles) return websiteConfig;
    return { ...websiteConfig, ...storeStudioStyles } as WebsiteConfig;
  }, [websiteConfig, storeStudioStyles, storeStudioEnabled]);

  return {
    useCustomLayout,
    customLayoutLoading,
    customLayoutData,
    storeStudioEnabled,
    productDisplayOrder,
    effectiveWebsiteConfig,
  };
};
