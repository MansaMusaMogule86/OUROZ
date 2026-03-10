import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function CartLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[var(--color-sahara)]">
            <Navbar />
            {children}
            <Footer />
        </div>
    );
}
