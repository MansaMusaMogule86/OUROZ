import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ProductLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[var(--color-sahara)]">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                {children}
            </main>
            <Footer />
        </div>
    );
}
