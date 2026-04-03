'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { TRADE_NAV_SECTIONS } from '@/lib/trade/trade-constants';

interface TradeSidebarProps {
    collapsed?: boolean;
    onToggle?: () => void;
}

export default function TradeSidebar({ collapsed = false, onToggle }: TradeSidebarProps) {
    const pathname = usePathname();

    return (
        <aside
            className={clsx(
                'fixed top-0 left-0 h-screen bg-[#0D0D0D] text-white z-40 flex flex-col transition-all duration-300 border-r border-white/5',
                collapsed ? 'w-16' : 'w-60',
            )}
        >
            {/* ── Logo ──────────────────────────────────────────── */}
            <div className="flex items-center gap-3 px-5 h-16 border-b border-white/8 flex-shrink-0">
                <span
                    className="text-xl"
                    style={{
                        fontFamily: 'serif',
                        background: 'linear-gradient(165deg, #D4AF37, #C4A882)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    ⵣ
                </span>
                {!collapsed && (
                    <span
                        className="text-xs tracking-[0.25em] font-semibold text-stone-300"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                        TRADE OS
                    </span>
                )}
            </div>

            {/* ── Navigation ────────────────────────────────────── */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5 scrollbar-hide">
                {TRADE_NAV_SECTIONS.map((section) => (
                    <div key={section.title}>
                        {!collapsed && (
                            <h4 className="text-[9px] font-semibold uppercase tracking-[0.25em] text-stone-600 px-2 mb-2">
                                {section.title}
                            </h4>
                        )}
                        <div className="space-y-0.5">
                            {section.items.map((item) => {
                                const isActive = pathname === item.href ||
                                    (item.href !== '/trade' && pathname.startsWith(item.href));
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={clsx(
                                            'flex items-center gap-3 rounded-lg transition-all duration-150',
                                            collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5',
                                            isActive
                                                ? 'bg-white/8 text-white'
                                                : 'text-stone-500 hover:text-stone-300 hover:bg-white/4',
                                        )}
                                        title={collapsed ? item.label : undefined}
                                    >
                                        <span className="text-sm flex-shrink-0 w-5 text-center">{item.icon}</span>
                                        {!collapsed && (
                                            <span className="text-[11px] font-medium tracking-wide">{item.label}</span>
                                        )}
                                        {isActive && !collapsed && (
                                            <span className="ml-auto w-1 h-1 rounded-full bg-amber-400" />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* ── Bottom toggle ──────────────────────────────────── */}
            <div className="border-t border-white/8 p-3 flex-shrink-0">
                <button
                    onClick={onToggle}
                    className="w-full flex items-center justify-center py-2 rounded-lg text-stone-600 hover:text-stone-400 hover:bg-white/4 transition-colors"
                >
                    <span className="text-sm">{collapsed ? '»' : '«'}</span>
                </button>
            </div>
        </aside>
    );
}
