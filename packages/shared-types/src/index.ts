/**
 * @repo/shared-types
 *
 * Shared TypeScript type definitions used by both the Admin Dashboard
 * and the Storefront apps, as well as the backend API.
 *
 * Keeping types in a single package ensures that schema changes in one
 * app are immediately reflected in all others at compile time.
 */

// ─── Tenant ──────────────────────────────────────────────────────────

export type TenantPlan = 'starter' | 'growth' | 'enterprise';
export type TenantStatus = 'active' | 'trialing' | 'suspended' | 'archived' | 'inactive' | 'pending';

export interface ShopStatus {
  isTrialing: boolean;
  isStartups: boolean;
  isEnterprise: boolean;
  isPremium: boolean;
  isExpired: boolean;
  isSuspended: boolean;
  isBlocked: boolean;
}

export interface TenantBranding {
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  fontFamily?: string;
}

export interface DomainMapping {
  id: string;
  tenantId: string;
  domain: string;
  type: 'subdomain' | 'custom';
  verified: boolean;
  isPrimary: boolean;
  sslEnabled: boolean;
  createdAt: string;
  verificationToken?: string;
  dnsRecords?: {
    type: string;
    name: string;
    value: string;
    verified: boolean;
  }[];
}

export interface TenantSubscription {
  packageStartDate: string;
  packageDays: number;
  lastRenewalDate?: string;
  gracePeriodDays: number;
  isBlocked: boolean;
  lastNotificationShown?: string;
  renewalDismissedAt?: string;
}

export interface Tenant {
  id: string;
  _id?: string;
  name: string;
  subdomain: string;
  customDomain?: string;
  customDomains?: DomainMapping[];
  contactEmail: string;
  contactName?: string;
  adminEmail?: string;
  adminAuthUid?: string;
  plan: TenantPlan;
  status: TenantStatus;
  createdAt: string;
  updatedAt: string;
  onboardingCompleted: boolean;
  subscriptionStartedAt?: string;
  subscriptionEndsAt?: string;
  trialEndsAt?: string;
  billingCycle?: 'monthly' | 'yearly';
  locale?: string;
  currency?: string;
  branding?: TenantBranding;
  settings?: Record<string, unknown>;
  subscription?: TenantSubscription;
  shopStatus?: ShopStatus;
}

export interface CreateTenantPayload {
  name: string;
  subdomain: string;
  contactEmail: string;
  contactName?: string;
  adminEmail: string;
  adminPassword: string;
  plan?: TenantPlan;
}

// ─── Subscription & Billing ──────────────────────────────────────────

export interface SubscriptionPlanFeatures {
  maxProducts: number | 'unlimited';
  maxOrders: number | 'unlimited';
  maxUsers: number | 'unlimited';
  maxStorageGB: number | 'unlimited';
  customDomain: boolean;
  analyticsAccess: boolean;
  prioritySupport: boolean;
  apiAccess: boolean;
  whiteLabel: boolean;
  multiCurrency: boolean;
  advancedReports: boolean;
}

export interface SubscriptionPlan {
  name: 'basic' | 'pro' | 'enterprise';
  displayName: string;
  description: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  currency: string;
  features: SubscriptionPlanFeatures;
  isActive?: boolean;
  isPopular?: boolean;
  stripePriceId?: string;
}

export type PaymentMethod = 'card' | 'bank_transfer' | 'bkash' | 'nagad' | 'rocket' | 'other';

export interface BillingTransaction {
  tenantId: string;
  tenantName: string;
  planName: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  billingPeriodStart: string;
  billingPeriodEnd: string;
  transactionId?: string;
  invoiceId?: string;
  metadata?: Record<string, unknown>;
}

export interface Invoice {
  tenantId: string;
  tenantName: string;
  tenantEmail: string;
  billingAddress?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  lineItems: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
  }>;
  taxRate?: number;
  dueDate: string;
  notes?: string;
}

// ─── Tenant Data ─────────────────────────────────────────────────────

export interface TenantDataDocument<T = unknown> {
  tenantId: string;
  key: string;
  data: T;
  updatedAt: string;
}

// ─── Product (shared shape for storefront & admin) ───────────────────

export interface ProductImage {
  url: string;
  alt?: string;
  isPrimary?: boolean;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku?: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  attributes?: Record<string, string>;
}

export interface Product {
  id: string;
  _id?: string;
  tenantId: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  sku?: string;
  stock: number;
  images: ProductImage[];
  category?: string;
  tags?: string[];
  brand?: string;
  status: 'active' | 'draft' | 'archived';
  variants?: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}

// ─── Order ───────────────────────────────────────────────────────────

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned'
  | 'refunded';

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  variant?: string;
  image?: string;
}

export interface Order {
  id: string;
  _id?: string;
  tenantId: string;
  orderNumber: string;
  customer: {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  items: OrderItem[];
  subtotal: number;
  discount?: number;
  shipping?: number;
  total: number;
  status: OrderStatus;
  paymentMethod?: string;
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── User & Auth ─────────────────────────────────────────────────────

export type UserRole = 'customer' | 'admin' | 'tenant_admin' | 'super_admin' | 'staff';

export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: UserRole;
  tenantId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── API Response Helpers ────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T = unknown> extends ApiResponse<T[]> {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
