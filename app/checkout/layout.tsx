import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import OurozBackground from '@/components/shared/OurozBackground';

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative min-h-screen bg-[var(--color-sahara)] overflow-hidden">
            <OurozBackground showArch={false} showWatermark showDunes={false} />
            <div className="relative z-10 flex min-h-screen flex-col">
                <Navbar />
                <div className="flex-1">{children}</div>
                <Footer />
            </div>
        </div>
    );
}
