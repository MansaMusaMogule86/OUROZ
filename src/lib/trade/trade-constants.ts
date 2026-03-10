/**
 * Morocco Trade OS — Constants
 * Navigation config, status maps, color maps, labels.
 */

import type { TradeRFQStatus, TradeShipmentStatus, TradeDealStatus, TradeRiskLevel, TradeDocumentStatus, TradeComplianceLevel } from '@/types/trade';

// ============================================================
// NAVIGATION
// ============================================================

export const TRADE_NAV_SECTIONS = [
    {
        title: 'Command Center',
        items: [
            { href: '/trade', label: 'Dashboard', icon: '◈' },
        ],
    },
    {
        title: 'Sourcing',
        items: [
            { href: '/trade/rfq', label: 'RFQ Engine', icon: '◇' },
            { href: '/trade/suppliers', label: 'Supplier Discovery', icon: '⬡' },
            { href: '/trade/prices', label: 'Price Intelligence', icon: '◐' },
        ],
    },
    {
        title: 'Operations',
        items: [
            { href: '/trade/logistics', label: 'Logistics Tracker', icon: '◻' },
            { href: '/trade/compliance', label: 'Compliance Vault', icon: '▧' },
        ],
    },
    {
        title: 'Negotiations',
        items: [
            { href: '/trade/deals', label: 'Deal Room', icon: '◉' },
        ],
    },
];

// ============================================================
// STATUS COLOR MAPS
// ============================================================

export const RFQ_STATUS_CONFIG: Record<TradeRFQStatus, { label: string; variant: 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'premium' }> = {
    draft: { label: 'Draft', variant: 'neutral' },
    ai_review: { label: 'AI Review', variant: 'premium' },
    open: { label: 'Open', variant: 'info' },
    quoted: { label: 'Quoted', variant: 'success' },
    comparing: { label: 'Comparing', variant: 'warning' },
    awarded: { label: 'Awarded', variant: 'success' },
    expired: { label: 'Expired', variant: 'error' },
    cancelled: { label: 'Cancelled', variant: 'neutral' },
};

export const SHIPMENT_STATUS_CONFIG: Record<TradeShipmentStatus, { label: string; variant: 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'premium' }> = {
    booked: { label: 'Booked', variant: 'neutral' },
    picked_up: { label: 'Picked Up', variant: 'info' },
    in_transit: { label: 'In Transit', variant: 'info' },
    customs: { label: 'Customs', variant: 'warning' },
    out_for_delivery: { label: 'Out for Delivery', variant: 'premium' },
    delivered: { label: 'Delivered', variant: 'success' },
    exception: { label: 'Exception', variant: 'error' },
};

export const DEAL_STATUS_CONFIG: Record<TradeDealStatus, { label: string; variant: 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'premium' }> = {
    exploring: { label: 'Exploring', variant: 'neutral' },
    negotiating: { label: 'Negotiating', variant: 'info' },
    terms_agreed: { label: 'Terms Agreed', variant: 'warning' },
    contract_sent: { label: 'Contract Sent', variant: 'premium' },
    signed: { label: 'Signed', variant: 'success' },
    closed_won: { label: 'Closed Won', variant: 'success' },
    closed_lost: { label: 'Closed Lost', variant: 'error' },
};

export const RISK_LEVEL_CONFIG: Record<TradeRiskLevel, { label: string; variant: 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'premium' }> = {
    low: { label: 'Low Risk', variant: 'success' },
    medium: { label: 'Medium Risk', variant: 'warning' },
    high: { label: 'High Risk', variant: 'error' },
    critical: { label: 'Critical', variant: 'error' },
};

export const DOCUMENT_STATUS_CONFIG: Record<TradeDocumentStatus, { label: string; variant: 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'premium' }> = {
    pending: { label: 'Pending', variant: 'neutral' },
    uploaded: { label: 'Uploaded', variant: 'info' },
    verified: { label: 'Verified', variant: 'success' },
    rejected: { label: 'Rejected', variant: 'error' },
    expired: { label: 'Expired', variant: 'warning' },
};

export const COMPLIANCE_LEVEL_CONFIG: Record<TradeComplianceLevel, { label: string; variant: 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'premium' }> = {
    basic: { label: 'Basic', variant: 'neutral' },
    standard: { label: 'Standard', variant: 'info' },
    premium: { label: 'Premium', variant: 'success' },
    sovereign: { label: 'Sovereign', variant: 'premium' },
};

// ============================================================
// MOROCCAN TRADE CONTEXT
// ============================================================

export const MOROCCAN_REGIONS = [
    'Tanger-Tetouan-Al Hoceima',
    'Oriental',
    'Fes-Meknes',
    'Rabat-Sale-Kenitra',
    'Beni Mellal-Khenifra',
    'Casablanca-Settat',
    'Marrakech-Safi',
    'Draa-Tafilalet',
    'Souss-Massa',
    'Guelmim-Oued Noun',
    'Laayoune-Sakia El Hamra',
    'Dakhla-Oued Ed-Dahab',
];

export const PRODUCT_CATEGORIES = [
    'Argan Oil & Derivatives',
    'Olive Oil & Table Olives',
    'Saffron & Spices',
    'Ceramics & Zellige',
    'Textiles & Leather',
    'Citrus & Dried Fruits',
    'Cosmetics & Beauty',
    'Tea & Herbal Infusions',
    'Preserved Foods',
    'Artisan Woodwork',
    'Bakery & Pastries',
    'Couscous & Grains',
];

export const INCOTERMS = ['EXW', 'FCA', 'FOB', 'CIF', 'CFR', 'DAP', 'DDP'] as const;

export const CURRENCIES = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
    { code: 'MAD', symbol: 'د.م.', name: 'Moroccan Dirham' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
];
