
import React, { useState, useEffect } from 'react';
import { DUMMY_PRODUCTS, CATEGORIES } from '../../constants';
import { Product } from '../../types';

interface StorefrontProps {
  wishlist: Product[];
  onToggleWishlist: (product: Product) => void;
  onNavigateToCategory: (slug: string) => void;
}

const B2CStorefront: React.FC<StorefrontProps> = ({ wishlist, onToggleWishlist, onNavigateToCategory }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showWishlistOnly, setShowWishlistOnly] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const retailProducts = DUMMY_PRODUCTS.filter(p => p.retailEnabled && p.is_active);
  const displayProducts = showWishlistOnly ? wishlist : retailProducts;

  const filtered = displayProducts.filter(p => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = p.name.toLowerCase().includes(term) || 
                          p.category.toLowerCase().includes(term) ||
                          p.search_tags.toLowerCase().includes(term);
    const matchesCategory = activeCategory === 'all' || p.category_slug === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const isInAmud = (productId: string) => wishlist.some(p => p.id === productId);

  return (
    <div className="space-y-32 animate-fade-in pt-10">
      {/* Editorial Banner */}
      {!showWishlistOnly && (
        <div className="relative h-[750px] rounded-[64px] overflow-hidden shadow-luxury border border-gold/10">
          <img 
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200" 
            className="w-full h-full object-cover contrast-110 grayscale-[0.2]"
            alt="Dunes"
          />
          <div className="absolute inset-0 bg-black/5 flex flex-col justify-center p-16 md:p-32 space-y-12">
            <div className="max-w-4xl space-y-10">
              <span className="heading-vogue text-[11px] bg-gold/80 text-white px-8 py-3 rounded-full shadow-2xl inline-block backdrop-blur-md">The Syndicate Collective</span>
              
              <h1 className="text-white leading-[0.8] tracking-tighter">
                <span className="heading-vogue text-9xl md:text-[13rem] block text-white drop-shadow-2xl">Pure</span>
                <span className="heading-vogue text-8xl md:text-[11rem] italic text-gold block -mt-4 drop-shadow-xl">Heritage.</span>
              </h1>
              
              <p className="text-white/80 text-3xl leading-relaxed max-w-2xl font-serif font-light italic drop-shadow-md">
                Verified trade connections between ancient Morocco and modern horizons. Sourced for sovereigns.
              </p>
              
              <div className="flex gap-10">
                <button 
                  onClick={() => onNavigateToCategory('kitchen-accessories')} 
                  className="px-16 py-7 bg-sahara text-henna rounded-full font-black text-[11px] uppercase tracking-[0.5em] hover:bg-gold hover:text-white transition-all shadow-luxury transform active:scale-95"
                >
                  Explore Registry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AMUD Search Engine Bar */}
      <div className="space-y-16 sticky top-28 z-30 glass-vogue p-12 rounded-[64px] shadow-luxury border border-gold/30 backdrop-blur-3xl">
        <div className="flex flex-col lg:flex-row gap-10 items-center justify-between">
          <div className="relative w-full lg:w-[800px]">
            <span className="absolute left-10 top-1/2 -translate-y-1/2 yaz-shimmer text-3xl font-serif">ⵣ</span>
            <input 
              className="w-full pl-24 pr-12 py-7 rounded-[40px] border border-gold/20 bg-sahara/30 focus:bg-white/80 focus:ring-8 focus:ring-gold/5 outline-none shadow-inner transition-all text-2xl font-serif font-light italic placeholder:text-henna/20"
              placeholder={showWishlistOnly ? "Search Amud Vault..." : "Trace your artifacts by origin..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-6 w-full lg:w-auto">
            <button 
              onClick={() => setShowWishlistOnly(!showWishlistOnly)}
              className={`flex-1 px-12 py-7 rounded-[40px] border transition-all flex items-center justify-center gap-6 font-bold ${
                showWishlistOnly 
                  ? 'bg-majorelle text-white shadow-luxury' 
                  : 'bg-white/5 border-gold/40 hover:bg-sahara/50 text-henna shadow-sm'
              }`}
            >
              <span className="heading-vogue text-[11px] tracking-[0.4em]">Vault ({wishlist.length})</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-6 overflow-x-auto pb-4 scrollbar-hide">
          <button 
            onClick={() => setActiveCategory('all')}
            className={`whitespace-nowrap px-12 py-4 rounded-full heading-vogue text-[10px] tracking-[0.4em] transition-all flex items-center gap-4 ${
              activeCategory === 'all' 
                ? 'bg-majorelle text-white shadow-xl' 
                : 'bg-henna/5 text-henna/40 hover:bg-henna/10'
            }`}
          >
            All Collective
          </button>
          {CATEGORIES.map(cat => (
            <button 
              key={cat.slug}
              onClick={() => setActiveCategory(cat.slug)}
              className={`whitespace-nowrap px-12 py-4 rounded-full heading-vogue text-[10px] tracking-[0.4em] transition-all flex items-center gap-4 ${
                activeCategory === cat.slug 
                  ? 'bg-majorelle text-white shadow-xl' 
                  : 'bg-henna/5 text-henna/40 hover:bg-henna/10'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Artifact Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-20 pb-40">
        {filtered.map(product => (
          <ArtifactCard 
            key={product.id}
            product={product} 
            onToggle={onToggleWishlist}
            isInAmud={isInAmud(product.id)}
          />
        ))}
      </div>
    </div>
  );
};

interface ArtifactCardProps {
  product: Product;
  onToggle: (product: Product) => void;
  isInAmud: boolean;
}

const ArtifactCard = React.memo(({ product, onToggle, isInAmud }: ArtifactCardProps) => {
  const handleToggle = () => onToggle(product);

  return (
    <div className="group card-vogue bg-white/40 glass-vogue overflow-hidden hover:-translate-y-8 shadow-gold-ambient border-gold/10 hover:border-gold/50 flex flex-col h-full active:scale-[0.98]">
      <div className="relative h-[500px] overflow-hidden shrink-0 bg-sahara/50">
        <img src={product.image} className="w-full h-full object-cover grayscale-[0.3] contrast-125 transition-all duration-1000 group-hover:scale-110 group-hover:grayscale-0" alt={product.name} />
        <div className="absolute inset-0 bg-henna/0 group-hover:bg-henna/10 transition-all duration-700 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <button onClick={handleToggle} className="px-10 py-5 bg-sahara text-henna rounded-full shadow-luxury heading-vogue text-[10px] hover:bg-gold hover:text-white transition-all transform hover:scale-110">
            {isInAmud ? 'Remove Trace' : 'Trace to Amud'}
          </button>
        </div>
        {isInAmud && (
          <div className="absolute top-8 left-8 w-12 h-12 glass-vogue rounded-full flex items-center justify-center border-gold animate-pulse">
            <span className="yaz-shimmer text-xl font-serif">ⵣ</span>
          </div>
        )}
      </div>

      <div className="p-12 flex flex-col flex-1 bg-transparent">
        <div className="flex justify-between items-start mb-8">
          <span className="heading-vogue text-[10px] text-gold/60">{product.category}</span>
          <span className="text-henna/5 font-serif text-5xl select-none">ⵣ</span>
        </div>
        <h3 className="heading-vogue text-2xl text-henna mb-8 leading-tight line-clamp-2 h-20 group-hover:text-gold transition-colors">{product.name}</h3>
        <p className="text-lg text-henna/40 mb-12 line-clamp-2 flex-1 font-serif font-light italic leading-relaxed">{product.short_description}</p>

        <div className="flex items-center justify-between mt-auto pt-10 border-t border-gold/10">
          <span className="heading-vogue text-3xl text-henna tracking-tighter">{product.price.toFixed(0)} <span className="text-[10px] font-sans text-gold uppercase tracking-[0.4em]">{product.currency}</span></span>
          <button onClick={handleToggle} className={`w-16 h-16 rounded-full flex items-center justify-center transition-all transform hover:scale-125 active:scale-90 shadow-luxury ${isInAmud ? 'bg-majorelle text-white' : 'bg-henna text-white hover:bg-majorelle'}`}>
            <span className="text-2xl font-serif">ⵣ</span>
          </button>
        </div>
      </div>
    </div>
  );
});

export default B2CStorefront;
