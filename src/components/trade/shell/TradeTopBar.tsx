'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { clsx } from 'clsx';

interface TradeTopBarProps {
    onCommandPalette?: () => void;
    sidebarCollapsed?: boolean;
}

function getBreadcrumbs(pathname: string): { label: string; href?: string }[] {
    const segments = pathname.replace('/trade', '').split('/').filter(Boolean);
    const crumbs: { label: string; href?: string }[] = [
        { label: 'Trade OS', href: '/trade' },
    ];

    const labelMap: Record<string, string> = {
        rfq: 'RFQ Engine',
        suppliers: 'Supplier Discovery',
        prices: 'Price Intelligence',
        logistics: 'Logistics Tracker',
        compliance: 'Compliance Vault',
        deals: 'Deal Room',
        new: 'New',
    };

    let path = '/trade';
    for (const seg of segments) {
        path += `/${seg}`;
        const label = labelMap[seg] || seg.charAt(0).toUpperCase() + seg.slice(1);
        crumbs.push({ label, href: path });
    }

    return crumbs;
}

export default function TradeTopBar({ onCommandPalette, sidebarCollapsed }: TradeTopBarProps) {
    const pathname = usePathname();
    const breadcrumbs = getBreadcrumbs(pathname);

    return (
        <header
            className={clsx(
                'sticky top-0 z-30 bg-[#FAF6F1]/80 backdrop-blur-md border-b border-stone-200/60 h-14 flex items-center justify-between px-6 transition-all',
                sidebarCollapsed ? 'ml-16' : 'ml-60',
            )}
        >
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-1.5">
                {breadcrumbs.map((crumb, i) => (
                    <span key={i} className="flex items-center gap-1.5">
                        {i > 0 && <span className="text-stone-300 text-xs">/</span>}
                        {i < breadcrumbs.length - 1 && crumb.href ? (
                            <Link
                                href={crumb.href}
                                className="text-[10px] font-medium uppercase tracking-[0.15em] text-stone-400 hover:text-stone-600 transition-colors"
                            >
                                {crumb.label}
                            </Link>
                        ) : (
                            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-stone-700">
                                {crumb.label}
                            </span>
                        )}
                    </span>
                ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-3">
                {/* Command palette trigger */}
                {onCommandPalette && (
                    <button
                        onClick={onCommandPalette}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-stone-400 hover:text-stone-600 hover:border-stone-300 transition-colors"
                    >
                        <span className="text-xs">Search...</span>
                        <kbd className="text-[9px] font-mono bg-stone-100 px-1.5 py-0.5 rounded text-stone-500">⌘K</kbd>
                    </button>
                )}

                {/* Notifications */}
                <button className="relative w-8 h-8 flex items-center justify-center rounded-lg text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition-colors">
                    <span className="text-sm">◎</span>
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500" />
                </button>
            </div>
        </header>
    );
}
