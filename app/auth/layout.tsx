import Link from 'next/link';
import OurozBackground from '@/components/shared/OurozBackground';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative min-h-screen bg-[var(--color-sahara)] overflow-hidden">
            <OurozBackground showArch={false} showWatermark showDunes={false} />
            <div className="relative z-10 flex min-h-screen flex-col">
                {/* Minimal header — logo only, no nav */}
                <header className="w-full px-8 lg:px-14 py-7">
                    <Link href="/" className="inline-flex items-center gap-3">
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
                </header>

                <main className="flex-1 flex items-center justify-center px-6 py-10">
                    <div className="w-full max-w-md">{children}</div>
                </main>

                <footer className="px-8 py-8 text-center text-[10px] uppercase tracking-[0.28em] text-[var(--color-charcoal)]/40">
                    © {new Date().getFullYear()} Ouroz · Atlas to Table
                </footer>
            </div>
        </div>
    );
}
