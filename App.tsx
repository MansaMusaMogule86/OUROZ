
import React, { useState, useEffect } from 'react';
import { UserRole, User, ApplicationStatus, Product, ViewType } from './types';
import Navigation from './components/Navigation';
import LandingPage from './components/LandingPage';
import WholesaleGate from './components/WholesaleGate';
import ApplicationForm from './components/ApplicationForm';
import AdminDashboard from './components/Admin/AdminDashboard';
import B2BDashboard from './components/B2B/Dashboard';
import B2CStorefront from './components/B2C/Storefront';
import ProductDetailPage from './components/B2C/ProductDetailPage';
import CartPage, { CartItem } from './components/B2C/CartPage';
import VoiceSupport from './components/VoiceSupport';
import AIStudio from './components/AI/AIStudio';
import Assistant from './components/AI/Assistant';
import CategoryPage from './components/Categories/CategoryPage';
import ChefAtelier from './components/ChefAtelier';
import AboutPage from './components/AboutPage';
import AccountPage from './components/AccountPage';

// B2B Marketplace Pages
import BuyerMarketplace from './src/pages/BuyerMarketplace';
import SupplierDashboard from './src/pages/SupplierDashboard';
import SupplierProfile from './src/pages/SupplierProfile';
import ProductDetail from './src/pages/ProductDetail';
import RFQSystem from './src/pages/RFQSystem';
import MessagingSystem from './src/pages/MessagingSystem';
import OrderManagement from './src/pages/OrderManagement';
import Checkout from './src/pages/Checkout';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('LANDING');
  const [tradeMode, setTradeMode] = useState<'RETAIL' | 'WHOLESALE'>('RETAIL');
  const [user, setUser] = useState<User>({
    id: 'user_dev',
    name: 'Artisan Curator',
    role: UserRole.GUEST,
    status: ApplicationStatus.NONE
  });

  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Wishlist state
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const saved = localStorage.getItem('ouroz_amud_vault');
    return saved ? JSON.parse(saved) : [];
  });

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('ouroz_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [lastAddedId, setLastAddedId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('ouroz_amud_vault', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('ouroz_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  const toggleAmudVault = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (!exists) {
        setLastAddedId(product.id);
        setTimeout(() => setLastAddedId(null), 1000);
      }
      return exists ? prev.filter(p => p.id !== product.id) : [...prev, product];
    });
  };

  const addToCart = (product: Product, qty: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, { product, quantity: qty }];
    });
    setLastAddedId(product.id);
    setTimeout(() => setLastAddedId(null), 1000);
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    setCart(prev => prev.map(item =>
      item.product.id === productId ? { ...item, quantity } : item
    ));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const clearCart = () => setCart([]);

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('PRODUCT_DETAIL');
  };

  const handleModeToggle = (mode: 'RETAIL' | 'WHOLESALE') => {
    setTradeMode(mode);
    if (mode === 'WHOLESALE') {
      if (user.status === ApplicationStatus.APPROVED) {
        setCurrentView('B2B_MARKETPLACE');
      } else {
        setCurrentView('TRADE_GATE');
      }
    } else {
      setCurrentView('SHOP');
    }
  };

  const catProps = (name: string, slug: string) => ({
    categoryName: name,
    categorySlug: slug,
    onBack: () => setCurrentView('SHOP'),
    onAddToCart: (product: Product) => addToCart(product),
    onViewProduct: handleViewProduct,
    wishlist,
    onToggleWishlist: toggleAmudVault,
  });

  const renderContent = () => {
    switch (currentView) {
      case 'LANDING':
        return <LandingPage onShop={() => handleModeToggle('RETAIL')} onTrade={() => handleModeToggle('WHOLESALE')} />;
      case 'SHOP':
        return <B2CStorefront wishlist={wishlist} onToggleWishlist={toggleAmudVault} onNavigateToCategory={(slug) => {
          const catMap: Record<string, ViewType> = {
            'kitchen-accessories': 'CAT_KITCHEN',
            'clothing': 'CAT_CLOTHING',
            'accessories': 'CAT_ACCESSORIES',
            'skin-care': 'CAT_SKINCARE',
            'groceries': 'CAT_GROCERIES'
          };
          setCurrentView(catMap[slug] || 'SHOP');
        }} />;
      case 'PRODUCT_DETAIL':
        return selectedProduct ? (
          <ProductDetailPage
            product={selectedProduct}
            onBack={() => setCurrentView('SHOP')}
            onAddToCart={addToCart}
            onToggleWishlist={toggleAmudVault}
            isInWishlist={wishlist.some(p => p.id === selectedProduct.id)}
            onViewProduct={handleViewProduct}
          />
        ) : (
          <B2CStorefront wishlist={wishlist} onToggleWishlist={toggleAmudVault} onNavigateToCategory={() => {}} />
        );
      case 'CART':
        return (
          <CartPage
            items={cart}
            onUpdateQuantity={updateCartQuantity}
            onRemoveItem={removeFromCart}
            onClearCart={clearCart}
            onContinueShopping={() => setCurrentView('SHOP')}
            onViewProduct={handleViewProduct}
          />
        );
      case 'CHEF_ADAFER':
        return <ChefAtelier onBack={() => setCurrentView('SHOP')} wishlist={wishlist} onToggleVault={toggleAmudVault} />;
      case 'CAT_KITCHEN':
        return <CategoryPage {...catProps('Artisan Kitchen', 'kitchen-accessories')} />;
      case 'CAT_CLOTHING':
        return <CategoryPage {...catProps('Heritage Clothing', 'clothing')} />;
      case 'CAT_ACCESSORIES':
        return <CategoryPage {...catProps('Jewelry & Metalwork', 'accessories')} />;
      case 'CAT_SKINCARE':
        return <CategoryPage {...catProps('Botanical Care', 'skin-care')} />;
      case 'CAT_GROCERIES':
        return <CategoryPage {...catProps('Curated Pantry', 'groceries')} />;
      case 'ABOUT':
        return <AboutPage onBack={() => setCurrentView('SHOP')} />;
      case 'ACCOUNT':
        return (
          <AccountPage
            user={user}
            onBack={() => setCurrentView('SHOP')}
            onUpdateUser={setUser}
            onNavigate={(view) => setCurrentView(view as ViewType)}
          />
        );
      case 'TRADE_GATE':
        return <WholesaleGate onApplyBuyer={() => setCurrentView('APPLY_BUYER')} onApplySupplier={() => setCurrentView('APPLY_SUPPLIER')} onLoginAsAdmin={() => {
          setUser({ id: 'admin_1', name: 'Grand Curator', role: UserRole.ADMIN, status: ApplicationStatus.APPROVED });
          setCurrentView('ADMIN');
        }} />;
      case 'APPLY_BUYER':
        return <ApplicationForm type="BUYER" onCancel={() => setCurrentView('TRADE_GATE')} onSuccess={() => {
          setUser(prev => ({ ...prev, status: ApplicationStatus.PENDING }));
          setCurrentView('TRADE_GATE');
        }} />;
      case 'APPLY_SUPPLIER':
        return <ApplicationForm type="SUPPLIER" onCancel={() => setCurrentView('TRADE_GATE')} onSuccess={() => {
          setUser(prev => ({ ...prev, status: ApplicationStatus.PENDING }));
          setCurrentView('TRADE_GATE');
        }} />;
      case 'TRADE_DASHBOARD':
        return <B2BDashboard role={user.role} />;
      case 'ADMIN':
        return <AdminDashboard />;
      case 'AI_STUDIO':
        return <AIStudio />;
      case 'AMUD_ENGINE':
        return <Assistant isChef={false} wishlist={wishlist} onToggleVault={toggleAmudVault} />;

      // B2B Marketplace Views
      case 'B2B_MARKETPLACE':
        return <BuyerMarketplace language="en" onNavigate={(path) => {
          if (path.startsWith('/supplier/')) setCurrentView('B2B_SUPPLIER_PROFILE');
          else if (path.startsWith('/product/')) setCurrentView('B2B_PRODUCT_DETAIL');
        }} />;
      case 'B2B_SUPPLIER_DASHBOARD':
        return <SupplierDashboard language="en" supplierId="demo" onNavigate={(path) => setCurrentView('B2B_MARKETPLACE')} />;
      case 'B2B_SUPPLIER_PROFILE':
        return <SupplierProfile supplierId="demo" language="en" onNavigate={(path) => {
          if (path === '/marketplace') setCurrentView('B2B_MARKETPLACE');
          else if (path.startsWith('/product/')) setCurrentView('B2B_PRODUCT_DETAIL');
        }} />;
      case 'B2B_PRODUCT_DETAIL':
        return <ProductDetail productSlug="demo-product" language="en" onNavigate={(path) => {
          if (path === '/marketplace') setCurrentView('B2B_MARKETPLACE');
          else if (path === '/checkout') setCurrentView('B2B_CHECKOUT');
          else if (path.startsWith('/supplier/')) setCurrentView('B2B_SUPPLIER_PROFILE');
        }} />;
      case 'B2B_RFQ':
        return <RFQSystem language="en" userId="demo" userType="buyer" onNavigate={(path) => setCurrentView('B2B_MARKETPLACE')} />;
      case 'B2B_MESSAGES':
        return <MessagingSystem language="en" userId="demo" userType="buyer" onNavigate={(path) => setCurrentView('B2B_MARKETPLACE')} />;
      case 'B2B_ORDERS':
        return <OrderManagement language="en" userId="demo" userType="buyer" onNavigate={(path) => setCurrentView('B2B_MARKETPLACE')} />;
      case 'B2B_CHECKOUT':
        return <Checkout language="en" userId="demo" onNavigate={(path) => {
          if (path === '/orders') setCurrentView('B2B_ORDERS');
          else if (path === '/marketplace') setCurrentView('B2B_MARKETPLACE');
        }} />;

      default:
        return <LandingPage onShop={() => handleModeToggle('RETAIL')} onTrade={() => handleModeToggle('WHOLESALE')} />;
    }
  };

  return (
    <div className={`min-h-screen bg-sahara flex flex-col font-sans transition-all duration-1000 overflow-x-hidden ${tradeMode === 'WHOLESALE' ? 'selection:bg-gold/30' : 'selection:bg-indigo/30'}`}>
      <Navigation
        user={user}
        currentView={currentView}
        tradeMode={tradeMode}
        onModeToggle={handleModeToggle}
        setView={setCurrentView}
        wishlistCount={wishlist.length}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
      />

      <main className="container mx-auto px-6 py-12 max-w-7xl flex-1 animate-fade-in relative">
        {renderContent()}
      </main>

      {/* AMUD Vault Icon (Floating Cart Proxy) */}
      <div className="fixed bottom-12 right-12 z-[100] flex flex-col items-end gap-6 pointer-events-none">
        <div className="flex flex-col items-center gap-4 pointer-events-auto">
          <button
            onClick={() => setCurrentView('AMUD_ENGINE')}
            className={`w-20 h-20 rounded-full shadow-amud amud-vault flex items-center justify-center hover:scale-110 transition-all active:scale-95 group relative overflow-hidden bg-white/10 backdrop-blur-3xl border border-gold/40`}
          >
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className={`text-4xl yaz-shimmer font-serif group-hover:animate-iridescent-yz`}>ⵣ</span>
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-indigo text-white text-[10px] font-black w-7 h-7 rounded-full flex items-center justify-center shadow-lg ring-4 ring-sahara animate-bounce">
                {wishlist.length}
              </span>
            )}
          </button>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gold/60">AMUD VAULT</span>
        </div>
      </div>

      {isVoiceOpen && <VoiceSupport onClose={() => setIsVoiceOpen(false)} />}

      {/* Particle Fly Portal */}
      {lastAddedId && (
        <div className="fixed inset-0 pointer-events-none z-[200]">
          <div className="absolute top-1/2 left-1/2 w-8 h-8 bg-gold rounded-full blur-xl animate-particle-fly"></div>
        </div>
      )}
    </div>
  );
};

export default App;
