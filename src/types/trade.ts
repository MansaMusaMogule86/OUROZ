/**
 * Morocco Trade OS — Type Definitions
 * Complete type system for the B2B sourcing intelligence platform.
 */

// ============================================================
// ENUMS
// ============================================================

export type TradeRFQStatus = 'draft' | 'ai_review' | 'open' | 'quoted' | 'comparing' | 'awarded' | 'expired' | 'cancelled';
export type TradeQuoteStatus = 'pending' | 'submitted' | 'shortlisted' | 'accepted' | 'rejected' | 'expired';
export type TradeShipmentStatus = 'booked' | 'picked_up' | 'in_transit' | 'customs' | 'out_for_delivery' | 'delivered' | 'exception';
export type TradeDocumentStatus = 'pending' | 'uploaded' | 'verified' | 'rejected' | 'expired';
export type TradeDealStatus = 'exploring' | 'negotiating' | 'terms_agreed' | 'contract_sent' | 'signed' | 'closed_won' | 'closed_lost';
export type TradeComplianceLevel = 'basic' | 'standard' | 'premium' | 'sovereign';
export type TradeRiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type TradePriceTrend = 'rising' | 'stable' | 'falling';
export type TradeSupplierTier = 'bronze' | 'silver' | 'gold' | 'platinum';

// ============================================================
// SUPPLIER DISCOVERY
// ============================================================

export interface TradeCertification {
    id: string;
    name: string;
    issuer: string;
    status: TradeDocumentStatus;
    expiresAt?: string;
    verifiedAt?: string;
}

export interface TradeSupplier {
    id: string;
    companyName: string;
    slug: string;
    companyType: 'manufacturer' | 'wholesaler' | 'trading_company' | 'cooperative' | 'artisan';
    region: string;
    city: string;
    yearEstablished: number;
    employeeCount: string;
    mainCategories: string[];
    certifications: TradeCertification[];
    exportCountries: string[];
    hasExportLicense: boolean;
    freeZoneCertified: boolean;
    verificationLevel: 'basic' | 'verified' | 'gold' | 'trusted';
    responseRate: number;
    responseTimeHours: number;
    onTimeDeliveryRate: number;
    ratingAvg: number;
    ratingCount: number;
    totalTransactions: number;
    repeatBuyerRate: number;
    monthlyCapacity: string;
    moqMin: number;
    moqCurrency: string;
    leadTimeDaysMin: number;
    leadTimeDaysMax: number;
    sampleAvailable: boolean;
    aiMatchScore?: number;
    aiMatchReasons?: string[];
    complianceScore: number;
    languages: string[];
    contactName: string;
    contactTitle: string;
    description: string;
}

// ============================================================
// RFQ
// ============================================================

export interface TradeRFQ {
    id: string;
    rfqNumber: string;
    title: string;
    status: TradeRFQStatus;
    createdAt: string;
    expiresAt: string;
    productName: string;
    category: string;
    detailedRequirements: string;
    specifications: { key: string; value: string }[];
    quantity: number;
    quantityUnit: string;
    targetPricePerUnit?: number;
    targetCurrency: string;
    destinationPort: string;
    incoterm: string;
    requiredByDate?: string;
    targetCategories: string[];
    invitedSupplierIds?: string[];
    aiScore?: number;
    aiSuggestions?: string[];
    viewCount: number;
    quoteCount: number;
    quotes: TradeQuote[];
    selectedQuoteId?: string;
}

export interface TradeQuote {
    id: string;
    rfqId: string;
    supplierId: string;
    supplierName: string;
    supplierCity: string;
    supplierVerification: string;
    quoteNumber: string;
    status: TradeQuoteStatus;
    submittedAt: string;
    unitPrice: number;
    currency: string;
    totalPrice: number;
    priceValidUntil: string;
    moq: number;
    leadTimeDays: number;
    incoterm: string;
    shippingCost?: number;
    paymentTerms: string;
    sampleAvailable: boolean;
    samplePrice?: number;
    aiComparisonScore?: number;
    aiNotes?: string;
    supplierNotes?: string;
    isNegotiable: boolean;
}

// ============================================================
// PRICE INTELLIGENCE
// ============================================================

export interface TradePriceData {
    id: string;
    productName: string;
    category: string;
    currentPrice: number;
    previousPrice: number;
    currency: string;
    unit: string;
    trend: TradePriceTrend;
    changePercent: number;
    benchmarks: {
        moroccoAvg: number;
        globalAvg: number;
        bestPrice: number;
        bestPriceSupplier?: string;
    };
    history: { date: string; price: number }[];
    aiSummary?: string;
}

export interface TradePriceAlert {
    id: string;
    productName: string;
    condition: 'below' | 'above';
    threshold: number;
    currency: string;
    isActive: boolean;
    triggeredAt?: string;
}

// ============================================================
// LOGISTICS
// ============================================================

export interface TradeShipmentMilestone {
    id: string;
    label: string;
    status: 'completed' | 'current' | 'pending' | 'delayed';
    estimatedDate: string;
    actualDate?: string;
    location?: string;
    notes?: string;
}

export interface TradeShipmentDocument {
    id: string;
    type: string;
    name: string;
    status: TradeDocumentStatus;
    uploadedAt?: string;
    verifiedAt?: string;
}

export interface TradeRiskAlert {
    id: string;
    level: TradeRiskLevel;
    title: string;
    description: string;
    createdAt: string;
    isResolved: boolean;
}

export interface TradeShipment {
    id: string;
    shipmentNumber: string;
    status: TradeShipmentStatus;
    riskLevel: TradeRiskLevel;
    supplierName: string;
    supplierId: string;
    buyerCompany: string;
    origin: { city: string; port: string; country: string };
    destination: { city: string; port: string; country: string };
    shippingMethod: 'sea' | 'air' | 'road';
    carrierName: string;
    trackingNumber?: string;
    containerNumber?: string;
    bookedAt: string;
    estimatedDeparture: string;
    actualDeparture?: string;
    estimatedArrival: string;
    actualArrival?: string;
    description: string;
    weightKg: number;
    volumeCbm: number;
    value: number;
    currency: string;
    incoterm: string;
    milestones: TradeShipmentMilestone[];
    documents: TradeShipmentDocument[];
    riskAlerts: TradeRiskAlert[];
}

// ============================================================
// COMPLIANCE
// ============================================================

export interface TradeComplianceDocument {
    id: string;
    type: string;
    name: string;
    status: TradeDocumentStatus;
    uploadedAt: string;
    expiresAt?: string;
    verifiedBy?: string;
    verifiedAt?: string;
    rejectionReason?: string;
}

export interface TradeAuditEntry {
    id: string;
    action: string;
    actor: string;
    timestamp: string;
    details: string;
}

export interface TradeComplianceRecord {
    id: string;
    supplierId: string;
    supplierName: string;
    overallScore: number;
    level: TradeComplianceLevel;
    lastAuditDate: string;
    nextAuditDue: string;
    categories: {
        documentation: number;
        exportLicensing: number;
        qualityCertification: number;
        financialStanding: number;
        tradeHistory: number;
    };
    documents: TradeComplianceDocument[];
    auditTrail: TradeAuditEntry[];
}

// ============================================================
// DEAL / NEGOTIATION
// ============================================================

export interface TradeDealTerms {
    unitPrice: number;
    currency: string;
    quantity: number;
    incoterm: string;
    paymentTerms: string;
    leadTimeDays: number;
    shippingMethod: string;
    specialConditions?: string;
    timestamp: string;
}

export interface TradeDealMessage {
    id: string;
    senderId: string;
    senderName: string;
    senderType: 'buyer' | 'supplier' | 'ai' | 'system';
    content: string;
    timestamp: string;
}

export interface TradeDeal {
    id: string;
    dealNumber: string;
    title: string;
    status: TradeDealStatus;
    createdAt: string;
    updatedAt: string;
    supplierId: string;
    supplierName: string;
    supplierCity: string;
    buyerCompany: string;
    productName: string;
    category: string;
    quantity: number;
    quantityUnit: string;
    currentTerms: TradeDealTerms;
    termHistory: TradeDealTerms[];
    messages: TradeDealMessage[];
    aiStrategyNotes?: string[];
    aiRecommendedPrice?: number;
    aiConfidence?: number;
    milestones: { label: string; date: string; completed: boolean }[];
    rfqId?: string;
}

// ============================================================
// DASHBOARD
// ============================================================

export interface TradeAIInsightItem {
    id: string;
    title: string;
    content: string;
    type: 'opportunity' | 'risk' | 'recommendation' | 'market';
    priority: 'high' | 'medium' | 'low';
    createdAt: string;
    actionLabel?: string;
    actionHref?: string;
}

export interface TradeActivityItem {
    id: string;
    type: 'rfq' | 'quote' | 'shipment' | 'deal' | 'compliance' | 'price';
    title: string;
    description: string;
    timestamp: string;
    href?: string;
}

export interface TradeAlert {
    id: string;
    level: TradeRiskLevel;
    title: string;
    description: string;
    module: 'rfq' | 'logistics' | 'compliance' | 'deals' | 'prices';
    createdAt: string;
    isRead: boolean;
    href?: string;
}

export interface TradeDashboardStats {
    activeRfqs: number;
    pendingQuotes: number;
    activeShipments: number;
    activeDeals: number;
    complianceScore: number;
    totalTradeValue: number;
    currency: string;
    aiInsights: TradeAIInsightItem[];
    recentActivity: TradeActivityItem[];
    alerts: TradeAlert[];
}
