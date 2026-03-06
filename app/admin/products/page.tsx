'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import Image from 'next/image';

interface ProductVariant {
  id: string;
  sku: string;
  weight: number | null;
  retail_price: number;
  stock_quantity: number;
  is_active: boolean;
}

interface PriceTier {
  id?: string;
  min_quantity: number;
  price: number;
  label: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  base_price: number;
  is_active: boolean;
  is_featured: boolean;
  image_urls: string[];
  created_at: string;
  brand_id: string | null;
  category_id: string | null;
  brand?: { name: string } | Array<{ name: string }> | null;
  category?: { name: string } | Array<{ name: string }> | null;
  variants?: ProductVariant[];
}

interface Brand {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
}

type ActiveFilter = 'active' | 'draft' | 'all';

function Toast({ message, type, onDismiss }: { message: string; type: 'error' | 'success'; onDismiss: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 4000);
    return () => clearTimeout(t);
  }, [onDismiss]);
  return (
    <div className={`fixed bottom-5 right-5 z-50 max-w-sm px-4 py-3 rounded-lg shadow-lg text-sm font-medium ${type === 'error' ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'}`}>
      {message}
    </div>
  );
}

function Toggle({ checked, onChange, disabled }: { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={[
        'relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none disabled:opacity-50',
        checked ? '' : 'bg-stone-200',
      ].join(' ')}
      style={checked ? { background: 'var(--color-imperial)' } : undefined}
    >
      <span
        className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transform transition-transform duration-200 ${checked ? 'translate-x-4.5' : 'translate-x-0.5'}`}
        style={{ transition: 'transform 200ms' }}
      />
    </button>
  );
}

interface AddProductModalProps {
  brands: Brand[];
  categories: Category[];
  onClose: () => void;
  onSuccess: () => void;
  showToast: (msg: string, type: 'error' | 'success') => void;
}

function AddProductModal({ brands, categories, onClose, onSuccess, showToast }: AddProductModalProps) {
  const supabase = createClient();
  const [form, setForm] = useState({
    name: '',
    slug: '',
    brand_id: '',
    category_id: '',
    base_price: '',
  });
  const [saving, setSaving] = useState(false);

  function generateSlug(name: string) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  function handleNameChange(name: string) {
    setForm((f) => ({ ...f, name, slug: generateSlug(name) }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const price = parseFloat(form.base_price);
    if (!form.name.trim()) { showToast('Product name is required', 'error'); return; }
    if (!form.slug.trim()) { showToast('Slug is required', 'error'); return; }
    if (isNaN(price) || price < 0) { showToast('Invalid base price', 'error'); return; }

    setSaving(true);

    const { data: product, error: prodErr } = await supabase
      .from('products')
      .insert({
        name: form.name.trim(),
        slug: form.slug.trim(),
        base_price: price,
        brand_id: form.brand_id || null,
        category_id: form.category_id || null,
        is_active: false,
        is_featured: false,
        image_urls: [],
      })
      .select('id')
      .single();

    if (prodErr || !product) { showToast('Failed to create product: ' + prodErr?.message, 'error'); setSaving(false); return; }

    const { error: varErr } = await supabase.from('product_variants').insert({
      product_id: product.id,
      sku: `${form.slug.trim()}-default`,
      retail_price: price,
      stock_quantity: 0,
      is_active: true,
    });

    if (varErr) { showToast('Product created but default variant failed: ' + varErr.message, 'error'); }
    else { showToast('Product created', 'success'); }

    onSuccess();
    onClose();
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-base font-semibold text-stone-800 mb-5">Add New Product</h3>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">Product Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
              autoFocus
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">Slug <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-blue-400"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">Brand</label>
              <select
                value={form.brand_id}
                onChange={(e) => setForm((f) => ({ ...f, brand_id: e.target.value }))}
                className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
              >
                <option value="">— Select brand —</option>
                {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">Category</label>
              <select
                value={form.category_id}
                onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))}
                className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
              >
                <option value="">— Select category —</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">Base Price (AED) <span className="text-red-500">*</span></label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.base_price}
              onChange={(e) => setForm((f) => ({ ...f, base_price: e.target.value }))}
              className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
              required
            />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 rounded-lg border border-stone-200 text-sm text-stone-600 hover:bg-stone-50">Cancel</button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-60"
              style={{ background: 'var(--color-imperial)' }}
            >
              {saving ? 'Creating…' : 'Create product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface ExpandedEditorProps {
  product: Product;
  onProductChange: (updated: Partial<Product>) => void;
  onVariantChange: (variantId: string, updated: Partial<ProductVariant>) => void;
  showToast: (msg: string, type: 'error' | 'success') => void;
}

function ExpandedEditor({ product, onProductChange, onVariantChange, showToast }: ExpandedEditorProps) {
  const supabase = createClient();
  const [editName, setEditName] = useState(product.name);
  const [editPrice, setEditPrice] = useState(String(product.base_price));
  const [savingField, setSavingField] = useState<string | null>(null);
  const [priceTiers, setPriceTiers] = useState<PriceTier[]>([]);
  const [tiersLoading, setTiersLoading] = useState(false);
  const [variantEdits, setVariantEdits] = useState<Record<string, { stock: string; price: string }>>({});

  useEffect(() => {
    setEditName(product.name);
    setEditPrice(String(product.base_price));
  }, [product.id]);

  useEffect(() => {
    async function loadTiers() {
      setTiersLoading(true);
      const { data } = await supabase.from('price_tiers').select('*').eq('product_id', product.id).order('min_quantity');
      setPriceTiers((data ?? []) as PriceTier[]);
      setTiersLoading(false);
    }
    loadTiers();
  }, [product.id]);

  async function saveField(field: 'name' | 'base_price' | 'is_active' | 'is_featured', value: string | boolean) {
    setSavingField(field);
    const payload = field === 'base_price' ? { base_price: parseFloat(value as string) }
      : field === 'name' ? { name: (value as string).trim() }
      : { [field]: value };

    const { error } = await supabase.from('products').update(payload).eq('id', product.id);
    if (error) { showToast('Failed to update product', 'error'); }
    else {
      onProductChange(payload as Partial<Product>);
      showToast('Product updated', 'success');
    }
    setSavingField(null);
  }

  async function saveVariantStock(variant: ProductVariant) {
    const raw = variantEdits[variant.id]?.stock;
    const val = parseInt(raw ?? '');
    if (isNaN(val) || val < 0) { showToast('Invalid stock quantity', 'error'); return; }
    setSavingField(`stock_${variant.id}`);
    const { error } = await supabase.from('product_variants').update({ stock_quantity: val }).eq('id', variant.id);
    if (error) { showToast('Failed to update stock', 'error'); }
    else {
      onVariantChange(variant.id, { stock_quantity: val });
      setVariantEdits((e) => { const n = { ...e }; delete n[variant.id]; return n; });
      showToast('Stock updated', 'success');
    }
    setSavingField(null);
  }

  async function addTierRow() {
    const newTier: PriceTier = { min_quantity: 1, price: 0, label: '' };
    const { data, error } = await supabase.from('price_tiers').insert({ product_id: product.id, ...newTier }).select().single();
    if (error) { showToast('Failed to add tier', 'error'); return; }
    setPriceTiers((t) => [...t, data as PriceTier]);
  }

  async function saveTier(tier: PriceTier) {
    if (!tier.id) return;
    const { error } = await supabase.from('price_tiers').update({ min_quantity: tier.min_quantity, price: tier.price, label: tier.label }).eq('id', tier.id);
    if (error) { showToast('Failed to save tier', 'error'); }
    else { showToast('Tier saved', 'success'); }
  }

  async function removeTier(tierId: string) {
    const { error } = await supabase.from('price_tiers').delete().eq('id', tierId);
    if (error) { showToast('Failed to remove tier', 'error'); }
    else { setPriceTiers((t) => t.filter((x) => x.id !== tierId)); }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-5">
      {/* Left: basic fields */}
      <div className="space-y-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400">Product Fields</h4>

        {/* Name */}
        <div>
          <label className="block text-xs font-medium text-stone-600 mb-1">Name</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="flex-1 border border-stone-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
            <button
              onClick={() => saveField('name', editName)}
              disabled={savingField === 'name' || editName === product.name}
              className="px-3 py-1.5 rounded-lg bg-stone-800 text-white text-xs disabled:opacity-50"
            >
              {savingField === 'name' ? '…' : 'Save'}
            </button>
          </div>
        </div>

        {/* Base price */}
        <div>
          <label className="block text-xs font-medium text-stone-600 mb-1">Base Price (AED)</label>
          <div className="flex gap-2">
            <input
              type="number"
              min="0"
              step="0.01"
              value={editPrice}
              onChange={(e) => setEditPrice(e.target.value)}
              className="flex-1 border border-stone-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
            <button
              onClick={() => saveField('base_price', editPrice)}
              disabled={savingField === 'base_price' || editPrice === String(product.base_price)}
              className="px-3 py-1.5 rounded-lg bg-stone-800 text-white text-xs disabled:opacity-50"
            >
              {savingField === 'base_price' ? '…' : 'Save'}
            </button>
          </div>
        </div>

        {/* Toggles */}
        <div className="flex flex-col gap-3 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-sm text-stone-700">Active (visible in store)</span>
            <Toggle
              checked={product.is_active}
              disabled={savingField === 'is_active'}
              onChange={(v) => saveField('is_active', v)}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-stone-700">Featured</span>
            <Toggle
              checked={product.is_featured}
              disabled={savingField === 'is_featured'}
              onChange={(v) => saveField('is_featured', v)}
            />
          </div>
        </div>

        {/* Variants */}
        <div className="border-t border-stone-200 pt-4">
          <h5 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3">Variants</h5>
          {(product.variants ?? []).length === 0 && (
            <p className="text-xs text-stone-400">No variants.</p>
          )}
          <div className="space-y-3">
            {(product.variants ?? []).map((variant) => (
              <div key={variant.id} className="bg-white border border-stone-100 rounded-lg p-3 text-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-medium text-stone-700">{variant.sku}</span>
                  <span className={`px-1.5 py-0.5 rounded-full ${variant.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-100 text-stone-400'}`}>
                    {variant.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-stone-500 mb-2">
                  <span>Weight: {variant.weight ?? '—'} kg</span>
                  <span>Price: AED {variant.retail_price}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-stone-500">Stock:</span>
                  <input
                    type="number"
                    min="0"
                    value={variantEdits[variant.id]?.stock ?? String(variant.stock_quantity)}
                    onChange={(e) => setVariantEdits((prev) => ({
                      ...prev,
                      [variant.id]: { ...prev[variant.id], stock: e.target.value },
                    }))}
                    className="w-20 border border-stone-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-400"
                  />
                  <button
                    onClick={() => saveVariantStock(variant)}
                    disabled={
                      savingField === `stock_${variant.id}` ||
                      variantEdits[variant.id]?.stock === undefined ||
                      variantEdits[variant.id]?.stock === String(variant.stock_quantity)
                    }
                    className="px-2 py-1 rounded bg-stone-700 text-white text-xs disabled:opacity-50"
                  >
                    {savingField === `stock_${variant.id}` ? '…' : 'Update'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: price tiers */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400">Price Tiers</h4>
          <button
            onClick={addTierRow}
            className="text-xs px-2.5 py-1 rounded border border-stone-300 text-stone-600 hover:bg-stone-100 transition-colors"
          >
            + Add tier
          </button>
        </div>

        {tiersLoading ? (
          <div className="py-4 text-xs text-stone-400">Loading tiers…</div>
        ) : priceTiers.length === 0 ? (
          <p className="text-xs text-stone-400">No price tiers configured.</p>
        ) : (
          <div className="space-y-2">
            {priceTiers.map((tier, i) => (
              <div key={tier.id ?? i} className="bg-white border border-stone-100 rounded-lg p-3">
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <div>
                    <label className="block text-xs text-stone-400 mb-1">Min Qty</label>
                    <input
                      type="number"
                      min="1"
                      value={tier.min_quantity}
                      onChange={(e) => setPriceTiers((t) => t.map((x, j) => j === i ? { ...x, min_quantity: parseInt(e.target.value) || 1 } : x))}
                      className="w-full border border-stone-200 rounded px-2 py-1 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-stone-400 mb-1">Price (AED)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={tier.price}
                      onChange={(e) => setPriceTiers((t) => t.map((x, j) => j === i ? { ...x, price: parseFloat(e.target.value) || 0 } : x))}
                      className="w-full border border-stone-200 rounded px-2 py-1 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-stone-400 mb-1">Label</label>
                    <input
                      type="text"
                      value={tier.label}
                      onChange={(e) => setPriceTiers((t) => t.map((x, j) => j === i ? { ...x, label: e.target.value } : x))}
                      placeholder="e.g. Wholesale"
                      className="w-full border border-stone-200 rounded px-2 py-1 text-xs focus:outline-none"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => saveTier(tier)}
                    className="text-xs px-2.5 py-1 rounded bg-stone-700 text-white"
                  >
                    Save
                  </button>
                  {tier.id && (
                    <button
                      onClick={() => removeTier(tier.id!)}
                      className="text-xs px-2.5 py-1 rounded border border-red-200 text-red-600 hover:bg-red-50"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const router = useRouter();
  const supabase = createClient();

  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);
  const [addModal, setAddModal] = useState(false);
  const [bulkProcessing, setBulkProcessing] = useState(false);
  const [savingProduct, setSavingProduct] = useState<Record<string, boolean>>({});
  const [flashRow, setFlashRow] = useState<string | null>(null);

  const showToast = useCallback((message: string, type: 'error' | 'success') => {
    setToast({ message, type });
  }, []);

  const flashSuccess = (id: string) => {
    setFlashRow(id);
    setTimeout(() => setFlashRow(null), 1500);
  };

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace('/'); return; }
      const { data: profile } = await supabase.from('user_profiles').select('role').eq('user_id', user.id).single();
      const profileRole = (profile as { role?: string } | null)?.role;
      if (profileRole !== 'admin') { router.replace('/'); return; }

      await Promise.all([loadProducts(), loadBrandsCategories()]);
      setLoading(false);
    }
    init();
  }, []);

  async function loadProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('id, name, slug, base_price, is_active, is_featured, image_urls, created_at, brand_id, category_id, brand:brand_id(name), category:category_id(name), variants:product_variants(id, sku, weight, retail_price, stock_quantity, is_active)')
      .order('created_at', { ascending: false });

    if (error) { showToast('Failed to load products', 'error'); return; }

    const normalized = ((data ?? []) as unknown as Product[]).map((product) => ({
      ...product,
      brand: Array.isArray(product.brand) ? product.brand[0] : product.brand,
      category: Array.isArray(product.category) ? product.category[0] : product.category,
    }));

    setProducts(normalized);
  }

  async function loadBrandsCategories() {
    const [{ data: b }, { data: c }] = await Promise.all([
      supabase.from('brands').select('id, name').order('name'),
      supabase.from('categories').select('id, name').order('name'),
    ]);
    setBrands((b ?? []) as Brand[]);
    setCategories((c ?? []) as Category[]);
  }

  async function toggleProductField(productId: string, field: 'is_active' | 'is_featured', currentValue: boolean) {
    const newValue = !currentValue;
    setProducts((prev) => prev.map((p) => p.id === productId ? { ...p, [field]: newValue } : p));

    const { error } = await supabase.from('products').update({ [field]: newValue }).eq('id', productId);
    if (error) {
      setProducts((prev) => prev.map((p) => p.id === productId ? { ...p, [field]: currentValue } : p));
      showToast('Failed to update product', 'error');
    } else {
      flashSuccess(productId);
    }
  }

  async function bulkToggle(activate: boolean) {
    if (selected.size === 0) return;
    setBulkProcessing(true);
    const ids = Array.from(selected);

    setProducts((prev) => prev.map((p) => ids.includes(p.id) ? { ...p, is_active: activate } : p));

    const { error } = await supabase.from('products').update({ is_active: activate }).in('id', ids);
    if (error) {
      showToast('Bulk update failed', 'error');
      await loadProducts();
    } else {
      showToast(`${ids.length} product(s) ${activate ? 'activated' : 'deactivated'}`, 'success');
      setSelected(new Set());
    }
    setBulkProcessing(false);
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((p) => p.id)));
    }
  }

  const filtered = products.filter((p) => {
    const matchStatus = activeFilter === 'all' ? true : activeFilter === 'active' ? p.is_active : !p.is_active;
    const matchCategory = !categoryFilter || p.category_id === categoryFilter;
    const matchBrand = !brandFilter || p.brand_id === brandFilter;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchCategory && matchBrand && matchSearch;
  });

  const fmt = (v: number) => `AED ${v.toLocaleString('en-AE', { minimumFractionDigits: 2 })}`;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-7 h-7 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--color-imperial)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}
      {addModal && (
        <AddProductModal
          brands={brands}
          categories={categories}
          onClose={() => setAddModal(false)}
          onSuccess={loadProducts}
          showToast={showToast}
        />
      )}

      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-semibold text-stone-800">Products</h2>
          <p className="text-sm text-stone-500 mt-0.5">Manage the product catalog</p>
        </div>
        <button
          onClick={() => setAddModal(true)}
          className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-opacity"
          style={{ background: 'var(--color-imperial)' }}
        >
          + Add product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        {/* Status tabs */}
        <div className="flex rounded-lg border border-stone-200 overflow-hidden">
          {(['all', 'active', 'draft'] as ActiveFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={[
                'px-3 py-1.5 text-xs font-medium capitalize transition-colors',
                activeFilter === f ? 'text-white' : 'text-stone-600 hover:bg-stone-50',
              ].join(' ')}
              style={activeFilter === f ? { background: 'var(--color-imperial)' } : undefined}
            >
              {f === 'draft' ? 'Inactive' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Category filter */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border border-stone-200 rounded-lg px-3 py-1.5 text-xs text-stone-600 focus:outline-none focus:ring-1 focus:ring-blue-400"
        >
          <option value="">All categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        {/* Brand filter */}
        <select
          value={brandFilter}
          onChange={(e) => setBrandFilter(e.target.value)}
          className="border border-stone-200 rounded-lg px-3 py-1.5 text-xs text-stone-600 focus:outline-none focus:ring-1 focus:ring-blue-400"
        >
          <option value="">All brands</option>
          {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>

        {/* Search */}
        <div className="relative flex-1 min-w-[180px]">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name…"
            className="w-full border border-stone-200 rounded-lg px-3 py-1.5 text-xs text-stone-700 focus:outline-none focus:ring-1 focus:ring-blue-400 pl-8"
          />
          <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" fill="none" viewBox="0 0 16 16">
            <circle cx="6.5" cy="6.5" r="4" stroke="currentColor" strokeWidth="1.5" />
            <path d="m10 10 3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* Bulk actions */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 mb-3 px-3 py-2.5 bg-blue-50 border border-blue-200 rounded-lg text-sm">
          <span className="text-blue-700 font-medium">{selected.size} selected</span>
          <div className="flex gap-2 ml-auto">
            <button
              onClick={() => bulkToggle(true)}
              disabled={bulkProcessing}
              className="px-3 py-1.5 rounded text-xs font-medium text-white disabled:opacity-60"
              style={{ background: 'var(--color-imperial)' }}
            >
              Activate
            </button>
            <button
              onClick={() => bulkToggle(false)}
              disabled={bulkProcessing}
              className="px-3 py-1.5 rounded text-xs font-medium bg-stone-600 text-white disabled:opacity-60"
            >
              Deactivate
            </button>
            <button
              onClick={() => setSelected(new Set())}
              className="px-3 py-1.5 rounded text-xs border border-stone-300 text-stone-600"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg border border-stone-200 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-stone-100 bg-stone-50">
              <th className="px-4 py-3 w-8">
                <input
                  type="checkbox"
                  checked={filtered.length > 0 && selected.size === filtered.length}
                  onChange={toggleSelectAll}
                  className="rounded border-stone-300"
                />
              </th>
              <th className="text-left px-4 py-3 font-medium text-stone-600 w-12">Image</th>
              <th className="text-left px-4 py-3 font-medium text-stone-600">Name</th>
              <th className="text-left px-4 py-3 font-medium text-stone-600 hidden md:table-cell">Brand</th>
              <th className="text-left px-4 py-3 font-medium text-stone-600 hidden lg:table-cell">Category</th>
              <th className="text-right px-4 py-3 font-medium text-stone-600">Price</th>
              <th className="text-center px-4 py-3 font-medium text-stone-600">Active</th>
              <th className="text-center px-4 py-3 font-medium text-stone-600 hidden sm:table-cell">Featured</th>
              <th className="text-right px-4 py-3 font-medium text-stone-600 hidden md:table-cell">Stock</th>
              <th className="px-4 py-3 w-8" />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={10} className="px-4 py-10 text-center text-stone-400">No products found.</td>
              </tr>
            )}
            {filtered.map((product, idx) => {
              const firstVariant = product.variants?.[0];
              const stock = firstVariant?.stock_quantity ?? 0;
              const thumb = product.image_urls?.[0];

              return (
                <>
                  <tr
                    key={product.id}
                    className={[
                      'border-b border-stone-100 cursor-pointer transition-colors duration-150',
                      idx % 2 === 0 ? 'bg-white' : 'bg-stone-50/60',
                      expandedId === product.id ? 'bg-blue-50/30' : 'hover:bg-stone-50',
                      flashRow === product.id ? 'bg-emerald-50' : '',
                    ].join(' ')}
                  >
                    <td className="px-4 py-2.5" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selected.has(product.id)}
                        onChange={() => toggleSelect(product.id)}
                        className="rounded border-stone-300"
                      />
                    </td>
                    <td className="px-4 py-2.5" onClick={() => setExpandedId(expandedId === product.id ? null : product.id)}>
                      {thumb ? (
                        <div className="w-10 h-10 rounded overflow-hidden bg-stone-100 relative shrink-0">
                          <img src={thumb} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded bg-stone-100 flex items-center justify-center text-stone-300 text-xs">
                          —
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-2.5 font-medium text-stone-800" onClick={() => setExpandedId(expandedId === product.id ? null : product.id)}>
                      <div>{product.name}</div>
                      <div className="text-xs text-stone-400 font-mono">{product.slug}</div>
                    </td>
                    <td className="px-4 py-2.5 text-stone-600 hidden md:table-cell" onClick={() => setExpandedId(expandedId === product.id ? null : product.id)}>
                      {(product.brand as any)?.name ?? '—'}
                    </td>
                    <td className="px-4 py-2.5 text-stone-600 hidden lg:table-cell" onClick={() => setExpandedId(expandedId === product.id ? null : product.id)}>
                      {(product.category as any)?.name ?? '—'}
                    </td>
                    <td className="px-4 py-2.5 text-right text-stone-700" onClick={() => setExpandedId(expandedId === product.id ? null : product.id)}>
                      {fmt(product.base_price)}
                    </td>
                    <td className="px-4 py-2.5 text-center" onClick={(e) => e.stopPropagation()}>
                      <Toggle
                        checked={product.is_active}
                        onChange={() => toggleProductField(product.id, 'is_active', product.is_active)}
                        disabled={savingProduct[product.id]}
                      />
                    </td>
                    <td className="px-4 py-2.5 text-center hidden sm:table-cell" onClick={(e) => e.stopPropagation()}>
                      <Toggle
                        checked={product.is_featured}
                        onChange={() => toggleProductField(product.id, 'is_featured', product.is_featured)}
                        disabled={savingProduct[product.id]}
                      />
                    </td>
                    <td className="px-4 py-2.5 text-right text-stone-600 hidden md:table-cell" onClick={() => setExpandedId(expandedId === product.id ? null : product.id)}>
                      <span className={stock === 0 ? 'text-red-500' : 'text-stone-700'}>{stock}</span>
                    </td>
                    <td className="px-4 py-2.5 text-right" onClick={() => setExpandedId(expandedId === product.id ? null : product.id)}>
                      <svg
                        width="14" height="14" viewBox="0 0 14 14" fill="none"
                        className={`inline-block transition-transform duration-150 text-stone-400 ${expandedId === product.id ? 'rotate-180' : ''}`}
                      >
                        <path d="M2 5l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </td>
                  </tr>

                  {expandedId === product.id && (
                    <tr key={`${product.id}-expanded`} className="bg-slate-50/80 border-b border-stone-100">
                      <td colSpan={10} className="p-0">
                        <Suspense fallback={<div className="p-5 text-xs text-stone-400">Loading editor…</div>}>
                          <ExpandedEditor
                            product={product}
                            onProductChange={(updated) => {
                              setProducts((prev) => prev.map((p) => p.id === product.id ? { ...p, ...updated } : p));
                              flashSuccess(product.id);
                            }}
                            onVariantChange={(variantId, updated) => {
                              setProducts((prev) => prev.map((p) => {
                                if (p.id !== product.id) return p;
                                return {
                                  ...p,
                                  variants: (p.variants ?? []).map((v) =>
                                    v.id === variantId ? { ...v, ...updated } : v
                                  ),
                                };
                              }));
                            }}
                            showToast={showToast}
                          />
                        </Suspense>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
