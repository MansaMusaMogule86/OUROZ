/**
 * OUROZ Supplier Profile TypeScript Types
 * Shared types for frontend components
 */

// ============================================
// ENUMS
// ============================================

export type VerificationLevel = 'BASIC' | 'VERIFIED' | 'GOLD' | 'TRUSTED';
export type CompanyType = 'MANUFACTURER' | 'WHOLESALER' | 'TRADING_COMPANY' | 'COOPERATIVE' | 'ARTISAN';
export type EmployeeRange = '1-10' | '11-50' | '51-100' | '101-500' | '500+';
export type RevenueRange = '< $100K' | '$100K - $500K' | '$500K - $1M' | '$1M - $5M' | '$5M - $10M' | '$10M+';
export type Language = 'en' | 'ar' | 'fr';

// ============================================
// CORE INTERFACES
// ============================================

export interface Certification {
    id: string;
    name: string;
    issuer: string;
    icon?: string;
    isVerified: boolean;
}

export interface ProductPrice {
    min: number;
    max: number;
    currency?: string;
}

export interface FeaturedProduct {
    id: string;
    name: string;
    image: string;
    price: ProductPrice;
    moq: number;
    orders: number;
}

export interface SupplierRating {
    avg: number;
    count: number;
}

export interface RatingDistribution {
    stars: number;
    count: number;
    percentage: number;
}

export interface Review {
    id: string;
    rating: number;
    title?: string;
    content: string;
    detailedRatings?: {
        communication?: number;
        quality?: number;
        delivery?: number;
    };
    isVerifiedPurchase: boolean;
    response?: string;
    responseAt?: string;
    createdAt: string;
    buyer: {
        name: string;
        avatar?: string;
    };
}

export interface GalleryItem {
    id: string;
    type: 'IMAGE' | 'VIDEO';
    url: string;
    thumbnail?: string;
    title?: string;
    description?: string;
    isFeatured: boolean;
}

// ============================================
// SUPPLIER PROFILE
// ============================================

export interface SupplierProfile {
    id: string;

    // Company Names
    companyName: string;
    companyNameAr?: string;
    companyNameFr?: string;

    // Branding
    logo?: string;
    banner?: string;

    // Verification
    verificationLevel: VerificationLevel;
    hasTradeAssurance: boolean;
    tradeAssuranceLimit: number;

    // Business Info
    companyType: CompanyType;
    yearEstablished: number;
    employeeCount: EmployeeRange;
    annualRevenue: RevenueRange;

    // Location
    region: string;
    city: string;
    fullAddress?: string;

    // Export Info
    exportCountries: string[];
    exportExperience: number;
    hasExportLicense: boolean;
    freeZoneCertified: boolean;

    // Certifications
    certifications: Certification[];

    // Categories
    mainCategories: string[];
    productCount: number;

    // Performance
    responseRate: number;
    responseTime: string;
    onTimeDelivery: number;
    rating: SupplierRating;
    totalTransactions: number;
    repeatBuyerRate: number;

    // Content
    description?: string;
    videoUrl?: string;

    // Contact
    contactName?: string;
    contactTitle?: string;
    languages: string[];

    // Products
    featuredProducts: FeaturedProduct[];

    // User-specific
    isFavorited: boolean;

    // Metadata
    createdAt: string;
}

// ============================================
// API REQUEST/RESPONSE TYPES
// ============================================

export interface GetProductsParams {
    page?: number;
    limit?: number;
    category?: string;
    sort?: 'popular' | 'recent' | 'price_low' | 'price_high';
}

export interface GetReviewsParams {
    page?: number;
    limit?: number;
    rating?: number;
    sort?: 'recent' | 'highest' | 'lowest' | 'helpful';
}

export interface CreateReviewPayload {
    rating: number;
    title?: string;
    content: string;
    communicationRating?: number;
    qualityRating?: number;
    deliveryRating?: number;
    orderId?: string;
}

export interface ReportSupplierPayload {
    reason: 'SPAM' | 'FRAUD' | 'INAPPROPRIATE' | 'FAKE_INFO' | 'OTHER';
    description?: string;
}

export interface PaginationInfo {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: PaginationInfo;
}
