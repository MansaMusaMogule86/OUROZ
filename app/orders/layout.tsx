import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OurozBackground from '@/components/shared/OurozBackground';

export default function OrdersLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative min-h-screen bg-[var(--color-sahara)] overflow-hidden">
            <OurozBackground showArch={false} showWatermark showDunes={false} />
            <div className="relative z-10 flex min-h-screen flex-col">
                <Navbar />
                <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-10">
                    {children}
                </main>
                <Footer />
            </div>
        </div>
    );
}
