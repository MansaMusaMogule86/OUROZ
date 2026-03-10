'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HeartIcon, UserIcon } from '@heroicons/react/24/outline';
import CartIconButton from '@/components/shop/CartIconButton';

const NAV_LINKS = [
    { href: '/shop', label: 'Shop' },
    { href: '/suppliers', label: 'Suppliers' },
    { href: '/journal', label: 'Journal' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
    const pathname = usePathname();

    return (
        <header className="sticky top-0 z-30 glass-dark border-b border-[var(--color-charcoal)]/[0.04]">
            <div className="max-w-7xl mx-auto px-5 sm:px-10 h-20 flex items-center justify-between">
                {/* Logo — raw serif text, no container */}
                <Link href="/" className="flex items-center gap-2 group shrink-0">
                    <span
                        className="text-2xl font-serif leading-none select-none transition-opacity group-hover:opacity-70"
                        style={{
                            color: '#913023',
                        }}
                    >
                        ⵣ
                    </span>
                    <span
                        className="text-[15px] font-serif tracking-[0.2em] uppercase text-[#1a1a1a]"
                        style={{ fontWeight: 600 }}
                    >
                        OUROZ
                    </span>
                </Link>

                {/* Center Nav — with dot separators */}
                <nav className="hidden md:flex items-center gap-0">
                    {NAV_LINKS.map((link, i) => {
                        const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
                        return (
                            <div key={link.href} className="flex items-center">
                                {i > 0 && (
                                    <span className="w-[3px] h-[3px] rounded-full bg-[var(--color-charcoal)]/10 mx-5" />
                                )}
                                <Link
                                    href={link.href}
                                    className={`relative text-[11px] font-medium uppercase tracking-[0.2em] transition-colors duration-300 ${isActive
                                        ? 'text-[var(--color-charcoal)]'
                                        : 'text-[var(--color-charcoal)]/35 hover:text-[var(--color-charcoal)]/70'
                                        }`}
                                >
                                    {link.label}
                                    {isActive && (
                                        <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[var(--color-imperial)]" />
                                    )}
                                </Link>
                            </div>
                        );
                    })}
                </nav>

                {/* Right actions */}
                <div className="flex items-center gap-1">
                    <Link
                        href="/wishlist"
                        className="p-2.5 text-[var(--color-charcoal)]/30 hover:text-[var(--color-charcoal)] transition-colors duration-300 hidden sm:block"
                        aria-label="Wishlist"
                    >
                        <HeartIcon className="w-[18px] h-[18px]" />
                    </Link>
                    <CartIconButton />
                    <Link
                        href="/auth/login"
                        className="ml-2 text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--color-charcoal)]/35 hover:text-[var(--color-charcoal)] transition-colors duration-300 hidden sm:block"
                    >
                        Sign In
                    </Link>
                </div>
            </div>

            {/* Mobile nav — minimal text links with underline indicator */}
            <div className="md:hidden flex items-center gap-6 px-5 pb-3 overflow-x-auto scrollbar-hide">
                {NAV_LINKS.map(link => {
                    const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`relative text-[10px] font-medium uppercase tracking-[0.18em] whitespace-nowrap transition-colors duration-300 pb-1 ${isActive
                                ? 'text-[var(--color-charcoal)]'
                                : 'text-[var(--color-charcoal)]/30'
                                }`}
                        >
                            {link.label}
                            {isActive && (
                                <span className="absolute bottom-0 left-0 right-0 h-px bg-[var(--color-charcoal)]" />
                            )}
                        </Link>
                    );
                })}
            </div>
        </header>
    );
}
