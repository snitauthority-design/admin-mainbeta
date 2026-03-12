// Type definitions for FigmaProductList and related components

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  costPrice?: number;
  image?: string;
  galleryImages?: string[];
  description?: string;
  category?: string;
  subCategory?: string;
  childCategory?: string;
  brand?: string;
  sku?: string;
  stock?: number;
  status?: 'Active' | 'Draft';
  tags?: string[];
  slug?: string;
  title?: string;
  salePrice?: number;
  tag?: string;
  rating?: number;
  _id?: string;
  [key: string]: any;
}

export interface Category {
  id: number;
  name: string;
  [key: string]: any;
}

export interface Brand {
  id: number;
  name: string;
  [key: string]: any;
}

export type TagType = {
  id: number;
  name: string;
  [key: string]: any;
};

export interface FigmaProductListProps {
  products?: Product[];
  categories?: Category[];
  brands?: Brand[];
  onAddProduct?: () => void;
  onEditProduct?: (product: Product) => void;
  onDeleteProduct?: (id: number) => void;
  onCloneProduct?: (product: Product) => void;
  onBulkDelete?: (ids: number[]) => void;
  onBulkStatusUpdate?: (ids: number[], status: 'Active' | 'Draft') => void;
  onBulkFlashSale?: (ids: number[], action: 'add' | 'remove') => void;
  onBulkDiscount?: (ids: number[], discount: number) => void;
  onImport?: () => void;
  onExport?: () => void;
  onBulkImport?: (products: Product[]) => void;
  onQuickUpdate?: (productId: number, updates: Partial<Product>) => void;
  tags?: TagType[];
  tenantId?: string;
  tenantSubdomain?: string;
  productDisplayOrder?: number[];
  onProductOrderChange?: (order: number[]) => Promise<void>;
}
