-- ============================================
-- OUROZ Supplier Profile Database Schema
-- PostgreSQL Migration: 001_supplier_profile_tables
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUM TYPES
-- ============================================

CREATE TYPE verification_level AS ENUM ('BASIC', 'VERIFIED', 'GOLD', 'TRUSTED');
CREATE TYPE company_type AS ENUM ('MANUFACTURER', 'WHOLESALER', 'TRADING_COMPANY', 'COOPERATIVE', 'ARTISAN');
CREATE TYPE employee_range AS ENUM ('1-10', '11-50', '51-100', '101-500', '500+');
CREATE TYPE revenue_range AS ENUM ('< $100K', '$100K - $500K', '$500K - $1M', '$1M - $5M', '$5M - $10M', '$10M+');
CREATE TYPE supplier_status AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED', 'REJECTED');

-- ============================================
-- TABLE: suppliers
-- Core supplier/company information
-- ============================================

CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Account linkage
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Company names (multi-language)
    company_name VARCHAR(255) NOT NULL,
    company_name_ar VARCHAR(255),
    company_name_fr VARCHAR(255),

    -- Branding
    logo_url VARCHAR(500),
    banner_url VARCHAR(500),

    -- Verification & Trust
    verification_level verification_level NOT NULL DEFAULT 'BASIC',
    has_trade_assurance BOOLEAN NOT NULL DEFAULT FALSE,
    trade_assurance_limit DECIMAL(15, 2) DEFAULT 0,

    -- Business Info
    company_type company_type NOT NULL,
    year_established INTEGER CHECK (year_established >= 1900 AND year_established <= EXTRACT(YEAR FROM CURRENT_DATE)),
    employee_count employee_range,
    annual_revenue revenue_range,

    -- Location
    region VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    full_address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),

    -- Export Info
    export_experience_years INTEGER DEFAULT 0,
    has_export_license BOOLEAN DEFAULT FALSE,
    free_zone_certified BOOLEAN DEFAULT FALSE,

    -- Performance Metrics (calculated/cached)
    response_rate DECIMAL(5, 2) DEFAULT 0, -- percentage
    avg_response_time_hours DECIMAL(5, 2),
    on_time_delivery_rate DECIMAL(5, 2) DEFAULT 0,
    rating_avg DECIMAL(3, 2) DEFAULT 0,
    rating_count INTEGER DEFAULT 0,
    total_transactions INTEGER DEFAULT 0,
    repeat_buyer_rate DECIMAL(5, 2) DEFAULT 0,

    -- Content
    description TEXT,
    video_url VARCHAR(500),

    -- Contact
    contact_name VARCHAR(255),
    contact_title VARCHAR(100),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),

    -- Status
    status supplier_status NOT NULL DEFAULT 'PENDING',

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    verified_at TIMESTAMP WITH TIME ZONE,

    -- Constraints
    CONSTRAINT valid_rating CHECK (rating_avg >= 0 AND rating_avg <= 5),
    CONSTRAINT valid_rates CHECK (
        response_rate >= 0 AND response_rate <= 100 AND
        on_time_delivery_rate >= 0 AND on_time_delivery_rate <= 100 AND
        repeat_buyer_rate >= 0 AND repeat_buyer_rate <= 100
    )
);

-- Indexes for suppliers
CREATE INDEX idx_suppliers_user_id ON suppliers(user_id);
CREATE INDEX idx_suppliers_status ON suppliers(status);
CREATE INDEX idx_suppliers_verification ON suppliers(verification_level);
CREATE INDEX idx_suppliers_region ON suppliers(region);
CREATE INDEX idx_suppliers_city ON suppliers(city);
CREATE INDEX idx_suppliers_company_type ON suppliers(company_type);
CREATE INDEX idx_suppliers_rating ON suppliers(rating_avg DESC);
CREATE INDEX idx_suppliers_created_at ON suppliers(created_at DESC);

-- Full-text search index
CREATE INDEX idx_suppliers_company_name_search ON suppliers USING gin(to_tsvector('english', company_name));

-- ============================================
-- TABLE: supplier_categories
-- Categories the supplier operates in
-- ============================================

CREATE TABLE supplier_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(supplier_id, category_id)
);

CREATE INDEX idx_supplier_categories_supplier ON supplier_categories(supplier_id);
CREATE INDEX idx_supplier_categories_category ON supplier_categories(category_id);

-- ============================================
-- TABLE: supplier_export_countries
-- Countries the supplier exports to
-- ============================================

CREATE TABLE supplier_export_countries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
    country_code CHAR(2) NOT NULL, -- ISO 3166-1 alpha-2
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(supplier_id, country_code)
);

CREATE INDEX idx_supplier_export_countries_supplier ON supplier_export_countries(supplier_id);
CREATE INDEX idx_supplier_export_countries_country ON supplier_export_countries(country_code);

-- ============================================
-- TABLE: supplier_certifications
-- Certifications held by supplier
-- ============================================

CREATE TABLE supplier_certifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,

    name VARCHAR(100) NOT NULL,
    issuer VARCHAR(100) NOT NULL,
    icon VARCHAR(50), -- emoji or icon code
    certificate_number VARCHAR(100),
    issue_date DATE,
    expiry_date DATE,
    document_url VARCHAR(500),
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by UUID REFERENCES users(id),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_supplier_certifications_supplier ON supplier_certifications(supplier_id);
CREATE INDEX idx_supplier_certifications_verified ON supplier_certifications(is_verified);

-- ============================================
-- TABLE: supplier_languages
-- Languages spoken by supplier contact
-- ============================================

CREATE TABLE supplier_languages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
    language_code VARCHAR(10) NOT NULL, -- e.g., 'en', 'ar', 'fr'
    language_name VARCHAR(50) NOT NULL,
    proficiency VARCHAR(20) DEFAULT 'FLUENT', -- BASIC, CONVERSATIONAL, FLUENT, NATIVE
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(supplier_id, language_code)
);

CREATE INDEX idx_supplier_languages_supplier ON supplier_languages(supplier_id);

-- ============================================
-- TABLE: supplier_gallery
-- Photos and media for supplier profile
-- ============================================

CREATE TABLE supplier_gallery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,

    media_type VARCHAR(20) NOT NULL DEFAULT 'IMAGE', -- IMAGE, VIDEO
    url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    title VARCHAR(255),
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_supplier_gallery_supplier ON supplier_gallery(supplier_id);
CREATE INDEX idx_supplier_gallery_sort ON supplier_gallery(supplier_id, sort_order);

-- ============================================
-- TABLE: supplier_reviews
-- Reviews from buyers
-- ============================================

CREATE TABLE supplier_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
    buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,

    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    content TEXT,

    -- Detailed ratings (optional)
    communication_rating INTEGER CHECK (communication_rating >= 1 AND communication_rating <= 5),
    quality_rating INTEGER CHECK (quality_rating >= 1 AND quality_rating <= 5),
    delivery_rating INTEGER CHECK (delivery_rating >= 1 AND delivery_rating <= 5),

    -- Moderation
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    is_visible BOOLEAN DEFAULT TRUE,
    is_flagged BOOLEAN DEFAULT FALSE,

    -- Supplier response
    response TEXT,
    response_at TIMESTAMP WITH TIME ZONE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_supplier_reviews_supplier ON supplier_reviews(supplier_id);
CREATE INDEX idx_supplier_reviews_buyer ON supplier_reviews(buyer_id);
CREATE INDEX idx_supplier_reviews_rating ON supplier_reviews(supplier_id, rating);
CREATE INDEX idx_supplier_reviews_created ON supplier_reviews(created_at DESC);
CREATE INDEX idx_supplier_reviews_visible ON supplier_reviews(supplier_id, is_visible) WHERE is_visible = TRUE;

-- ============================================
-- TABLE: supplier_products
-- Products listed by supplier (summary for profile)
-- ============================================

CREATE TABLE supplier_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,

    name VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255),
    name_fr VARCHAR(255),
    slug VARCHAR(255) NOT NULL,

    description TEXT,
    image_url VARCHAR(500),

    -- Pricing
    price_min DECIMAL(12, 2),
    price_max DECIMAL(12, 2),
    currency CHAR(3) DEFAULT 'USD',

    -- MOQ & Orders
    moq INTEGER DEFAULT 1,
    total_orders INTEGER DEFAULT 0,

    -- Categorization
    category_id UUID REFERENCES categories(id),

    -- Status
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT valid_price_range CHECK (price_min IS NULL OR price_max IS NULL OR price_min <= price_max)
);

CREATE UNIQUE INDEX idx_supplier_products_slug ON supplier_products(supplier_id, slug);
CREATE INDEX idx_supplier_products_supplier ON supplier_products(supplier_id);
CREATE INDEX idx_supplier_products_featured ON supplier_products(supplier_id, is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_supplier_products_active ON supplier_products(supplier_id, is_active) WHERE is_active = TRUE;
CREATE INDEX idx_supplier_products_category ON supplier_products(category_id);

-- ============================================
-- TABLE: supplier_favorites
-- Buyers who favorited a supplier
-- ============================================

CREATE TABLE supplier_favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(supplier_id, user_id)
);

CREATE INDEX idx_supplier_favorites_supplier ON supplier_favorites(supplier_id);
CREATE INDEX idx_supplier_favorites_user ON supplier_favorites(user_id);

-- ============================================
-- TABLE: supplier_reports
-- Reports/flags from users
-- ============================================

CREATE TABLE supplier_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
    reporter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    reason VARCHAR(50) NOT NULL, -- SPAM, FRAUD, INAPPROPRIATE, FAKE_INFO, OTHER
    description TEXT,

    status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, REVIEWED, RESOLVED, DISMISSED
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    resolution_notes TEXT,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_supplier_reports_supplier ON supplier_reports(supplier_id);
CREATE INDEX idx_supplier_reports_status ON supplier_reports(status);
CREATE INDEX idx_supplier_reports_created ON supplier_reports(created_at DESC);

-- ============================================
-- FUNCTION: Update updated_at timestamp
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON suppliers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_supplier_certifications_updated_at BEFORE UPDATE ON supplier_certifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_supplier_gallery_updated_at BEFORE UPDATE ON supplier_gallery FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_supplier_reviews_updated_at BEFORE UPDATE ON supplier_reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_supplier_products_updated_at BEFORE UPDATE ON supplier_products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_supplier_reports_updated_at BEFORE UPDATE ON supplier_reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FUNCTION: Recalculate supplier rating
-- ============================================

CREATE OR REPLACE FUNCTION recalculate_supplier_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE suppliers
    SET
        rating_avg = (
            SELECT COALESCE(AVG(rating), 0)
            FROM supplier_reviews
            WHERE supplier_id = COALESCE(NEW.supplier_id, OLD.supplier_id) AND is_visible = TRUE
        ),
        rating_count = (
            SELECT COUNT(*)
            FROM supplier_reviews
            WHERE supplier_id = COALESCE(NEW.supplier_id, OLD.supplier_id) AND is_visible = TRUE
        ),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = COALESCE(NEW.supplier_id, OLD.supplier_id);

    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_recalculate_rating
AFTER INSERT OR UPDATE OR DELETE ON supplier_reviews
FOR EACH ROW EXECUTE FUNCTION recalculate_supplier_rating();
