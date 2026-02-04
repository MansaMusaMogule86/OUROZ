
export enum PlatformMode {
  B2B = 'B2B',
  B2C = 'B2C'
}

export enum UserRole {
  GUEST = 'GUEST',
  BUYER = 'BUYER',
  SUPPLIER = 'SUPPLIER',
  ADMIN = 'ADMIN'
}

export enum ApplicationStatus {
  NONE = 'NONE',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface User {
  id: string;
  role: UserRole;
  status: ApplicationStatus;
  companyName?: string;
  name: string;
}

export interface TradeApplication {
  id: string;
  userId: string;
  type: 'BUYER' | 'SUPPLIER';
  companyName: string;
  country: string;
  details: string;
  status: ApplicationStatus;
  createdAt: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  short_description: string;
  seo_meta_title: string;
  search_tags: string;
  price: number;
  currency: string;
  wholesalePrice?: number;
  moq: number;
  origin: string;
  category: string;
  category_slug: string;
  image: string;
  verified: boolean;
  retailEnabled: boolean;
  wholesaleEnabled: boolean;
  is_active: boolean;
  stock_status: 'in_stock' | 'out_of_stock' | 'preorder';
}

export interface Category {
  name: string;
  slug: string;
  is_active: boolean;
}

export interface RFQ {
  id: string;
  productId: string;
  quantity: number;
  incoterms: string;
  specs: string;
  status: 'PENDING' | 'QUOTED' | 'NEGOTIATING' | 'CLOSED';
  createdAt: string;
}

export interface GroundingSource {
  title?: string;
  uri?: string;
}

export interface AIMessage {
  role: 'user' | 'model';
  text: string;
  sources?: GroundingSource[];
  isThinking?: boolean;
}

export type ViewType =
  | 'LANDING'
  | 'SHOP'
  | 'TRADE_GATE'
  | 'APPLY_BUYER'
  | 'APPLY_SUPPLIER'
  | 'TRADE_DASHBOARD'
  | 'ADMIN'
  | 'AI_STUDIO'
  | 'AMUD_ENGINE'
  | 'CHEF_ADAFER'
  | 'CAT_KITCHEN'
  | 'CAT_CLOTHING'
  | 'CAT_ACCESSORIES'
  | 'CAT_SKINCARE'
  | 'CAT_GROCERIES'
  // B2B Marketplace Views
  | 'B2B_MARKETPLACE'
  | 'B2B_SUPPLIER_DASHBOARD'
  | 'B2B_SUPPLIER_PROFILE'
  | 'B2B_PRODUCT_DETAIL'
  | 'B2B_RFQ'
  | 'B2B_MESSAGES'
  | 'B2B_ORDERS'
  | 'B2B_CHECKOUT';

export enum VerificationStatus {
  NOT_STARTED = 'NOT_STARTED',
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED'
}
