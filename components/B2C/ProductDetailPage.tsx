
import React, { useState } from 'react';
import { Product } from '../../types';
import { DUMMY_PRODUCTS } from '../../constants';
import ProductCard from '../ProductCard';

interface ProductDetailPageProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product, qty: number) => void;
  onToggleWishlist: (product: Product) => void;
  isInWishlist: boolean;
  onViewProduct: (product: Product) => void;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  onBack,
  onAddToCart,
  onToggleWishlist,
  isInWishlist,
  onViewProduct
}) => {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'details' | 'shipping'>('description');

  const relatedProducts = DUMMY_PRODUCTS
    .filter(p => p.category_slug === product.category_slug && p.id !== product.id && p.retailEnabled && p.is_active)
    .slice(0, 4);

  return (
    <div className="animate-fade-in space-y-20 pb-32">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3 text-sm">
        <button onClick={onBack} className="text-gold/60 hover:text-gold transition-colors heading-vogue text-[10px] tracking-[0.3em]">
          Collective
        </button>
        <span className="text-gold/30">/</span>
        <span className="text-gold/60 heading-vogue text-[10px] tracking-[0.3em]">{product.category}</span>
        <span className="text-gold/30">/</span>
        <span className="text-henna heading-vogue text-[10px] tracking-[0.3em]">{product.name}</span>
      </div>

      {/* Product Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Image Section */}
        <div className="space-y-6">
          <div className="relative rounded-[3rem] overflow-hidden bg-sahara/30 aspect-square shadow-luxury border border-gold/10 group">
            <img
              src={product.image}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              alt={product.name}
            />
            {product.verified && (
              <div className="absolute top-8 left-8 bg-white/90 backdrop-blur-sm px-5 py-2.5 rounded-full text-[9px] font-black uppercase tracking-[0.3em] text-gold border border-gold/20 shadow-sm flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                Verified Origin
              </div>
            )}
            <button
              onClick={() => onToggleWishlist(product)}
              className={`absolute top-8 right-8 w-14 h-14 rounded-full flex items-center justify-center transition-all transform hover:scale-110 shadow-luxury ${isInWishlist ? 'bg-majorelle text-white' : 'bg-white/80 backdrop-blur text-henna hover:bg-majorelle hover:text-white'}`}
            >
              <span className="text-2xl font-serif">ⵣ</span>
            </button>
          </div>
        </div>

        {/* Info Section */}
        <div className="flex flex-col justify-center space-y-10">
          <div>
            <span className="heading-vogue text-[10px] text-gold/60 tracking-[0.5em]">{product.category}</span>
            <h1 className="heading-vogue text-5xl text-henna mt-3 leading-tight">{product.name}</h1>
          </div>

          <div className="flex items-center gap-6">
            {product.origin && (
              <div className="flex items-center gap-2 bg-sahara/50 px-5 py-2.5 rounded-full border border-gold/10">
                <span className="text-[10px] font-bold text-henna/60 uppercase tracking-widest">Origin</span>
                <span className="text-sm font-bold text-henna">{product.origin}</span>
              </div>
            )}
            <div className="flex items-center gap-2 bg-sahara/50 px-5 py-2.5 rounded-full border border-gold/10">
              <span className={`w-2 h-2 rounded-full ${product.stock_status === 'in_stock' ? 'bg-emerald-400' : product.stock_status === 'preorder' ? 'bg-amber-400' : 'bg-red-400'}`}></span>
              <span className="text-[10px] font-bold text-henna/60 uppercase tracking-widest">
                {product.stock_status === 'in_stock' ? 'In Stock' : product.stock_status === 'preorder' ? 'Pre-Order' : 'Out of Stock'}
              </span>
            </div>
          </div>

          <p className="text-xl text-henna/50 font-serif font-light italic leading-relaxed">{product.description}</p>

          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="heading-vogue text-5xl text-henna tracking-tighter">{product.price.toFixed(0)}</span>
              <span className="text-sm text-gold uppercase tracking-[0.4em] font-bold">{product.currency}</span>
            </div>
            {product.wholesalePrice && (
              <p className="text-sm text-gold/70 font-medium">
                Wholesale: {product.wholesalePrice.toFixed(0)} {product.currency} (MOQ: {product.moq} units)
              </p>
            )}
          </div>

          {/* Quantity & Add to Cart */}
          <div className="flex items-center gap-6">
            <div className="flex items-center border border-gold/20 rounded-full overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-14 h-14 flex items-center justify-center text-henna hover:bg-sahara/50 transition-colors text-xl"
              >
                −
              </button>
              <span className="w-16 text-center font-bold text-henna text-lg">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-14 h-14 flex items-center justify-center text-henna hover:bg-sahara/50 transition-colors text-xl"
              >
                +
              </button>
            </div>

            <button
              onClick={() => onAddToCart(product, quantity)}
              disabled={product.stock_status === 'out_of_stock'}
              className="flex-1 py-5 bg-henna text-white rounded-full heading-vogue text-[11px] tracking-[0.4em] hover:bg-majorelle transition-all shadow-luxury active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {product.stock_status === 'out_of_stock' ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gold/10">
            <div className="text-center p-4 rounded-2xl bg-sahara/30">
              <p className="text-[9px] font-black text-gold/60 uppercase tracking-widest mb-1">Shipping</p>
              <p className="text-xs font-bold text-henna">Worldwide</p>
            </div>
            <div className="text-center p-4 rounded-2xl bg-sahara/30">
              <p className="text-[9px] font-black text-gold/60 uppercase tracking-widest mb-1">Authenticity</p>
              <p className="text-xs font-bold text-henna">Guaranteed</p>
            </div>
            <div className="text-center p-4 rounded-2xl bg-sahara/30">
              <p className="text-[9px] font-black text-gold/60 uppercase tracking-widest mb-1">Returns</p>
              <p className="text-xs font-bold text-henna">14 Days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="glass-vogue rounded-[3rem] p-12 border border-gold/10">
        <div className="flex gap-2 mb-10 border-b border-gold/10 pb-4">
          {(['description', 'details', 'shipping'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-3 rounded-full heading-vogue text-[10px] tracking-[0.3em] transition-all ${
                activeTab === tab
                  ? 'bg-henna text-white shadow-lg'
                  : 'text-henna/40 hover:text-henna hover:bg-sahara/50'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="min-h-[200px]">
          {activeTab === 'description' && (
            <div className="space-y-6">
              <p className="text-lg text-henna/60 font-serif italic leading-relaxed">{product.description}</p>
              <div className="flex flex-wrap gap-3 pt-4">
                {product.search_tags.split(',').map((tag, i) => (
                  <span key={i} className="px-4 py-2 bg-sahara/50 rounded-full text-[10px] font-bold text-henna/50 uppercase tracking-widest border border-gold/10">
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'details' && (
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-sahara/30 border border-gold/5">
                <p className="text-[9px] font-black text-gold/60 uppercase tracking-widest mb-2">Category</p>
                <p className="text-sm font-bold text-henna">{product.category}</p>
              </div>
              <div className="p-6 rounded-2xl bg-sahara/30 border border-gold/5">
                <p className="text-[9px] font-black text-gold/60 uppercase tracking-widest mb-2">Origin</p>
                <p className="text-sm font-bold text-henna">{product.origin}</p>
              </div>
              <div className="p-6 rounded-2xl bg-sahara/30 border border-gold/5">
                <p className="text-[9px] font-black text-gold/60 uppercase tracking-widest mb-2">Minimum Order</p>
                <p className="text-sm font-bold text-henna">{product.moq} unit(s)</p>
              </div>
              <div className="p-6 rounded-2xl bg-sahara/30 border border-gold/5">
                <p className="text-[9px] font-black text-gold/60 uppercase tracking-widest mb-2">Stock Status</p>
                <p className="text-sm font-bold text-henna capitalize">{product.stock_status.replace('_', ' ')}</p>
              </div>
            </div>
          )}
          {activeTab === 'shipping' && (
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-6 rounded-2xl bg-sahara/30 border border-gold/5">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold shrink-0">✈</div>
                <div>
                  <p className="font-bold text-henna mb-1">International Shipping</p>
                  <p className="text-sm text-henna/50">Ships from Morocco to worldwide destinations. Delivery typically 7-14 business days.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-6 rounded-2xl bg-sahara/30 border border-gold/5">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold shrink-0">📦</div>
                <div>
                  <p className="font-bold text-henna mb-1">Secure Packaging</p>
                  <p className="text-sm text-henna/50">All items are carefully wrapped in protective materials to ensure they arrive in perfect condition.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-6 rounded-2xl bg-sahara/30 border border-gold/5">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold shrink-0">↩</div>
                <div>
                  <p className="font-bold text-henna mb-1">Returns Policy</p>
                  <p className="text-sm text-henna/50">14-day return window for unused items in original packaging. Contact support for details.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-10">
          <div className="flex items-center justify-between">
            <h2 className="heading-vogue text-3xl text-henna">Related Artifacts</h2>
            <button onClick={onBack} className="heading-vogue text-[10px] text-gold tracking-[0.3em] hover:text-henna transition-colors">
              View All →
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                variant="compact"
                onViewDetail={onViewProduct}
                onToggleWishlist={onToggleWishlist}
                isInWishlist={false}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
