'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const NAV_ITEMS = [
  { label: 'Dashboard',         href: '/admin',                icon: '◈' },
  { label: 'Businesses',        href: '/admin/businesses',     icon: '⬡' },
  { label: 'Credit',            href: '/admin/credit',         icon: '◇' },
  { label: 'Invoices',          href: '/admin/invoices',       icon: '◻' },
  { label: 'Risk & Limits',     href: '/admin/risk',           icon: '◐' },
  { label: 'Products',          href: '/admin/products',       icon: '⬢' },
  { label: 'Brands',            href: '/admin/brands',         icon: '◍' },
  { label: 'Suppliers',         href: '/admin/suppliers',      icon: '◈', phase: 'C' },
  { label: 'Subscriptions',     href: '/admin/subscriptions',  icon: '◉', phase: 'B' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [userEmail, setUserEmail] = useState<string>('');
  const [checking, setChecking] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function verifyAdmin() {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        router.replace('/');
        return;
      }

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('user_id', user.id)
        .single();
      const profileRole = (profile as { role?: string } | null)?.role;

      if (profileRole !== 'admin') {
        router.replace('/');
        return;
      }

      setUserEmail(user.email ?? '');
      setChecking(false);
    }

    verifyAdmin();
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.replace('/');
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-charcoal)' }}>
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: 'var(--color-gold)', borderTopColor: 'transparent' }}
          />
          <span className="text-sm" style={{ color: 'var(--color-sahara)' }}>Verifying access…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#f8f7f4' }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={[
          'fixed top-0 left-0 h-full z-30 flex flex-col transition-all duration-200',
          'bg-[#1a1612] border-r border-[#2e2a25]',
          sidebarOpen ? 'w-60' : 'w-14 md:w-60',
        ].join(' ')}
      >
        {/* Sidebar header */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-[#2e2a25] shrink-0">
          <div
            className="w-7 h-7 rounded-sm flex items-center justify-center text-xs font-bold shrink-0"
            style={{ background: 'var(--color-imperial)', color: '#fff' }}
          >
            أ
          </div>
          <span
            className={[
              'text-sm font-semibold tracking-wide transition-opacity duration-200 whitespace-nowrap overflow-hidden',
              sidebarOpen ? 'opacity-100' : 'opacity-0 md:opacity-100',
            ].join(' ')}
            style={{ color: 'var(--color-gold)' }}
          >
            OUROZ Admin
          </span>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  'flex items-center gap-3 px-4 py-2.5 mx-2 rounded-md text-sm transition-colors duration-150 group relative',
                  isActive
                    ? 'text-white'
                    : 'text-[#9e9791] hover:text-white hover:bg-white/5',
                ].join(' ')}
                style={isActive ? { background: 'var(--color-imperial)', color: '#fff' } : undefined}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="text-base shrink-0 w-5 text-center">{item.icon}</span>
                <span
                  className={[
                    'whitespace-nowrap transition-opacity duration-200',
                    sidebarOpen ? 'opacity-100' : 'opacity-0 md:opacity-100',
                  ].join(' ')}
                >
                  {item.label}
                  {item.phase && (
                    <span className="ml-1.5 text-[10px] px-1 py-0.5 rounded" style={{ background: '#2e2a25', color: 'var(--color-sahara)' }}>
                      Phase {item.phase}
                    </span>
                  )}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* User footer */}
        <div className="px-4 py-4 border-t border-[#2e2a25] shrink-0">
          <div
            className={[
              'flex items-center gap-2 transition-opacity duration-200',
              sidebarOpen ? 'opacity-100' : 'opacity-0 md:opacity-100',
            ].join(' ')}
          >
            <div className="w-6 h-6 rounded-full bg-[#2e2a25] flex items-center justify-center text-xs" style={{ color: 'var(--color-gold)' }}>
              {userEmail.charAt(0).toUpperCase()}
            </div>
            <span className="text-xs text-[#9e9791] truncate flex-1">{userEmail}</span>
          </div>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col ml-14 md:ml-60 min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-10 bg-white border-b border-stone-200 flex items-center justify-between px-5 py-3 shrink-0">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-1 rounded text-stone-500 hover:bg-stone-100"
              onClick={() => setSidebarOpen((o) => !o)}
              aria-label="Toggle sidebar"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
                <rect x="1" y="3" width="16" height="2" rx="1" />
                <rect x="1" y="8" width="16" height="2" rx="1" />
                <rect x="1" y="13" width="16" height="2" rx="1" />
              </svg>
            </button>
            <h1 className="text-sm font-semibold text-stone-800 tracking-wide">Admin Panel</h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:block text-xs text-stone-500">{userEmail}</span>
            <button
              onClick={handleSignOut}
              className="text-xs px-3 py-1.5 rounded border transition-colors duration-150 text-stone-600 border-stone-300 hover:bg-stone-100"
            >
              Sign out
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-5 md:p-7">
          {children}
        </main>
      </div>
    </div>
  );
}
