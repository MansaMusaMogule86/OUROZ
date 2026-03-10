import Link from 'next/link';
import { cookies } from 'next/headers';
import { fetchCategories, fetchBrands, fetchProducts } from '@/lib/api';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import HomeClient from '@/components/HomeClient';

export const revalidate = 60;

export default async function HomePage() {
    const cookieStore = await cookies();
    void cookieStore;

    const [, , { products }] = await Promise.all([
        fetchCategories(),
        fetchBrands(),
        fetchProducts({ limit: 6 }),
    ]);

    const featuredProducts = products.slice(0, 6).map(p => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.base_price,
        image: p.image_urls?.[0] || 'https://placehold.co/300x300/C4A882/ffffff?text=Product',
    }));

    return (
        <div className="min-h-screen bg-[var(--color-sahara)]">
            <Navbar />

            {/* Client-side sections with framer-motion animations */}
            <HomeClient featuredProducts={featuredProducts} />

            <Footer />
        </div>
    );
}
