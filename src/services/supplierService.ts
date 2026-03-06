/**
 * OUROZ – supplierService
 * Handles Phase C supplier and product submission workflows.
 */

import { supabase } from '@/lib/supabase';
import type {
    Supplier,
    SupplierProduct,
    Commission,
    SupplierProductStatus,
} from '@/types/business';

// =============================================================================
// Supplier registration
// =============================================================================

export async function registerSupplier(input: {
    ownerUserId:     string;
    name:            string;
    description?:    string;
    contactPhone?:   string;
    contactEmail:    string;
    logoUrl?:        string;
    tradeUrl?:       string;
}): Promise<{ ok: boolean; supplier_id?: string; error?: string }> {
    // Auto-generate slug from name
    const slug = input.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

    // Ensure unique slug
    const { data: existing } = await supabase
        .from('suppliers')
        .select('id')
        .eq('slug', slug)
        .single();

    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

    const { data, error } = await supabase
        .from('suppliers')
        .insert({
            owner_user_id:     input.ownerUserId,
            name:              input.name,
            slug:              finalSlug,
            description:       input.description ?? null,
            contact_phone:     input.contactPhone ?? null,
            contact_email:     input.contactEmail,
            logo_url:          input.logoUrl ?? null,
            trade_license_url: input.tradeUrl ?? null,
            status:            'pending',
        })
        .select('id')
        .single();

    if (error || !data) return { ok: false, error: error?.message ?? 'Registration failed.' };
    return { ok: true, supplier_id: (data as { id: string }).id };
}

// =============================================================================
// Submit product draft
// =============================================================================

export async function submitProductDraft(input: {
    supplierId:    string;
    name:          string;
    nameAr?:       string;
    nameFr?:       string;
    description?:  string;
    brandId?:      string;
    categoryId?:   string;
    basePrice:     number;
    imageUrls?:    string[];
    variants: {
        sku:         string;
        weight?:     string;
        weightGrams?: number;
        retailPrice: number;
        stock:       number;
    }[];
}): Promise<{ ok: boolean; product_id?: string; supplier_product_id?: string; error?: string }> {
    // Create product (inactive until approved)
    const slug = input.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') + '-' + Date.now();

    const { data: product, error: prodError } = await supabase
        .from('products')
        .insert({
            slug,
            brand_id:      input.brandId ?? null,
            category_id:   input.categoryId ?? null,
            name:          input.name,
            name_ar:       input.nameAr ?? null,
            name_fr:       input.nameFr ?? null,
            description:   input.description ?? null,
            base_price:    input.basePrice,
            image_urls:    input.imageUrls ?? [],
            is_active:     false, // goes live only after admin approval
            is_featured:   false,
            is_wholesale_enabled: true,
            supplier_id:   input.supplierId,
        })
        .select('id')
        .single();

    if (prodError || !product) {
        return { ok: false, error: prodError?.message ?? 'Failed to create product.' };
    }

    const productId = (product as { id: string }).id;

    // Create variants
    if (input.variants.length > 0) {
        const { error: varError } = await supabase
            .from('product_variants')
            .insert(
                input.variants.map((v, i) => ({
                    product_id:     productId,
                    sku:            v.sku,
                    weight:         v.weight ?? null,
                    weight_grams:   v.weightGrams ?? null,
                    retail_price:   v.retailPrice,
                    stock_quantity: v.stock,
                    is_active:      false, // activates with product
                    sort_order:     i,
                }))
            );

        if (varError) {
            await supabase.from('products').delete().eq('id', productId);
            return { ok: false, error: varError.message };
        }
    }

    // Create supplier_products link record
    const { data: sp, error: spError } = await supabase
        .from('supplier_products')
        .insert({
            supplier_id:  input.supplierId,
            product_id:   productId,
            status:       'draft',
        })
        .select('id')
        .single();

    if (spError || !sp) {
        return { ok: false, error: spError?.message ?? 'Failed to link product to supplier.' };
    }

    return {
        ok:                  true,
        product_id:          productId,
        supplier_product_id: (sp as { id: string }).id,
    };
}

// =============================================================================
// Submit for review (draft → pending)
// =============================================================================

export async function submitForReview(
    supplierProductId: string
): Promise<{ ok: boolean; error?: string }> {
    const { error } = await supabase
        .from('supplier_products')
        .update({ status: 'pending', submitted_at: new Date().toISOString() })
        .eq('id', supplierProductId);

    if (error) return { ok: false, error: error.message };
    return { ok: true };
}

// =============================================================================
// Admin: approve supplier product
// =============================================================================

export async function approveSupplierProduct(
    supplierProductId: string,
    adminUserId: string
): Promise<{ ok: boolean; error?: string }> {
    const { error } = await supabase.rpc('approve_supplier_product', {
        p_supplier_product_id: supplierProductId,
        p_admin_user_id:       adminUserId,
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
}

// =============================================================================
// Admin: approve supplier account
// =============================================================================

export async function approveSupplier(
    supplierId: string,
    adminUserId: string,
    commissionRate = 15
): Promise<{ ok: boolean; error?: string }> {
    const { error } = await supabase
        .from('suppliers')
        .update({
            status:      'approved',
            approved_at: new Date().toISOString(),
            approved_by: adminUserId,
        })
        .eq('id', supplierId);

    if (error) return { ok: false, error: error.message };

    // Create default commission record
    await supabase
        .from('commissions')
        .upsert(
            { supplier_id: supplierId, rate_percent: commissionRate },
            { onConflict: 'supplier_id' }
        );

    return { ok: true };
}

// =============================================================================
// Fetch supplier's own products
// =============================================================================

export async function fetchSupplierProducts(supplierId: string): Promise<
    Array<SupplierProduct & { product: { id: string; name: string; image_urls: string[] } }>
> {
    const { data, error } = await supabase
        .from('supplier_products')
        .select('*, product:product_id(id, name, image_urls)')
        .eq('supplier_id', supplierId)
        .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data as Array<SupplierProduct & { product: { id: string; name: string; image_urls: string[] } }>;
}

// =============================================================================
// Fetch all pending supplier products (admin)
// =============================================================================

export async function fetchPendingSupplierProducts(): Promise<
    Array<SupplierProduct & {
        product: { id: string; name: string };
        supplier: { id: string; name: string; contact_email: string };
    }>
> {
    const { data, error } = await supabase
        .from('supplier_products')
        .select(`
            *,
            product:product_id ( id, name ),
            supplier:supplier_id ( id, name, contact_email )
        `)
        .eq('status', 'pending')
        .order('submitted_at', { ascending: true });

    if (error || !data) return [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data as any;
}

// =============================================================================
// Get commission for an order item (used at checkout)
// =============================================================================

export async function getCommission(
    supplierId: string,
    lineTotal: number
): Promise<number> {
    const { data } = await supabase.rpc('calculate_commission', {
        p_supplier_id: supplierId,
        p_line_total:  lineTotal,
    });
    return Number(data ?? 0);
}
