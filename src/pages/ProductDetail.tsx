/**
 * OUROZ Product Detail Page
 * Page 6 - Complete product information and purchase flow
 * 
 * PAGE OBJECTIVE:
 * Provide comprehensive product information to buyers, build trust through
 * supplier verification, enable direct contact/RFQ, and showcase product
 * specifications, pricing tiers, and origin certification.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft, ChevronRight, Heart, Share2, Shield, Star,
    MapPin, Clock, Package, Truck, MessageCircle, FileText,
    CheckCircle, AlertCircle, Info, Play, Download, Minus, Plus,
    Award, Globe, Users, TrendingUp, CreditCard, Building2
} from 'lucide-react';

interface ProductDetailProps {
    productSlug: string;
    language: 'en' | 'ar' | 'fr';
    onNavigate: (path: string) => void;
}

interface ProductData {
    id: string;
    name: string;
    nameAr?: string;
    nameFr?: string;
    slug: string;
    sku: string;

    // Media
    mainImage: string;
    gallery: string[];
    videoUrl?: string;

    // Description
    shortDescription: string;
    fullDescription: string;

    // Pricing
    priceType: 'FIXED' | 'TIERED' | 'NEGOTIABLE';
    priceTiers: { minQty: number; maxQty?: number; price: number }[];
    currency: string;

    // MOQ & Lead Time
    moq: number;
    moqUnit: string;
    maxOrderQty?: number;
    leadTime: { min: number; max: number };

    // Origin
    origin: {
        country: string;
        region: string;
        certified: boolean;
        certificateUrl?: string;
    };
    hsCode?: string;

    // Specifications
    specifications: { name: string; value: string }[];

    // Samples
    sampleAvailable: boolean;
    samplePrice?: number;
    sampleLeadTime?: number;

    // Customization
    customizationAvailable: boolean;
    customizationDetails?: string;

    // Shipping
    weight: number;
    dimensions: { l: number; w: number; h: number };
    packagingDetails: string;

    // Supplier
    supplier: {
        id: string;
        name: string;
        logo: string;
        verificationLevel: 'BASIC' | 'VERIFIED' | 'GOLD' | 'TRUSTED';
        hasTradeAssurance: boolean;
        tradeAssuranceLimit: number;
        responseRate: number;
        responseTime: string;
        onTimeDelivery: number;
        rating: { avg: number; count: number };
        yearEstablished: number;
        location: string;
    };

    // Metrics
    rating: { avg: number; count: number };
    orderCount: number;
    viewCount: number;

    // Status
    inStock: boolean;
    isFeatured: boolean;
    isHot: boolean;

    // Related
    relatedProducts: {
        id: string;
        name: string;
        image: string;
        price: number;
        moq: number;
    }[];
}

const MOCK_PRODUCT: ProductData = {
    id: 'prod_001',
    name: 'Premium Organic Argan Oil - 100ml Cold Pressed',
    nameAr: 'زيت أركان عضوي ممتاز',
    nameFr: 'Huile d\'Argan Biologique Premium',
    slug: 'premium-organic-argan-oil-100ml',
    sku: 'ARG-100-ORG-001',

    mainImage: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800',
    gallery: [
        'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800',
        'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=800',
        'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800',
        'https://images.unsplash.com/photo-1596097635121-14b63a7e0a66?w=800',
    ],
    videoUrl: 'https://example.com/product-video.mp4',

    shortDescription: '100% pure, cold-pressed organic argan oil from the Souss-Massa region of Morocco. Certified USDA Organic and ECOCERT.',
    fullDescription: `Our Premium Organic Argan Oil is extracted using traditional cold-press methods from argan nuts harvested in the UNESCO-protected Argan Biosphere Reserve.

Key Benefits:
• 100% pure and unrefined
• Cold-pressed to preserve nutrients
• Rich in Vitamin E and essential fatty acids
• Suitable for cosmetic and culinary use
• Certified organic and fair trade

Production Process:
Each bottle represents hours of careful work by the women's cooperatives in the Souss-Massa region. The argan nuts are hand-cracked and cold-pressed to extract the precious golden oil, which is then filtered and packaged in UV-protective glass bottles.

Quality Assurance:
Every batch is tested for purity and quality. We provide certificates of analysis upon request.`,

    priceType: 'TIERED',
    priceTiers: [
        { minQty: 100, maxQty: 499, price: 12.00 },
        { minQty: 500, maxQty: 999, price: 10.50 },
        { minQty: 1000, maxQty: 4999, price: 9.00 },
        { minQty: 5000, price: 7.50 },
    ],
    currency: 'USD',

    moq: 100,
    moqUnit: 'bottles',
    maxOrderQty: 50000,
    leadTime: { min: 14, max: 21 },

    origin: {
        country: 'Morocco',
        region: 'Souss-Massa',
        certified: true,
        certificateUrl: '/certificates/origin-001.pdf',
    },
    hsCode: '1515.90.11',

    specifications: [
        { name: 'Volume', value: '100ml' },
        { name: 'Packaging', value: 'Amber glass bottle with dropper' },
        { name: 'Shelf Life', value: '24 months' },
        { name: 'Storage', value: 'Cool, dry place away from sunlight' },
        { name: 'Ingredients', value: '100% Argania Spinosa Kernel Oil' },
        { name: 'Organic Certification', value: 'USDA Organic, ECOCERT' },
        { name: 'Grade', value: 'Cosmetic/Food Grade' },
        { name: 'Color', value: 'Golden Yellow' },
        { name: 'Odor', value: 'Mild, nutty' },
    ],

    sampleAvailable: true,
    samplePrice: 15,
    sampleLeadTime: 5,

    customizationAvailable: true,
    customizationDetails: 'Private labeling available. Custom packaging (bottles, labels, boxes) for orders 1000+. OEM manufacturing available.',

    weight: 0.15,
    dimensions: { l: 4, w: 4, h: 12 },
    packagingDetails: '25 bottles per inner carton, 100 bottles per master carton. Palletization available.',

    supplier: {
        id: 'sup_001',
        name: 'Atlas Argan Trading Co.',
        logo: 'https://ui-avatars.com/api/?name=Atlas+Argan&background=C4A052&color=fff&size=100',
        verificationLevel: 'GOLD',
        hasTradeAssurance: true,
        tradeAssuranceLimit: 500000,
        responseRate: 98,
        responseTime: '< 2 hours',
        onTimeDelivery: 96,
        rating: { avg: 4.9, count: 324 },
        yearEstablished: 2008,
        location: 'Agadir, Morocco',
    },

    rating: { avg: 4.8, count: 156 },
    orderCount: 2450,
    viewCount: 45200,

    inStock: true,
    isFeatured: true,
    isHot: true,

    relatedProducts: [
        { id: 'p2', name: 'Argan Oil Hair Serum 50ml', image: 'https://picsum.photos/seed/rel1/300', price: 8.50, moq: 200 },
        { id: 'p3', name: 'Organic Prickly Pear Oil 30ml', image: 'https://picsum.photos/seed/rel2/300', price: 28.00, moq: 50 },
        { id: 'p4', name: 'Argan Oil Body Lotion 200ml', image: 'https://picsum.photos/seed/rel3/300', price: 6.00, moq: 300 },
        { id: 'p5', name: 'Pure Rose Water 250ml', image: 'https://picsum.photos/seed/rel4/300', price: 4.50, moq: 200 },
    ],
};

const ProductDetail: React.FC<ProductDetailProps> = ({ productSlug, language, onNavigate }) => {
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(100);
    const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'shipping' | 'reviews'>('description');
    const product = MOCK_PRODUCT;

    const currentPrice = product.priceTiers.find(tier =>
        quantity >= tier.minQty && (!tier.maxQty || quantity <= tier.maxQty)
    )?.price || product.priceTiers[0].price;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Breadcrumb */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <button onClick={() => onNavigate('/')} className="hover:text-amber-600">Home</button>
                        <ChevronRight className="w-4 h-4" />
                        <button onClick={() => onNavigate('/category/cosmetics')} className="hover:text-amber-600">Cosmetics</button>
                        <ChevronRight className="w-4 h-4" />
                        <button onClick={() => onNavigate('/category/argan-oil')} className="hover:text-amber-600">Argan Oil</button>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-gray-900 truncate">{product.name}</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* Product Gallery */}
                    <div>
                        <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-sm mb-4">
                            <img
                                src={product.gallery[selectedImage]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                            {product.isHot && (
                                <span className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                    🔥 Hot Product
                                </span>
                            )}
                            <div className="absolute top-4 right-4 flex gap-2">
                                <button title="Add to favorites" aria-label="Add to favorites" className="w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center hover:bg-white transition">
                                    <Heart className="w-5 h-5 text-gray-600" />
                                </button>
                                <button title="Share product" aria-label="Share product" className="w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center hover:bg-white transition">
                                    <Share2 className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>
                            {product.videoUrl && (
                                <button className="absolute bottom-4 right-4 flex items-center gap-2 bg-black/70 text-white px-4 py-2 rounded-full text-sm hover:bg-black/80 transition">
                                    <Play className="w-4 h-4" />
                                    Watch Video
                                </button>
                            )}
                        </div>
                        <div className="flex gap-3">
                            {product.gallery.map((img, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedImage(i)}
                                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition ${selectedImage === i ? 'border-amber-500' : 'border-transparent'
                                        }`}
                                >
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

                        {/* Ratings & Stats */}
                        <div className="flex flex-wrap items-center gap-4 mb-6">
                            <div className="flex items-center gap-1">
                                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                                <span className="font-semibold">{product.rating.avg}</span>
                                <span className="text-gray-500">({product.rating.count} reviews)</span>
                            </div>
                            <span className="text-gray-300">|</span>
                            <span className="text-gray-600">{product.orderCount.toLocaleString()} orders</span>
                            <span className="text-gray-300">|</span>
                            <span className="text-gray-600">{product.viewCount.toLocaleString()} views</span>
                        </div>

                        {/* Price Tiers */}
                        <div className="bg-amber-50 rounded-2xl p-6 mb-6">
                            <div className="flex items-end gap-2 mb-4">
                                <span className="text-4xl font-bold text-gray-900">${currentPrice.toFixed(2)}</span>
                                <span className="text-gray-600 mb-1">/ {product.moqUnit.slice(0, -1)}</span>
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                                {product.priceTiers.map((tier, i) => (
                                    <div
                                        key={i}
                                        className={`p-3 rounded-xl text-center cursor-pointer transition ${quantity >= tier.minQty && (!tier.maxQty || quantity <= tier.maxQty)
                                            ? 'bg-amber-500 text-white'
                                            : 'bg-white text-gray-700 hover:bg-amber-100'
                                            }`}
                                        onClick={() => setQuantity(tier.minQty)}
                                    >
                                        <p className="font-bold">${tier.price.toFixed(2)}</p>
                                        <p className="text-xs opacity-80">
                                            {tier.minQty}{tier.maxQty ? `-${tier.maxQty}` : '+'}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quantity Selector */}
                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-gray-600">Quantity:</span>
                            <div className="flex items-center border rounded-xl overflow-hidden">
                                <button
                                    onClick={() => setQuantity(Math.max(product.moq, quantity - 100))}
                                    title="Decrease quantity"
                                    aria-label="Decrease quantity"
                                    className="px-4 py-3 hover:bg-gray-100 transition"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.max(product.moq, parseInt(e.target.value) || product.moq))}
                                    title="Quantity"
                                    aria-label="Quantity"
                                    className="w-24 text-center border-x py-3 font-semibold"
                                />
                                <button
                                    onClick={() => setQuantity(quantity + 100)}
                                    title="Increase quantity"
                                    aria-label="Increase quantity"
                                    className="px-4 py-3 hover:bg-gray-100 transition"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                            <span className="text-gray-500">
                                MOQ: {product.moq} {product.moqUnit}
                            </span>
                        </div>

                        {/* Total */}
                        <div className="flex items-center justify-between p-4 bg-gray-100 rounded-xl mb-6">
                            <span className="text-gray-600">Total Price:</span>
                            <span className="text-2xl font-bold text-gray-900">
                                ${(currentPrice * quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </span>
                        </div>

                        {/* Key Info */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="flex items-center gap-3 p-3 bg-white rounded-xl border">
                                <Clock className="w-5 h-5 text-amber-500" />
                                <div>
                                    <p className="text-sm text-gray-500">Lead Time</p>
                                    <p className="font-semibold">{product.leadTime.min}-{product.leadTime.max} days</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-white rounded-xl border">
                                <MapPin className="w-5 h-5 text-amber-500" />
                                <div>
                                    <p className="text-sm text-gray-500">Origin</p>
                                    <p className="font-semibold">{product.origin.region}, Morocco</p>
                                </div>
                            </div>
                            {product.sampleAvailable && (
                                <div className="flex items-center gap-3 p-3 bg-white rounded-xl border">
                                    <Package className="w-5 h-5 text-amber-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">Sample</p>
                                        <p className="font-semibold">${product.samplePrice} ({product.sampleLeadTime} days)</p>
                                    </div>
                                </div>
                            )}
                            {product.customizationAvailable && (
                                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-200">
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                    <div>
                                        <p className="text-sm text-green-700">Customization</p>
                                        <p className="font-semibold text-green-700">Available</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex gap-4 mb-6">
                            <button
                                onClick={() => onNavigate(`/contact/${product.supplier.id}?product=${product.id}`)}
                                className="flex-1 flex items-center justify-center gap-2 bg-amber-500 text-white py-4 rounded-xl font-semibold hover:bg-amber-600 transition"
                            >
                                <MessageCircle className="w-5 h-5" />
                                Contact Supplier
                            </button>
                            <button
                                onClick={() => onNavigate(`/rfq/create?product=${product.id}`)}
                                className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-amber-500 text-amber-600 py-4 rounded-xl font-semibold hover:bg-amber-50 transition"
                            >
                                <FileText className="w-5 h-5" />
                                Request Quote
                            </button>
                        </div>

                        {/* Trade Assurance */}
                        {product.supplier.hasTradeAssurance && (
                            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                                <Shield className="w-8 h-8 text-green-600" />
                                <div>
                                    <p className="font-semibold text-green-800">Trade Assurance Protected</p>
                                    <p className="text-sm text-green-600">
                                        Up to ${(product.supplier.tradeAssuranceLimit).toLocaleString()} coverage
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Supplier Card */}
                <SupplierInfoCard supplier={product.supplier} onNavigate={onNavigate} />

                {/* Tabs */}
                <div className="bg-white rounded-2xl shadow-sm mt-8">
                    <div className="flex border-b">
                        {[
                            { id: 'description', label: 'Description' },
                            { id: 'specs', label: 'Specifications' },
                            { id: 'shipping', label: 'Shipping' },
                            { id: 'reviews', label: `Reviews (${product.rating.count})` },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`px-6 py-4 font-medium transition relative ${activeTab === tab.id ? 'text-amber-600' : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {tab.label}
                                {activeTab === tab.id && (
                                    <motion.div layoutId="productTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500" />
                                )}
                            </button>
                        ))}
                    </div>
                    <div className="p-6">
                        {activeTab === 'description' && (
                            <div className="prose max-w-none">
                                <p className="text-lg text-gray-700 mb-6">{product.shortDescription}</p>
                                <div className="whitespace-pre-line text-gray-600">{product.fullDescription}</div>
                                {product.customizationAvailable && (
                                    <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                                        <h4 className="font-semibold text-blue-800 mb-2">🎨 Customization Options</h4>
                                        <p className="text-blue-700">{product.customizationDetails}</p>
                                    </div>
                                )}
                            </div>
                        )}
                        {activeTab === 'specs' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {product.specifications.map((spec, i) => (
                                    <div key={i} className="flex justify-between py-3 border-b">
                                        <span className="text-gray-500">{spec.name}</span>
                                        <span className="font-medium text-gray-900">{spec.value}</span>
                                    </div>
                                ))}
                                <div className="flex justify-between py-3 border-b">
                                    <span className="text-gray-500">SKU</span>
                                    <span className="font-medium text-gray-900">{product.sku}</span>
                                </div>
                                <div className="flex justify-between py-3 border-b">
                                    <span className="text-gray-500">HS Code</span>
                                    <span className="font-medium text-gray-900">{product.hsCode}</span>
                                </div>
                            </div>
                        )}
                        {activeTab === 'shipping' && (
                            <div className="space-y-6">
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-3">Product Specifications</h4>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="p-4 bg-gray-50 rounded-xl text-center">
                                            <p className="text-2xl font-bold text-gray-900">{product.weight} kg</p>
                                            <p className="text-sm text-gray-500">Weight per unit</p>
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded-xl text-center">
                                            <p className="text-2xl font-bold text-gray-900">
                                                {product.dimensions.l}×{product.dimensions.w}×{product.dimensions.h}
                                            </p>
                                            <p className="text-sm text-gray-500">Dimensions (cm)</p>
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded-xl text-center">
                                            <p className="text-2xl font-bold text-gray-900">
                                                {product.leadTime.min}-{product.leadTime.max}
                                            </p>
                                            <p className="text-sm text-gray-500">Lead time (days)</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-3">Packaging</h4>
                                    <p className="text-gray-600">{product.packagingDetails}</p>
                                </div>
                                {product.origin.certified && (
                                    <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl">
                                        <CheckCircle className="w-6 h-6 text-green-600" />
                                        <div>
                                            <p className="font-semibold text-green-800">Certificate of Origin Available</p>
                                            <p className="text-sm text-green-600">Morocco - {product.origin.region}</p>
                                        </div>
                                        <button className="ml-auto flex items-center gap-2 text-green-700 hover:text-green-800 font-medium">
                                            <Download className="w-4 h-4" />
                                            Download
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                        {activeTab === 'reviews' && (
                            <div className="text-center py-12 text-gray-500">
                                Reviews section - Coming soon
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Products */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {product.relatedProducts.map(rp => (
                            <div
                                key={rp.id}
                                onClick={() => onNavigate(`/product/${rp.id}`)}
                                className="bg-white rounded-xl overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition group"
                            >
                                <div className="aspect-square overflow-hidden">
                                    <img
                                        src={rp.image}
                                        alt={rp.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="font-medium text-gray-900 text-sm line-clamp-2 group-hover:text-amber-600 transition">
                                        {rp.name}
                                    </h3>
                                    <p className="text-amber-600 font-bold mt-2">${rp.price.toFixed(2)}</p>
                                    <p className="text-xs text-gray-500">MOQ: {rp.moq}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const SupplierInfoCard: React.FC<{
    supplier: ProductData['supplier'];
    onNavigate: (path: string) => void;
}> = ({ supplier, onNavigate }) => {
    const verifyStyles = {
        BASIC: 'bg-gray-100 text-gray-700',
        VERIFIED: 'bg-green-100 text-green-700',
        GOLD: 'bg-gradient-to-r from-amber-400 to-amber-600 text-white',
        TRUSTED: 'bg-gradient-to-r from-purple-500 to-purple-700 text-white',
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex items-center gap-4">
                    <img
                        src={supplier.logo}
                        alt={supplier.name}
                        className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-bold text-gray-900">{supplier.name}</h3>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${verifyStyles[supplier.verificationLevel]}`}>
                                {supplier.verificationLevel}
                            </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {supplier.location}
                            </span>
                            <span className="flex items-center gap-1">
                                <Building2 className="w-4 h-4" />
                                Est. {supplier.yearEstablished}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-6 md:ml-auto">
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-1">
                            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                            <span className="text-xl font-bold">{supplier.rating.avg}</span>
                        </div>
                        <p className="text-xs text-gray-500">{supplier.rating.count} reviews</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xl font-bold text-green-600">{supplier.responseRate}%</p>
                        <p className="text-xs text-gray-500">Response Rate</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xl font-bold">{supplier.responseTime}</p>
                        <p className="text-xs text-gray-500">Response Time</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xl font-bold text-blue-600">{supplier.onTimeDelivery}%</p>
                        <p className="text-xs text-gray-500">On-Time Delivery</p>
                    </div>
                </div>

                <button
                    onClick={() => onNavigate(`/supplier/${supplier.id}`)}
                    className="px-6 py-3 border border-amber-500 text-amber-600 rounded-xl font-semibold hover:bg-amber-50 transition whitespace-nowrap"
                >
                    View Supplier
                </button>
            </div>
        </div>
    );
};

export default ProductDetail;
