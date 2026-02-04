/**
 * OUROZ Shared UI Components
 * Reusable components used across the platform
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
    Star, Shield, CheckCircle, MapPin, Clock, Package,
    ChevronRight, Heart, MessageCircle, Globe, Award
} from 'lucide-react';

// ============================================================
// VERIFICATION BADGE
// ============================================================
interface VerificationBadgeProps {
    level: 'BASIC' | 'VERIFIED' | 'GOLD' | 'TRUSTED';
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
    level,
    size = 'md',
    showLabel = true
}) => {
    const configs = {
        BASIC: {
            bg: 'bg-gray-100',
            text: 'text-gray-700',
            icon: '○',
            label: 'Basic',
            gradient: false
        },
        VERIFIED: {
            bg: 'bg-green-100',
            text: 'text-green-700',
            icon: '✓',
            label: 'Verified',
            gradient: false
        },
        GOLD: {
            bg: 'bg-gradient-to-r from-amber-400 to-amber-600',
            text: 'text-white',
            icon: '🏆',
            label: 'Gold Supplier',
            gradient: true
        },
        TRUSTED: {
            bg: 'bg-gradient-to-r from-purple-500 to-purple-700',
            text: 'text-white',
            icon: '💎',
            label: 'Trusted',
            gradient: true
        },
    };

    const config = configs[level];
    const sizeClasses = {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-sm px-3 py-1',
        lg: 'text-base px-4 py-2',
    };

    return (
        <span className={`inline-flex items-center gap-1 rounded-full font-medium ${config.bg} ${config.text} ${sizeClasses[size]}`}>
            <span>{config.icon}</span>
            {showLabel && <span>{config.label}</span>}
        </span>
    );
};

// ============================================================
// TRADE ASSURANCE BADGE
// ============================================================
interface TradeAssuranceBadgeProps {
    limit?: number;
    variant?: 'inline' | 'card';
}

export const TradeAssuranceBadge: React.FC<TradeAssuranceBadgeProps> = ({
    limit,
    variant = 'inline'
}) => {
    if (variant === 'inline') {
        return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                <Shield className="w-3 h-3" />
                Trade Assurance
                {limit && <span>up to ${(limit / 1000)}K</span>}
            </span>
        );
    }

    return (
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
            <Shield className="w-8 h-8 text-green-600" />
            <div>
                <p className="font-semibold text-green-800">Trade Assurance Protected</p>
                {limit && (
                    <p className="text-sm text-green-600">
                        Up to ${limit.toLocaleString()} coverage
                    </p>
                )}
            </div>
        </div>
    );
};

// ============================================================
// PRODUCT CARD
// ============================================================
interface ProductCardProps {
    product: {
        id: string;
        name: string;
        image: string;
        price: { min: number; max: number };
        moq: number;
        moqUnit: string;
        supplier: {
            name: string;
            logo: string;
            verificationLevel: 'BASIC' | 'VERIFIED' | 'GOLD' | 'TRUSTED';
        };
        origin: { region: string };
        rating: { avg: number; count: number };
        orderCount: number;
        hasTradeAssurance: boolean;
        isHot?: boolean;
        isNew?: boolean;
    };
    onClick: () => void;
    onFavorite?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
    product,
    onClick,
    onFavorite
}) => (
    <motion.div
        whileHover={{ y: -4 }}
        onClick={onClick}
        className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition cursor-pointer group"
    >
        <div className="relative aspect-square overflow-hidden">
            <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
            <div className="absolute top-3 left-3 flex gap-2">
                {product.isHot && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">🔥 Hot</span>
                )}
                {product.isNew && (
                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">New</span>
                )}
            </div>
            {onFavorite && (
                <button
                    onClick={(e) => { e.stopPropagation(); onFavorite(); }}
                    title="Add to favorites"
                    aria-label="Add to favorites"
                    className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition"
                >
                    <Heart className="w-4 h-4" />
                </button>
            )}
            {product.hasTradeAssurance && (
                <div className="absolute bottom-3 left-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <Shield className="w-3 h-3" /> Trade Assurance
                </div>
            )}
        </div>

        <div className="p-4">
            <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-amber-600 transition">
                {product.name}
            </h3>

            <div className="flex items-center gap-1 mb-2">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-medium">{product.rating.avg.toFixed(1)}</span>
                <span className="text-xs text-gray-400">({product.rating.count})</span>
                <span className="text-xs text-gray-400 ml-2">{product.orderCount} orders</span>
            </div>

            <p className="text-xl font-bold text-gray-900 mb-1">
                ${product.price.min.toFixed(2)} - ${product.price.max.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500 mb-3">MOQ: {product.moq} {product.moqUnit}</p>

            <div className="flex items-center gap-2 pt-3 border-t">
                <img src={product.supplier.logo} alt="" className="w-6 h-6 rounded-full" />
                <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-600 truncate">{product.supplier.name}</p>
                    <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-400 truncate">{product.origin.region}</span>
                    </div>
                </div>
                <VerificationBadge level={product.supplier.verificationLevel} size="sm" showLabel={false} />
            </div>
        </div>
    </motion.div>
);

// ============================================================
// SUPPLIER CARD
// ============================================================
interface SupplierCardProps {
    supplier: {
        id: string;
        name: string;
        logo: string;
        verificationLevel: 'BASIC' | 'VERIFIED' | 'GOLD' | 'TRUSTED';
        hasTradeAssurance: boolean;
        location: string;
        productCount: number;
        rating: { avg: number; count: number };
        responseRate: number;
        responseTime: string;
        yearEstablished: number;
    };
    onClick: () => void;
}

export const SupplierCard: React.FC<SupplierCardProps> = ({ supplier, onClick }) => (
    <motion.div
        whileHover={{ y: -4 }}
        onClick={onClick}
        className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition cursor-pointer"
    >
        <div className="flex items-start gap-4">
            <img
                src={supplier.logo}
                alt={supplier.name}
                className="w-16 h-16 rounded-xl object-cover"
            />
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">{supplier.name}</h3>
                    <VerificationBadge level={supplier.verificationLevel} size="sm" />
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="w-4 h-4" />
                    <span>{supplier.location}</span>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-bold">{supplier.rating.avg}</span>
                </div>
                <p className="text-xs text-gray-500">{supplier.rating.count} reviews</p>
            </div>
            <div className="text-center">
                <p className="font-bold text-green-600">{supplier.responseRate}%</p>
                <p className="text-xs text-gray-500">Response</p>
            </div>
            <div className="text-center">
                <p className="font-bold">{supplier.productCount}</p>
                <p className="text-xs text-gray-500">Products</p>
            </div>
        </div>

        {supplier.hasTradeAssurance && (
            <div className="mt-4 pt-4 border-t">
                <TradeAssuranceBadge variant="inline" />
            </div>
        )}
    </motion.div>
);

// ============================================================
// PRICE TIER SELECTOR
// ============================================================
interface PriceTierSelectorProps {
    tiers: { minQty: number; maxQty?: number; price: number }[];
    selectedQty: number;
    onSelect: (qty: number) => void;
    currency?: string;
}

export const PriceTierSelector: React.FC<PriceTierSelectorProps> = ({
    tiers,
    selectedQty,
    onSelect,
    currency = 'USD'
}) => {
    const currentTier = tiers.find(t => selectedQty >= t.minQty && (!t.maxQty || selectedQty <= t.maxQty));

    return (
        <div className="bg-amber-50 rounded-2xl p-6">
            <div className="flex items-end gap-2 mb-4">
                <span className="text-4xl font-bold text-gray-900">
                    ${currentTier?.price.toFixed(2) || tiers[0].price.toFixed(2)}
                </span>
                <span className="text-gray-600 mb-1">/ unit</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
                {tiers.map((tier, i) => {
                    const isSelected = selectedQty >= tier.minQty && (!tier.maxQty || selectedQty <= tier.maxQty);
                    return (
                        <button
                            key={i}
                            onClick={() => onSelect(tier.minQty)}
                            className={`p-3 rounded-xl text-center transition ${isSelected
                                ? 'bg-amber-500 text-white'
                                : 'bg-white text-gray-700 hover:bg-amber-100'
                                }`}
                        >
                            <p className="font-bold">${tier.price.toFixed(2)}</p>
                            <p className="text-xs opacity-80">
                                {tier.minQty}{tier.maxQty ? `-${tier.maxQty}` : '+'}
                            </p>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

// ============================================================
// RATING DISPLAY
// ============================================================
interface RatingDisplayProps {
    rating: number;
    count?: number;
    size?: 'sm' | 'md' | 'lg';
    showCount?: boolean;
}

export const RatingDisplay: React.FC<RatingDisplayProps> = ({
    rating,
    count,
    size = 'md',
    showCount = true
}) => {
    const sizeClasses = {
        sm: 'w-3 h-3',
        md: 'w-4 h-4',
        lg: 'w-5 h-5',
    };

    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map(star => (
                <Star
                    key={star}
                    className={`${sizeClasses[size]} ${star <= Math.round(rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-300'
                        }`}
                />
            ))}
            <span className={`font-medium ml-1 ${size === 'sm' ? 'text-sm' : ''}`}>
                {rating.toFixed(1)}
            </span>
            {showCount && count !== undefined && (
                <span className={`text-gray-400 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
                    ({count.toLocaleString()})
                </span>
            )}
        </div>
    );
};

// ============================================================
// CATEGORY CHIP
// ============================================================
interface CategoryChipProps {
    icon: string;
    name: string;
    count?: number;
    isActive?: boolean;
    onClick?: () => void;
}

export const CategoryChip: React.FC<CategoryChipProps> = ({
    icon,
    name,
    count,
    isActive = false,
    onClick
}) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2 rounded-full transition ${isActive
            ? 'bg-amber-500 text-white'
            : 'bg-white text-gray-700 hover:bg-amber-50 border'
            }`}
    >
        <span>{icon}</span>
        <span className="font-medium">{name}</span>
        {count !== undefined && (
            <span className={`text-sm ${isActive ? 'opacity-80' : 'text-gray-400'}`}>
                ({count.toLocaleString()})
            </span>
        )}
    </button>
);

// ============================================================
// LOADING SKELETON
// ============================================================
interface SkeletonProps {
    variant?: 'text' | 'circular' | 'rectangular';
    width?: string | number;
    height?: string | number;
    className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
    variant = 'text',
    width,
    height,
    className = ''
}) => {
    const baseClasses = 'bg-gray-200 animate-pulse';
    const variantClasses = {
        text: 'rounded h-4',
        circular: 'rounded-full',
        rectangular: 'rounded-lg',
    };

    // Build dynamic class with width/height if provided as strings
    const sizeClass = `${typeof width === 'string' ? `w-[${width}]` : ''} ${typeof height === 'string' ? `h-[${height}]` : ''}`;

    return (
        <div
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClass} ${className}`.trim()}
            aria-hidden="true"
        />
    );
};

// ============================================================
// EMPTY STATE
// ============================================================
interface EmptyStateProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    icon,
    title,
    description,
    action
}) => (
    <div className="text-center py-16">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
            {icon}
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 mb-6">{description}</p>
        {action && (
            <button
                onClick={action.onClick}
                className="bg-amber-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-amber-600 transition"
            >
                {action.label}
            </button>
        )}
    </div>
);

// ============================================================
// MOROCCO FLAG BADGE
// ============================================================
export const MoroccoBadge: React.FC<{ label?: string }> = ({ label = 'Made in Morocco' }) => (
    <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 text-red-700 rounded-full text-xs font-medium border border-red-200">
        🇲🇦 {label}
    </span>
);

// ============================================================
// QUICK CONTACT BUTTON
// ============================================================
interface QuickContactProps {
    supplierId: string;
    supplierName: string;
    onContact: () => void;
    onRFQ: () => void;
}

export const QuickContactButtons: React.FC<QuickContactProps> = ({
    supplierId,
    supplierName,
    onContact,
    onRFQ
}) => (
    <div className="flex gap-3">
        <button
            onClick={onContact}
            className="flex-1 flex items-center justify-center gap-2 bg-amber-500 text-white py-3 rounded-xl font-semibold hover:bg-amber-600 transition"
        >
            <MessageCircle className="w-5 h-5" />
            Contact Supplier
        </button>
        <button
            onClick={onRFQ}
            className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-amber-500 text-amber-600 py-3 rounded-xl font-semibold hover:bg-amber-50 transition"
        >
            <Package className="w-5 h-5" />
            Request Quote
        </button>
    </div>
);
