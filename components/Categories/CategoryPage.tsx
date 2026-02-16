
import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import { DUMMY_PRODUCTS } from '../../constants';
import ProductCard from '../ProductCard';

interface CategoryPageProps {
  categoryName: string;
  categorySlug: string;
  onBack: () => void;
  onAddToCart: (product: Product) => void;
  onViewProduct: (product: Product) => void;
  wishlist?: Product[];
  onToggleWishlist?: (product: Product) => void;
}

const CategoryPage: React.FC<CategoryPageProps> = ({ categoryName, categorySlug, onBack, onViewProduct, wishlist = [], onToggleWishlist }) => {
  const products = DUMMY_PRODUCTS.filter(p => p.category_slug === categorySlug && p.retailEnabled);
  const [isScrolled, setIsScrolled] = useState(false);
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'name'>('default');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  const isInWishlist = (id: string) => wishlist.some(p => p.id === id);

  return (
    <div className="animate-fade-in">
      {/* Dynamic Header */}
      <div className={`fixed top-16 left-0 right-0 z-40 bg-white/80 backdrop-blur border-b border-gray-100 transition-all ${isScrolled ? 'py-2 opacity-100 translate-y-0' : 'py-4 opacity-0 -translate-y-4'}`}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">←</button>
            <h2 className="text-xl font-bold font-serif">{categoryName}</h2>
          </div>
          <p className="text-sm text-gray-500 font-medium">{products.length} Items Found</p>
        </div>
      </div>

      <div className="mb-12">
        <button onClick={onBack} className="flex items-center gap-2 text-gold font-bold mb-6 hover:translate-x-1 transition-transform heading-vogue text-[10px] tracking-[0.3em]">
          <span>←</span> Back to Collective
        </button>

        <div className="relative rounded-[3rem] overflow-hidden bg-slate-900 h-96 shadow-luxury group border border-gold/10">
          <img
            src={`https://picsum.photos/seed/${categorySlug}/1200/600`}
            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
            alt={categoryName}
          />
          <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-12 text-center">
            <span className="heading-vogue text-[10px] uppercase tracking-[0.5em] mb-4 text-gold">Premium Moroccan Selection</span>
            <h1 className="heading-vogue text-6xl mb-4">{categoryName}</h1>
            <p className="text-xl max-w-2xl opacity-90 font-serif font-light italic leading-relaxed">
              Discover authentic {categoryName.toLowerCase()} sourced directly from artisan collectives across the Kingdom.
            </p>
          </div>
          <div className="absolute bottom-8 right-8 flex gap-4">
            <div className="bg-white/10 backdrop-blur px-4 py-2 rounded-full text-xs font-bold border border-white/20">
              Verified Origin
            </div>
            <div className="bg-white/10 backdrop-blur px-4 py-2 rounded-full text-xs font-bold border border-white/20">
              Direct Shipping
            </div>
          </div>
        </div>
      </div>

      {/* Sort Controls */}
      <div className="flex items-center justify-between mb-8">
        <p className="text-sm text-henna/40 font-medium">{sortedProducts.length} products</p>
        <div className="flex items-center gap-3">
          <span className="text-[9px] font-black text-henna/30 uppercase tracking-widest">Sort by</span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as typeof sortBy)}
            className="px-4 py-2 rounded-xl border border-gold/20 bg-sahara/30 text-sm font-serif text-henna focus:ring-2 focus:ring-gold/10 outline-none"
          >
            <option value="default">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 mb-20">
        {sortedProducts.map(p => (
          <ProductCard
            key={p.id}
            product={p}
            onViewDetail={onViewProduct}
            onToggleWishlist={onToggleWishlist}
            isInWishlist={isInWishlist(p.id)}
          />
        ))}
      </div>

      {/* Featured AI Content Section */}
      <div className="glass-vogue rounded-[3rem] p-16 mb-20 border border-gold/10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="heading-vogue text-3xl text-henna">Experience {categoryName}</h2>
            <p className="text-lg text-henna/50 font-serif italic leading-relaxed">
              We use advanced AI to visualize the journey of our {categoryName.toLowerCase()} from the foothills of the Atlas Mountains to modern homes worldwide.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center text-gold">🎥</div>
                <div>
                  <p className="font-bold text-henna">Atmospheric Video Previews</p>
                  <p className="text-sm text-henna/40">Immersive clips showing product textures and usage.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center text-gold">🪄</div>
                <div>
                  <p className="font-bold text-henna">AI Personalization</p>
                  <p className="text-sm text-henna/40">Visualize these items in your own space using our AI Studio.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative rounded-3xl overflow-hidden aspect-video shadow-luxury bg-black border border-gold/10">
             <img src={`https://picsum.photos/seed/${categorySlug}-video/800/450`} className="w-full h-full object-cover opacity-80" alt="Video preview" />
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-gold shadow-xl cursor-pointer hover:scale-110 transition-transform">
                   <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
