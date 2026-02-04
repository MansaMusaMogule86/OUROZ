/**
 * OUROZ Database Schema Types
 * Complete type definitions for the B2B Marketplace Platform
 * All tables include: UUID primary key, created_at, updated_at, status
 */

// =============================================================================
// ENUMS
// =============================================================================

export enum UserRole {
    GUEST = 'GUEST',
    BUYER = 'BUYER',
    SUPPLIER = 'SUPPLIER',
    ADMIN = 'ADMIN',
    SUPER_ADMIN = 'SUPER_ADMIN',
    LOGISTICS_PARTNER = 'LOGISTICS_PARTNER',
    SUPPORT_AGENT = 'SUPPORT_AGENT',
}

export enum AccountStatus {
    PENDING = 'PENDING',
    ACTIVE = 'ACTIVE',
    SUSPENDED = 'SUSPENDED',
    BANNED = 'BANNED',
    DEACTIVATED = 'DEACTIVATED',
}

export enum VerificationLevel {
    UNVERIFIED = 'UNVERIFIED',
    BASIC = 'BASIC',
    VERIFIED = 'VERIFIED',
    GOLD = 'GOLD',
    TRUSTED = 'TRUSTED',
}

export enum VerificationType {
    IDENTITY = 'IDENTITY',
    BUSINESS = 'BUSINESS',
    FACTORY = 'FACTORY',
    EXPORT_LICENSE = 'EXPORT_LICENSE',
    QUALITY_CERT = 'QUALITY_CERT',
    ORIGIN_CERT = 'ORIGIN_CERT',
}

export enum VerificationStatus {
    NOT_STARTED = 'NOT_STARTED',
    PENDING = 'PENDING',
    IN_REVIEW = 'IN_REVIEW',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    EXPIRED = 'EXPIRED',
}

export enum SupplierCategory {
    AGRICULTURE = 'AGRICULTURE',
    TEXTILES = 'TEXTILES',
    HANDICRAFTS = 'HANDICRAFTS',
    COSMETICS = 'COSMETICS',
    INDUSTRIAL = 'INDUSTRIAL',
    CONSTRUCTION = 'CONSTRUCTION',
    FOOD_EXPORT = 'FOOD_EXPORT',
    AUTOMOTIVE = 'AUTOMOTIVE',
    ELECTRONICS = 'ELECTRONICS',
    PACKAGING = 'PACKAGING',
    FURNITURE = 'FURNITURE',
    LEATHER = 'LEATHER',
}

export enum ProductStatus {
    DRAFT = 'DRAFT',
    PENDING_REVIEW = 'PENDING_REVIEW',
    ACTIVE = 'ACTIVE',
    SUSPENDED = 'SUSPENDED',
    OUT_OF_STOCK = 'OUT_OF_STOCK',
    DISCONTINUED = 'DISCONTINUED',
}

export enum RFQStatus {
    DRAFT = 'DRAFT',
    OPEN = 'OPEN',
    QUOTED = 'QUOTED',
    NEGOTIATING = 'NEGOTIATING',
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED',
    EXPIRED = 'EXPIRED',
    CONVERTED = 'CONVERTED',
}

export enum OrderStatus {
    PENDING_PAYMENT = 'PENDING_PAYMENT',
    PAYMENT_RECEIVED = 'PAYMENT_RECEIVED',
    IN_ESCROW = 'IN_ESCROW',
    PROCESSING = 'PROCESSING',
    READY_TO_SHIP = 'READY_TO_SHIP',
    SHIPPED = 'SHIPPED',
    IN_TRANSIT = 'IN_TRANSIT',
    CUSTOMS_CLEARANCE = 'CUSTOMS_CLEARANCE',
    DELIVERED = 'DELIVERED',
    COMPLETED = 'COMPLETED',
    DISPUTE = 'DISPUTE',
    CANCELLED = 'CANCELLED',
    REFUNDED = 'REFUNDED',
}

export enum PaymentStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    IN_ESCROW = 'IN_ESCROW',
    RELEASED = 'RELEASED',
    PARTIAL_RELEASE = 'PARTIAL_RELEASE',
    REFUNDED = 'REFUNDED',
    FAILED = 'FAILED',
    DISPUTED = 'DISPUTED',
}

export enum PaymentMethod {
    WIRE_TRANSFER = 'WIRE_TRANSFER',
    CREDIT_CARD = 'CREDIT_CARD',
    LETTER_OF_CREDIT = 'LETTER_OF_CREDIT',
    ESCROW = 'ESCROW',
    PAYPAL = 'PAYPAL',
    TRADE_ASSURANCE = 'TRADE_ASSURANCE',
}

export enum ShippingMethod {
    SEA_FREIGHT = 'SEA_FREIGHT',
    AIR_FREIGHT = 'AIR_FREIGHT',
    ROAD_FREIGHT = 'ROAD_FREIGHT',
    RAIL_FREIGHT = 'RAIL_FREIGHT',
    EXPRESS_COURIER = 'EXPRESS_COURIER',
    MULTIMODAL = 'MULTIMODAL',
}

export enum Incoterm {
    EXW = 'EXW',
    FOB = 'FOB',
    CIF = 'CIF',
    CFR = 'CFR',
    DDP = 'DDP',
    DAP = 'DAP',
    FCA = 'FCA',
    CPT = 'CPT',
    CIP = 'CIP',
}

export enum DisputeType {
    QUALITY_ISSUE = 'QUALITY_ISSUE',
    QUANTITY_MISMATCH = 'QUANTITY_MISMATCH',
    LATE_DELIVERY = 'LATE_DELIVERY',
    DAMAGED_GOODS = 'DAMAGED_GOODS',
    WRONG_ITEMS = 'WRONG_ITEMS',
    NON_DELIVERY = 'NON_DELIVERY',
    PAYMENT_ISSUE = 'PAYMENT_ISSUE',
    FRAUD = 'FRAUD',
    OTHER = 'OTHER',
}

export enum DisputeStatus {
    OPEN = 'OPEN',
    UNDER_REVIEW = 'UNDER_REVIEW',
    MEDIATION = 'MEDIATION',
    ESCALATED = 'ESCALATED',
    RESOLVED_BUYER = 'RESOLVED_BUYER',
    RESOLVED_SUPPLIER = 'RESOLVED_SUPPLIER',
    RESOLVED_SPLIT = 'RESOLVED_SPLIT',
    CLOSED = 'CLOSED',
}

export enum Language {
    EN = 'en',
    AR = 'ar',
    FR = 'fr',
}

export enum Currency {
    USD = 'USD',
    EUR = 'EUR',
    MAD = 'MAD',
    AED = 'AED',
    GBP = 'GBP',
    SAR = 'SAR',
}

// =============================================================================
// BASE TYPES
// =============================================================================

export interface BaseEntity {
    id: string; // UUID
    created_at: Date;
    updated_at: Date;
    status: string;
}

export interface AuditFields {
    created_by?: string;
    updated_by?: string;
    deleted_at?: Date;
    deleted_by?: string;
}

// =============================================================================
// USER & AUTH ENTITIES
// =============================================================================

export interface User extends BaseEntity, AuditFields {
    email: string;
    email_verified: boolean;
    phone?: string;
    phone_verified: boolean;
    password_hash: string;
    role: UserRole;
    account_status: AccountStatus;
    preferred_language: Language;
    preferred_currency: Currency;
    avatar_url?: string;
    last_login_at?: Date;
    last_login_ip?: string;
    login_count: number;
    failed_login_attempts: number;
    locked_until?: Date;
    two_factor_enabled: boolean;
    two_factor_secret?: string;
    notification_preferences: NotificationPreferences;
}

export interface NotificationPreferences {
    email_marketing: boolean;
    email_orders: boolean;
    email_messages: boolean;
    email_rfq: boolean;
    push_enabled: boolean;
    sms_enabled: boolean;
}

export interface UserProfile extends BaseEntity {
    user_id: string;
    first_name: string;
    last_name: string;
    display_name?: string;
    bio?: string;
    timezone: string;
    date_format: string;
}

export interface Address extends BaseEntity {
    user_id: string;
    type: 'BILLING' | 'SHIPPING' | 'BUSINESS' | 'FACTORY';
    is_default: boolean;
    contact_name: string;
    company_name?: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state_province: string;
    postal_code: string;
    country_code: string;
    country_name: string;
    phone?: string;
    latitude?: number;
    longitude?: number;
}

export interface UserSession extends BaseEntity {
    user_id: string;
    session_token: string;
    refresh_token: string;
    device_info: DeviceInfo;
    ip_address: string;
    user_agent: string;
    expires_at: Date;
    last_activity_at: Date;
    is_active: boolean;
}

export interface DeviceInfo {
    device_type: 'desktop' | 'mobile' | 'tablet';
    os: string;
    browser: string;
    app_version?: string;
}

// =============================================================================
// BUYER ENTITIES
// =============================================================================

export interface Buyer extends BaseEntity, AuditFields {
    user_id: string;
    company_name: string;
    company_registration_number?: string;
    tax_id?: string;
    industry: string;
    company_size: 'MICRO' | 'SMALL' | 'MEDIUM' | 'LARGE' | 'ENTERPRISE';
    annual_purchase_volume?: number;
    annual_purchase_currency: Currency;
    website_url?: string;
    logo_url?: string;
    description?: string;
    verification_level: VerificationLevel;
    primary_contact_name: string;
    primary_contact_email: string;
    primary_contact_phone: string;
    preferred_incoterms: Incoterm[];
    preferred_payment_methods: PaymentMethod[];
    interested_categories: SupplierCategory[];
    total_orders: number;
    total_order_value: number;
    rating_given_avg: number;
    rating_given_count: number;
}

// =============================================================================
// SUPPLIER ENTITIES (MOROCCAN SPECIALIZED)
// =============================================================================

export interface Supplier extends BaseEntity, AuditFields {
    user_id: string;

    // Company Information
    company_name_en: string;
    company_name_ar?: string;
    company_name_fr?: string;
    legal_company_name: string;
    company_type: 'MANUFACTURER' | 'WHOLESALER' | 'TRADING_COMPANY' | 'COOPERATIVE' | 'ARTISAN';
    business_registration_number: string; // RC (Registre de Commerce)
    tax_identification_number: string; // IF (Identifiant Fiscal)
    ice_number: string; // ICE (Identifiant Commun de l'Entreprise) - Morocco specific
    patent_number?: string; // Patente - Morocco specific
    cnss_number?: string; // CNSS Registration - Morocco specific

    // Location - Morocco Specific
    region: MoroccanRegion;
    city: string;
    industrial_zone?: string;
    factory_addresses: Address[];
    warehouse_addresses: Address[];

    // Business Details
    year_established: number;
    employee_count: number;
    annual_revenue_range: string;
    main_categories: SupplierCategory[];
    sub_categories: string[];

    // Export Capabilities - Critical for Moroccan Suppliers
    export_experience_years: number;
    export_countries: string[];
    export_percentage: number; // % of production for export
    has_export_license: boolean;
    export_license_number?: string;
    export_license_expiry?: Date;
    free_zone_certified: boolean; // Tangier Free Zone, etc.

    // Certifications
    certifications: SupplierCertification[];

    // Production Capabilities
    production_capacity: ProductionCapacity;
    quality_control: QualityControl;

    // Verification & Trust
    verification_level: VerificationLevel;
    verification_badges: VerificationBadge[];
    trade_assurance_enabled: boolean;
    trade_assurance_limit: number;

    // Performance Metrics
    response_rate: number;
    response_time_hours: number;
    on_time_delivery_rate: number;
    order_completion_rate: number;
    rating_avg: number;
    rating_count: number;
    total_transactions: number;
    total_transaction_value: number;
    repeat_buyer_rate: number;

    // Content
    logo_url?: string;
    banner_url?: string;
    description_en?: string;
    description_ar?: string;
    description_fr?: string;
    video_url?: string;
    gallery_images: string[];

    // Contact
    primary_contact_name: string;
    primary_contact_title: string;
    primary_contact_email: string;
    primary_contact_phone: string;
    primary_contact_whatsapp?: string;
    website_url?: string;
    social_media: SocialMediaLinks;

    // Preferences
    min_order_value: number;
    min_order_currency: Currency;
    accepted_payment_methods: PaymentMethod[];
    preferred_incoterms: Incoterm[];
    shipping_methods: ShippingMethod[];
    lead_time_days_min: number;
    lead_time_days_max: number;
    sample_available: boolean;
    sample_policy?: string;

    // Languages
    languages_supported: Language[];

    // Premium Features
    is_premium: boolean;
    premium_tier?: 'SILVER' | 'GOLD' | 'PLATINUM';
    premium_expires_at?: Date;
    featured_until?: Date;

    // SEO
    slug: string;
    meta_title?: string;
    meta_description?: string;
    keywords: string[];
}

export type MoroccanRegion =
    | 'TANGER_TETOUAN_AL_HOCEIMA'
    | 'ORIENTAL'
    | 'FES_MEKNES'
    | 'RABAT_SALE_KENITRA'
    | 'BENI_MELLAL_KHENIFRA'
    | 'CASABLANCA_SETTAT'
    | 'MARRAKECH_SAFI'
    | 'DRAA_TAFILALET'
    | 'SOUSS_MASSA'
    | 'GUELMIM_OUED_NOUN'
    | 'LAAYOUNE_SAKIA_EL_HAMRA'
    | 'DAKHLA_OUED_ED_DAHAB';

export interface SupplierCertification extends BaseEntity {
    supplier_id: string;
    certification_type: string; // ISO 9001, HACCP, CE, etc.
    certification_name: string;
    issuing_body: string;
    certificate_number: string;
    issued_date: Date;
    expiry_date?: Date;
    document_url: string;
    verification_status: VerificationStatus;
    verified_at?: Date;
    verified_by?: string;
}

export interface ProductionCapacity {
    monthly_capacity: number;
    capacity_unit: string;
    production_lines: number;
    automation_level: 'MANUAL' | 'SEMI_AUTO' | 'FULLY_AUTO';
    shift_count: number;
    machinery_details?: string;
}

export interface QualityControl {
    has_qc_team: boolean;
    qc_team_size?: number;
    testing_equipment: string[];
    inspection_process?: string;
    defect_rate_percentage?: number;
}

export interface VerificationBadge {
    type: string;
    name: string;
    issued_at: Date;
    expires_at?: Date;
    icon_url: string;
}

export interface SocialMediaLinks {
    linkedin?: string;
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
}

// =============================================================================
// PRODUCT ENTITIES
// =============================================================================

export interface Product extends BaseEntity, AuditFields {
    supplier_id: string;

    // Basic Info - Multilingual
    name_en: string;
    name_ar?: string;
    name_fr?: string;
    slug: string;
    sku: string;

    // Description - Multilingual
    short_description_en: string;
    short_description_ar?: string;
    short_description_fr?: string;
    description_en: string;
    description_ar?: string;
    description_fr?: string;

    // Category
    category_id: string;
    sub_category_id?: string;

    // Pricing
    price_type: 'FIXED' | 'TIERED' | 'NEGOTIABLE';
    base_price: number;
    currency: Currency;
    price_tiers?: PriceTier[];
    price_visible_to: 'ALL' | 'REGISTERED' | 'VERIFIED' | 'ON_REQUEST';

    // MOQ & Lead Time
    moq: number;
    moq_unit: string;
    max_order_quantity?: number;
    lead_time_days: number;

    // Origin & Compliance (Moroccan Specific)
    country_of_origin: string; // Always 'MA' for Morocco
    region_of_origin?: MoroccanRegion;
    origin_certification: boolean;
    hs_code?: string; // Harmonized System Code for customs

    // Product Specifications
    specifications: ProductSpecification[];
    attributes: Record<string, string>;

    // Media
    main_image_url: string;
    gallery_images: string[];
    video_url?: string;
    documents: ProductDocument[];

    // Shipping
    weight_kg?: number;
    dimensions?: ProductDimensions;
    packaging_details?: string;
    customization_available: boolean;
    customization_details?: string;

    // Samples
    sample_available: boolean;
    sample_price?: number;
    sample_lead_time_days?: number;

    // Status & Visibility
    product_status: ProductStatus;
    is_featured: boolean;
    featured_until?: Date;
    is_hot: boolean;
    is_new: boolean;

    // Metrics
    view_count: number;
    inquiry_count: number;
    order_count: number;
    rating_avg: number;
    rating_count: number;

    // SEO
    meta_title?: string;
    meta_description?: string;
    keywords: string[];
    search_tags: string[];

    // Timestamp
    published_at?: Date;
}

export interface PriceTier {
    min_quantity: number;
    max_quantity?: number;
    price_per_unit: number;
}

export interface ProductSpecification {
    name: string;
    value: string;
    unit?: string;
}

export interface ProductDimensions {
    length_cm: number;
    width_cm: number;
    height_cm: number;
}

export interface ProductDocument {
    type: 'DATASHEET' | 'CERTIFICATE' | 'BROCHURE' | 'TEST_REPORT';
    name: string;
    url: string;
}

export interface Category extends BaseEntity {
    parent_id?: string;
    name_en: string;
    name_ar?: string;
    name_fr?: string;
    slug: string;
    description_en?: string;
    description_ar?: string;
    description_fr?: string;
    icon_url?: string;
    image_url?: string;
    display_order: number;
    is_active: boolean;
    is_featured: boolean;
    product_count: number;
    supplier_count: number;
    meta_title?: string;
    meta_description?: string;
}

// =============================================================================
// RFQ ENTITIES
// =============================================================================

export interface RFQ extends BaseEntity, AuditFields {
    buyer_id: string;

    // RFQ Details
    title: string;
    rfq_number: string; // Auto-generated: RFQ-2024-000001

    // Product Requirement
    product_name: string;
    category_id?: string;
    detailed_requirements: string;
    specifications: ProductSpecification[];

    // Quantity & Timeline
    quantity: number;
    quantity_unit: string;
    target_price?: number;
    target_currency: Currency;
    required_by_date?: Date;

    // Shipping
    destination_country: string;
    destination_port?: string;
    preferred_incoterms: Incoterm[];

    // Preferences
    preferred_supplier_location: string[]; // Country codes
    supplier_requirements?: string;

    // Attachments
    attachments: RFQAttachment[];
    reference_images: string[];

    // Targeting
    visibility: 'PUBLIC' | 'INVITED' | 'CATEGORY';
    invited_supplier_ids?: string[];
    target_category_ids?: string[];
    morocco_only: boolean;

    // Status
    rfq_status: RFQStatus;
    expires_at: Date;

    // Metrics
    view_count: number;
    quote_count: number;

    // Selected Quote
    selected_quote_id?: string;
    converted_order_id?: string;
}

export interface RFQAttachment {
    name: string;
    url: string;
    type: string;
    size_bytes: number;
}

export interface Quote extends BaseEntity, AuditFields {
    rfq_id: string;
    supplier_id: string;

    // Quote Details
    quote_number: string;

    // Pricing
    unit_price: number;
    currency: Currency;
    total_price: number;
    price_tiers?: PriceTier[];
    price_valid_until: Date;

    // Product Details
    product_description: string;
    specifications: ProductSpecification[];

    // Terms
    moq: number;
    lead_time_days: number;
    incoterm: Incoterm;
    shipping_cost?: number;
    payment_terms: string;

    // Samples
    sample_available: boolean;
    sample_price?: number;
    sample_lead_time_days?: number;

    // Attachments
    attachments: string[];

    // Status
    quote_status: 'DRAFT' | 'SUBMITTED' | 'SHORTLISTED' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';

    // Notes
    supplier_notes?: string;
    buyer_notes?: string;

    // Negotiation
    is_negotiable: boolean;
    revision_count: number;
    parent_quote_id?: string; // For quote revisions
}

// =============================================================================
// MESSAGING ENTITIES
// =============================================================================

export interface Conversation extends BaseEntity {
    type: 'BUYER_SUPPLIER' | 'SUPPORT' | 'RFQ' | 'ORDER';
    reference_type?: 'RFQ' | 'ORDER' | 'PRODUCT';
    reference_id?: string;
    participant_ids: string[];
    subject?: string;
    last_message_at: Date;
    last_message_preview?: string;
    unread_count: Record<string, number>; // user_id -> count
    is_archived: boolean;
}

export interface Message extends BaseEntity {
    conversation_id: string;
    sender_id: string;
    sender_type: 'BUYER' | 'SUPPLIER' | 'SYSTEM' | 'SUPPORT';

    // Content
    message_type: 'TEXT' | 'IMAGE' | 'FILE' | 'QUOTE' | 'ORDER' | 'SYSTEM';
    content: string;
    attachments?: MessageAttachment[];

    // Metadata
    metadata?: Record<string, any>;

    // Status
    is_read: boolean;
    read_at?: Date;
    is_deleted: boolean;
    deleted_at?: Date;
}

export interface MessageAttachment {
    type: 'IMAGE' | 'DOCUMENT' | 'VIDEO';
    name: string;
    url: string;
    size_bytes: number;
    mime_type: string;
}

// =============================================================================
// ORDER ENTITIES
// =============================================================================

export interface Order extends BaseEntity, AuditFields {
    order_number: string; // ORD-2024-000001

    // Parties
    buyer_id: string;
    supplier_id: string;

    // Source
    source_type: 'PRODUCT' | 'RFQ' | 'QUOTE';
    source_id?: string;

    // Items
    items: OrderItem[];

    // Pricing
    subtotal: number;
    shipping_cost: number;
    insurance_cost?: number;
    tax_amount?: number;
    discount_amount?: number;
    total_amount: number;
    currency: Currency;

    // Terms
    incoterm: Incoterm;
    payment_terms: string;

    // Addresses
    shipping_address_id: string;
    billing_address_id: string;

    // Timeline
    estimated_production_days: number;
    estimated_shipping_days: number;
    estimated_delivery_date?: Date;
    actual_delivery_date?: Date;

    // Status
    order_status: OrderStatus;
    payment_status: PaymentStatus;

    // Notes
    buyer_notes?: string;
    supplier_notes?: string;
    internal_notes?: string;

    // Documents
    proforma_invoice_url?: string;
    commercial_invoice_url?: string;
    packing_list_url?: string;
    bill_of_lading_url?: string;
    certificate_of_origin_url?: string;

    // Milestones
    milestones: OrderMilestone[];
}

export interface OrderItem extends BaseEntity {
    order_id: string;
    product_id?: string;

    // Product Details (snapshot at order time)
    product_name: string;
    product_sku?: string;
    product_image_url?: string;
    specifications?: ProductSpecification[];

    // Quantity & Pricing
    quantity: number;
    unit: string;
    unit_price: number;
    total_price: number;

    // Customization
    customization_details?: string;
}

export interface OrderMilestone {
    milestone: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
    estimated_date?: Date;
    actual_date?: Date;
    notes?: string;
}

// =============================================================================
// PAYMENT & ESCROW ENTITIES
// =============================================================================

export interface Payment extends BaseEntity, AuditFields {
    order_id: string;
    payment_number: string;

    // Amount
    amount: number;
    currency: Currency;
    exchange_rate?: number;

    // Method
    payment_method: PaymentMethod;
    payment_gateway?: string;
    gateway_transaction_id?: string;

    // Status
    payment_status: PaymentStatus;

    // Escrow
    is_escrow: boolean;
    escrow_id?: string;

    // Payer/Payee
    payer_id: string;
    payee_id: string;

    // Bank Details (for wire transfer)
    bank_reference?: string;

    // Timestamps
    initiated_at: Date;
    completed_at?: Date;
    failed_at?: Date;
    failure_reason?: string;

    // Receipts
    receipt_url?: string;
}

export interface EscrowTransaction extends BaseEntity {
    order_id: string;
    payment_id: string;

    // Amount
    escrowed_amount: number;
    currency: Currency;

    // Parties
    buyer_id: string;
    supplier_id: string;

    // Status
    escrow_status: 'FUNDED' | 'HELD' | 'PARTIAL_RELEASE' | 'RELEASED' | 'REFUNDED' | 'DISPUTED';

    // Release Conditions
    release_conditions: ReleaseCondition[];
    released_amount: number;
    remaining_amount: number;

    // Timeline
    funded_at: Date;
    released_at?: Date;
    refunded_at?: Date;

    // Dispute reference
    dispute_id?: string;
}

export interface ReleaseCondition {
    condition: string;
    is_met: boolean;
    met_at?: Date;
    verified_by?: string;
}

// =============================================================================
// SHIPPING & LOGISTICS ENTITIES
// =============================================================================

export interface Shipment extends BaseEntity {
    order_id: string;
    shipment_number: string;

    // Logistics Partner
    logistics_partner_id?: string;
    carrier_name: string;
    carrier_tracking_number?: string;

    // Shipping Details
    shipping_method: ShippingMethod;
    incoterm: Incoterm;

    // Origin
    origin_address_id: string;
    origin_port?: string;

    // Destination
    destination_address_id: string;
    destination_port?: string;

    // Package Details
    packages: ShipmentPackage[];
    total_weight_kg: number;
    total_volume_cbm: number;

    // Container (for sea freight)
    container_type?: '20FT' | '40FT' | '40FT_HC' | 'LCL';
    container_number?: string;

    // Timeline
    pickup_date?: Date;
    estimated_departure_date?: Date;
    actual_departure_date?: Date;
    estimated_arrival_date?: Date;
    actual_arrival_date?: Date;
    delivered_date?: Date;

    // Status
    shipment_status: 'PENDING' | 'PICKED_UP' | 'IN_TRANSIT' | 'CUSTOMS' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'EXCEPTION';

    // Tracking
    tracking_events: TrackingEvent[];

    // Customs
    customs_status?: 'PENDING' | 'IN_PROGRESS' | 'CLEARED' | 'HELD';
    customs_documents: string[];

    // Insurance
    is_insured: boolean;
    insurance_value?: number;
    insurance_policy_number?: string;

    // Cost
    shipping_cost: number;
    currency: Currency;
}

export interface ShipmentPackage {
    package_number: string;
    weight_kg: number;
    length_cm: number;
    width_cm: number;
    height_cm: number;
    content_description: string;
}

export interface TrackingEvent {
    timestamp: Date;
    location: string;
    status: string;
    description: string;
}

export interface LogisticsPartner extends BaseEntity {
    company_name: string;
    logo_url?: string;
    description?: string;

    // Coverage
    origin_countries: string[];
    destination_countries: string[];
    shipping_methods: ShippingMethod[];

    // Contact
    contact_email: string;
    contact_phone: string;
    website_url?: string;

    // Integration
    api_endpoint?: string;
    api_key_encrypted?: string;

    // Performance
    rating_avg: number;
    rating_count: number;
    on_time_rate: number;

    is_active: boolean;
    is_preferred: boolean;
}

// =============================================================================
// REVIEW & RATING ENTITIES
// =============================================================================

export interface Review extends BaseEntity, AuditFields {
    reviewer_id: string;
    reviewer_type: 'BUYER' | 'SUPPLIER';

    // Target
    review_type: 'SUPPLIER' | 'PRODUCT' | 'BUYER' | 'ORDER';
    target_id: string;
    order_id?: string;

    // Ratings
    overall_rating: number; // 1-5
    ratings: RatingBreakdown;

    // Content
    title?: string;
    content: string;

    // Media
    images?: string[];

    // Verification
    is_verified_purchase: boolean;

    // Response
    response?: ReviewResponse;

    // Moderation
    is_approved: boolean;
    is_hidden: boolean;
    moderation_notes?: string;

    // Helpfulness
    helpful_count: number;
    not_helpful_count: number;
}

export interface RatingBreakdown {
    quality?: number;
    communication?: number;
    shipping_speed?: number;
    value_for_money?: number;
    accuracy?: number;
}

export interface ReviewResponse {
    responder_id: string;
    content: string;
    responded_at: Date;
}

// =============================================================================
// DISPUTE ENTITIES
// =============================================================================

export interface Dispute extends BaseEntity, AuditFields {
    dispute_number: string;
    order_id: string;

    // Parties
    buyer_id: string;
    supplier_id: string;

    // Issue
    dispute_type: DisputeType;
    title: string;
    description: string;

    // Evidence
    evidence: DisputeEvidence[];

    // Amount
    disputed_amount: number;
    currency: Currency;

    // Status
    dispute_status: DisputeStatus;

    // Resolution
    resolution_type?: 'REFUND' | 'PARTIAL_REFUND' | 'REPLACEMENT' | 'OTHER';
    resolution_amount?: number;
    resolution_notes?: string;
    resolved_at?: Date;
    resolved_by?: string;

    // Mediation
    mediator_id?: string;
    mediation_notes?: string;

    // Timeline
    escalated_at?: Date;
    deadline?: Date;
}

export interface DisputeEvidence {
    submitted_by: string;
    type: 'IMAGE' | 'VIDEO' | 'DOCUMENT' | 'TEXT';
    title: string;
    description?: string;
    url?: string;
    submitted_at: Date;
}

// =============================================================================
// ADMIN & ANALYTICS ENTITIES
// =============================================================================

export interface AdminAuditLog extends BaseEntity {
    admin_id: string;
    action: string;
    entity_type: string;
    entity_id: string;
    old_values?: Record<string, any>;
    new_values?: Record<string, any>;
    ip_address: string;
    user_agent: string;
}

export interface PlatformSetting extends BaseEntity {
    key: string;
    value: any;
    value_type: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'JSON';
    category: string;
    description?: string;
    is_public: boolean;
}

export interface ReportedContent extends BaseEntity {
    reporter_id: string;
    content_type: 'PRODUCT' | 'SUPPLIER' | 'REVIEW' | 'MESSAGE';
    content_id: string;
    reason: string;
    description?: string;
    resolved_status: 'PENDING' | 'REVIEWED' | 'ACTION_TAKEN' | 'DISMISSED';
    resolved_by?: string;
    resolved_at?: Date;
    resolution_notes?: string;
}

// =============================================================================
// SEARCH & ANALYTICS TYPES (Elasticsearch)
// =============================================================================

export interface ProductSearchDocument {
    id: string;
    supplier_id: string;
    name: string;
    name_en: string;
    name_ar?: string;
    name_fr?: string;
    description: string;
    category_id: string;
    category_name: string;
    sub_category_id?: string;
    price: number;
    currency: Currency;
    moq: number;
    country_of_origin: string;
    region_of_origin?: string;
    keywords: string[];
    search_tags: string[];
    supplier_name: string;
    supplier_verification_level: VerificationLevel;
    rating_avg: number;
    rating_count: number;
    order_count: number;
    view_count: number;
    is_featured: boolean;
    is_hot: boolean;
    product_status: ProductStatus;
    created_at: Date;
    updated_at: Date;
}

export interface SupplierSearchDocument {
    id: string;
    company_name: string;
    company_name_en: string;
    company_name_ar?: string;
    company_name_fr?: string;
    company_type: string;
    region: MoroccanRegion;
    city: string;
    main_categories: SupplierCategory[];
    keywords: string[];
    verification_level: VerificationLevel;
    has_export_license: boolean;
    export_countries: string[];
    rating_avg: number;
    rating_count: number;
    response_rate: number;
    on_time_delivery_rate: number;
    total_transactions: number;
    year_established: number;
    employee_count: number;
    is_premium: boolean;
    languages_supported: Language[];
    created_at: Date;
    updated_at: Date;
}
