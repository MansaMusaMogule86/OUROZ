
import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import { DUMMY_PRODUCTS } from '../../constants';

interface CategoryPageProps {
  categoryName: string;
  categorySlug: string;
  onBack: () => void;
  onAddToCart: (productId: string) => void;
}

const CategoryPage: React.FC<CategoryPageProps> = ({ categoryName, categorySlug, onBack, onAddToCart }) => {
  const products = DUMMY_PRODUCTS.filter(p => p.category_slug === categorySlug && p.retailEnabled);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        <button onClick={onBack} className="flex items-center gap-2 text-primary-600 font-bold mb-6 hover:translate-x-1 transition-transform">
          <span>←</span> Back to Marketplace
        </button>
        
        <div className="relative rounded-[3rem] overflow-hidden bg-slate-900 h-96 shadow-2xl group">
          <img 
            src={`https://picsum.photos/seed/${categorySlug}/1200/600`} 
            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
            alt={categoryName}
          />
          <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-12 text-center">
            <span className="text-xs font-bold uppercase tracking-[0.3em] mb-4 text-secondary-400">Premium Moroccan Selection</span>
            <h1 className="text-6xl font-serif font-bold mb-4">{categoryName}</h1>
            <p className="text-xl max-w-2xl opacity-90 font-light leading-relaxed">
              Discover authentic {categoryName.toLowerCase()} sourced directly from artisan collectives across the Kingdom. Verified for quality and heritage.
            </p>
          </div>
          <div className="absolute bottom-8 right-8 flex gap-4">
            <div className="bg-white/10 backdrop-blur px-4 py-2 rounded-full text-xs font-bold border border-white/20">
              ✓ Verified Origin
            </div>
            <div className="bg-white/10 backdrop-blur px-4 py-2 rounded-full text-xs font-bold border border-white/20">
              ✈ Direct Shipping
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-20">
        {products.map(p => (
          <div key={p.id} className="group bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full">
            <div className="relative h-72 overflow-hidden">
              <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={p.name} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <button 
                onClick={() => onAddToCart(p.id)}
                className="absolute bottom-4 right-4 bg-primary-600 text-white p-4 rounded-full shadow-2xl translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
            <div className="p-6 flex flex-col flex-1">
              <h3 className="text-xl font-serif font-bold text-gray-900 mb-2 leading-tight group-hover:text-primary-600 transition-colors">{p.name}</h3>
              <p className="text-sm text-gray-500 mb-6 line-clamp-2 flex-1">{p.short_description}</p>
              <div className="flex items-center justify-between mt-auto">
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-gray-900">{p.price.toFixed(0)} {p.currency}</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">In Stock</span>
                </div>
                <button className="text-xs font-bold text-primary-600 uppercase tracking-widest hover:underline">Details →</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Featured AI Content Section for this category */}
      <div className="bg-slate-50 rounded-[3.5rem] p-16 mb-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-serif font-bold text-slate-900">Experience {categoryName}</h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              We use advanced Veo AI to visualize the journey of our {categoryName.toLowerCase()} from the foothills of the Atlas Mountains to the modern homes of the Gulf. 
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600">🎥</div>
                <div>
                  <p className="font-bold text-slate-900">Atmospheric Video Previews</p>
                  <p className="text-sm text-slate-500">Immersive clips showing product textures and usage.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-secondary-100 rounded-xl flex items-center justify-center text-secondary-600">🪄</div>
                <div>
                  <p className="font-bold text-slate-900">AI Personalization</p>
                  <p className="text-sm text-slate-500">Visualize these items in your own space using our AI Studio.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative rounded-3xl overflow-hidden aspect-video shadow-2xl bg-black">
             <img src={`https://picsum.photos/seed/${categorySlug}-video/800/450`} className="w-full h-full object-cover opacity-80" alt="Video preview" />
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-primary-600 shadow-xl cursor-pointer hover:scale-110 transition-transform">
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
