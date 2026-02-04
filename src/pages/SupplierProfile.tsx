/**
 * OUROZ Supplier Profile Page
 * Page 4 - Public-facing supplier storefront
 * 
 * PAGE OBJECTIVE:
 * Showcase Moroccan supplier's complete business profile to international buyers.
 * Build trust through verification badges, certifications, gallery, and reviews.
 * Enable direct contact, RFQ submission, and product browsing.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    MapPin, Calendar, Users, Globe, Shield, Award, Star,
    MessageCircle, FileText, Phone, Mail, ExternalLink,
    CheckCircle, Clock, TrendingUp, Package, Truck, Play,
    ChevronRight, Heart, Share2, Flag, Building2, Factory
} from 'lucide-react';

interface SupplierProfileProps {
    supplierId: string;
    language: 'en' | 'ar' | 'fr';
    onNavigate: (path: string) => void;
}

interface SupplierData {
    id: string;
    companyName: string;
    companyNameAr?: string;
    companyNameFr?: string;
    logo: string;
    banner: string;
    verificationLevel: 'BASIC' | 'VERIFIED' | 'GOLD' | 'TRUSTED';
    hasTradeAssurance: boolean;
    tradeAssuranceLimit: number;

    // Business Info
    companyType: 'MANUFACTURER' | 'WHOLESALER' | 'TRADING_COMPANY' | 'COOPERATIVE' | 'ARTISAN';
    yearEstablished: number;
    employeeCount: string;
    annualRevenue: string;

    // Location
    region: string;
    city: string;
    fullAddress: string;

    // Export Info
    exportCountries: string[];
    exportExperience: number;
    hasExportLicense: boolean;
    freeZoneCertified: boolean;

    // Certifications
    certifications: { name: string; issuer: string; icon: string }[];

    // Categories
    mainCategories: string[];
    productCount: number;

    // Performance
    responseRate: number;
    responseTime: string;
    onTimeDelivery: number;
    rating: { avg: number; count: number };
    totalTransactions: number;
    repeatBuyerRate: number;

    // Content
    description: string;
    videoUrl?: string;
    gallery: string[];

    // Contact
    contactName: string;
    contactTitle: string;
    languages: string[];

    // Products
    featuredProducts: {
        id: string;
        name: string;
        image: string;
        price: { min: number; max: number };
        moq: number;
        orders: number;
    }[];
}

const MOCK_SUPPLIER: SupplierData = {
    id: 'sup_001',
    companyName: 'Atlas Argan Trading Co.',
    companyNameAr: 'شركة أطلس للزيوت العضوية',
    companyNameFr: 'Atlas Argan Trading Co.',
    logo: 'https://ui-avatars.com/api/?name=Atlas+Argan&background=C4A052&color=fff&size=200',
    banner: 'https://images.unsplash.com/photo-1596097635121-14b63a7e0a66?w=1600',
    verificationLevel: 'GOLD',
    hasTradeAssurance: true,
    tradeAssuranceLimit: 500000,

    companyType: 'MANUFACTURER',
    yearEstablished: 2008,
    employeeCount: '51-100',
    annualRevenue: '$5M - $10M',

    region: 'Souss-Massa',
    city: 'Agadir',
    fullAddress: 'Zone Industrielle Ait Melloul, Agadir 80000, Morocco',

    exportCountries: ['US', 'FR', 'DE', 'GB', 'AE', 'SA', 'JP', 'CA'],
    exportExperience: 15,
    hasExportLicense: true,
    freeZoneCertified: false,

    certifications: [
        { name: 'ISO 9001:2015', issuer: 'Bureau Veritas', icon: '🏅' },
        { name: 'USDA Organic', issuer: 'USDA', icon: '🌿' },
        { name: 'ECOCERT', issuer: 'Ecocert SA', icon: '🌱' },
        { name: 'Fair Trade', issuer: 'FLO-CERT', icon: '🤝' },
    ],

    mainCategories: ['Argan Oil', 'Cosmetics', 'Essential Oils', 'Natural Skincare'],
    productCount: 86,

    responseRate: 98,
    responseTime: '< 2 hours',
    onTimeDelivery: 96,
    rating: { avg: 4.9, count: 324 },
    totalTransactions: 1250,
    repeatBuyerRate: 68,

    description: `Atlas Argan Trading Co. is a leading Moroccan manufacturer and exporter of premium argan oil and natural cosmetics. Founded in 2008 in the heart of the Argan forest region, we work directly with over 200 women's cooperatives to source the finest hand-pressed argan oil.

Our state-of-the-art production facility in Agadir combines traditional extraction methods with modern quality control to deliver products that meet the highest international standards. All our products are certified organic and fair trade.

We export to over 40 countries and have built lasting partnerships with leading beauty brands, retailers, and distributors worldwide.`,

    videoUrl: 'https://example.com/factory-tour.mp4',
    gallery: [
        'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600',
        'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=600',
        'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600',
        'https://images.unsplash.com/photo-1596097635121-14b63a7e0a66?w=600',
    ],

    contactName: 'Ahmed Benali',
    contactTitle: 'Export Manager',
    languages: ['English', 'Arabic', 'French', 'Spanish'],

    featuredProducts: [
        { id: 'p1', name: 'Premium Argan Oil 100ml', image: 'https://picsum.photos/seed/argan1/400', price: { min: 8, max: 12 }, moq: 100, orders: 2450 },
        { id: 'p2', name: 'Argan Oil Hair Serum', image: 'https://picsum.photos/seed/argan2/400', price: { min: 5, max: 8 }, moq: 200, orders: 1820 },
        { id: 'p3', name: 'Organic Prickly Pear Oil', image: 'https://picsum.photos/seed/argan3/400', price: { min: 25, max: 35 }, moq: 50, orders: 980 },
        { id: 'p4', name: 'Natural Black Soap 250g', image: 'https://picsum.photos/seed/argan4/400', price: { min: 2, max: 4 }, moq: 500, orders: 3200 },
    ],
};

const SupplierProfile: React.FC<SupplierProfileProps> = ({ supplierId, language, onNavigate }) => {
    const [activeTab, setActiveTab] = useState<'about' | 'products' | 'gallery' | 'reviews'>('about');
    const supplier = MOCK_SUPPLIER;

    const VerificationBadge = () => {
        const configs = {
            BASIC: { bg: 'bg-gray-100', text: 'text-gray-700', icon: '○', label: 'Basic' },
            VERIFIED: { bg: 'bg-green-100', text: 'text-green-700', icon: '✓', label: 'Verified' },
            GOLD: { bg: 'bg-gradient-to-r from-amber-400 to-amber-600', text: 'text-white', icon: '🏆', label: 'Gold Supplier' },
            TRUSTED: { bg: 'bg-gradient-to-r from-purple-500 to-purple-700', text: 'text-white', icon: '💎', label: 'Trusted' },
        };
        const config = configs[supplier.verificationLevel];
        return (
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${config.bg} ${config.text}`}>
                <span>{config.icon}</span>
                {config.label}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Banner */}
            <div className="relative h-72 md:h-96">
                <img src={supplier.banner} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                {/* Floating Actions */}
                <div className="absolute top-4 right-4 flex gap-2">
                    <button title="Add to favorites" aria-label="Add to favorites" className="p-2 bg-white/90 backdrop-blur rounded-lg hover:bg-white transition">
                        <Heart className="w-5 h-5 text-gray-600" />
                    </button>
                    <button title="Share supplier" aria-label="Share supplier" className="p-2 bg-white/90 backdrop-blur rounded-lg hover:bg-white transition">
                        <Share2 className="w-5 h-5 text-gray-600" />
                    </button>
                    <button title="Report supplier" aria-label="Report supplier" className="p-2 bg-white/90 backdrop-blur rounded-lg hover:bg-white transition">
                        <Flag className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            </div>

            {/* Profile Header */}
            <div className="container mx-auto px-4 -mt-24 relative z-10">
                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Logo & Basic Info */}
                        <div className="flex gap-6">
                            <img
                                src={supplier.logo}
                                alt={supplier.companyName}
                                className="w-24 h-24 md:w-32 md:h-32 rounded-2xl border-4 border-white shadow-lg object-cover"
                            />
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                                    {supplier.companyName}
                                </h1>
                                <div className="flex flex-wrap items-center gap-3 mb-4">
                                    <VerificationBadge />
                                    {supplier.hasTradeAssurance && (
                                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                            <Shield className="w-4 h-4" />
                                            Trade Assurance ${(supplier.tradeAssuranceLimit / 1000)}K
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                    <span className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        {supplier.city}, Morocco
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        Est. {supplier.yearEstablished}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Users className="w-4 h-4" />
                                        {supplier.employeeCount} employees
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Globe className="w-4 h-4" />
                                        Exports to {supplier.exportCountries.length}+ countries
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats & CTA */}
                        <div className="md:ml-auto flex flex-col items-end gap-4">
                            <div className="flex items-center gap-6">
                                <div className="text-center">
                                    <div className="flex items-center gap-1">
                                        <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                                        <span className="text-2xl font-bold">{supplier.rating.avg}</span>
                                    </div>
                                    <p className="text-sm text-gray-500">{supplier.rating.count} reviews</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-green-600">{supplier.responseRate}%</p>
                                    <p className="text-sm text-gray-500">Response rate</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold">{supplier.responseTime}</p>
                                    <p className="text-sm text-gray-500">Response time</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => onNavigate(`/contact/${supplier.id}`)}
                                    className="flex items-center gap-2 bg-amber-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-amber-600 transition"
                                >
                                    <MessageCircle className="w-5 h-5" />
                                    Contact Supplier
                                </button>
                                <button
                                    onClick={() => onNavigate(`/rfq/create?supplier=${supplier.id}`)}
                                    className="flex items-center gap-2 bg-white border-2 border-amber-500 text-amber-600 px-6 py-3 rounded-xl font-semibold hover:bg-amber-50 transition"
                                >
                                    <FileText className="w-5 h-5" />
                                    Request Quote
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b mt-8">
                        {[
                            { id: 'about', label: 'About' },
                            { id: 'products', label: `Products (${supplier.productCount})` },
                            { id: 'gallery', label: 'Gallery' },
                            { id: 'reviews', label: `Reviews (${supplier.rating.count})` },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`px-6 py-4 font-medium transition relative ${activeTab === tab.id
                                    ? 'text-amber-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {tab.label}
                                {activeTab === tab.id && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500"
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {activeTab === 'about' && (
                            <AboutSection supplier={supplier} />
                        )}
                        {activeTab === 'products' && (
                            <ProductsSection products={supplier.featuredProducts} onNavigate={onNavigate} />
                        )}
                        {activeTab === 'gallery' && (
                            <GallerySection gallery={supplier.gallery} videoUrl={supplier.videoUrl} />
                        )}
                        {activeTab === 'reviews' && (
                            <ReviewsSection rating={supplier.rating} />
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <BusinessDetailsCard supplier={supplier} />
                        <CertificationsCard certifications={supplier.certifications} />
                        <ContactCard supplier={supplier} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const AboutSection: React.FC<{ supplier: SupplierData }> = ({ supplier }) => (
    <div className="space-y-6">
        {/* Description */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Company Overview</h2>
            <p className="text-gray-600 whitespace-pre-line leading-relaxed">{supplier.description}</p>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'On-time Delivery', value: `${supplier.onTimeDelivery}%`, icon: Truck, color: 'green' },
                    { label: 'Total Transactions', value: supplier.totalTransactions.toLocaleString(), icon: Package, color: 'blue' },
                    { label: 'Repeat Buyers', value: `${supplier.repeatBuyerRate}%`, icon: Users, color: 'purple' },
                    { label: 'Export Experience', value: `${supplier.exportExperience} years`, icon: Globe, color: 'amber' },
                ].map(metric => (
                    <div key={metric.label} className="text-center p-4 bg-gray-50 rounded-xl">
                        <metric.icon className={`w-8 h-8 mx-auto mb-2 text-${metric.color}-500`} />
                        <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                        <p className="text-sm text-gray-500">{metric.label}</p>
                    </div>
                ))}
            </div>
        </div>

        {/* Export Countries */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Export Markets</h2>
            <div className="flex flex-wrap gap-2">
                {supplier.exportCountries.map(code => (
                    <span key={code} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                        {code}
                    </span>
                ))}
                <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                    +{40 - supplier.exportCountries.length} more countries
                </span>
            </div>
        </div>
    </div>
);

const ProductsSection: React.FC<{
    products: SupplierData['featuredProducts'];
    onNavigate: (path: string) => void;
}> = ({ products, onNavigate }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Featured Products</h2>
            <button className="text-amber-600 hover:text-amber-700 text-sm font-medium flex items-center gap-1">
                View All Products <ChevronRight className="w-4 h-4" />
            </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map(product => (
                <div
                    key={product.id}
                    onClick={() => onNavigate(`/product/${product.id}`)}
                    className="cursor-pointer group"
                >
                    <div className="aspect-square rounded-xl overflow-hidden mb-3">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                    </div>
                    <h3 className="font-medium text-gray-900 text-sm line-clamp-2 group-hover:text-amber-600 transition">
                        {product.name}
                    </h3>
                    <p className="text-amber-600 font-semibold mt-1">
                        ${product.price.min} - ${product.price.max}
                    </p>
                    <p className="text-xs text-gray-500">MOQ: {product.moq} • {product.orders} orders</p>
                </div>
            ))}
        </div>
    </div>
);

const GallerySection: React.FC<{
    gallery: string[];
    videoUrl?: string;
}> = ({ gallery, videoUrl }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Factory & Facility Gallery</h2>
        {videoUrl && (
            <div className="relative aspect-video rounded-xl overflow-hidden mb-4 bg-gray-900">
                <div className="absolute inset-0 flex items-center justify-center">
                    <button title="Play factory tour video" aria-label="Play factory tour video" className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition">
                        <Play className="w-8 h-8 text-amber-600 ml-1" />
                    </button>
                </div>
                <p className="absolute bottom-4 left-4 text-white font-medium">Factory Tour Video</p>
            </div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {gallery.map((img, i) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition">
                    <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                </div>
            ))}
        </div>
    </div>
);

const ReviewsSection: React.FC<{ rating: { avg: number; count: number } }> = ({ rating }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-6 mb-6">
            <div>
                <p className="text-5xl font-bold text-gray-900">{rating.avg}</p>
                <div className="flex items-center mt-1">
                    {[1, 2, 3, 4, 5].map(star => (
                        <Star key={star} className={`w-5 h-5 ${star <= Math.round(rating.avg) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                    ))}
                </div>
                <p className="text-sm text-gray-500 mt-1">{rating.count} reviews</p>
            </div>
            <div className="flex-1">
                {[5, 4, 3, 2, 1].map(stars => (
                    <div key={stars} className="flex items-center gap-2 text-sm">
                        <span className="w-3">{stars}</span>
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full bg-amber-400 rounded-full ${stars === 5 ? 'w-3/4' : stars === 4 ? 'w-[18%]' : stars === 3 ? 'w-[5%]' : 'w-[2%]'}`}
                            />
                        </div>
                        <span className="w-10 text-right text-gray-500">{stars === 5 ? '75%' : stars === 4 ? '18%' : stars === 3 ? '5%' : '2%'}</span>
                    </div>
                ))}
            </div>
        </div>
        {/* Sample reviews would go here */}
        <p className="text-center text-gray-500 py-8">Review details coming soon...</p>
    </div>
);

const BusinessDetailsCard: React.FC<{ supplier: SupplierData }> = ({ supplier }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">Business Details</h3>
        <div className="space-y-3 text-sm">
            <div className="flex justify-between">
                <span className="text-gray-500">Business Type</span>
                <span className="font-medium text-gray-900">{supplier.companyType}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-gray-500">Year Established</span>
                <span className="font-medium text-gray-900">{supplier.yearEstablished}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-gray-500">Employees</span>
                <span className="font-medium text-gray-900">{supplier.employeeCount}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-gray-500">Annual Revenue</span>
                <span className="font-medium text-gray-900">{supplier.annualRevenue}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-gray-500">Location</span>
                <span className="font-medium text-gray-900">{supplier.region}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-gray-500">Export License</span>
                <span className={`font-medium ${supplier.hasExportLicense ? 'text-green-600' : 'text-red-500'}`}>
                    {supplier.hasExportLicense ? 'Verified ✓' : 'Not Verified'}
                </span>
            </div>
        </div>
    </div>
);

const CertificationsCard: React.FC<{
    certifications: { name: string; issuer: string; icon: string }[];
}> = ({ certifications }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">Certifications</h3>
        <div className="space-y-3">
            {certifications.map((cert, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <span className="text-2xl">{cert.icon}</span>
                    <div>
                        <p className="font-medium text-gray-900">{cert.name}</p>
                        <p className="text-xs text-gray-500">{cert.issuer}</p>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-600 ml-auto" />
                </div>
            ))}
        </div>
    </div>
);

const ContactCard: React.FC<{ supplier: SupplierData }> = ({ supplier }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">Contact Information</h3>
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-xl">
                    👤
                </div>
                <div>
                    <p className="font-medium text-gray-900">{supplier.contactName}</p>
                    <p className="text-sm text-gray-500">{supplier.contactTitle}</p>
                </div>
            </div>
            <div className="pt-3 border-t space-y-2 text-sm">
                <p className="text-gray-600">
                    <strong>Languages:</strong> {supplier.languages.join(', ')}
                </p>
                <p className="text-gray-600">
                    <strong>Address:</strong> {supplier.fullAddress}
                </p>
            </div>
        </div>
    </div>
);

export default SupplierProfile;
