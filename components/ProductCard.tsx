
import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onToggleWishlist?: (product: Product) => void;
  onViewDetail?: (product: Product) => void;
  isInWishlist?: boolean;
  variant?: 'default' | 'compact' | 'editorial';
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onToggleWishlist,
  onViewDetail,
  isInWishlist = false,
  variant = 'default'
}) => {
  if (variant === 'compact') {
    return (
      <div
        onClick={() => onViewDetail?.(product)}
        className="group cursor-pointer bg-white/40 glass-vogue rounded-[1.5rem] overflow-hidden hover:-translate-y-2 shadow-sm hover:shadow-xl border border-gold/10 hover:border-gold/30 transition-all duration-500 flex flex-col h-full"
      >
        <div className="relative h-48 overflow-hidden shrink-0 bg-sahara/30">
          <img src={product.image} className="w-full h-full object-cover grayscale-[0.2] contrast-110 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-700" alt={product.name} />
          {product.verified && (
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-gold border border-gold/20">
              Verified
            </div>
          )}
          {isInWishlist && (
            <div className="absolute top-3 right-3 w-8 h-8 glass-vogue rounded-full flex items-center justify-center border-gold animate-pulse">
              <span className="yaz-shimmer text-sm font-serif">ⵣ</span>
            </div>
          )}
        </div>
        <div className="p-5 flex flex-col flex-1">
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gold/50 mb-1">{product.category}</span>
          <h3 className="text-sm font-bold text-henna mb-1 leading-tight line-clamp-2 group-hover:text-gold transition-colors">{product.name}</h3>
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-gold/10">
            <span className="font-bold text-henna">{product.price.toFixed(0)} <span className="text-[9px] text-gold/60 uppercase">{product.currency}</span></span>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'editorial') {
    return (
      <div className="group cursor-pointer relative rounded-[3rem] overflow-hidden h-[600px] shadow-luxury border border-gold/10 hover:border-gold/40 transition-all duration-700" onClick={() => onViewDetail?.(product)}>
        <img src={product.image} className="w-full h-full object-cover grayscale-[0.3] contrast-125 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-1000" alt={product.name} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-12 space-y-4">
          <span className="heading-vogue text-[10px] text-gold tracking-[0.5em]">{product.category}</span>
          <h3 className="heading-vogue text-3xl text-white leading-tight">{product.name}</h3>
          <p className="text-white/60 font-serif italic text-lg line-clamp-2">{product.short_description}</p>
          <div className="flex items-center justify-between pt-4">
            <span className="heading-vogue text-3xl text-white">{product.price.toFixed(0)} <span className="text-sm text-gold/80 uppercase tracking-widest">{product.currency}</span></span>
            <div className="flex gap-3">
              {onToggleWishlist && (
                <button
                  onClick={(e) => { e.stopPropagation(); onToggleWishlist(product); }}
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all transform hover:scale-110 ${isInWishlist ? 'bg-majorelle text-white' : 'bg-white/20 backdrop-blur text-white hover:bg-white/40'}`}
                >
                  <span className="text-xl font-serif">ⵣ</span>
                </button>
              )}
              <button className="px-8 py-4 bg-sahara text-henna rounded-full heading-vogue text-[10px] tracking-[0.3em] hover:bg-gold hover:text-white transition-all">
                Discover
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className="group card-vogue bg-white/40 glass-vogue overflow-hidden hover:-translate-y-4 shadow-gold-ambient border-gold/10 hover:border-gold/50 flex flex-col h-full active:scale-[0.98] transition-all duration-500">
      <div
        className="relative h-[400px] overflow-hidden shrink-0 bg-sahara/50 cursor-pointer"
        onClick={() => onViewDetail?.(product)}
      >
        <img src={product.image} className="w-full h-full object-cover grayscale-[0.3] contrast-125 transition-all duration-1000 group-hover:scale-110 group-hover:grayscale-0" alt={product.name} />
        <div className="absolute inset-0 bg-henna/0 group-hover:bg-henna/10 transition-all duration-700 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <button
            onClick={(e) => { e.stopPropagation(); onViewDetail?.(product); }}
            className="px-10 py-5 bg-sahara text-henna rounded-full shadow-luxury heading-vogue text-[10px] hover:bg-gold hover:text-white transition-all transform hover:scale-110"
          >
            View Details
          </button>
        </div>
        {product.verified && (
          <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.3em] text-gold border border-gold/20 shadow-sm">
            Verified Origin
          </div>
        )}
        {isInWishlist && (
          <div className="absolute top-6 right-6 w-12 h-12 glass-vogue rounded-full flex items-center justify-center border-gold animate-pulse">
            <span className="yaz-shimmer text-xl font-serif">ⵣ</span>
          </div>
        )}
        {product.wholesaleEnabled && (
          <div className="absolute bottom-6 left-6 bg-gold/90 backdrop-blur-sm px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.3em] text-white shadow-sm">
            Wholesale
          </div>
        )}
      </div>

      <div className="p-8 flex flex-col flex-1 bg-transparent">
        <div className="flex justify-between items-start mb-4">
          <span className="heading-vogue text-[10px] text-gold/60">{product.category}</span>
          {product.origin && (
            <span className="text-[9px] font-bold text-henna/30 uppercase tracking-widest">{product.origin}</span>
          )}
        </div>
        <h3
          className="heading-vogue text-xl text-henna mb-4 leading-tight line-clamp-2 cursor-pointer group-hover:text-gold transition-colors"
          onClick={() => onViewDetail?.(product)}
        >
          {product.name}
        </h3>
        <p className="text-sm text-henna/40 mb-6 line-clamp-2 flex-1 font-serif font-light italic leading-relaxed">{product.short_description}</p>

        {product.moq > 1 && (
          <div className="text-[9px] font-bold text-henna/30 uppercase tracking-widest mb-4">
            MOQ: {product.moq} units
          </div>
        )}

        <div className="flex items-center justify-between mt-auto pt-6 border-t border-gold/10">
          <div className="flex flex-col">
            <span className="heading-vogue text-2xl text-henna tracking-tighter">
              {product.price.toFixed(0)} <span className="text-[10px] font-sans text-gold uppercase tracking-[0.4em]">{product.currency}</span>
            </span>
            {product.wholesalePrice && (
              <span className="text-[10px] text-gold/60 font-medium">
                Wholesale: {product.wholesalePrice.toFixed(0)} {product.currency}
              </span>
            )}
          </div>
          {onToggleWishlist && (
            <button
              onClick={(e) => { e.stopPropagation(); onToggleWishlist(product); }}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all transform hover:scale-125 active:scale-90 shadow-lg ${isInWishlist ? 'bg-majorelle text-white' : 'bg-henna text-white hover:bg-majorelle'}`}
            >
              <span className="text-lg font-serif">ⵣ</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProductCard);
