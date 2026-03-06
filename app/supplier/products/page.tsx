'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface SupplierProduct {
    id: string;
    status: 'draft' | 'pending' | 'approved' | 'rejected';
    product: {
        id: string;
        name: string;
        slug: string;
        base_price: number;
        image_urls: string[];
        is_active: boolean;
    };
}

export default function SupplierProductsPage() {
    const [products, setProducts] = useState<SupplierProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [supplierId, setSupplierId] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: supplier } = await supabase
                .from('suppliers')
                .select('id')
                .eq('owner_user_id', user.id)
                .single();

            if (!supplier) return;
            setSupplierId(supplier.id);

            const { data } = await supabase
                .from('supplier_products')
                .select('id, status, product:products(id, name, slug, base_price, image_urls, is_active)')
                .eq('supplier_id', supplier.id)
                .order('created_at', { ascending: false });

            setProducts((data as unknown as SupplierProduct[]) ?? []);
            setLoading(false);
        })();
    }, []);

    const submitForReview = async (supplierProductId: string) => {
        const { error } = await supabase
            .from('supplier_products')
            .update({ status: 'pending' })
            .eq('id', supplierProductId);

        if (!error) {
            setProducts(prev => prev.map(p =>
                p.id === supplierProductId ? { ...p, status: 'pending' } : p
            ));
        }
    };

    const statusStyles: Record<string, string> = {
        draft: 'bg-gray-100 text-gray-600',
        pending: 'bg-amber-100 text-amber-700',
        approved: 'bg-emerald-100 text-emerald-700',
        rejected: 'bg-red-100 text-red-700',
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-[var(--color-charcoal)]">My Products</h1>
                <Link href="/supplier/products/new"
                    className="px-6 py-2.5 bg-amber-600 text-white rounded-xl font-medium hover:bg-amber-700 transition text-sm">
                    + Add Product
                </Link>
            </div>

            {loading ? (
                <div className="space-y-3">
                    {[1,2,3].map(i => <div key={i} className="h-20 bg-white rounded-xl animate-pulse" />)}
                </div>
            ) : products.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
                    <p className="text-gray-500 mb-4">No products yet</p>
                    <Link href="/supplier/products/new"
                        className="px-6 py-2.5 bg-amber-600 text-white rounded-xl font-medium hover:bg-amber-700 transition text-sm">
                        Add Your First Product
                    </Link>
                </div>
            ) : (
                <div className="space-y-3">
                    {products.map(sp => (
                        <div key={sp.id} className="bg-white rounded-xl p-4 border border-gray-100 flex items-center gap-4">
                            <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                                {sp.product?.image_urls?.[0] && (
                                    <img src={sp.product.image_urls[0]} alt="" className="w-full h-full object-cover" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-gray-900 truncate">{sp.product?.name ?? 'Unnamed'}</h3>
                                <p className="text-sm text-gray-500">AED {sp.product?.base_price?.toFixed(2) ?? '0.00'}</p>
                            </div>
                            <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusStyles[sp.status]}`}>
                                {sp.status}
                            </span>
                            {sp.status === 'draft' && (
                                <button onClick={() => submitForReview(sp.id)}
                                    className="text-sm font-medium text-amber-600 hover:text-amber-700 px-4 py-2 border border-amber-200 rounded-lg hover:bg-amber-50 transition">
                                    Submit for Review
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
