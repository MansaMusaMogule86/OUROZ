/**
 * OUROZ RFQ System - Request for Quotation
 * Page 7 - Complete RFQ creation and management
 * 
 * PAGE OBJECTIVE:
 * Enable buyers to submit detailed product requirements and receive
 * competitive quotes from verified Moroccan suppliers.
 * 
 * FEATURES:
 * - Multi-step RFQ creation wizard
 * - RFQ listing and management
 * - Quote comparison
 * - Quote acceptance workflow
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText, Plus, Search, Filter, ChevronRight, ChevronDown,
    Upload, X, CheckCircle, Clock, MessageCircle, Star,
    MapPin, Shield, Award, Package, Calendar, DollarSign,
    Truck, Globe, AlertCircle, Eye, MoreVertical
} from 'lucide-react';

interface RFQSystemProps {
    language: 'en' | 'ar' | 'fr';
    userId: string;
    userType: 'buyer' | 'supplier';
    onNavigate: (path: string) => void;
}

// Types
interface RFQ {
    id: string;
    rfqNumber: string;
    title: string;
    category: string;
    quantity: number;
    unit: string;
    targetPrice?: number;
    currency: string;
    requiredBy?: string;
    destination: string;
    status: 'DRAFT' | 'OPEN' | 'QUOTED' | 'NEGOTIATING' | 'ACCEPTED' | 'EXPIRED' | 'CLOSED';
    quoteCount: number;
    viewCount: number;
    createdAt: string;
    expiresAt: string;
    moroccoOnly: boolean;
}

interface Quote {
    id: string;
    rfqId: string;
    supplier: {
        id: string;
        name: string;
        logo: string;
        verificationLevel: 'BASIC' | 'VERIFIED' | 'GOLD' | 'TRUSTED';
        location: string;
        rating: { avg: number; count: number };
        hasTradeAssurance: boolean;
    };
    unitPrice: number;
    totalPrice: number;
    currency: string;
    moq: number;
    leadTime: number;
    incoterm: string;
    validUntil: string;
    status: 'SUBMITTED' | 'SHORTLISTED' | 'ACCEPTED' | 'REJECTED';
    isNegotiable: boolean;
    submittedAt: string;
}

// Mock Data
const MOCK_RFQS: RFQ[] = [
    {
        id: 'rfq_001',
        rfqNumber: 'RFQ-2024-001542',
        title: 'Organic Argan Oil 100ml - Bulk Order',
        category: 'Cosmetics',
        quantity: 5000,
        unit: 'bottles',
        targetPrice: 8,
        currency: 'USD',
        requiredBy: '2024-03-15',
        destination: 'United States',
        status: 'QUOTED',
        quoteCount: 8,
        viewCount: 156,
        createdAt: '2024-01-25',
        expiresAt: '2024-02-25',
        moroccoOnly: true,
    },
    {
        id: 'rfq_002',
        rfqNumber: 'RFQ-2024-001543',
        title: 'Traditional Berber Carpets - Custom Sizes',
        category: 'Textiles',
        quantity: 200,
        unit: 'pieces',
        targetPrice: 150,
        currency: 'USD',
        destination: 'Germany',
        status: 'OPEN',
        quoteCount: 3,
        viewCount: 89,
        createdAt: '2024-01-28',
        expiresAt: '2024-02-28',
        moroccoOnly: true,
    },
    {
        id: 'rfq_003',
        rfqNumber: 'RFQ-2024-001544',
        title: 'Zellige Mosaic Tiles - Architectural Project',
        category: 'Construction',
        quantity: 500,
        unit: 'sqm',
        targetPrice: 80,
        currency: 'USD',
        destination: 'United Arab Emirates',
        status: 'NEGOTIATING',
        quoteCount: 5,
        viewCount: 124,
        createdAt: '2024-01-22',
        expiresAt: '2024-02-22',
        moroccoOnly: true,
    },
];

const MOCK_QUOTES: Quote[] = [
    {
        id: 'quote_001',
        rfqId: 'rfq_001',
        supplier: {
            id: 'sup_001',
            name: 'Atlas Argan Trading Co.',
            logo: 'https://ui-avatars.com/api/?name=Atlas+Argan&background=C4A052&color=fff',
            verificationLevel: 'GOLD',
            location: 'Agadir, Morocco',
            rating: { avg: 4.9, count: 324 },
            hasTradeAssurance: true,
        },
        unitPrice: 7.50,
        totalPrice: 37500,
        currency: 'USD',
        moq: 1000,
        leadTime: 14,
        incoterm: 'FOB',
        validUntil: '2024-02-15',
        status: 'SHORTLISTED',
        isNegotiable: true,
        submittedAt: '2024-01-26',
    },
    {
        id: 'quote_002',
        rfqId: 'rfq_001',
        supplier: {
            id: 'sup_002',
            name: 'Souss Organic Exports',
            logo: 'https://ui-avatars.com/api/?name=Souss+Organic&background=2563EB&color=fff',
            verificationLevel: 'TRUSTED',
            location: 'Essaouira, Morocco',
            rating: { avg: 4.8, count: 189 },
            hasTradeAssurance: true,
        },
        unitPrice: 8.20,
        totalPrice: 41000,
        currency: 'USD',
        moq: 500,
        leadTime: 10,
        incoterm: 'CIF',
        validUntil: '2024-02-20',
        status: 'SUBMITTED',
        isNegotiable: false,
        submittedAt: '2024-01-27',
    },
    {
        id: 'quote_003',
        rfqId: 'rfq_001',
        supplier: {
            id: 'sup_003',
            name: 'Moroccan Beauty Labs',
            logo: 'https://ui-avatars.com/api/?name=Morocco+Beauty&background=10B981&color=fff',
            verificationLevel: 'VERIFIED',
            location: 'Casablanca, Morocco',
            rating: { avg: 4.6, count: 98 },
            hasTradeAssurance: false,
        },
        unitPrice: 6.80,
        totalPrice: 34000,
        currency: 'USD',
        moq: 2000,
        leadTime: 21,
        incoterm: 'FOB',
        validUntil: '2024-02-10',
        status: 'SUBMITTED',
        isNegotiable: true,
        submittedAt: '2024-01-28',
    },
];

const CATEGORIES = [
    'Agriculture', 'Textiles', 'Handicrafts', 'Cosmetics',
    'Food & Beverages', 'Construction', 'Industrial', 'Automotive'
];

const INCOTERMS = ['EXW', 'FOB', 'CIF', 'CFR', 'DDP', 'DAP'];

const RFQSystem: React.FC<RFQSystemProps> = ({ language, userId, userType, onNavigate }) => {
    const [view, setView] = useState<'list' | 'create' | 'detail'>('list');
    const [selectedRFQ, setSelectedRFQ] = useState<RFQ | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>('all');

    if (view === 'create') {
        return <RFQCreateWizard onBack={() => setView('list')} onNavigate={onNavigate} />;
    }

    if (view === 'detail' && selectedRFQ) {
        return (
            <RFQDetail
                rfq={selectedRFQ}
                quotes={MOCK_QUOTES.filter(q => q.rfqId === selectedRFQ.id)}
                onBack={() => setView('list')}
                onNavigate={onNavigate}
            />
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-40">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Request for Quotation</h1>
                            <p className="text-gray-500">Get competitive quotes from verified Moroccan suppliers</p>
                        </div>
                        <button
                            onClick={() => setView('create')}
                            className="flex items-center gap-2 bg-amber-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-amber-600 transition"
                        >
                            <Plus className="w-5 h-5" />
                            Create New RFQ
                        </button>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="container mx-auto px-4 py-6">
                <div className="flex items-center gap-4 mb-6">
                    <div className="flex bg-white rounded-xl p-1 shadow-sm">
                        {['all', 'OPEN', 'QUOTED', 'NEGOTIATING', 'ACCEPTED', 'EXPIRED'].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filterStatus === status
                                    ? 'bg-amber-500 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                {status === 'all' ? 'All RFQs' : status}
                            </button>
                        ))}
                    </div>
                </div>

                {/* RFQ List */}
                <div className="space-y-4">
                    {MOCK_RFQS.map(rfq => (
                        <RFQCard
                            key={rfq.id}
                            rfq={rfq}
                            onClick={() => {
                                setSelectedRFQ(rfq);
                                setView('detail');
                            }}
                        />
                    ))}
                </div>

                {MOCK_RFQS.length === 0 && (
                    <div className="text-center py-16">
                        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No RFQs Yet</h3>
                        <p className="text-gray-500 mb-6">Submit your first RFQ to get quotes from suppliers</p>
                        <button
                            onClick={() => setView('create')}
                            className="bg-amber-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-amber-600"
                        >
                            Create Your First RFQ
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

// RFQ Card Component
const RFQCard: React.FC<{ rfq: RFQ; onClick: () => void }> = ({ rfq, onClick }) => {
    const statusStyles: Record<string, { bg: string; text: string }> = {
        DRAFT: { bg: 'bg-gray-100', text: 'text-gray-600' },
        OPEN: { bg: 'bg-blue-100', text: 'text-blue-700' },
        QUOTED: { bg: 'bg-green-100', text: 'text-green-700' },
        NEGOTIATING: { bg: 'bg-amber-100', text: 'text-amber-700' },
        ACCEPTED: { bg: 'bg-purple-100', text: 'text-purple-700' },
        EXPIRED: { bg: 'bg-red-100', text: 'text-red-600' },
        CLOSED: { bg: 'bg-gray-100', text: 'text-gray-600' },
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={onClick}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition cursor-pointer"
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm text-gray-500 font-mono">{rfq.rfqNumber}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[rfq.status].bg} ${statusStyles[rfq.status].text}`}>
                            {rfq.status}
                        </span>
                        {rfq.moroccoOnly && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                🇲🇦 Morocco Only
                            </span>
                        )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{rfq.title}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                            <Package className="w-4 h-4" />
                            {rfq.quantity.toLocaleString()} {rfq.unit}
                        </span>
                        {rfq.targetPrice && (
                            <span className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4" />
                                Target: ${rfq.targetPrice}/{rfq.unit.slice(0, -1)}
                            </span>
                        )}
                        <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {rfq.destination}
                        </span>
                        {rfq.requiredBy && (
                            <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                Required by {rfq.requiredBy}
                            </span>
                        )}
                    </div>
                </div>
                <div className="text-right">
                    <div className="flex items-center gap-4 mb-3">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-amber-600">{rfq.quoteCount}</p>
                            <p className="text-xs text-gray-500">Quotes</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-gray-400">{rfq.viewCount}</p>
                            <p className="text-xs text-gray-500">Views</p>
                        </div>
                    </div>
                    <p className="text-xs text-gray-400">
                        Expires {rfq.expiresAt}
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

// RFQ Create Wizard
const RFQCreateWizard: React.FC<{
    onBack: () => void;
    onNavigate: (path: string) => void;
}> = ({ onBack, onNavigate }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        description: '',
        quantity: '',
        unit: 'pieces',
        targetPrice: '',
        currency: 'USD',
        requiredBy: '',
        destination: '',
        incoterm: 'FOB',
        moroccoOnly: true,
        attachments: [] as File[],
        specifications: '',
    });

    const steps = [
        { id: 1, title: 'Product Details', icon: Package },
        { id: 2, title: 'Quantity & Budget', icon: DollarSign },
        { id: 3, title: 'Shipping & Terms', icon: Truck },
        { id: 4, title: 'Review & Submit', icon: CheckCircle },
    ];

    const handleSubmit = () => {
        // Submit RFQ logic
        alert('RFQ submitted successfully!');
        onBack();
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <button onClick={onBack} title="Close" aria-label="Close" className="p-2 hover:bg-gray-100 rounded-lg">
                            <X className="w-5 h-5" />
                        </button>
                        <h1 className="text-xl font-bold text-gray-900">Create New RFQ</h1>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Progress Steps */}
                <div className="flex justify-center mb-12">
                    <div className="flex items-center gap-4">
                        {steps.map((s, i) => (
                            <React.Fragment key={s.id}>
                                <div className="flex items-center gap-2">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= s.id ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-500'
                                        }`}>
                                        {step > s.id ? <CheckCircle className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
                                    </div>
                                    <span className={`font-medium ${step >= s.id ? 'text-gray-900' : 'text-gray-400'}`}>
                                        {s.title}
                                    </span>
                                </div>
                                {i < steps.length - 1 && (
                                    <div className={`w-16 h-0.5 ${step > s.id ? 'bg-amber-500' : 'bg-gray-200'}`} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Form Content */}
                <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm p-8">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <h2 className="text-xl font-bold text-gray-900 mb-6">What are you looking for?</h2>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Title *</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="e.g., Organic Argan Oil 100ml Bottles"
                                        className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        title="Select product category"
                                        aria-label="Select product category"
                                        className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500"
                                    >
                                        <option value="">Select a category</option>
                                        {CATEGORIES.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Detailed Requirements *</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={4}
                                        placeholder="Describe your requirements in detail: specifications, quality standards, certifications needed, etc."
                                        className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Attachments (Optional)</label>
                                    <div className="border-2 border-dashed rounded-xl p-8 text-center hover:border-amber-500 transition cursor-pointer">
                                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                        <p className="text-gray-600">Drag files here or click to upload</p>
                                        <p className="text-sm text-gray-400">Images, specifications, reference documents</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Quantity & Budget</h2>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Quantity *</label>
                                        <input
                                            type="number"
                                            value={formData.quantity}
                                            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                            placeholder="e.g., 5000"
                                            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Unit *</label>
                                        <select
                                            value={formData.unit}
                                            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                            title="Select unit of measurement"
                                            aria-label="Select unit of measurement"
                                            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500"
                                        >
                                            <option value="pieces">Pieces</option>
                                            <option value="bottles">Bottles</option>
                                            <option value="kg">Kilograms</option>
                                            <option value="tons">Metric Tons</option>
                                            <option value="sqm">Square Meters</option>
                                            <option value="sets">Sets</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Target Price (Optional)</label>
                                        <input
                                            type="number"
                                            value={formData.targetPrice}
                                            onChange={(e) => setFormData({ ...formData, targetPrice: e.target.value })}
                                            placeholder="Per unit"
                                            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                                        <select
                                            value={formData.currency}
                                            onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                            title="Select currency"
                                            aria-label="Select currency"
                                            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500"
                                        >
                                            <option value="USD">USD ($)</option>
                                            <option value="EUR">EUR (€)</option>
                                            <option value="GBP">GBP (£)</option>
                                            <option value="MAD">MAD (DH)</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Required By (Optional)</label>
                                    <input
                                        type="date"
                                        value={formData.requiredBy}
                                        onChange={(e) => setFormData({ ...formData, requiredBy: e.target.value })}
                                        title="Required by date"
                                        aria-label="Required by date"
                                        className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping & Terms</h2>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Destination Country *</label>
                                    <input
                                        type="text"
                                        value={formData.destination}
                                        onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                                        placeholder="e.g., United States"
                                        className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Incoterm</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {INCOTERMS.map(term => (
                                            <button
                                                key={term}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, incoterm: term })}
                                                className={`px-4 py-3 border rounded-xl text-sm font-medium transition ${formData.incoterm === term
                                                    ? 'bg-amber-500 text-white border-amber-500'
                                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {term}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-4 bg-green-50 rounded-xl">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.moroccoOnly}
                                            onChange={(e) => setFormData({ ...formData, moroccoOnly: e.target.checked })}
                                            className="w-5 h-5 text-amber-500 rounded"
                                        />
                                        <div>
                                            <p className="font-semibold text-green-800">🇲🇦 Morocco Suppliers Only</p>
                                            <p className="text-sm text-green-600">Only receive quotes from verified Moroccan suppliers</p>
                                        </div>
                                    </label>
                                </div>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Review Your RFQ</h2>

                                <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Product</span>
                                        <span className="font-semibold text-gray-900">{formData.title || '-'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Category</span>
                                        <span className="font-semibold text-gray-900">{formData.category || '-'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Quantity</span>
                                        <span className="font-semibold text-gray-900">{formData.quantity} {formData.unit}</span>
                                    </div>
                                    {formData.targetPrice && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Target Price</span>
                                            <span className="font-semibold text-gray-900">{formData.currency} {formData.targetPrice}/unit</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Destination</span>
                                        <span className="font-semibold text-gray-900">{formData.destination || '-'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Incoterm</span>
                                        <span className="font-semibold text-gray-900">{formData.incoterm}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Supplier Location</span>
                                        <span className="font-semibold text-green-600">🇲🇦 Morocco Only</span>
                                    </div>
                                </div>

                                <div className="p-4 bg-blue-50 rounded-xl flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-blue-800">What happens next?</p>
                                        <p className="text-sm text-blue-600">
                                            Your RFQ will be visible to matching suppliers for 30 days.
                                            You'll receive email notifications when suppliers submit quotes.
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8 pt-6 border-t">
                        <button
                            onClick={() => step > 1 ? setStep(step - 1) : onBack()}
                            className="px-6 py-3 text-gray-600 hover:text-gray-900 font-medium"
                        >
                            {step === 1 ? 'Cancel' : 'Back'}
                        </button>
                        <button
                            onClick={() => step < 4 ? setStep(step + 1) : handleSubmit()}
                            className="px-8 py-3 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition"
                        >
                            {step === 4 ? 'Submit RFQ' : 'Continue'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// RFQ Detail with Quotes
const RFQDetail: React.FC<{
    rfq: RFQ;
    quotes: Quote[];
    onBack: () => void;
    onNavigate: (path: string) => void;
}> = ({ rfq, quotes, onBack, onNavigate }) => {
    const [sortBy, setSortBy] = useState<'price' | 'rating' | 'leadTime'>('price');

    const sortedQuotes = [...quotes].sort((a, b) => {
        switch (sortBy) {
            case 'price': return a.unitPrice - b.unitPrice;
            case 'rating': return b.supplier.rating.avg - a.supplier.rating.avg;
            case 'leadTime': return a.leadTime - b.leadTime;
            default: return 0;
        }
    });

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-4">
                    <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
                        <ChevronRight className="w-5 h-5 rotate-180" />
                        Back to RFQs
                    </button>
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-gray-500 font-mono mb-1">{rfq.rfqNumber}</p>
                            <h1 className="text-2xl font-bold text-gray-900">{rfq.title}</h1>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                <span>{rfq.quantity.toLocaleString()} {rfq.unit}</span>
                                <span>•</span>
                                <span>{rfq.destination}</span>
                                <span>•</span>
                                <span>Expires {rfq.expiresAt}</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-3xl font-bold text-amber-600">{quotes.length}</p>
                            <p className="text-sm text-gray-500">Quotes Received</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6">
                {/* Sort */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Compare Quotes</h2>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Sort by:</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            title="Sort quotes by"
                            aria-label="Sort quotes by"
                            className="px-3 py-2 border rounded-lg text-sm"
                        >
                            <option value="price">Lowest Price</option>
                            <option value="rating">Highest Rating</option>
                            <option value="leadTime">Fastest Delivery</option>
                        </select>
                    </div>
                </div>

                {/* Quotes Grid */}
                <div className="space-y-4">
                    {sortedQuotes.map((quote, i) => (
                        <QuoteCard
                            key={quote.id}
                            quote={quote}
                            isLowest={sortBy === 'price' && i === 0}
                            onNavigate={onNavigate}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

// Quote Card
const QuoteCard: React.FC<{
    quote: Quote;
    isLowest: boolean;
    onNavigate: (path: string) => void;
}> = ({ quote, isLowest, onNavigate }) => {
    const verifyStyles: Record<string, string> = {
        BASIC: 'bg-gray-100 text-gray-700',
        VERIFIED: 'bg-green-100 text-green-700',
        GOLD: 'bg-amber-100 text-amber-700',
        TRUSTED: 'bg-purple-100 text-purple-700',
    };

    return (
        <div className={`bg-white rounded-xl p-6 shadow-sm border-2 ${isLowest ? 'border-green-500' : 'border-transparent'}`}>
            {isLowest && (
                <div className="flex items-center gap-2 text-green-600 mb-4">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-semibold">Lowest Price</span>
                </div>
            )}

            <div className="flex items-start gap-6">
                {/* Supplier Info */}
                <div className="flex items-center gap-4 flex-1">
                    <img
                        src={quote.supplier.logo}
                        alt={quote.supplier.name}
                        className="w-16 h-16 rounded-xl"
                    />
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{quote.supplier.name}</h3>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${verifyStyles[quote.supplier.verificationLevel]}`}>
                                {quote.supplier.verificationLevel}
                            </span>
                            {quote.supplier.hasTradeAssurance && (
                                <Shield className="w-4 h-4 text-green-600" />
                            )}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {quote.supplier.location}
                            </span>
                            <span className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                {quote.supplier.rating.avg} ({quote.supplier.rating.count})
                            </span>
                        </div>
                    </div>
                </div>

                {/* Quote Details */}
                <div className="grid grid-cols-4 gap-8">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">${quote.unitPrice.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">per unit</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">{quote.moq}</p>
                        <p className="text-xs text-gray-500">MOQ</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">{quote.leadTime}</p>
                        <p className="text-xs text-gray-500">days lead time</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">{quote.incoterm}</p>
                        <p className="text-xs text-gray-500">terms</p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                    <button
                        onClick={() => onNavigate(`/messages?quote=${quote.id}`)}
                        className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-amber-600 transition"
                    >
                        <MessageCircle className="w-4 h-4" />
                        Contact
                    </button>
                    <button className="flex items-center gap-2 border border-gray-300 text-gray-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition">
                        <Eye className="w-4 h-4" />
                        Details
                    </button>
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t text-sm">
                <div className="flex items-center gap-4 text-gray-500">
                    <span>Total: <strong className="text-gray-900">${quote.totalPrice.toLocaleString()}</strong></span>
                    <span>Valid until: {quote.validUntil}</span>
                    {quote.isNegotiable && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">Negotiable</span>
                    )}
                </div>
                <span className="text-gray-400">Submitted {quote.submittedAt}</span>
            </div>
        </div>
    );
};

export default RFQSystem;
