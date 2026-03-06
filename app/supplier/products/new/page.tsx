'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface CategoryOption { id: string; name: string; }
interface BrandOption { id: string; name: string; }

export default function NewProductPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<CategoryOption[]>([]);
    const [brands, setBrands] = useState<BrandOption[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [form, setForm] = useState({
        name: '', nameAr: '', nameFr: '', description: '',
        basePrice: '', comparePrice: '', categoryId: '', brandId: '',
        imageUrl: '', sku: '', weight: '', stockQty: '10',
    });

    useEffect(() => {
        (async () => {
            const [catRes, brandRes] = await Promise.all([
                supabase.from('categories').select('id, name').order('name'),
                supabase.from('brands').select('id, name').order('name'),
            ]);
            setCategories(catRes.data ?? []);
            setBrands(brandRes.data ?? []);
        })();
    }, []);

    const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setError('Please sign in'); setLoading(false); return; }

        const { data: supplier } = await supabase
            .from('suppliers')
            .select('id')
            .eq('owner_user_id', user.id)
            .single();

        if (!supplier) { setError('Supplier account not found'); setLoading(false); return; }

        // Create slug
        const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36);

        // 1. Create product (inactive until admin approves)
        const { data: product, error: prodError } = await supabase
            .from('products')
            .insert({
                name: form.name,
                name_ar: form.nameAr || null,
                name_fr: form.nameFr || null,
                slug,
                description: form.description || null,
                base_price: parseFloat(form.basePrice) || 0,
                compare_price: form.comparePrice ? parseFloat(form.comparePrice) : null,
                category_id: form.categoryId || null,
                brand_id: form.brandId || null,
                image_urls: form.imageUrl ? [form.imageUrl] : [],
                is_active: false,
            })
            .select('id')
            .single();

        if (prodError || !product) {
            setError(prodError?.message ?? 'Failed to create product');
            setLoading(false);
            return;
        }

        // 2. Create default variant
        const { error: varError } = await supabase
            .from('product_variants')
            .insert({
                product_id: product.id,
                sku: form.sku || `${slug}-default`,
                label: 'Default',
                weight: form.weight || null,
                retail_price: parseFloat(form.basePrice) || 0,
                stock_quantity: parseInt(form.stockQty) || 10,
            });

        if (varError) {
            setError(varError.message);
            setLoading(false);
            return;
        }

        // 3. Link to supplier
        const { error: linkError } = await supabase
            .from('supplier_products')
            .insert({
                supplier_id: supplier.id,
                product_id: product.id,
                status: 'draft',
            });

        if (linkError) {
            setError(linkError.message);
            setLoading(false);
            return;
        }

        router.push('/supplier/products');
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-[var(--color-charcoal)]">Add New Product</h1>

            {error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">{error}</div>}

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                    <input required value={form.name} onChange={e => update('name', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name (Arabic)</label>
                        <input value={form.nameAr} onChange={e => update('nameAr', e.target.value)} dir="rtl"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name (French)</label>
                        <input value={form.nameFr} onChange={e => update('nameFr', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea rows={3} value={form.description} onChange={e => update('description', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none resize-none" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Base Price (AED) *</label>
                        <input required type="number" step="0.01" min="0" value={form.basePrice} onChange={e => update('basePrice', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Compare Price (AED)</label>
                        <input type="number" step="0.01" min="0" value={form.comparePrice} onChange={e => update('comparePrice', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none" placeholder="Strikethrough price" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select value={form.categoryId} onChange={e => update('categoryId', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none">
                            <option value="">Select category</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                        <select value={form.brandId} onChange={e => update('brandId', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none">
                            <option value="">Select brand</option>
                            {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                    <input value={form.imageUrl} onChange={e => update('imageUrl', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none" placeholder="https://..." />
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                        <input value={form.sku} onChange={e => update('sku', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none" placeholder="Auto-generated" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                        <input value={form.weight} onChange={e => update('weight', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none" placeholder="e.g. 500g" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Stock Qty</label>
                        <input type="number" min="0" value={form.stockQty} onChange={e => update('stockQty', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none" />
                    </div>
                </div>

                <button type="submit" disabled={loading}
                    className="w-full py-3 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 transition disabled:opacity-50">
                    {loading ? 'Creating...' : 'Create Product (Draft)'}
                </button>
                <p className="text-xs text-gray-400 text-center">Products start as drafts. Submit for review when ready.</p>
            </form>
        </div>
    );
}
