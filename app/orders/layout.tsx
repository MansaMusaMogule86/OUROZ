import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function OrdersLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[var(--color-sahara)]">
            <Navbar />
            <main className="max-w-4xl mx-auto px-4 py-8">
                {children}
            </main>
            <Footer />
        </div>
    );
}
