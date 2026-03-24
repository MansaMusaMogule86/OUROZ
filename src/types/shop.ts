export type LangCode = 'en' | 'ar' | 'fr';

export interface Category {
  id: string;
  slug: string;
  name: string;
  name_ar?: string;
  name_fr?: string;
  image_url?: string;
  description?: string;
  product_count?: number;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  compare_at_price?: number;
  currency: string;
  image_url?: string;
  category_id?: string;
  origin?: string;
  in_stock: boolean;
}
