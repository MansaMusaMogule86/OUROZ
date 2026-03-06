'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';

type ToastType = 'success' | 'error';

interface BrandRow {
  id: string;
  slug: string;
  name: string;
  logo_url: string | null;
  is_active: boolean;
}

function Toast({ message, type, onDismiss }: { message: string; type: ToastType; onDismiss: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3500);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      className={`fixed bottom-5 right-5 z-50 max-w-sm rounded-lg px-4 py-3 text-sm font-medium shadow-lg ${
        type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
      }`}
    >
      {message}
    </div>
  );
}

export default function AdminBrandsPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [brands, setBrands] = useState<BrandRow[]>([]);
  const [search, setSearch] = useState('');
  const [draftUrls, setDraftUrls] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  useEffect(() => {
    void init();
  }, []);

  async function init() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace('/');
      return;
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    const role = (profile as { role?: string } | null)?.role;
    if (role !== 'admin') {
      router.replace('/');
      return;
    }

    await loadBrands();
    setLoading(false);
  }

  async function loadBrands() {
    const { data, error } = await supabase
      .from('brands')
      .select('id, slug, name, logo_url, is_active')
      .order('name', { ascending: true });

    if (error || !data) {
      showToast('Failed to load brands', 'error');
      return;
    }

    const rows = data as BrandRow[];
    setBrands(rows);

    const nextDrafts: Record<string, string> = {};
    for (const row of rows) {
      nextDrafts[row.id] = row.logo_url ?? '';
    }
    setDraftUrls(nextDrafts);
  }

  function showToast(message: string, type: ToastType) {
    setToast({ message, type });
  }

  async function saveLogoUrl(brandId: string) {
    const logoUrl = (draftUrls[brandId] ?? '').trim();
    setSavingId(brandId);

    const { error } = await supabase
      .from('brands')
      .update({ logo_url: logoUrl.length > 0 ? logoUrl : null })
      .eq('id', brandId);

    if (error) {
      showToast('Failed to save logo URL', 'error');
      setSavingId(null);
      return;
    }

    setBrands((prev) =>
      prev.map((brand) =>
        brand.id === brandId ? { ...brand, logo_url: logoUrl.length > 0 ? logoUrl : null } : brand
      )
    );

    showToast('Logo updated', 'success');
    setSavingId(null);
  }

  async function handleFileUpload(brand: BrandRow, file: File | null) {
    if (!file) return;

    setUploadingId(brand.id);

    const ext = (file.name.split('.').pop() || 'png').toLowerCase();
    const safeSlug = brand.slug.replace(/[^a-z0-9-]/gi, '').toLowerCase();
    const path = `${safeSlug}/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('brand-logos')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      showToast('Upload failed. Check bucket name/policies for brand-logos.', 'error');
      setUploadingId(null);
      return;
    }

    const { data: publicData } = supabase.storage.from('brand-logos').getPublicUrl(path);
    const publicUrl = publicData.publicUrl;

    setDraftUrls((prev) => ({ ...prev, [brand.id]: publicUrl }));

    const { error: updateError } = await supabase
      .from('brands')
      .update({ logo_url: publicUrl })
      .eq('id', brand.id);

    if (updateError) {
      showToast('Uploaded, but failed to save DB URL', 'error');
      setUploadingId(null);
      return;
    }

    setBrands((prev) => prev.map((b) => (b.id === brand.id ? { ...b, logo_url: publicUrl } : b)));
    showToast('Logo uploaded and linked', 'success');
    setUploadingId(null);
  }

  const filteredBrands = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return brands;
    return brands.filter((brand) => brand.name.toLowerCase().includes(q) || brand.slug.toLowerCase().includes(q));
  }, [brands, search]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" style={{ borderColor: 'var(--color-imperial)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-stone-800">Brand Logos</h2>
          <p className="text-sm text-stone-500">Upload logos or paste direct URLs. Changes are reflected on the Shop brand ticker.</p>
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search brand..."
          className="w-full sm:w-72 rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-imperial)]"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-stone-100 bg-stone-50">
              <th className="px-4 py-3 text-left font-medium text-stone-600">Brand</th>
              <th className="px-4 py-3 text-left font-medium text-stone-600">Preview</th>
              <th className="px-4 py-3 text-left font-medium text-stone-600">Logo URL</th>
              <th className="px-4 py-3 text-left font-medium text-stone-600">Upload</th>
              <th className="px-4 py-3 text-right font-medium text-stone-600">Save</th>
            </tr>
          </thead>
          <tbody>
            {filteredBrands.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-stone-400">
                  No brands found.
                </td>
              </tr>
            )}

            {filteredBrands.map((brand) => {
              const draft = draftUrls[brand.id] ?? '';
              return (
                <tr key={brand.id} className="border-b border-stone-100 last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-medium text-stone-800">{brand.name}</p>
                    <p className="font-mono text-xs text-stone-400">{brand.slug}</p>
                  </td>

                  <td className="px-4 py-3">
                    <div className="h-12 w-20 overflow-hidden rounded-lg border border-stone-200 bg-stone-50">
                      {draft ? (
                        <img src={draft} alt={`${brand.name} logo`} className="h-full w-full object-contain" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-stone-400">No logo</div>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={draft}
                      onChange={(e) => setDraftUrls((prev) => ({ ...prev, [brand.id]: e.target.value }))}
                      placeholder="https://..."
                      className="w-full rounded-lg border border-stone-200 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[var(--color-imperial)]"
                    />
                  </td>

                  <td className="px-4 py-3">
                    <label className="inline-flex cursor-pointer items-center rounded-lg border border-stone-200 px-3 py-2 text-xs text-stone-600 hover:bg-stone-50">
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/svg+xml"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0] ?? null;
                          void handleFileUpload(brand, file);
                          e.currentTarget.value = '';
                        }}
                      />
                      {uploadingId === brand.id ? 'Uploading...' : 'Upload file'}
                    </label>
                  </td>

                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => void saveLogoUrl(brand.id)}
                      disabled={savingId === brand.id}
                      className="rounded-lg px-3 py-2 text-xs font-medium text-white disabled:opacity-60"
                      style={{ background: 'var(--color-imperial)' }}
                    >
                      {savingId === brand.id ? 'Saving...' : 'Save'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
