/**
 * OUROZ Supplier Dashboard Homepage
 * Page 3 - Morocco-Only Supplier Ecosystem
 * 
 * PAGE OBJECTIVE:
 * Dedicated ecosystem for Moroccan suppliers to manage their business,
 * view buyer inquiries, track orders, and grow their export operations.
 * This is NOT just a filter - it's a complete supplier-centric experience.
 * 
 * USER ACTIONS:
 * - View dashboard metrics (orders, inquiries, views)
 * - Manage products
 * - Respond to RFQs and quotes
 * - Handle messages from buyers
 * - Track orders and shipments
 * - Access verification status
 * - View analytics and reports
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Home, Package, FileText, MessageCircle, Truck, CreditCard,
    BarChart2, Settings, HelpCircle, Bell, ChevronDown, Plus,
    TrendingUp, TrendingDown, Eye, ShoppingCart, Users, Clock,
    Star, Shield, Award, CheckCircle, AlertCircle, Calendar,
    ArrowUpRight, ArrowDownRight, MoreVertical, Filter, Download
} from 'lucide-react';

// Types
interface SupplierDashboardProps {
    language: 'en' | 'ar' | 'fr';
    supplierId: string;
    onNavigate: (path: string) => void;
}

interface DashboardMetrics {
    totalOrders: { value: number; change: number };
    totalRevenue: { value: number; change: number; currency: string };
    productViews: { value: number; change: number };
    inquiries: { value: number; change: number };
    responseRate: { value: number; change: number };
    avgResponseTime: { value: string; change: number };
}

interface PendingItem {
    id: string;
    type: 'rfq' | 'order' | 'message' | 'review';
    title: string;
    subtitle: string;
    time: string;
    priority: 'high' | 'medium' | 'low';
    buyerCountry: string;
}

interface RecentOrder {
    id: string;
    orderNumber: string;
    buyerName: string;
    buyerCountry: string;
    amount: number;
    currency: string;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'completed';
    items: number;
    date: string;
}

// Mock Data
const MOCK_METRICS: DashboardMetrics = {
    totalOrders: { value: 156, change: 12.5 },
    totalRevenue: { value: 284500, change: 18.3, currency: 'USD' },
    productViews: { value: 45200, change: 8.7 },
    inquiries: { value: 89, change: -5.2 },
    responseRate: { value: 94, change: 2.1 },
    avgResponseTime: { value: '2.4h', change: -15.0 },
};

const MOCK_PENDING: PendingItem[] = [
    { id: '1', type: 'rfq', title: 'RFQ for 5000 units of Argan Oil', subtitle: 'Global Beauty Corp', time: '2h ago', priority: 'high', buyerCountry: '🇺🇸' },
    { id: '2', type: 'order', title: 'Order #ORD-2024-001245', subtitle: 'Awaiting confirmation', time: '4h ago', priority: 'high', buyerCountry: '🇩🇪' },
    { id: '3', type: 'message', title: 'New message from Pierre Martin', subtitle: 'Inquiring about bulk pricing', time: '5h ago', priority: 'medium', buyerCountry: '🇫🇷' },
    { id: '4', type: 'rfq', title: 'RFQ for Traditional Carpets', subtitle: 'Home Decor International', time: '8h ago', priority: 'medium', buyerCountry: '🇬🇧' },
    { id: '5', type: 'review', title: 'New review on Ceramic Tagine', subtitle: '⭐⭐⭐⭐⭐ 5.0 rating', time: '1d ago', priority: 'low', buyerCountry: '🇦🇪' },
];

const MOCK_ORDERS: RecentOrder[] = [
    { id: '1', orderNumber: 'ORD-2024-001250', buyerName: 'Organic Beauty Ltd', buyerCountry: '🇺🇸 USA', amount: 12500, currency: 'USD', status: 'processing', items: 250, date: '2024-01-28' },
    { id: '2', orderNumber: 'ORD-2024-001249', buyerName: 'Euro Home Decor', buyerCountry: '🇩🇪 Germany', amount: 8750, currency: 'USD', status: 'shipped', items: 45, date: '2024-01-27' },
    { id: '3', orderNumber: 'ORD-2024-001248', buyerName: 'Maison du Maroc', buyerCountry: '🇫🇷 France', amount: 6200, currency: 'USD', status: 'pending', items: 120, date: '2024-01-27' },
    { id: '4', orderNumber: 'ORD-2024-001247', buyerName: 'Gulf Traders LLC', buyerCountry: '🇦🇪 UAE', amount: 15800, currency: 'USD', status: 'delivered', items: 500, date: '2024-01-26' },
    { id: '5', orderNumber: 'ORD-2024-001246', buyerName: 'British Tea Company', buyerCountry: '🇬🇧 UK', amount: 4200, currency: 'USD', status: 'completed', items: 200, date: '2024-01-25' },
];

const TOP_PRODUCTS = [
    { id: '1', name: 'Premium Argan Oil 100ml', views: 4520, orders: 156, revenue: 12480, trend: 'up' },
    { id: '2', name: 'Handwoven Berber Carpet', views: 3200, orders: 28, revenue: 22400, trend: 'up' },
    { id: '3', name: 'Moroccan Black Soap 250g', views: 2890, orders: 234, revenue: 9360, trend: 'down' },
    { id: '4', name: 'Traditional Zellige Tiles', views: 2100, orders: 12, revenue: 18600, trend: 'up' },
    { id: '5', name: 'Rose Water Toner 200ml', views: 1850, orders: 189, revenue: 7560, trend: 'down' },
];

const TOP_BUYER_COUNTRIES = [
    { country: 'United States', flag: '🇺🇸', orders: 45, revenue: 78500 },
    { country: 'France', flag: '🇫🇷', orders: 38, revenue: 52400 },
    { country: 'Germany', flag: '🇩🇪', orders: 32, revenue: 48200 },
    { country: 'UAE', flag: '🇦🇪', orders: 28, revenue: 42100 },
    { country: 'United Kingdom', flag: '🇬🇧', orders: 24, revenue: 35800 },
];

// Sidebar Navigation Items
const NAV_ITEMS = [
    { id: 'dashboard', icon: Home, label: 'Dashboard', badge: null },
    { id: 'products', icon: Package, label: 'Products', badge: null },
    { id: 'orders', icon: ShoppingCart, label: 'Orders', badge: 3 },
    { id: 'rfq', icon: FileText, label: 'RFQ & Quotes', badge: 5 },
    { id: 'messages', icon: MessageCircle, label: 'Messages', badge: 12 },
    { id: 'shipping', icon: Truck, label: 'Shipping', badge: null },
    { id: 'payments', icon: CreditCard, label: 'Payments', badge: null },
    { id: 'analytics', icon: BarChart2, label: 'Analytics', badge: null },
    { id: 'verification', icon: Shield, label: 'Verification', badge: null },
    { id: 'settings', icon: Settings, label: 'Settings', badge: null },
];

// Main Component
const SupplierDashboard: React.FC<SupplierDashboardProps> = ({ language, supplierId, onNavigate }) => {
    const [activeNav, setActiveNav] = useState('dashboard');
    const [metrics, setMetrics] = useState<DashboardMetrics>(MOCK_METRICS);
    const [pendingItems, setPendingItems] = useState<PendingItem[]>(MOCK_PENDING);
    const [recentOrders, setRecentOrders] = useState<RecentOrder[]>(MOCK_ORDERS);
    const [dateRange, setDateRange] = useState('30d');

    const isRTL = language === 'ar';

    return (
        <div className={`min-h-screen bg-gray-50 flex ${isRTL ? 'flex-row-reverse' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
            {/* Sidebar */}
            <Sidebar
                activeNav={activeNav}
                setActiveNav={setActiveNav}
                onNavigate={onNavigate}
                isRTL={isRTL}
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Top Header */}
                <DashboardHeader
                    dateRange={dateRange}
                    setDateRange={setDateRange}
                    onNavigate={onNavigate}
                />

                {/* Dashboard Content */}
                <main className="flex-1 p-6 overflow-auto">
                    {/* Verification Banner */}
                    <VerificationBanner level="GOLD" onNavigate={onNavigate} />

                    {/* Metrics Grid */}
                    <MetricsGrid metrics={metrics} />

                    {/* Main Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                        {/* Pending Actions */}
                        <div className="lg:col-span-2">
                            <PendingActions items={pendingItems} onNavigate={onNavigate} />
                        </div>

                        {/* Quick Stats */}
                        <div>
                            <QuickStats />
                        </div>
                    </div>

                    {/* Recent Orders & Analytics */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                        <div className="lg:col-span-2">
                            <RecentOrdersTable orders={recentOrders} onNavigate={onNavigate} />
                        </div>
                        <div className="space-y-6">
                            <TopProducts products={TOP_PRODUCTS} />
                            <TopBuyerCountries countries={TOP_BUYER_COUNTRIES} />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

// Sub-components
const Sidebar: React.FC<{
    activeNav: string;
    setActiveNav: (nav: string) => void;
    onNavigate: (path: string) => void;
    isRTL: boolean;
}> = ({ activeNav, setActiveNav, onNavigate, isRTL }) => (
    <aside className={`w-64 bg-white border-gray-200 flex flex-col ${isRTL ? 'border-l' : 'border-r'}`}>
        {/* Logo */}
        <div className="p-6 border-b">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('/')}>
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-700 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl font-serif">ⵣ</span>
                </div>
                <div>
                    <span className="text-xl font-serif font-bold text-gray-900">OUROZ</span>
                    <p className="text-xs text-amber-600 font-medium">Supplier Portal</p>
                </div>
            </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
            {NAV_ITEMS.map(item => (
                <button
                    key={item.id}
                    onClick={() => {
                        setActiveNav(item.id);
                        onNavigate(`/supplier/${item.id}`);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition ${activeNav === item.id
                        ? 'bg-amber-100 text-amber-700'
                        : 'text-gray-600 hover:bg-gray-100'
                        }`}
                >
                    <div className="flex items-center gap-3">
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                    </div>
                    {item.badge && (
                        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                            {item.badge}
                        </span>
                    )}
                </button>
            ))}
        </nav>

        {/* Help */}
        <div className="p-4 border-t">
            <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-xl transition">
                <HelpCircle className="w-5 h-5" />
                <span className="font-medium">Help & Support</span>
            </button>
        </div>
    </aside>
);

const DashboardHeader: React.FC<{
    dateRange: string;
    setDateRange: (range: string) => void;
    onNavigate: (path: string) => void;
}> = ({ dateRange, setDateRange, onNavigate }) => (
    <header className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Supplier Dashboard</h1>
                <p className="text-gray-500">Welcome back, Atlas Trading Co.</p>
            </div>

            <div className="flex items-center gap-4">
                {/* Date Range Selector */}
                <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    title="Select date range"
                    aria-label="Select date range"
                    className="px-4 py-2 border rounded-lg bg-white text-sm"
                >
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                    <option value="90d">Last 90 days</option>
                    <option value="1y">Last year</option>
                </select>

                {/* Notifications */}
                <button title="Notifications" aria-label="Notifications" className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </button>

                {/* Add Product */}
                <button
                    onClick={() => onNavigate('/supplier/products/new')}
                    className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-amber-600 transition"
                >
                    <Plus className="w-4 h-4" />
                    Add Product
                </button>

                {/* Profile */}
                <button title="Profile menu" aria-label="Profile menu" className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg">
                    <img
                        src="https://ui-avatars.com/api/?name=Atlas+Trading&background=C4A052&color=fff"
                        alt=""
                        className="w-8 h-8 rounded-full"
                    />
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
            </div>
        </div>
    </header>
);

const VerificationBanner: React.FC<{
    level: 'BASIC' | 'VERIFIED' | 'GOLD' | 'TRUSTED';
    onNavigate: (path: string) => void;
}> = ({ level, onNavigate }) => {
    const configs = {
        BASIC: { bg: 'bg-gray-100', border: 'border-gray-300', text: 'text-gray-700', icon: '○', message: 'Complete verification to unlock more features' },
        VERIFIED: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', icon: '✓', message: 'Verified Supplier - Upgrade to Gold for more visibility' },
        GOLD: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', icon: '🏆', message: 'Gold Supplier - 3x more visibility, Trade Assurance enabled' },
        TRUSTED: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', icon: '💎', message: 'Trusted Supplier - Maximum visibility and buyer trust' },
    };
    const config = configs[level];

    return (
        <div className={`${config.bg} ${config.text} border ${config.border} rounded-xl p-4 mb-6 flex items-center justify-between`}>
            <div className="flex items-center gap-3">
                <span className="text-2xl">{config.icon}</span>
                <div>
                    <p className="font-semibold">{level} Supplier Status</p>
                    <p className="text-sm opacity-80">{config.message}</p>
                </div>
            </div>
            <button
                onClick={() => onNavigate('/supplier/verification')}
                className={`px-4 py-2 rounded-lg font-medium ${level === 'TRUSTED' ? 'bg-purple-600 text-white' : 'bg-amber-500 text-white'
                    }`}
            >
                {level === 'TRUSTED' ? 'View Benefits' : 'Upgrade Now'}
            </button>
        </div>
    );
};

const MetricsGrid: React.FC<{ metrics: DashboardMetrics }> = ({ metrics }) => {
    const cards = [
        { label: 'Total Orders', value: metrics.totalOrders.value, change: metrics.totalOrders.change, prefix: '', suffix: '', icon: ShoppingCart, color: 'blue' },
        { label: 'Revenue', value: metrics.totalRevenue.value, change: metrics.totalRevenue.change, prefix: '$', suffix: '', icon: CreditCard, color: 'green' },
        { label: 'Product Views', value: metrics.productViews.value, change: metrics.productViews.change, prefix: '', suffix: '', icon: Eye, color: 'purple' },
        { label: 'New Inquiries', value: metrics.inquiries.value, change: metrics.inquiries.change, prefix: '', suffix: '', icon: MessageCircle, color: 'amber' },
        { label: 'Response Rate', value: metrics.responseRate.value, change: metrics.responseRate.change, prefix: '', suffix: '%', icon: Clock, color: 'teal' },
        { label: 'Avg Response', value: metrics.avgResponseTime.value, change: metrics.avgResponseTime.change, prefix: '', suffix: '', icon: TrendingUp, color: 'indigo' },
    ];

    const colorClasses: Record<string, { bg: string; text: string; icon: string }> = {
        blue: { bg: 'bg-blue-50', text: 'text-blue-600', icon: 'text-blue-500' },
        green: { bg: 'bg-green-50', text: 'text-green-600', icon: 'text-green-500' },
        purple: { bg: 'bg-purple-50', text: 'text-purple-600', icon: 'text-purple-500' },
        amber: { bg: 'bg-amber-50', text: 'text-amber-600', icon: 'text-amber-500' },
        teal: { bg: 'bg-teal-50', text: 'text-teal-600', icon: 'text-teal-500' },
        indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', icon: 'text-indigo-500' },
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {cards.map((card, i) => (
                <motion.div
                    key={card.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white rounded-xl p-4 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-3">
                        <div className={`w-10 h-10 ${colorClasses[card.color].bg} rounded-lg flex items-center justify-center`}>
                            <card.icon className={`w-5 h-5 ${colorClasses[card.color].icon}`} />
                        </div>
                        <div className={`flex items-center gap-1 text-sm ${card.change >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                            {card.change >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                            {Math.abs(card.change)}%
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                        {card.prefix}{typeof card.value === 'number' ? card.value.toLocaleString() : card.value}{card.suffix}
                    </p>
                    <p className="text-sm text-gray-500">{card.label}</p>
                </motion.div>
            ))}
        </div>
    );
};

const PendingActions: React.FC<{
    items: PendingItem[];
    onNavigate: (path: string) => void;
}> = ({ items, onNavigate }) => (
    <div className="bg-white rounded-xl shadow-sm">
        <div className="p-4 border-b flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Pending Actions</h2>
            <span className="bg-red-100 text-red-600 text-sm px-3 py-1 rounded-full font-medium">
                {items.length} items need attention
            </span>
        </div>
        <div className="divide-y">
            {items.map(item => (
                <div
                    key={item.id}
                    onClick={() => onNavigate(`/supplier/${item.type}/${item.id}`)}
                    className="p-4 hover:bg-gray-50 cursor-pointer flex items-center gap-4"
                >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.type === 'rfq' ? 'bg-blue-100 text-blue-600' :
                        item.type === 'order' ? 'bg-green-100 text-green-600' :
                            item.type === 'message' ? 'bg-purple-100 text-purple-600' :
                                'bg-amber-100 text-amber-600'
                        }`}>
                        {item.type === 'rfq' && <FileText className="w-5 h-5" />}
                        {item.type === 'order' && <ShoppingCart className="w-5 h-5" />}
                        {item.type === 'message' && <MessageCircle className="w-5 h-5" />}
                        {item.type === 'review' && <Star className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <span className="text-lg">{item.buyerCountry}</span>
                            <p className="font-medium text-gray-900 truncate">{item.title}</p>
                        </div>
                        <p className="text-sm text-gray-500">{item.subtitle}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-400">{item.time}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${item.priority === 'high' ? 'bg-red-100 text-red-600' :
                            item.priority === 'medium' ? 'bg-amber-100 text-amber-600' :
                                'bg-gray-100 text-gray-600'
                            }`}>
                            {item.priority}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const QuickStats: React.FC = () => (
    <div className="bg-white rounded-xl shadow-sm p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h2>
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <span className="text-gray-600">Active Products</span>
                <span className="font-semibold text-gray-900">248</span>
            </div>
            <div className="flex items-center justify-between">
                <span className="text-gray-600">Open RFQs</span>
                <span className="font-semibold text-gray-900">12</span>
            </div>
            <div className="flex items-center justify-between">
                <span className="text-gray-600">Pending Orders</span>
                <span className="font-semibold text-gray-900">5</span>
            </div>
            <div className="flex items-center justify-between">
                <span className="text-gray-600">In-Transit Shipments</span>
                <span className="font-semibold text-gray-900">8</span>
            </div>
            <div className="flex items-center justify-between">
                <span className="text-gray-600">Avg Rating</span>
                <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-semibold text-gray-900">4.8</span>
                    <span className="text-gray-400">(324)</span>
                </div>
            </div>
        </div>
    </div>
);

const RecentOrdersTable: React.FC<{
    orders: RecentOrder[];
    onNavigate: (path: string) => void;
}> = ({ orders, onNavigate }) => {
    const statusStyles: Record<string, { bg: string; text: string }> = {
        pending: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
        processing: { bg: 'bg-blue-100', text: 'text-blue-700' },
        shipped: { bg: 'bg-purple-100', text: 'text-purple-700' },
        delivered: { bg: 'bg-green-100', text: 'text-green-700' },
        completed: { bg: 'bg-gray-100', text: 'text-gray-700' },
    };

    return (
        <div className="bg-white rounded-xl shadow-sm">
            <div className="p-4 border-b flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
                <button
                    onClick={() => onNavigate('/supplier/orders')}
                    className="text-amber-600 hover:text-amber-700 text-sm font-medium"
                >
                    View All
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 text-left">
                        <tr>
                            <th className="px-4 py-3 text-sm font-medium text-gray-500">Order</th>
                            <th className="px-4 py-3 text-sm font-medium text-gray-500">Buyer</th>
                            <th className="px-4 py-3 text-sm font-medium text-gray-500">Amount</th>
                            <th className="px-4 py-3 text-sm font-medium text-gray-500">Status</th>
                            <th className="px-4 py-3 text-sm font-medium text-gray-500">Date</th>
                            <th className="px-4 py-3 text-sm font-medium text-gray-500"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {orders.map(order => (
                            <tr key={order.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3">
                                    <p className="font-medium text-gray-900">{order.orderNumber}</p>
                                    <p className="text-sm text-gray-500">{order.items} items</p>
                                </td>
                                <td className="px-4 py-3">
                                    <p className="font-medium text-gray-900">{order.buyerName}</p>
                                    <p className="text-sm text-gray-500">{order.buyerCountry}</p>
                                </td>
                                <td className="px-4 py-3 font-semibold text-gray-900">
                                    ${order.amount.toLocaleString()}
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusStyles[order.status].bg} ${statusStyles[order.status].text}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-gray-500">{order.date}</td>
                                <td className="px-4 py-3">
                                    <button title="More options" aria-label="More options" className="p-2 hover:bg-gray-100 rounded-lg">
                                        <MoreVertical className="w-4 h-4 text-gray-400" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const TopProducts: React.FC<{ products: typeof TOP_PRODUCTS }> = ({ products }) => (
    <div className="bg-white rounded-xl shadow-sm p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h2>
        <div className="space-y-3">
            {products.slice(0, 5).map((product, i) => (
                <div key={product.id} className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                        {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.orders} orders</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">${product.revenue.toLocaleString()}</p>
                        {product.trend === 'up' ? (
                            <TrendingUp className="w-4 h-4 text-green-500 ml-auto" />
                        ) : (
                            <TrendingDown className="w-4 h-4 text-red-500 ml-auto" />
                        )}
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const TopBuyerCountries: React.FC<{ countries: typeof TOP_BUYER_COUNTRIES }> = ({ countries }) => (
    <div className="bg-white rounded-xl shadow-sm p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Buyer Countries</h2>
        <div className="space-y-3">
            {countries.map((country, i) => (
                <div key={country.country} className="flex items-center gap-3">
                    <span className="text-xl">{country.flag}</span>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{country.country}</p>
                        <p className="text-xs text-gray-500">{country.orders} orders</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">${country.revenue.toLocaleString()}</p>
                </div>
            ))}
        </div>
    </div>
);

export default SupplierDashboard;
