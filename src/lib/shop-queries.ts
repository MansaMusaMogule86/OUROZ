/**
 * shop-queries.ts — All Supabase read queries for the storefront.
 * Uses the browser client (anon key) — safe for public product/category data.
 * Called from server components only; no auth cookies needed for public reads.
 */

import { createBrowserClient } from '@supabase/ssr';
import type { Category, SubCategory, ProductCard, Product, LangCode } from '@/types/shop';

function supabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// ── Localisation helpers ──────────────────────────────────────────────────────

function localName(
  row: { name: string; name_ar?: string | null; name_fr?: string | null },
  lang: LangCode
): string {
  if (lang === 'ar' && row.name_ar) return row.name_ar;
  if (lang === 'fr' && row.name_fr) return row.name_fr;
  return row.name;
}

function localDesc(
  row: { description?: string | null; description_ar?: string | null; description_fr?: string | null },
  lang: LangCode
): string | undefined {
  if (lang === 'ar' && row.description_ar) return row.description_ar;
  if (lang === 'fr' && row.description_fr) return row.description_fr;
  return row.description ?? undefined;
}

// ── Categories ────────────────────────────────────────────────────────────────

export async function getCategories(lang: LangCode = 'en'): Promise<Category[]> {
  const db = supabase();

  const [{ data: topLevel }, { data: subs }] = await Promise.all([
    db
      .from('categories')
      .select('id, slug, name, name_ar, name_fr, icon, image_url, description, description_ar, description_fr')
      .is('parent_id', null)
      .eq('is_active', true)
      .order('display_order', { ascending: true }),

    db
      .from('categories')
      .select('id, slug, name, name_ar, name_fr, icon, parent_id')
      .not('parent_id', 'is', null)
      .eq('is_active', true)
      .order('display_order', { ascending: true }),
  ]);

  if (!topLevel) return [];

  // Group subcategories by parent
  const subMap: Record<string, SubCategory[]> = {};
  for (const s of subs ?? []) {
    if (!subMap[s.parent_id]) subMap[s.parent_id] = [];
    subMap[s.parent_id].push({
      id: s.id,
      slug: s.slug,
      name: localName(s, lang),
      icon: s.icon ?? undefined,
    });
  }

  return topLevel.map(cat => ({
    id: cat.id,
    slug: cat.slug,
    name: localName(cat, lang),
    icon: cat.icon ?? undefined,
    image_url: cat.image_url ?? undefined,
    description: localDesc(cat, lang),
    subcategories: subMap[cat.id] ?? [],
  }));
}

export async function getCategoryBySlug(
  slug: string,
  lang: LangCode = 'en'
): Promise<Category | null> {
  const db = supabase();

  const { data, error } = await db
    .from('categories')
    .select('id, slug, name, name_ar, name_fr, icon, image_url, description, description_ar, description_fr')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error || !data) return null;

  const { data: subs } = await db
    .from('categories')
    .select('id, slug, name, name_ar, name_fr, icon')
    .eq('parent_id', data.id)
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  return {
    id: data.id,
    slug: data.slug,
    name: localName(data, lang),
    icon: data.icon ?? undefined,
    image_url: data.image_url ?? undefined,
    description: localDesc(data, lang),
    subcategories: (subs ?? []).map(s => ({
      id: s.id,
      slug: s.slug,
      name: localName(s, lang),
      icon: s.icon ?? undefined,
    })),
  };
}

// ── Products ──────────────────────────────────────────────────────────────────

export interface ProductCardsQuery {
  lang?: LangCode;
  categorySlug?: string;
  subcategorySlug?: string;
  search?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'newest' | 'price_asc' | 'price_desc' | 'name';
}

export async function getProductCards({
  lang = 'en',
  categorySlug,
  subcategorySlug,
  search,
  limit = 24,
  offset = 0,
  sortBy = 'newest',
}: ProductCardsQuery): Promise<{ products: ProductCard[]; total: number }> {
  const db = supabase();

  // Resolve which category IDs to filter against
  let categoryIds: string[] | null = null;

  if (subcategorySlug) {
    const { data: sub } = await db
      .from('categories')
      .select('id')
      .eq('slug', subcategorySlug)
      .single();
    if (sub) categoryIds = [sub.id];
  } else if (categorySlug) {
    const { data: cat } = await db
      .from('categories')
      .select('id')
      .eq('slug', categorySlug)
      .single();
    if (cat) {
      const { data: children } = await db
        .from('categories')
        .select('id')
        .eq('parent_id', cat.id);
      categoryIds = [cat.id, ...(children ?? []).map(c => c.id)];
    }
  }

  let query = db
    .from('products')
    .select(
      `id, slug, name, name_ar, name_fr,
       base_price, compare_at_price, currency,
       origin, in_stock, badge,
       category:categories!category_id(slug),
       brand:brands!brand_id(slug),
       images:product_images(url, position)`,
      { count: 'exact' }
    )
    .eq('is_active', true);

  if (categoryIds?.length) {
    query = query.in('category_id', categoryIds);
  }

  if (search) {
    query = query.ilike('name', `%${search}%`);
  }

  switch (sortBy) {
    case 'price_asc':  query = query.order('base_price', { ascending: true });  break;
    case 'price_desc': query = query.order('base_price', { ascending: false }); break;
    case 'name':       query = query.order('name',       { ascending: true });  break;
    default:           query = query.order('created_at', { ascending: false });
  }

  query = query.range(offset, offset + limit - 1);

  const { data, count, error } = await query;
  if (error || !data) return { products: [], total: 0 };

  const products: ProductCard[] = data.map(row => {
    const imgs = ((row.images as { url: string; position: number }[]) ?? [])
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

    const name = lang === 'ar' && (row as { name_ar?: string }).name_ar
      ? (row as { name_ar: string }).name_ar
      : lang === 'fr' && (row as { name_fr?: string }).name_fr
      ? (row as { name_fr: string }).name_fr
      : row.name;

    return {
      id: row.id,
      slug: row.slug,
      name,
      price: row.base_price,
      compare_at_price: row.compare_at_price ?? undefined,
      currency: row.currency ?? 'AED',
      image_url: imgs[0]?.url,
      category_slug: (row.category as unknown as { slug: string } | null)?.slug,
      brand_slug: (row.brand as unknown as { slug: string } | null)?.slug,
      origin: row.origin ?? undefined,
      in_stock: row.in_stock,
      badge: row.badge ?? undefined,
    };
  });

  return { products, total: count ?? 0 };
}

export async function getProductBySlug(
  slug: string,
  lang: LangCode = 'en'
): Promise<Product | null> {
  const db = supabase();

  const { data, error } = await db
    .from('products')
    .select(`
      id, slug, name, name_ar, name_fr,
      short_description, description, description_ar, description_fr,
      base_price, compare_at_price, currency,
      origin, origin_region, weight, certifications, badge, in_stock,
      images:product_images(id, url, alt, position),
      variants:product_variants(id, name, price, compare_at_price, in_stock, sku, display_order),
      category:categories!category_id(slug, name),
      brand:brands!brand_id(slug, name)
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error || !data) return null;

  const name = lang === 'ar' && data.name_ar ? data.name_ar
             : lang === 'fr' && data.name_fr ? data.name_fr
             : data.name;

  const description = lang === 'ar' && data.description_ar ? data.description_ar
                    : lang === 'fr' && data.description_fr ? data.description_fr
                    : data.description;

  const images = ((data.images as { id: string; url: string; alt?: string; position: number }[]) ?? [])
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    .map(img => ({ id: img.id, url: img.url, alt: img.alt ?? name, position: img.position ?? 0 }));

  const variants = (
    (data.variants as {
      id: string; name: string; price: number;
      compare_at_price?: number; in_stock: boolean;
      sku?: string; display_order?: number;
    }[]) ?? []
  )
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
    .map(v => ({
      id: v.id,
      name: v.name,
      price: v.price,
      compare_at_price: v.compare_at_price ?? undefined,
      in_stock: v.in_stock,
      sku: v.sku ?? undefined,
    }));

  const cat = data.category as unknown as { slug: string; name: string } | null;
  const brand = data.brand as unknown as { slug: string; name: string } | null;

  return {
    id: data.id,
    slug: data.slug,
    name,
    short_description: data.short_description ?? undefined,
    description: description ?? undefined,
    price: data.base_price,
    compare_at_price: data.compare_at_price ?? undefined,
    currency: data.currency ?? 'AED',
    origin: data.origin ?? undefined,
    origin_region: data.origin_region ?? undefined,
    weight: data.weight ?? undefined,
    certifications: (data.certifications as string[]) ?? [],
    badge: data.badge ?? undefined,
    in_stock: data.in_stock,
    images,
    variants,
    category: cat ? { slug: cat.slug, name: cat.name } : undefined,
    brand: brand ? { slug: brand.slug, name: brand.name } : undefined,
  };
}
