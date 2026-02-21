
import React, { useState } from 'react';
import Assistant from './AI/Assistant';
import { Product } from '../types';

interface ChefAtelierProps {
  onBack: () => void;
  wishlist?: Product[];
  onToggleVault?: (product: Product) => void;
}

const ChefAtelier: React.FC<ChefAtelierProps> = ({ onBack, wishlist, onToggleVault }) => {
  const [showGuide, setShowGuide] = useState(false);

  return (
    <div className="animate-fade-in pt-12 space-y-20">
      <div className="flex justify-between items-center px-4">
        <button onClick={onBack} className="heading-vogue text-[10px] text-emerald hover:opacity-50 transition-all flex items-center gap-4">
          <span className="text-xl">←</span> Return to Collection
        </button>
        <div className="flex items-center gap-4">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald animate-pulse"></div>
          <span className="heading-vogue text-[10px] text-emerald tracking-[0.3em]">Atelier Mode Active</span>
        </div>
      </div>

      <div className="relative rounded-[64px] overflow-hidden bg-emerald min-h-[650px] h-auto shadow-luxury group border border-emerald/20 mx-2 pb-12">
        <img
          src="https://images.unsplash.com/photo-1590593162201-f67611a18b87?auto=format&fit=crop&q=80&w=2070&v=99"
          className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-[4s]"
          alt="Chef Adafer Atelier"
        />
        <div className="relative z-10 flex flex-col justify-center items-center text-sahara text-center p-12 space-y-12 bg-black/40 min-h-[650px]">
          <span className="heading-vogue text-[12px] opacity-70 tracking-[1em]">The Michelin Sanctuary</span>
          <h1 className="text-9xl md:text-[11rem] font-serif font-light leading-none">Chef <span className="italic text-gold">ADAFER</span></h1>
          <p className="text-3xl max-w-3xl font-serif font-light italic leading-relaxed opacity-90 text-shadow-sm">
            A sanctuary for the sovereign palate. Curating the botanical purity and mineral integrity required for the next era of Amazigh culinary art.
          </p>
          <div className="flex flex-col md:flex-row gap-10 pt-8">
            <button
              onClick={() => setShowGuide(true)}
              className="px-16 py-7 bg-sahara text-emerald rounded-full font-black text-[11px] uppercase tracking-[0.5em] shadow-luxury hover:bg-emerald hover:text-sahara transition-all transform hover:scale-105"
            >
              Consult the Chef
            </button>
            <button className="px-16 py-7 bg-emerald/90 text-sahara rounded-full font-black text-[11px] uppercase tracking-[0.5em] border border-emerald/40 hover:bg-emerald transition-all backdrop-blur-md">
              View Apothecary
            </button>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-16 px-4">
        {[
          { name: 'Heritage Saffron', desc: 'Hand-picked threads from the soul of Taliouine.', img: 'https://images.unsplash.com/photo-1599940824399-b87987cb972d?auto=format&fit=crop&q=80&w=500' },
          { name: 'Argan Essence', desc: 'Culinary liquid gold, cold-pressed in ancient riads.', img: 'https://images.unsplash.com/photo-1610444583737-9f137bc6030c?auto=format&fit=crop&q=80&w=500' },
          { name: 'Aromatic Clay', desc: 'Atlas mountain clay vessels for thermal perfection.', img: 'https://images.unsplash.com/photo-1590333746438-2834503f5533?auto=format&fit=crop&q=80&w=500' }
        ].map((item, i) => (
          <div key={i} className="group card-vogue p-12 hover:-translate-y-6 transition-all duration-1000 cursor-pointer border-emerald/10 hover:border-emerald/40 bg-sahara shadow-luxury">
            <div className="aspect-[3/4] rounded-[40px] mb-10 overflow-hidden shadow-luxury border border-white/10 bg-sahara/50">
              <img src={item.img} className="w-full h-full object-cover grayscale-[0.4] group-hover:grayscale-0 transition-all duration-1000" alt={item.name} />
            </div>
            <span className="heading-vogue text-[10px] text-emerald/60 mb-6 block tracking-[0.4em]">Adafer Selection</span>
            <h3 className="text-5xl font-serif font-light text-henna mb-6 leading-tight">{item.name}</h3>
            <p className="text-xl font-serif font-light italic text-henna/40 leading-relaxed mb-12">{item.desc}</p>
            <button className="w-full py-6 border border-emerald/20 text-emerald rounded-full text-[10px] font-black uppercase tracking-[0.4em] hover:bg-emerald hover:text-white transition-all shadow-sm">
              Source Intelligence
            </button>
          </div>
        ))}
      </div>

      {showGuide && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-henna/60 backdrop-blur-2xl transition-all" onClick={() => setShowGuide(false)}></div>
          <Assistant
            isChef={true}
            wishlist={wishlist}
            onToggleVault={onToggleVault}
          />
          <button
            onClick={() => setShowGuide(false)}
            className="fixed top-12 right-12 z-[170] w-12 h-12 flex items-center justify-center bg-white/10 rounded-full border border-white/20 text-sahara hover:text-gold hover:scale-110 transition-all"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default ChefAtelier;
