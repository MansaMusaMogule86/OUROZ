
import React from 'react';

interface LandingPageProps {
  onShop: () => void;
  onTrade: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onShop, onTrade }) => {
  return (
    <div className="pt-32 pb-32 flex flex-col items-center animate-fade-in space-y-40 bg-sahara">
      {/* Editorial Hero with Authentic Logo */}
      <div className="text-center space-y-16 max-w-6xl animate-slide-up relative">
        <div className="flex justify-center mb-12">
          <div className="relative group">
            {/* The Gemini-style rotating gold shimmer - strictly burnished gold */}
            <div className="absolute -inset-10 yaz-shimmer-ring rounded-full opacity-40 blur-xl animate-yaz-rotate pointer-events-none"></div>
            
            {/* Logo Container: Imperial Red with Gold Frame */}
            <div className="relative w-52 h-52 yaz-enamel border-4 border-gold rounded-full flex items-center justify-center shadow-2xl transition-transform duration-1000 group-hover:scale-105">
              <span className="text-sahara text-[7.5rem] font-serif select-none leading-none drop-shadow-lg">ⵣ</span>
            </div>
            
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-henna text-sahara px-10 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.5em] shadow-2xl border border-gold/20 z-10">
              VERIFIED LINEAGE
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <h1 className="text-8xl md:text-[13rem] font-serif font-light text-henna leading-[0.75] tracking-[-0.05em]">
            OUROZ
          </h1>
          <p className="text-2xl md:text-3xl font-serif italic text-gold font-light tracking-[0.2em]">
            The Amazigh Source
          </p>
        </div>

        <p className="text-2xl md:text-3xl text-henna/40 font-serif font-light italic leading-relaxed max-w-3xl mx-auto border-y border-gold/10 py-12 px-6">
          Where ancient Berber craftsmanship finds its modern velocity. A trade bridge for the few, verified by the source.
        </p>

        <div className="flex gap-12 justify-center pt-8">
           <div className="text-[10px] font-black uppercase tracking-[0.5em] text-gold/40 border-b border-gold/20 pb-2">Verified Origins</div>
           <div className="text-[10px] font-black uppercase tracking-[0.5em] text-gold/40 border-b border-gold/20 pb-2">Direct Logistics</div>
           <div className="text-[10px] font-black uppercase tracking-[0.5em] text-gold/40 border-b border-gold/20 pb-2">AI Verification</div>
        </div>
      </div>

      {/* Path Selection Cards - Structural Overhaul */}
      <div className="grid md:grid-cols-2 gap-16 w-full max-w-7xl px-4">
        {/* Retail Path - The Curator (Atlas Indigo) */}
        <div 
          onClick={onShop}
          className="group relative overflow-hidden rounded-extreme bg-white/10 glass-vogue p-24 flex flex-col items-center text-center transition-all duration-1000 hover:-translate-y-8 hover:shadow-luxury cursor-pointer border border-gold/30"
        >
          <div className="absolute inset-0 bg-indigo/[0.02] group-hover:bg-indigo/[0.05] transition-colors"></div>
          <div className="w-28 h-28 bg-sahara rounded-full flex items-center justify-center text-6xl mb-12 shadow-inner border border-gold/10 group-hover:rotate-12 transition-transform duration-700">🏺</div>
          <h2 className="text-7xl font-serif font-light mb-8 text-henna tracking-vogue">The Curator</h2>
          <p className="text-henna/50 mb-14 flex-1 text-2xl font-serif font-light leading-relaxed italic">
            Direct access to the rare, the hand-thrown, and the botanically pure. Curated artifacts for the modern sanctuary.
          </p>
          <button className="w-full py-8 bg-indigo text-sahara rounded-full font-black text-[11px] uppercase tracking-[0.5em] shadow-2xl shadow-indigo/20 hover:scale-[1.02] transition-all transform active:scale-95">
            Access Collective
          </button>
        </div>

        {/* Wholesale Path - The Syndicate (Burnished Gold) */}
        <div 
          onClick={onTrade}
          className="group relative overflow-hidden rounded-extreme bg-henna p-24 flex flex-col items-center text-center transition-all duration-1000 hover:-translate-y-8 hover:shadow-luxury cursor-pointer border border-gold/40"
        >
          <div className="absolute inset-0 bg-gold/[0.03] group-hover:bg-gold/[0.08] transition-colors"></div>
          <div className="w-28 h-28 bg-white/5 rounded-full flex items-center justify-center text-6xl mb-12 shadow-inner border border-gold/20 group-hover:-rotate-12 transition-transform duration-700">🚢</div>
          <h2 className="text-7xl font-serif font-light mb-8 text-sahara tracking-vogue">The Syndicate</h2>
          <p className="text-sahara/40 mb-14 flex-1 text-2xl font-serif font-light leading-relaxed italic">
            Institutional volume trade with automated logistics and verified Amazigh lineage. Secure. Scalable. Sovereign.
          </p>
          <button className="w-full py-8 bg-gold text-sahara rounded-full font-black text-[11px] uppercase tracking-[0.5em] hover:scale-[1.02] transition-all transform active:scale-95 shadow-2xl shadow-gold/20">
            Enter Syndicate Hub
          </button>
        </div>
      </div>

      {/* Luxury Footer Metrics */}
      <div className="w-full max-w-6xl py-32 border-t border-gold/10 text-center animate-slide-up [animation-delay:0.6s]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-20">
          <div className="space-y-4">
            <p className="text-8xl font-serif font-light text-henna tracking-tighter">800+</p>
            <p className="text-[10px] text-gold font-black uppercase tracking-[0.6em] opacity-60">Verified Masters</p>
          </div>
          <div className="space-y-4">
            <p className="text-8xl font-serif font-light text-henna tracking-tighter">12</p>
            <p className="text-[10px] text-gold font-black uppercase tracking-[0.6em] opacity-60">Logistics Hubs</p>
          </div>
          <div className="space-y-4">
            <p className="text-8xl font-serif font-light text-henna tracking-tighter">10ms</p>
            <p className="text-[10px] text-gold font-black uppercase tracking-[0.6em] opacity-60">AI Verification</p>
          </div>
          <div className="space-y-4">
            <p className="text-8xl font-serif font-light text-henna tracking-tighter">100%</p>
            <p className="text-[10px] text-gold font-black uppercase tracking-[0.6em] opacity-60">Pure Lineage</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
