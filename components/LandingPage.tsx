
import React from 'react';

interface LandingPageProps {
  onShop: () => void;
  onTrade: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onShop, onTrade }) => {
  return (
    <div className="min-h-[calc(100vh-6rem)] flex flex-col items-center justify-center bg-sahara relative overflow-hidden">

      {/* Hero Section - Centered Editorial Layout */}
      <div className="text-center space-y-10 max-w-5xl px-6 animate-fade-in relative z-10">

        {/* Amazigh Logo Mark */}
        <div className="flex justify-center mb-6">
          <div className="relative group">
            {/* Shimmer ring behind logo */}
            <div className="absolute -inset-8 yaz-shimmer-ring rounded-full opacity-30 blur-xl animate-yaz-rotate pointer-events-none"></div>

            {/* Logo circle with soft gradient */}
            <div className="relative w-40 h-40 rounded-full bg-gradient-to-b from-white/80 to-white/40 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] flex items-center justify-center border border-gold/10 transition-transform duration-1000 group-hover:scale-105">
              <span className="text-[6rem] leading-none select-none" style={{
                background: 'linear-gradient(180deg, #C85A5A 0%, #A63D3D 40%, #8B1A4A 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontFamily: 'Playfair Display, serif'
              }}>ⵣ</span>
            </div>
          </div>
        </div>

        {/* Brand Title */}
        <div className="space-y-4">
          <h1 className="text-7xl md:text-[10rem] font-serif font-light text-henna leading-[0.8] tracking-[-0.04em]">
            OUROZ
          </h1>
          <p className="text-lg md:text-xl font-serif italic text-gold/70 font-light tracking-[0.25em] uppercase">
            The Amazigh Source
          </p>
        </div>

        {/* Main Tagline - from Screenshot 1 */}
        <div className="max-w-3xl mx-auto space-y-4 pt-4">
          <h2 className="text-2xl md:text-4xl font-serif font-light text-henna/80 leading-snug tracking-wide">
            Authentic Moroccan Products,<br />Delivered in Dubai
          </h2>
          <p className="text-base md:text-lg text-henna/40 font-light leading-relaxed max-w-2xl mx-auto">
            From the souks of Morocco to your doorstep. Fresh spices, artisan goods, and traditional delicacies.
          </p>
        </div>

        {/* CTA Buttons - Screenshot 2 Style */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center pt-6 max-w-xl mx-auto">
          <button
            onClick={onShop}
            className="flex-1 py-5 px-10 border-2 border-henna/20 text-henna rounded-full font-sans font-black text-[11px] uppercase tracking-[0.4em] hover:bg-henna hover:text-sahara transition-all duration-500 hover:border-henna hover:shadow-xl active:scale-95"
          >
            Shop Now
          </button>
          <button
            onClick={onTrade}
            className="flex-1 py-5 px-10 bg-henna text-sahara rounded-full font-sans font-black text-[11px] uppercase tracking-[0.4em] hover:bg-henna/90 transition-all duration-500 hover:shadow-xl active:scale-95"
          >
            Wholesale Pricing
          </button>
        </div>

        {/* Bottom Labels - Screenshot 2 Style */}
        <div className="flex gap-10 md:gap-16 justify-center pt-10">
          <div className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-gold/40 border-b border-gold/15 pb-2 hover:text-gold/70 transition-colors cursor-default">
            Verified Lineage
          </div>
          <div className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-gold/40 border-b border-gold/15 pb-2 hover:text-gold/70 transition-colors cursor-default">
            Direct Logistics
          </div>
          <div className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-gold/40 border-b border-gold/15 pb-2 hover:text-gold/70 transition-colors cursor-default">
            Sourcing Branding
          </div>
        </div>
      </div>

      {/* Why OUROZ Section - Below fold, matching Screenshot 2 aesthetic */}
      <div className="w-full max-w-6xl px-6 pt-40 pb-24 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-serif font-light text-henna tracking-wide">
            Why OUROZ?
          </h2>
          <div className="w-16 h-px bg-gold/30 mx-auto mt-6"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-12 md:gap-16">
          {/* Feature 1 */}
          <div className="group text-center space-y-6 p-10 rounded-[2rem] bg-white/30 border border-gold/10 hover:border-gold/30 transition-all duration-700 hover:-translate-y-2 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.06)]">
            <div className="w-20 h-20 mx-auto rounded-full bg-sahara border border-gold/10 flex items-center justify-center text-4xl shadow-inner group-hover:scale-110 transition-transform duration-500">
              🌿
            </div>
            <h3 className="text-lg font-serif font-light text-henna tracking-[0.15em] uppercase">
              Direct from Morocco
            </h3>
            <p className="text-sm text-henna/40 font-light leading-relaxed">
              Sourced directly from Moroccan artisans and cooperatives, ensuring authenticity and fair trade.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="group text-center space-y-6 p-10 rounded-[2rem] bg-white/30 border border-gold/10 hover:border-gold/30 transition-all duration-700 hover:-translate-y-2 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.06)]">
            <div className="w-20 h-20 mx-auto rounded-full bg-sahara border border-gold/10 flex items-center justify-center text-4xl shadow-inner group-hover:scale-110 transition-transform duration-500">
              🚚
            </div>
            <h3 className="text-lg font-serif font-light text-henna tracking-[0.15em] uppercase">
              Fast Dubai Delivery
            </h3>
            <p className="text-sm text-henna/40 font-light leading-relaxed">
              Same-day and next-day delivery across all Emirates. Fresh products guaranteed.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="group text-center space-y-6 p-10 rounded-[2rem] bg-white/30 border border-gold/10 hover:border-gold/30 transition-all duration-700 hover:-translate-y-2 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.06)]">
            <div className="w-20 h-20 mx-auto rounded-full bg-sahara border border-gold/10 flex items-center justify-center text-4xl shadow-inner group-hover:scale-110 transition-transform duration-500">
              💎
            </div>
            <h3 className="text-lg font-serif font-light text-henna tracking-[0.15em] uppercase">
              Wholesale & Retail
            </h3>
            <p className="text-sm text-henna/40 font-light leading-relaxed">
              Competitive pricing for businesses. Tiered wholesale rates with credit terms for approved accounts.
            </p>
          </div>
        </div>
      </div>

      {/* Luxury Footer Metrics */}
      <div className="w-full max-w-6xl px-6 py-24 border-t border-gold/10 text-center">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-16">
          <div className="space-y-3">
            <p className="text-5xl md:text-7xl font-serif font-light text-henna tracking-tighter">800+</p>
            <p className="text-[9px] text-gold font-black uppercase tracking-[0.5em] opacity-50">Verified Masters</p>
          </div>
          <div className="space-y-3">
            <p className="text-5xl md:text-7xl font-serif font-light text-henna tracking-tighter">12</p>
            <p className="text-[9px] text-gold font-black uppercase tracking-[0.5em] opacity-50">Logistics Hubs</p>
          </div>
          <div className="space-y-3">
            <p className="text-5xl md:text-7xl font-serif font-light text-henna tracking-tighter">10ms</p>
            <p className="text-[9px] text-gold font-black uppercase tracking-[0.5em] opacity-50">AI Verification</p>
          </div>
          <div className="space-y-3">
            <p className="text-5xl md:text-7xl font-serif font-light text-henna tracking-tighter">100%</p>
            <p className="text-[9px] text-gold font-black uppercase tracking-[0.5em] opacity-50">Pure Lineage</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
