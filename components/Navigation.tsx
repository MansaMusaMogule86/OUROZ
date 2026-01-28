
import React from 'react';
import { User, UserRole, ApplicationStatus, ViewType } from '../types';

interface NavigationProps {
  user: User;
  currentView: ViewType;
  tradeMode: 'RETAIL' | 'WHOLESALE';
  onModeToggle: (mode: 'RETAIL' | 'WHOLESALE') => void;
  setView: (view: ViewType) => void;
  wishlistCount: number;
}

const Navigation: React.FC<NavigationProps> = ({ user, currentView, tradeMode, onModeToggle, setView, wishlistCount }) => {
  const accentColor = tradeMode === 'RETAIL' ? 'text-indigo' : 'text-gold';
  const accentBg = tradeMode === 'RETAIL' ? 'bg-indigo' : 'bg-gold';

  const NavButton: React.FC<{ view: ViewType; label: string }> = ({ view, label }) => {
    const isActive = currentView === view || (view === 'SHOP' && currentView.startsWith('CAT_'));
    return (
      <button 
        onClick={() => setView(view)} 
        className={`relative py-2 px-1 transition-all hover:opacity-100 font-sans font-medium tracking-widest text-[11px] uppercase ${isActive ? accentColor : 'text-henna/40 opacity-70'}`}
      >
        {label}
        {isActive && (
          <span className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 ${accentBg} rounded-full shadow-sm`}></span>
        )}
      </button>
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[110] glass-vogue border-b border-gold/10 transition-all duration-700">
      <div className="container mx-auto px-8 h-24 flex items-center justify-between">
        <div className="flex items-center gap-6 cursor-pointer group" onClick={() => setView('LANDING')}>
          {/* Logo Frame: Authentic Enamel & Gold */}
          <div className="relative w-12 h-12 yaz-enamel rounded-sm flex items-center justify-center border border-gold group-hover:rotate-90 transition-transform duration-700 shadow-lg">
             <span className="text-sahara text-3xl font-serif select-none">ⵣ</span>
          </div>
          <div className="h-8 w-px bg-gold/20 hidden sm:block"></div>
          <span className="heading-vogue text-2xl hidden sm:block">OUROZ</span>
        </div>

        <div className="hidden lg:flex items-center gap-12">
          <div className="flex items-center gap-10">
            <NavButton view="SHOP" label="Collective" />
            <NavButton view="CHEF_ADAFER" label="Adafer" />
            <NavButton view="AI_STUDIO" label="Studio" />
            <NavButton view="AMUD_ENGINE" label="Amud" />
          </div>
          
          <div className="h-4 w-px bg-gold/30"></div>

          <div className="bg-henna/5 p-1 rounded-full flex items-center border border-gold/10 backdrop-blur-md">
            <button 
              onClick={() => onModeToggle('RETAIL')}
              className={`px-6 py-2 rounded-full transition-all text-[9px] font-black uppercase tracking-widest ${tradeMode === 'RETAIL' ? 'bg-indigo text-white shadow-xl scale-105' : 'text-henna/30 hover:text-henna'}`}
            >
              Curator
            </button>
            <button 
              onClick={() => onModeToggle('WHOLESALE')}
              className={`px-6 py-2 rounded-full transition-all text-[9px] font-black uppercase tracking-widest ${tradeMode === 'WHOLESALE' ? 'bg-gold text-white shadow-xl scale-105' : 'text-henna/30 hover:text-henna'}`}
            >
              Syndicate
            </button>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="relative cursor-pointer group" onClick={() => setView('AMUD_ENGINE')}>
             <span className="heading-vogue text-[10px] tracking-[0.5em] opacity-40 group-hover:opacity-100 transition-opacity">Vault</span>
             <div className="absolute -top-1 -right-4 w-2 h-2 bg-gold rounded-full opacity-0 group-hover:opacity-100 transition-opacity animate-pulse"></div>
          </div>

          <div className="flex items-center gap-5 pl-8 border-l border-gold/20">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-bold text-henna leading-none uppercase tracking-[0.3em]">{user.name}</p>
              <p className={`text-[8px] font-medium uppercase tracking-[0.4em] mt-1.5 opacity-40`}>{user.role}</p>
            </div>
            <div className={`w-12 h-12 rounded-full border border-gold/30 flex items-center justify-center text-xs font-serif bg-white shadow-inner`}>
              {user.name.charAt(0)}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
