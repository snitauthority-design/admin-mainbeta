import { Product, Category, SubCategory, ChildCategory, Brand, Tag } from '../../../types';

export interface FigmaProductUploadProps {
  categories: Category[];
  subCategories?: SubCategory[];
  childCategories?: ChildCategory[];
  brands: Brand[];
  tags?: Tag[];
  onAddProduct: (product: Product) => void;
  onBack?: () => void;
  onNavigate?: (section: string) => void;
  editProduct?: Product | null;
}

export interface FormData {
  isMostSales: any;
  name: string;
  slug: string;
  autoSlug: boolean;
  shopName: string;
  shortDescription: string;
  description: string;
  mainImage: string;
  videoUrl: string;
  galleryImages: string[];
  unfilteredImages: { url: string; uploadedAt: string }[];
  regularPrice: number;
  salesPrice: number;
  costPrice: number;
  quantity: number;
  serial: number;
  unitName: string;
  warranty: string;
  sku: string;
  barcode: string;
  initialSoldCount: number;
  productionStart: string;
  expirationEnd: string;
  variantsMandatory: boolean;
  variants: { title: string; options: { attribute: string; extraPrice: number; image?: string }[] }[];
  brandName: string;
  modelName: string;
  details: { type: string; description: string }[];
  affiliateSource: string;
  sourceProductUrl: string;
  sourceSku: string;
  useDefaultDelivery: boolean;
  deliveryChargeDefault: number;
  deliveryByCity: { city: string; charge: number }[];
  keywords: string;
  seoDescription: string;
  seoTitle: string;
  category: string;
  subCategory: string;
  childCategory: string;
  categories: string[];
  subCategoriesArr: string[];
  childCategoriesArr: string[];
  brandsArr: string[];
  condition: string;
  flashSale: boolean;
  flashSaleStartDate: string;
  flashSaleEndDate: string;
  tag: string[];
  deepSearch: string;
}
