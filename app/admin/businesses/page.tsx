'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';

type BusinessStatus = 'pending' | 'approved' | 'rejected';

interface Business {
  id: string;
  name: string;
  legal_name: string | null;
  business_type: string | null;
  contact_email: string;
  status: BusinessStatus;
  created_at: string;
  trade_license_url: string | null;
  address: string | null;
  phone: string | null;
  rejection_reason: string | null;
  approved_at: string | null;
  approved_by: string | null;
}

interface AdminNote {
  id: string;
  content: string;
  created_at: string;
  created_by: string;
  author_email?: string;
}

type FilterTab = 'all' | BusinessStatus;

function StatusBadge({ status }: { status: BusinessStatus }) {
  const map: Record<BusinessStatus, { bg: string; text: string; label: string }> = {
    pending:  { bg: 'bg-amber-50 border border-amber-200',  text: 'text-amber-700',  label: 'Pending' },
    approved: { bg: 'bg-emerald-50 border border-emerald-200', text: 'text-emerald-700', label: 'Approved' },
    rejected: { bg: 'bg-red-50 border border-red-200',     text: 'text-red-700',    label: 'Rejected' },
  };
  const s = map[status];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>
      {s.label}
    </span>
  );
}

function Toast({ message, type, onDismiss }: { message: string; type: 'error' | 'success'; onDismiss: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 4000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div
      className={`fixed bottom-5 right-5 z-50 max-w-sm px-4 py-3 rounded-lg shadow-lg text-sm font-medium transition-all duration-300 ${
        type === 'error' ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'
      }`}
    >
      {message}
    </div>
  );
}

export default function BusinessesPage() {
  const router = useRouter();
  const supabase = createClient();

  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterTab>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [processing, setProcessing] = useState<Record<string, boolean>>({});
  const [rejectReason, setRejectReason] = useState<Record<string, string>>({});
  const [noteContent, setNoteContent] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState<Record<string, AdminNote[]>>({});
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);
  const [adminId, setAdminId] = useState<string>('');
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

      const { data: profile } = await supabase
        .from('user_profiles').select('role').eq('user_id', user.id).single();
      const profileRole = (profile as { role?: string } | null)?.role;
      if (profileRole !== 'admin') { router.replace('/'); return; }

      setAdminId(user.id);
      await fetchBusinesses();
      setLoading(false);
    }
    init();
  }, []);

  async function fetchBusinesses() {
    const { data, error } = await supabase
      .from('businesses')
      .select('id, name, legal_name, business_type, contact_email, status, created_at, trade_license_url, address, phone, rejection_reason, approved_at, approved_by')
      .order('created_at', { ascending: false });

    if (error) { showToast('Failed to load businesses', 'error'); return; }
    setBusinesses((data ?? []) as Business[]);
  }

  async function fetchNotes(businessId: string) {
    const { data } = await supabase
      .from('admin_notes')
      .select('id, content, created_at, created_by')
      .eq('entity_id', businessId)
      .eq('entity_type', 'business')
      .order('created_at', { ascending: false });
    setNotes((prev) => ({ ...prev, [businessId]: (data ?? []) as AdminNote[] }));
  }

  function toggleRow(id: string) {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      fetchNotes(id);
    }
  }

  async function approveBusiness(id: string) {
    setProcessing((p) => ({ ...p, [id]: true }));
    const { error } = await supabase
      .from('businesses')
      .update({ status: 'approved', approved_at: new Date().toISOString(), approved_by: adminId })
      .eq('id', id);

    if (error) { showToast('Failed to approve business', 'error'); }
    else {
      await supabase.from('credit_accounts').upsert(
        { business_id: id, credit_limit: 0, terms_days: 30, status: 'active' },
        { onConflict: 'business_id', ignoreDuplicates: true }
      );
      setBusinesses((prev) => prev.map((b) => b.id === id ? { ...b, status: 'approved' as BusinessStatus } : b));
      showToast('Business approved and credit account created', 'success');
      flashSuccess(id);
    }
    setProcessing((p) => ({ ...p, [id]: false }));
  }

  async function rejectBusiness(id: string) {
    const reason = rejectReason[id]?.trim();
    if (!reason) { showToast('Please enter a rejection reason', 'error'); return; }

    setProcessing((p) => ({ ...p, [id]: true }));
    const { error } = await supabase
      .from('businesses')
      .update({ status: 'rejected', rejection_reason: reason })
      .eq('id', id);

    if (error) { showToast('Failed to reject business', 'error'); }
    else {
      setBusinesses((prev) => prev.map((b) => b.id === id ? { ...b, status: 'rejected' as BusinessStatus, rejection_reason: reason } : b));
      setRejectReason((r) => ({ ...r, [id]: '' }));
      showToast('Business rejected', 'success');
      flashSuccess(id);
    }
    setProcessing((p) => ({ ...p, [id]: false }));
  }

  async function reapproveBusiness(id: string) {
    setProcessing((p) => ({ ...p, [id]: true }));
    const { error } = await supabase
      .from('businesses')
      .update({ status: 'approved', approved_at: new Date().toISOString(), approved_by: adminId, rejection_reason: null })
      .eq('id', id);

    if (error) { showToast('Failed to re-approve business', 'error'); }
    else {
      setBusinesses((prev) => prev.map((b) => b.id === id ? { ...b, status: 'approved' as BusinessStatus, rejection_reason: null } : b));
      showToast('Business re-approved', 'success');
      flashSuccess(id);
    }
    setProcessing((p) => ({ ...p, [id]: false }));
  }

  async function saveNote(businessId: string) {
    const content = noteContent[businessId]?.trim();
    if (!content) return;

    setProcessing((p) => ({ ...p, [`note_${businessId}`]: true }));
    const { error } = await supabase.from('admin_notes').insert({
      entity_id: businessId,
      entity_type: 'business',
      content,
      created_by: adminId,
    });

    if (error) { showToast('Failed to save note', 'error'); }
    else {
      setNoteContent((n) => ({ ...n, [businessId]: '' }));
      await fetchNotes(businessId);
      showToast('Note saved', 'success');
    }
    setProcessing((p) => ({ ...p, [`note_${businessId}`]: false }));
  }

  const filteredBusinesses = filter === 'all'
    ? businesses
    : businesses.filter((b) => b.status === filter);

  const pendingCount = businesses.filter((b) => b.status === 'pending').length;

  const tabs: { key: FilterTab; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'approved', label: 'Approved' },
    { key: 'rejected', label: 'Rejected' },
  ];

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

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-stone-800">Businesses</h2>
        <p className="text-sm text-stone-500 mt-0.5">Review and manage business registrations</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-5 border-b border-stone-200">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={[
              'px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors duration-150 flex items-center gap-1.5',
              filter === tab.key
                ? 'border-[var(--color-imperial)] text-stone-800'
                : 'border-transparent text-stone-500 hover:text-stone-700',
            ].join(' ')}
          >
            {tab.label}
            {tab.key === 'pending' && pendingCount > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold text-white" style={{ background: 'var(--color-imperial)' }}>
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-stone-200 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-stone-100 bg-stone-50">
              <th className="text-left px-4 py-3 font-medium text-stone-600">Name</th>
              <th className="text-left px-4 py-3 font-medium text-stone-600 hidden md:table-cell">Legal Name</th>
              <th className="text-left px-4 py-3 font-medium text-stone-600 hidden lg:table-cell">Type</th>
              <th className="text-left px-4 py-3 font-medium text-stone-600 hidden sm:table-cell">Email</th>
              <th className="text-left px-4 py-3 font-medium text-stone-600">Status</th>
              <th className="text-left px-4 py-3 font-medium text-stone-600 hidden md:table-cell">Registered</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {filteredBusinesses.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-stone-400 text-sm">
                  No businesses found.
                </td>
              </tr>
            )}
            {filteredBusinesses.map((biz, idx) => (
              <>
                <tr
                  key={biz.id}
                  className={[
                    'border-b border-stone-100 cursor-pointer transition-colors duration-150',
                    idx % 2 === 0 ? 'bg-white' : 'bg-stone-50/60',
                    expandedId === biz.id ? 'bg-blue-50/40' : 'hover:bg-stone-50',
                    flashRow === biz.id ? 'bg-emerald-50' : '',
                  ].join(' ')}
                  onClick={() => toggleRow(biz.id)}
                >
                  <td className="px-4 py-3 font-medium text-stone-800">{biz.name}</td>
                  <td className="px-4 py-3 text-stone-600 hidden md:table-cell">{biz.legal_name || '—'}</td>
                  <td className="px-4 py-3 text-stone-600 hidden lg:table-cell capitalize">{biz.business_type || '—'}</td>
                  <td className="px-4 py-3 text-stone-600 hidden sm:table-cell">{biz.contact_email}</td>
                  <td className="px-4 py-3"><StatusBadge status={biz.status} /></td>
                  <td className="px-4 py-3 text-stone-500 hidden md:table-cell">
                    {new Date(biz.created_at).toLocaleDateString('en-AE', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <svg
                      width="14" height="14" viewBox="0 0 14 14" fill="none"
                      className={`inline-block transition-transform duration-150 text-stone-400 ${expandedId === biz.id ? 'rotate-180' : ''}`}
                    >
                      <path d="M2 5l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </td>
                </tr>

                {expandedId === biz.id && (
                  <tr key={`${biz.id}-expanded`} className="bg-slate-50/80">
                    <td colSpan={7} className="px-5 py-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left: details */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3">Business Details</h4>
                          <DetailRow label="Contact Email" value={biz.contact_email} />
                          <DetailRow label="Phone" value={biz.phone || '—'} />
                          <DetailRow label="Address" value={biz.address || '—'} />
                          {biz.trade_license_url && (
                            <div className="flex gap-2 text-sm">
                              <span className="text-stone-400 w-36 shrink-0">Trade License</span>
                              <a href={biz.trade_license_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline truncate">
                                View document
                              </a>
                            </div>
                          )}
                          {biz.rejection_reason && (
                            <div className="mt-2 p-3 rounded bg-red-50 border border-red-100 text-sm text-red-700">
                              <span className="font-medium">Rejection reason: </span>{biz.rejection_reason}
                            </div>
                          )}
                        </div>

                        {/* Right: actions */}
                        <div className="space-y-4">
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3">Actions</h4>

                          {biz.status === 'pending' && (
                            <div className="space-y-3">
                              <div className="flex gap-2">
                                <button
                                  disabled={processing[biz.id]}
                                  onClick={(e) => { e.stopPropagation(); approveBusiness(biz.id); }}
                                  className="flex-1 px-4 py-2 rounded text-sm font-medium text-white transition-opacity disabled:opacity-60"
                                  style={{ background: 'var(--color-imperial)' }}
                                >
                                  {processing[biz.id] ? 'Approving…' : 'Approve'}
                                </button>
                              </div>
                              <div className="flex flex-col gap-2">
                                <textarea
                                  rows={2}
                                  placeholder="Rejection reason (required)"
                                  value={rejectReason[biz.id] || ''}
                                  onChange={(e) => setRejectReason((r) => ({ ...r, [biz.id]: e.target.value }))}
                                  onClick={(e) => e.stopPropagation()}
                                  className="w-full border border-stone-200 rounded px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-red-400"
                                />
                                <button
                                  disabled={processing[biz.id]}
                                  onClick={(e) => { e.stopPropagation(); rejectBusiness(biz.id); }}
                                  className="px-4 py-2 rounded text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-60"
                                >
                                  {processing[biz.id] ? 'Rejecting…' : 'Reject'}
                                </button>
                              </div>
                            </div>
                          )}

                          {biz.status === 'approved' && (
                            <div className="flex gap-2">
                              <a
                                href={`/admin/credit?business=${biz.id}`}
                                onClick={(e) => e.stopPropagation()}
                                className="px-4 py-2 rounded text-sm font-medium border border-stone-300 text-stone-700 hover:bg-stone-100 transition-colors"
                              >
                                View Credit
                              </a>
                            </div>
                          )}

                          {biz.status === 'rejected' && (
                            <button
                              disabled={processing[biz.id]}
                              onClick={(e) => { e.stopPropagation(); reapproveBusiness(biz.id); }}
                              className="px-4 py-2 rounded text-sm font-medium text-white transition-opacity disabled:opacity-60"
                              style={{ background: 'var(--color-imperial)' }}
                            >
                              {processing[biz.id] ? 'Processing…' : 'Re-approve'}
                            </button>
                          )}

                          {/* Admin notes */}
                          <div className="border-t border-stone-200 pt-4 mt-2">
                            <h5 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">Admin Notes</h5>
                            <div className="flex flex-col gap-2 mb-3">
                              <textarea
                                rows={2}
                                placeholder="Add a note…"
                                value={noteContent[biz.id] || ''}
                                onChange={(e) => setNoteContent((n) => ({ ...n, [biz.id]: e.target.value }))}
                                onClick={(e) => e.stopPropagation()}
                                className="w-full border border-stone-200 rounded px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-blue-400"
                              />
                              <button
                                disabled={processing[`note_${biz.id}`] || !noteContent[biz.id]?.trim()}
                                onClick={(e) => { e.stopPropagation(); saveNote(biz.id); }}
                                className="self-end px-3 py-1.5 rounded text-xs font-medium bg-stone-800 text-white hover:bg-stone-700 transition-colors disabled:opacity-50"
                              >
                                {processing[`note_${biz.id}`] ? 'Saving…' : 'Save note'}
                              </button>
                            </div>
                            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                              {(notes[biz.id] ?? []).length === 0 && (
                                <p className="text-xs text-stone-400">No notes yet.</p>
                              )}
                              {(notes[biz.id] ?? []).map((note) => (
                                <div key={note.id} className="text-xs bg-white border border-stone-100 rounded p-2">
                                  <p className="text-stone-700 mb-0.5">{note.content}</p>
                                  <p className="text-stone-400">
                                    {new Date(note.created_at).toLocaleString('en-AE', { dateStyle: 'short', timeStyle: 'short' })}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2 text-sm">
      <span className="text-stone-400 w-36 shrink-0">{label}</span>
      <span className="text-stone-700">{value}</span>
    </div>
  );
}
