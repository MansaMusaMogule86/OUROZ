/**
 * OUROZ Supplier Profile Header Component
 * Displays logo, name, verification badges, stats, and CTA buttons
 */

import React from 'react';
import { MapPin, Calendar, Users, Globe, Shield, Star, MessageCircle, FileText } from 'lucide-react';
import { SupplierProfile, VerificationLevel } from '../../types/supplier';

interface SupplierProfileHeaderProps {
    supplier: SupplierProfile;
    localizedName: string;
    onContactClick: () => void;
    onRFQClick: () => void;
}

// ============================================
// VERIFICATION BADGE CONFIG
// ============================================

const VERIFICATION_CONFIG: Record<VerificationLevel, {
    bg: string;
    text: string;
    icon: string;
    label: string;
}> = {
    BASIC: { bg: 'bg-gray-100', text: 'text-gray-700', icon: '○', label: 'Basic' },
    VERIFIED: { bg: 'bg-green-100', text: 'text-green-700', icon: '✓', label: 'Verified' },
    GOLD: { bg: 'bg-gradient-to-r from-amber-400 to-amber-600', text: 'text-white', icon: '🏆', label: 'Gold Supplier' },
    TRUSTED: { bg: 'bg-gradient-to-r from-purple-500 to-purple-700', text: 'text-white', icon: '💎', label: 'Trusted' },
};

// ============================================
// SUB-COMPONENTS
// ============================================

const VerificationBadge: React.FC<{ level: VerificationLevel }> = ({ level }) => {
    const config = VERIFICATION_CONFIG[level];
    return (
        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${config.bg} ${config.text}`}>
            <span>{config.icon}</span>
            {config.label}
        </span>
    );
};

const TradeAssuranceBadge: React.FC<{ limit: number }> = ({ limit }) => (
    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
        <Shield className="w-4 h-4" />
        Trade Assurance ${(limit / 1000).toFixed(0)}K
    </span>
);

const StatCard: React.FC<{
    value: string | number;
    label: string;
    icon?: React.ReactNode;
    color?: string;
}> = ({ value, label, icon, color = 'text-gray-900' }) => (
    <div className="text-center">
        <div className="flex items-center justify-center gap-1">
            {icon}
            <span className={`text-2xl font-bold ${color}`}>{value}</span>
        </div>
        <p className="text-sm text-gray-500">{label}</p>
    </div>
);

// ============================================
// MAIN COMPONENT
// ============================================

const SupplierProfileHeader: React.FC<SupplierProfileHeaderProps> = ({
    supplier,
    localizedName,
    onContactClick,
    onRFQClick,
}) => {
    const defaultLogo = `https://ui-avatars.com/api/?name=${encodeURIComponent(supplier.companyName)}&background=C4A052&color=fff&size=200`;

    return (
        <div className="flex flex-col md:flex-row gap-6">
            {/* Logo & Basic Info */}
            <div className="flex gap-6">
                <img
                    src={supplier.logo || defaultLogo}
                    alt={supplier.companyName}
                    className="w-24 h-24 md:w-32 md:h-32 rounded-2xl border-4 border-white shadow-lg object-cover"
                />
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                        {localizedName}
                    </h1>

                    {/* Badges */}
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        <VerificationBadge level={supplier.verificationLevel} />
                        {supplier.hasTradeAssurance && supplier.tradeAssuranceLimit > 0 && (
                            <TradeAssuranceBadge limit={supplier.tradeAssuranceLimit} />
                        )}
                    </div>

                    {/* Meta Info */}
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

            {/* Stats & CTAs */}
            <div className="md:ml-auto flex flex-col items-end gap-4">
                {/* Stats */}
                <div className="flex items-center gap-6">
                    <StatCard
                        value={supplier.rating.avg.toFixed(1)}
                        label={`${supplier.rating.count} reviews`}
                        icon={<Star className="w-5 h-5 fill-amber-400 text-amber-400" />}
                    />
                    <StatCard
                        value={`${supplier.responseRate}%`}
                        label="Response rate"
                        color="text-green-600"
                    />
                    <StatCard
                        value={supplier.responseTime}
                        label="Response time"
                    />
                </div>

                {/* CTA Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={onContactClick}
                        className="flex items-center gap-2 bg-amber-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-amber-600 transition"
                    >
                        <MessageCircle className="w-5 h-5" />
                        Contact Supplier
                    </button>
                    <button
                        onClick={onRFQClick}
                        className="flex items-center gap-2 bg-white border-2 border-amber-500 text-amber-600 px-6 py-3 rounded-xl font-semibold hover:bg-amber-50 transition"
                    >
                        <FileText className="w-5 h-5" />
                        Request Quote
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SupplierProfileHeader;
