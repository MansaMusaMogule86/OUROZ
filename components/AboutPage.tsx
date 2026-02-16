
import React from 'react';

interface AboutPageProps {
  onBack: () => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ onBack }) => {
  return (
    <div className="animate-fade-in space-y-24 pb-32">
      {/* Hero */}
      <div className="relative rounded-[4rem] overflow-hidden h-[500px] shadow-luxury border border-gold/10">
        <img
          src="https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&q=80&w=1200"
          className="w-full h-full object-cover"
          alt="Moroccan artisan"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
          <div className="p-16 max-w-2xl space-y-6">
            <span className="heading-vogue text-[10px] text-gold tracking-[0.5em]">Our Story</span>
            <h1 className="heading-vogue text-6xl text-white leading-tight">The Bridge Between Heritage & Horizon</h1>
            <p className="text-white/70 font-serif italic text-xl leading-relaxed">
              OUROZ connects Morocco's finest artisan collectives with discerning buyers worldwide, preserving centuries of craftsmanship through modern trade.
            </p>
          </div>
        </div>
      </div>

      {/* Mission */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {[
          { title: 'Preserve', desc: 'We protect ancient craft traditions by connecting master artisans directly with global markets, ensuring fair value for their irreplaceable skills.', icon: 'ⵣ' },
          { title: 'Connect', desc: 'Our dual marketplace bridges B2C curators seeking authentic pieces with B2B syndicates building sustainable supply chains.', icon: '◈' },
          { title: 'Verify', desc: 'Every product is traced to its origin, every supplier verified through our multi-tier authentication system for complete transparency.', icon: '◆' },
        ].map((item, i) => (
          <div key={i} className="glass-vogue rounded-[2rem] p-10 border border-gold/10 space-y-6 text-center hover:border-gold/30 transition-all">
            <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center mx-auto">
              <span className="text-3xl text-gold font-serif">{item.icon}</span>
            </div>
            <h3 className="heading-vogue text-2xl text-henna">{item.title}</h3>
            <p className="text-henna/50 font-serif italic leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="glass-vogue rounded-[3rem] p-16 border border-gold/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: '500+', label: 'Verified Artisans' },
            { value: '12', label: 'Regions of Morocco' },
            { value: '5,000+', label: 'Unique Products' },
            { value: '45', label: 'Export Countries' },
          ].map((stat, i) => (
            <div key={i} className="text-center space-y-2">
              <p className="heading-vogue text-4xl text-gold">{stat.value}</p>
              <p className="text-[10px] font-black text-henna/40 uppercase tracking-[0.3em]">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Regions */}
      <div className="space-y-10">
        <h2 className="heading-vogue text-3xl text-henna text-center">Our Artisan Regions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {['Fes', 'Marrakech', 'Safi', 'Essaouira', 'Chefchaouen', 'Ouarzazate', 'Taroudant', 'Taza', 'Meknes', 'Tiznit', 'Agadir', 'Casablanca'].map((region, i) => (
            <div key={i} className="p-4 rounded-2xl bg-sahara/50 border border-gold/10 text-center hover:bg-gold/10 transition-all cursor-default">
              <p className="font-bold text-henna text-sm">{region}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div className="glass-vogue rounded-[3rem] p-16 border border-gold/10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="space-y-6">
            <h2 className="heading-vogue text-3xl text-henna">Get in Touch</h2>
            <p className="text-henna/50 font-serif italic text-lg">
              Whether you're a curator seeking a single masterpiece or a syndicate building supply chains, we're here to connect you.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold text-sm">✉</div>
                <div>
                  <p className="text-[9px] font-black text-gold/50 uppercase tracking-widest">Email</p>
                  <p className="text-sm font-bold text-henna">trade@ouroz.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold text-sm">☎</div>
                <div>
                  <p className="text-[9px] font-black text-gold/50 uppercase tracking-widest">Phone</p>
                  <p className="text-sm font-bold text-henna">+212 5XX-XXXXXX</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold text-sm">◈</div>
                <div>
                  <p className="text-[9px] font-black text-gold/50 uppercase tracking-widest">Headquarters</p>
                  <p className="text-sm font-bold text-henna">Casablanca, Morocco</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <input className="w-full px-6 py-4 rounded-2xl border border-gold/20 bg-sahara/30 focus:bg-white/80 focus:ring-4 focus:ring-gold/10 outline-none transition-all font-serif" placeholder="Your Name" />
            <input className="w-full px-6 py-4 rounded-2xl border border-gold/20 bg-sahara/30 focus:bg-white/80 focus:ring-4 focus:ring-gold/10 outline-none transition-all font-serif" placeholder="Email Address" />
            <select className="w-full px-6 py-4 rounded-2xl border border-gold/20 bg-sahara/30 focus:bg-white/80 focus:ring-4 focus:ring-gold/10 outline-none transition-all font-serif text-henna/50">
              <option>I'm a Buyer</option>
              <option>I'm a Supplier</option>
              <option>Partnership Inquiry</option>
              <option>General Question</option>
            </select>
            <textarea className="w-full px-6 py-4 rounded-2xl border border-gold/20 bg-sahara/30 focus:bg-white/80 focus:ring-4 focus:ring-gold/10 outline-none transition-all font-serif h-32 resize-none" placeholder="Your Message"></textarea>
            <button className="w-full py-5 bg-henna text-white rounded-full heading-vogue text-[11px] tracking-[0.4em] hover:bg-majorelle transition-all shadow-luxury">
              Send Message
            </button>
          </div>
        </div>
      </div>

      <div className="text-center">
        <button onClick={onBack} className="heading-vogue text-[10px] text-gold tracking-[0.3em] hover:text-henna transition-colors">
          ← Back to Collective
        </button>
      </div>
    </div>
  );
};

export default AboutPage;
