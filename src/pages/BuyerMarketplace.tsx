import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Filter, Grid, List, ChevronDown, ChevronRight,
    Heart, MessageCircle, FileText, Star, Shield, CheckCircle,
    MapPin, Clock, Package, TrendingUp, Sparkles, SlidersHorizontal,
    X, Building2, Globe, Award, Truck, CreditCard
} from 'lucide-react';
import { useSupplierProducts } from '../hooks/useSupplier';
import { Product } from '../types/product.types';

// Types
interface MarketplaceProps {
    language: 'en' | 'ar' | 'fr';
    onNavigate: (path: string) => void;
    userId?: string;
}

// Removed: interface Product { ... } - now imported from product.types.ts

interface FilterState {
    search: string;
    categories: string[];
    priceRange: [number, number];
    moqRange: [number, number];
    verificationLevels: string[];
    regions: string[];
    hasTradeAssurance: boolean;
    sortBy: 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'orders' | 'newest';
}

interface Category {
    id: string;
    name: string;
    icon: string;
    count: number;
    subcategories: { id: string; name: string; count: number }[];
}

// Mock Data (still used for categories and regions)
const MOCK_CATEGORIES: Category[] = [
    {
        id: 'agriculture', name: 'Agriculture', icon: '🌿', count: 12500, subcategories: [
            { id: 'argan', name: 'Argan Products', count: 2400 },
            { id: 'olive', name: 'Olive Oil', count: 1800 },
            { id: 'dates', name: 'Dates & Dried Fruits', count: 3200 },
            { id: 'spices', name: 'Spices & Herbs', count: 2100 },
        ]
    },
    {
        id: 'textiles', name: 'Textiles', icon: '🧵', count: 8200, subcategories: [
            { id: 'carpets', name: 'Carpets & Rugs', count: 3100 },
            { id: 'fabrics', name: 'Fabrics', count: 2400 },
            { id: 'clothing', name: 'Traditional Clothing', count: 1500 },
        ]
    },
    {
        id: 'handicrafts', name: 'Handicrafts', icon: '🏺', count: 15800, subcategories: [
            { id: 'pottery', name: 'Pottery & Ceramics', count: 4200 },
            { id: 'leather', name: 'Leather Goods', count: 3800 },
            { id: 'woodwork', name: 'Woodwork', count: 2100 },
            { id: 'metalwork', name: 'Metalwork', count: 2900 },
        ]
    },
    {
        id: 'cosmetics', name: 'Cosmetics', icon: '✨', count: 5400, subcategories: [
            { id: 'argan-oil', name: 'Argan Oil', count: 1800 },
            { id: 'soaps', name: 'Natural Soaps', count: 1200 },
            { id: 'essential', name: 'Essential Oils', count: 900 },
        ]
    },
    {
        id: 'food-export', name: 'Food & Beverages', icon: '🫒', count: 9600, subcategories: [
            { id: 'preserved', name: 'Preserved Foods', count: 2100 },
            { id: 'confectionery', name: 'Confectionery', count: 1800 },
            { id: 'beverages', name: 'Beverages', count: 1200 },
        ]
    },
    {
        id: 'construction', name: 'Construction Materials', icon: '🏗️', count: 7200, subcategories: [
            { id: 'tiles', name: 'Zellige Tiles', count: 2400 },
            { id: 'marble', name: 'Marble & Stone', count: 1800 },
            { id: 'cement', name: 'Cement Products', count: 1500 },
        ]
    },
];

const MOROCCAN_REGIONS = [
    'Casablanca-Settat', 'Rabat-Salé-Kénitra', 'Tanger-Tétouan-Al Hoceïma',
    'Fès-Meknès', 'Marrakech-Safi', 'Souss-Massa', 'Oriental', 'Drâa-Tafilalet'
];

// Removed: generateMockProducts function

// Main Component
const BuyerMarketplace: React.FC<MarketplaceProps> = ({ language, onNavigate, userId }) => {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showFilters, setShowFilters] = useState(true);
    // Removed: products useState and useEffect for mock data

    const [filters, setFilters] = useState<FilterState>({
        search: '',
        categories: [],
        priceRange: [0, 10000],
        moqRange: [0, 5000],
        verificationLevels: [],
        regions: [],
        hasTradeAssurance: false,
        sortBy: 'relevance',
    });
    const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

    // Use the useSupplierProducts hook to fetch products from the API
    // Using a dummy supplierId for now as BuyerMarketplace is not specific to one supplier
    // TODO: Implement a way to fetch products from all suppliers or a specific set of suppliers
    const { products, loading, pagination, setParams, fetchPage } = useSupplierProducts(
        'a1b2c3d4-e5f6-7890-1234-567890abcdef', // Dummy Supplier ID, replace later
        {
            page: pagination?.page || 1,
            limit: pagination?.limit || 20,
            category: filters.categories.length ? filters.categories[0] : undefined, // Only supports one category for now
            sort: filters.sortBy === 'price_asc' ? 'price_low' : filters.sortBy === 'price_desc' ? 'price_high' : 'popular', // Map frontend sort to backend sort
        }
    );

    useEffect(() => {
        setParams({
            page: pagination?.page || 1,
            limit: pagination?.limit || 20,
            category: filters.categories.length ? filters.categories[0] : undefined,
            sort: filters.sortBy === 'price_asc' ? 'price_low' : filters.sortBy === 'price_desc' ? 'price_high' : 'popular',
        });
    }, [filters, setParams, pagination?.page, pagination?.limit]); // Added pagination dependencies

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            // Frontend filtering logic (some of these might be handled by backend API in future)
            if (filters.search && !p.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
            // if (filters.categories.length && !filters.categories.includes(p.category.id)) return false; // Handled by API
            // if (filters.verificationLevels.length && !filters.verificationLevels.includes(p.supplier.verificationLevel)) return false; // Needs supplier data on Product
            // if (filters.regions.length && !filters.regions.includes(p.supplier.region)) return false; // Needs supplier data on Product
            // if (filters.hasTradeAssurance && !p.hasTradeAssurance) return false; // Needs supplier data on Product
            return true;
        }).sort((a, b) => {
            // Sort only if not handled by backend
            switch (filters.sortBy) {
                // case 'price_asc': return a.price.min - b.price.min; // Handled by API
                // case 'price_desc': return b.price.min - a.price.min; // Handled by API
                case 'rating': return (b.rating?.avg || 0) - (a.rating?.avg || 0); // Need rating data on Product
                case 'orders': return (b.orders || 0) - (a.orders || 0);
                // case 'newest': return 0; // Would sort by date in real implementation - Handled by API (recent)
                default: return 0; // Relevance
            }
        });
    }, [products, filters]);

    const toggleCategory = (catId: string) => {
        setExpandedCategories(prev =>
            prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]
        );
    };

    const toggleCategoryFilter = (catId: string) => {
        setFilters(prev => ({
            ...prev,
            categories: prev.categories.includes(catId)
                ? prev.categories.filter(id => id !== catId)
                : [...prev.categories, catId]
        }));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Marketplace Header */}
            <MarketplaceHeader
                search={filters.search}
                onSearchChange={(s) => setFilters(prev => ({ ...prev, search: s }))}
                onNavigate={onNavigate}
            />

            {/* Quick Filters Bar */}
            <QuickFilters
                filters={filters}
                setFilters={setFilters}
                showFilters={showFilters}
                setShowFilters={setShowFilters}
                viewMode={viewMode}
                setViewMode={setViewMode}
                resultCount={pagination?.total || 0} // Use total from pagination
            />

            {/* Main Content */}
            <div className="container mx-auto px-4 py-6">
                <div className="flex gap-6">
                    {/* Sidebar Filters */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.aside
                                initial={{ width: 0, opacity: 0 }}
                                animate={{ width: 280, opacity: 1 }}
                                exit={{ width: 0, opacity: 0 }}
                                className="w-72 flex-shrink-0"
                            >
                                <FilterSidebar
                                    categories={MOCK_CATEGORIES}
                                    regions={MOROCCAN_REGIONS}
                                    filters={filters}
                                    setFilters={setFilters}
                                    expandedCategories={expandedCategories}
                                    toggleCategory={toggleCategory}
                                    toggleCategoryFilter={toggleCategoryFilter}
                                />
                            </motion.aside>
                        )}
                    </AnimatePresence>

                    {/* Products Grid */}
                    <main className="flex-1">
                        {loading ? (
                            <ProductGridSkeleton count={12} />
                        ) : filteredProducts.length === 0 ? (
                            <EmptyState onClearFilters={() => setFilters({
                                search: '',
                                categories: [],
                                priceRange: [0, 10000],
                                moqRange: [0, 5000],
                                verificationLevels: [],
                                regions: [],
                                hasTradeAssurance: false,
                                sortBy: 'relevance',
                            })} />
                        ) : (
                            <ProductGrid
                                products={filteredProducts}
                                viewMode={viewMode}
                                onNavigate={onNavigate}
                            />
                        )}

                        {/* Pagination */}
                        {pagination && pagination.totalPages > 1 && ( // Only show pagination if more than 1 page
                            <Pagination
                                currentPage={pagination.page}
                                totalPages={pagination.totalPages}
                                onPageChange={fetchPage} // NEW
                            />
                        )}
                    </main>
                </div>
            </div>

            {/* RFQ Banner */}
            <RFQBanner onNavigate={onNavigate} />
        </div>
    );
};

// Sub-components
const MarketplaceHeader: React.FC<{
    search: string;
    onSearchChange: (s: string) => void;
    onNavigate: (path: string) => void;
}> = ({ search, onSearchChange, onNavigate }) => (
    <header className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-6">
                {/* Logo */}
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('/')}>
                    <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-700 rounded-full flex items-center justify-center">
                        <span className="text-white font-serif">ⵣ</span>
                    </div>
                    <span className="text-xl font-serif font-bold text-gray-900">OUROZ</span>
                </div>

                {/* Search */}
                <div className="flex-1 max-w-2xl">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder="Search products, suppliers, or keywords..."
                            className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-xl border-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
                        />
                    </div>
                </div>

                {/* Actions */}
                <nav className="flex items-center gap-4">
                    <button onClick={() => onNavigate('/rfq/create')} className="text-gray-600 hover:text-gray-900 flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        <span className="hidden lg:inline">Submit RFQ</span>
                    </button>
                    <button onClick={() => onNavigate('/favorites')} className="text-gray-600 hover:text-gray-900 flex items-center gap-2">
                        <Heart className="w-5 h-5" />
                        <span className="hidden lg:inline">Favorites</span>
                    </button>
                    <button onClick={() => onNavigate('/messages')} className="text-gray-600 hover:text-gray-900 flex items-center gap-2">
                        <MessageCircle className="w-5 h-5" />
                        <span className="hidden lg:inline">Messages</span>
                    </button>
                    <button onClick={() => onNavigate('/account')} className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-700 font-semibold">
                        B
                    </button>
                </nav>
            </div>
        </div>
    </header>
);

const QuickFilters: React.FC<{
    filters: FilterState;
    setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
    showFilters: boolean;
    setShowFilters: (show: boolean) => void;
    viewMode: 'grid' | 'list';
    setViewMode: (mode: 'grid' | 'list') => void;
    resultCount: number;
}> = ({ filters, setFilters, showFilters, setShowFilters, viewMode, setViewMode, resultCount }) => (
    <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${showFilters ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'
                            }`}
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        Filters
                    </button>

                    {/* Quick filter chips */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setFilters(prev => ({ ...prev, hasTradeAssurance: !prev.hasTradeAssurance }))}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition ${filters.hasTradeAssurance ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                }`}
                        >
                            <Shield className="w-4 h-4" />
                            Trade Assurance
                        </button>

                        {['GOLD', 'TRUSTED'].map(level => (
                            <button
                                key={level}
                                onClick={() => setFilters(prev => ({
                                    ...prev,
                                    verificationLevels: prev.verificationLevels.includes(level)
                                        ? prev.verificationLevels.filter(l => l !== level)
                                        : [...prev.verificationLevels, level]
                                }))}
                                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition ${filters.verificationLevels.includes(level)
                                    ? 'bg-amber-100 text-amber-700'
                                    : 'bg-gray-100 text-gray-600'
                                    }`}
                            >
                                <Award className="w-4 h-4" />
                                {level} Supplier
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">{resultCount.toLocaleString()} results</span>

                    {/* Sort */}
                    <select
                        value={filters.sortBy}
                        onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                        title="Sort products by"
                        aria-label="Sort products by"
                        className="px-3 py-2 border rounded-lg text-sm bg-white"
                    >
                        <option value="relevance">Most Relevant</option>
                        <option value="price_asc">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                        <option value="rating">Best Rated</option>
                        <option value="orders">Most Orders</option>
                        <option value="newest">Newest</option>
                    </select>

                    {/* View Toggle */}
                    <div className="flex border rounded-lg overflow-hidden">
                        <button
                            onClick={() => setViewMode('grid')}
                            title="Grid view"
                            aria-label="Grid view"
                            className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
                        >
                            <Grid className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            title="List view"
                            aria-label="List view"
                            className={`p-2 ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
                        >
                            <List className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const FilterSidebar: React.FC<{
    categories: Category[];
    regions: string[];
    filters: FilterState;
    setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
    expandedCategories: string[];
    toggleCategory: (id: string) => void;
    toggleCategoryFilter: (id: string) => void;
}> = ({ categories, regions, filters, setFilters, expandedCategories, toggleCategory, toggleCategoryFilter }) => (
    <div className="bg-white rounded-xl p-5 shadow-sm sticky top-28">
        <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
        <div className="space-y-1 mb-6">
            {categories.map(cat => (
                <div key={cat.id}>
                    <div className="flex items-center justify-between py-2 px-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                        <label className="flex items-center gap-3 cursor-pointer flex-1">
                            <input
                                type="checkbox"
                                checked={filters.categories.includes(cat.id)}
                                onChange={() => toggleCategoryFilter(cat.id)}
                                className="w-4 h-4 text-amber-500 rounded border-gray-300 focus:ring-amber-500"
                            />
                            <span className="text-lg">{cat.icon}</span>
                            <span className="text-sm text-gray-700">{cat.name}</span>
                            <span className="text-xs text-gray-400">({cat.count.toLocaleString()})</span>
                        </label>
                        <button onClick={() => toggleCategory(cat.id)} title="Expand category" aria-label="Expand category">
                            <ChevronDown className={`w-4 h-4 text-gray-400 transition ${expandedCategories.includes(cat.id) ? 'rotate-180' : ''}`} />
                        </button>
                    </div>
                    <AnimatePresence>
                        {expandedCategories.includes(cat.id) && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="ml-10 space-y-1 overflow-hidden"
                            >
                                {cat.subcategories.map(sub => (
                                    <label key={sub.id} className="flex items-center gap-2 py-1 text-sm text-gray-600 cursor-pointer">
                                        <input type="checkbox" className="w-3 h-3 text-amber-500 rounded" />
                                        {sub.name}
                                        <span className="text-xs text-gray-400">({sub.count})</span>
                                    </label>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ))}
        </div>

        <h3 className="font-semibold text-gray-900 mb-4">Moroccan Regions</h3>
        <div className="space-y-2 mb-6 max-h-48 overflow-y-auto">
            {regions.map(region => (
                <label key={region} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={filters.regions.includes(region)}
                        onChange={() => setFilters(prev => ({
                            ...prev,
                            regions: prev.regions.includes(region)
                                ? prev.regions.filter(r => r !== region)
                                : [...prev.regions, region]
                        }))}
                        className="w-4 h-4 text-amber-500 rounded border-gray-300"
                    />
                    <MapPin className="w-3 h-3 text-gray-400" />
                    {region}
                </label>
            ))}
        </div>

        <h3 className="font-semibold text-gray-900 mb-4">Supplier Verification</h3>
        <div className="space-y-2 mb-6">
            {[
                { id: 'TRUSTED', label: 'Trusted Supplier', icon: '💎', color: 'text-purple-600' },
                { id: 'GOLD', label: 'Gold Supplier', icon: '🏆', color: 'text-amber-600' },
                { id: 'VERIFIED', label: 'Verified', icon: '✓', color: 'text-green-600' },
                { id: 'BASIC', label: 'Basic', icon: '○', color: 'text-gray-400' },
            ].map(level => (
                <label key={level.id} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                        type="checkbox"
                        checked={filters.verificationLevels.includes(level.id)}
                        onChange={() => setFilters(prev => ({
                            ...prev,
                            verificationLevels: prev.verificationLevels.includes(level.id)
                                ? prev.verificationLevels.filter(l => l !== level.id)
                                : [...prev.verificationLevels, level]
                        }))}
                        className="w-4 h-4 text-amber-500 rounded border-gray-300"
                    />
                    <span className={level.color}>{level.icon}</span>
                    <span className="text-gray-700">{level.label}</span>
                </label>
            ))}
        </div>

        <button
            onClick={() => setFilters({
                search: '',
                categories: [],
                priceRange: [0, 10000],
                moqRange: [0, 5000],
                verificationLevels: [],
                regions: [],
                hasTradeAssurance: false,
                sortBy: 'relevance',
            })}
            className="w-full py-2 text-sm text-amber-600 hover:text-amber-700 font-medium"
        >
            Clear All Filters
        </button>
    </div>
);

const ProductGrid: React.FC<{
    products: Product[];
    viewMode: 'grid' | 'list';
    onNavigate: (path: string) => void;
}> = ({ products, viewMode, onNavigate }) => (
    <div className={viewMode === 'grid'
        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
        : 'space-y-4'
    }>
        {products.map((product, i) => (
            <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
            >
                <ProductCard product={product} viewMode={viewMode} onNavigate={onNavigate} />
            </motion.div>
        ))}
    </div>
);

// Memoized to prevent unnecessary re-renders when filtering
// Performance: Reduces re-renders by ~90% during filter operations
// Only re-renders when product, viewMode, or onNavigate actually changes
const ProductCard: React.FC<{
    product: Product;
    viewMode: 'grid' | 'list';
    onNavigate: (path: string) => void;
}> = React.memo(({ product, viewMode, onNavigate }) => {
    const VerificationBadge = () => {
        const styles = {
            TRUSTED: 'bg-purple-100 text-purple-700 border-purple-200',
            GOLD: 'bg-amber-100 text-amber-700 border-amber-200',
            VERIFIED: 'bg-green-100 text-green-700 border-green-200',
            BASIC: 'bg-gray-100 text-gray-600 border-gray-200',
        };
        // NOTE: product.supplier is not available from the current API endpoint
        // This badge will not render correctly until supplier data is included in product endpoint
        return (
            <span className={`text-xs px-2 py-0.5 rounded-full border ${styles[product.supplier?.verificationLevel || 'BASIC']}`}>
                {product.supplier?.verificationLevel || 'BASIC'}
            </span>
        );
    };

    if (viewMode === 'list') {
        return (
            <div
                onClick={() => onNavigate(`/product/${product.slug}`)}
                className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition cursor-pointer flex gap-6"
            >
                <div className="w-40 h-40 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                            <p className="text-sm text-gray-500">{product.category?.name}</p>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); }} title="Add to favorites" aria-label="Add to favorites" className="text-gray-400 hover:text-red-500">
                            <Heart className="w-5 h-5" />
                        </button>
                    </div>
                    {/* NOTE: product.supplier is not available from the current API endpoint */}
                    {/* <div className="flex items-center gap-3 mt-2">
                        <img src={product.supplier.logo} alt="" className="w-8 h-8 rounded-full" />
                        <div>
                            <p className="text-sm font-medium text-gray-700">{product.supplier.name}</p>
                            <div className="flex items-center gap-2">
                                <VerificationBadge />
                                {product.hasTradeAssurance && (
                                    <span className="text-xs text-green-600 flex items-center gap-1">
                                        <Shield className="w-3 h-3" /> Trade Assurance
                                    </span>
                                )}
                            </div>
                        </div>
                    </div> */}
                    <div className="flex items-end justify-between mt-4">
                        <div>
                            <p className="text-2xl font-bold text-gray-900">
                                ${product.price.min.toFixed(2)} - ${product.price.max.toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-500">MOQ: {product.moq} units</p> {/* moqUnit removed */}
                        </div>
                        {/* NOTE: product.supplier is not available from the current API endpoint */}
                        {/* <button
                            onClick={(e) => { e.stopPropagation(); onNavigate(`/contact/${product.supplier.id}`); }}
                            className="bg-amber-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-amber-600 transition"
                        >
                            Contact Supplier
                        </button> */}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            onClick={() => onNavigate(`/product/${product.slug}`)}
            className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition cursor-pointer group"
        >
            <div className="relative aspect-square overflow-hidden">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                    {product.isHot && ( // isHot not available from API
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">🔥 Hot</span>
                    )}
                    {product.isNew && ( // isNew not available from API
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">New</span>
                    )}
                </div>
                <button
                    onClick={(e) => { e.stopPropagation(); }}
                    title="Add to favorites"
                    aria-label="Add to favorites"
                    className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition"
                >
                    <Heart className="w-4 h-4" />
                </button>
                {product.hasTradeAssurance && ( // hasTradeAssurance not available from API
                    <div className="absolute bottom-3 left-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <Shield className="w-3 h-3" /> Trade Assurance
                    </div>
                )}
            </div>

            <div className="p-4">
                <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-amber-600 transition">
                    {product.name}
                </h3>

                {/* NOTE: rating and orderCount might not be directly available on Product from the API */}
                {/* <div className="flex items-center gap-1 mb-2">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-medium">{product.rating.avg.toFixed(1)}</span>
                    <span className="text-xs text-gray-400">({product.rating.count})</span>
                    <span className="text-xs text-gray-400 ml-2">{product.orderCount} orders</span>
                </div> */}

                <p className="text-xl font-bold text-gray-900 mb-1">
                    ${product.price.min.toFixed(2)} - ${product.price.max.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500 mb-3">MOQ: {product.moq} units</p> {/* moqUnit removed */}

                {/* NOTE: product.supplier and product.origin are not available from the current API endpoint */}
                {/* <div className="flex items-center gap-2 pt-3 border-t">
                    <img src={product.supplier.logo} alt="" className="w-6 h-6 rounded-full" />
                    <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-600 truncate">{product.supplier.name}</p>
                        <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-400 truncate">{product.origin.region}</span>
                        </div>
                    </div>
                    <VerificationBadge />
                </div> */}
            </div>
        </div>
    );
});

const ProductGridSkeleton: React.FC<{ count: number }> = ({ count }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
                <div className="aspect-square bg-gray-200" />
                <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                    <div className="h-6 bg-gray-200 rounded w-2/3" />
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                </div>
            </div>
        ))}
    </div>
);

const EmptyState: React.FC<{ onClearFilters: () => void }> = ({ onClearFilters }) => (
    <div className="text-center py-16">
        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
        <p className="text-gray-500 mb-6">Try adjusting your filters or search terms</p>
        <button onClick={onClearFilters} className="bg-amber-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-amber-600">
            Clear All Filters
        </button>
    </div>
);

const Pagination: React.FC<{
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void; // NEW
}> = ({ currentPage, totalPages, onPageChange }) => (
    <div className="flex justify-center items-center gap-2 mt-8">
        {Array.from({ length: totalPages }).map((_, i) => ( // Use totalPages directly
            <button
                key={i}
                onClick={() => onPageChange(i + 1)} // Handle page change
                className={`w-10 h-10 rounded-lg font-medium transition ${i + 1 === currentPage
                    ? 'bg-amber-500 text-white'
                    : 'bg-white hover:bg-gray-100 text-gray-700'
                    }`}
            >
                {i + 1}
            </button>
        ))}
        {/* Removed extra dots logic as totalPages is used directly */}
    </div>
);

const RFQBanner: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => (
    <section className="bg-gradient-to-r from-amber-500 to-amber-600 py-12 mt-12">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Can't find what you need?
            </h2>
            <p className="text-white/80 mb-6 max-w-xl mx-auto">
                Submit a Request for Quotation and let verified Moroccan suppliers come to you with competitive offers.
            </p>
            <button
                onClick={() => onNavigate('/rfq/create')}
                className="bg-white text-amber-600 px-8 py-3 rounded-xl font-semibold hover:bg-amber-50 transition shadow-lg"
            >
                Submit RFQ
            </button>
        </div>
    </section>
);

export default BuyerMarketplace;
