
import React, { useState } from 'react';
import { User, ViewType } from '../types';

interface NavigationProps {
  user: User;
  currentView: ViewType;
  tradeMode: 'RETAIL' | 'WHOLESALE';
  onModeToggle: (mode: 'RETAIL' | 'WHOLESALE') => void;
  setView: (view: ViewType) => void;
  wishlistCount: number;
  cartCount?: number;
}

const Navigation: React.FC<NavigationProps> = ({ user, currentView, tradeMode, onModeToggle, setView, wishlistCount, cartCount = 0 }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const accentColor = tradeMode === 'RETAIL' ? 'text-indigo' : 'text-gold';
  const accentBg = tradeMode === 'RETAIL' ? 'bg-indigo' : 'bg-gold';

  const isB2BView = currentView.startsWith('B2B_');

  const NavButton: React.FC<{ view: ViewType; label: string }> = ({ view, label }) => {
    const isActive = currentView === view || (view === 'SHOP' && currentView.startsWith('CAT_')) || (view === 'SHOP' && ['PRODUCT_DETAIL', 'CART', 'CHECKOUT', 'ORDER_SUCCESS'].includes(currentView));
    return (
      <button
        onClick={() => { setView(view); setMobileMenuOpen(false); }}
        className={`relative py-2 px-1 transition-all duration-300 hover:opacity-100 font-sans font-medium tracking-[0.2em] text-[10px] uppercase ${isActive ? 'text-henna' : 'text-henna/30 hover:text-henna/60'}`}
      >
        {label}
        {isActive && (
          <span className={`absolute -bottom-1 left-0 right-0 h-[1px] bg-henna/40`}></span>
        )}
      </button>
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[110] bg-sahara/90 backdrop-blur-xl border-b border-gold/8 transition-all duration-700">
      <div className="container mx-auto px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setView('LANDING')}>
          <div className="relative w-10 h-10 rounded-lg bg-white shadow-sm border border-gold/10 flex items-center justify-center group-hover:shadow-md transition-all duration-500">
            <span className="text-xl select-none" style={{
              background: 'linear-gradient(180deg, #C85A5A 0%, #8B1A4A 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontFamily: 'Playfair Display, serif'
            }}>ⵣ</span>
          </div>
          <span className="heading-vogue text-lg tracking-[0.2em] hidden sm:block">OUROZ</span>
        </div>

        {/* Center Navigation */}
        <div className="hidden lg:flex items-center gap-10">
          {tradeMode === 'WHOLESALE' && isB2BView ? (
            /* B2B Navigation */
            <div className="flex items-center gap-8">
              <NavButton view="B2B_MARKETPLACE" label="Marketplace" />
              <NavButton view="B2B_RFQ" label="RFQ" />
              <NavButton view="B2B_ORDERS" label="Orders" />
              <NavButton view="B2B_MESSAGES" label="Messages" />
              <NavButton view="B2B_SUPPLIER_DASHBOARD" label="Dashboard" />
            </div>
          ) : (
            /* B2C Navigation */
            <div className="flex items-center gap-8">
              <NavButton view="SHOP" label="Collection" />
              <NavButton view="CHEF_ADAFER" label="Atelier" />
              <NavButton view="AI_STUDIO" label="Studio" />
              <NavButton view="ABOUT" label="Intelligence" />
            </div>
          )}

          <div className="h-5 w-px bg-henna/8"></div>

          {/* Mode Toggle Pills */}
          <div className="flex items-center gap-1 p-1 rounded-full border border-henna/8">
            <button
              onClick={() => onModeToggle('RETAIL')}
              className={`px-5 py-2 rounded-full transition-all duration-400 text-[9px] font-black uppercase tracking-[0.2em] ${tradeMode === 'RETAIL' ? 'bg-indigo text-white shadow-md' : 'text-henna/25 hover:text-henna/50'}`}
            >
              Curator
            </button>
            <button
              onClick={() => onModeToggle('WHOLESALE')}
              className={`px-5 py-2 rounded-full transition-all duration-400 text-[9px] font-black uppercase tracking-[0.2em] ${tradeMode === 'WHOLESALE' ? 'bg-henna text-sahara shadow-md' : 'text-henna/25 hover:text-henna/50'}`}
            >
              Syndicate
            </button>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-6">
          {/* Cart */}
          {tradeMode === 'RETAIL' && (
            <div className="relative cursor-pointer group" onClick={() => setView('CART')}>
              <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-henna/30 group-hover:text-henna/70 transition-colors">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 w-4 h-4 bg-imperial-red text-white text-[7px] font-black rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
          )}

          {/* Vault */}
          <div className="relative cursor-pointer group" onClick={() => setView('AMUD_ENGINE')}>
            <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-henna/30 group-hover:text-henna/70 transition-colors">Vault</span>
            {wishlistCount > 0 && (
              <div className="absolute -top-1 -right-3 w-2 h-2 bg-gold rounded-full animate-pulse"></div>
            )}
          </div>

          {/* User Info */}
          <div className="flex items-center gap-4 pl-6 border-l border-henna/8">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-bold text-henna leading-none uppercase tracking-[0.2em]">{user.name}</p>
              <p className="text-[8px] font-medium uppercase tracking-[0.3em] mt-1 text-gold/50">{user.role}</p>
            </div>
            <div
              className="w-10 h-10 rounded-full bg-white border border-henna/8 flex items-center justify-center text-[11px] font-serif text-henna/60 shadow-sm cursor-pointer hover:border-gold/30 hover:shadow-md transition-all duration-300"
              onClick={() => setView('ACCOUNT')}
            >
              {user.name.charAt(0)}
            </div>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="lg:hidden w-10 h-10 flex items-center justify-center"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="text-henna text-xl">{mobileMenuOpen ? '×' : '≡'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-sahara/95 backdrop-blur-xl border-t border-gold/8 p-6 space-y-3">
          {tradeMode === 'WHOLESALE' ? (
            <>
              <NavButton view="B2B_MARKETPLACE" label="Marketplace" />
              <NavButton view="B2B_RFQ" label="RFQ" />
              <NavButton view="B2B_ORDERS" label="Orders" />
              <NavButton view="B2B_MESSAGES" label="Messages" />
            </>
          ) : (
            <>
              <NavButton view="SHOP" label="Collection" />
              <NavButton view="CHEF_ADAFER" label="Atelier" />
              <NavButton view="AI_STUDIO" label="Studio" />
              <NavButton view="ABOUT" label="Intelligence" />
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navigation;
