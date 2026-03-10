import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[var(--color-sahara)]">
            <Navbar />
            <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
                {children}
            </main>
            <Footer />
        </div>
    );
}
