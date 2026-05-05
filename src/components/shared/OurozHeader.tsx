import Link from 'next/link';
import OurozMark from './OurozMark';

const NAV_LINKS = [
  { href: '/shop', label: 'SHOP' },
  { href: '/suppliers', label: 'SUPPLIERS' },
  { href: '/journal', label: 'JOURNAL' },
  { href: '/about', label: 'ABOUT' },
  { href: '/contact', label: 'CONTACT' },
];

export default function OurozHeader() {
  return (
    <header className="sticky top-0 w-full z-[60] bg-[var(--color-sahara)]/85 backdrop-blur-md border-b border-[var(--color-charcoal)]/[0.04]">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between px-8 lg:px-14 h-[72px]">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-full border border-[var(--color-charcoal)]/15 flex items-center justify-center overflow-hidden bg-white">
            <img src="/logo/logo.png" alt="OUROZ" className="w-[82%] h-[82%] object-contain" draggable={false} />
          </div>
          <span
            className="text-[15px] font-heading tracking-[0.35em] uppercase"
            style={{ fontWeight: 600 }}
          >
            OUROZ
          </span>
        </Link>

        {/* Center Nav */}
        <nav className="hidden lg:flex items-center gap-10">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[10px] font-body font-bold uppercase tracking-[0.22em] text-[var(--color-charcoal)]/50 hover:text-[var(--color-charcoal)] transition-colors duration-300"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right spacer for symmetry */}
        <div className="w-[100px] shrink-0" />
      </div>
    </header>
  );
}
