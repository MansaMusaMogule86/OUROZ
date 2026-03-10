/**
 * Morocco Trade OS — Service Layer
 *
 * Supabase query functions for all Trade OS data.
 * Each function returns typed data matching the existing Trade OS interfaces.
 * Falls back to mock data when tables are empty (initial deployment).
 */

import { supabase } from '@/lib/supabase';
import type {
    TradeSupplier,
    TradeRFQ,
    TradeQuote,
    TradePriceData,
    TradePriceAlert,
    TradeShipment,
    TradeComplianceRecord,
    TradeDeal,
    TradeDashboardStats,
    TradeAIInsightItem,
    TradeActivityItem,
    TradeAlert,
} from '@/types/trade';

// ============================================================
// Internal helpers
// ============================================================

function mapSupplierRow(row: Record<string, unknown>): TradeSupplier {
    return {
        id: row.id as string,
        companyName: row.company_name as string,
        slug: row.slug as string,
        companyType: row.company_type as TradeSupplier['companyType'],
        region: row.region as string,
        city: row.city as string,
        yearEstablished: row.year_established as number,
        employeeCount: row.employee_count as string,
        mainCategories: row.main_categories as string[],
        certifications: (row.certifications ?? []) as TradeSupplier['certifications'],
        exportCountries: row.export_countries as string[],
        hasExportLicense: row.has_export_license as boolean,
        freeZoneCertified: row.free_zone_certified as boolean,
        verificationLevel: row.verification_level as TradeSupplier['verificationLevel'],
        responseRate: Number(row.response_rate ?? 0),
        responseTimeHours: row.response_time_hours as number,
        onTimeDeliveryRate: Number(row.on_time_delivery_rate ?? 0),
        ratingAvg: Number(row.rating_avg ?? 0),
        ratingCount: row.rating_count as number,
        totalTransactions: row.total_transactions as number,
        repeatBuyerRate: Number(row.repeat_buyer_rate ?? 0),
        monthlyCapacity: row.monthly_capacity as string,
        moqMin: row.moq_min as number,
        moqCurrency: row.moq_currency as string,
        leadTimeDaysMin: row.lead_time_days_min as number,
        leadTimeDaysMax: row.lead_time_days_max as number,
        sampleAvailable: row.sample_available as boolean,
        aiMatchScore: row.ai_match_score != null ? Number(row.ai_match_score) : undefined,
        aiMatchReasons: row.ai_match_reasons as string[] | undefined,
        complianceScore: Number(row.compliance_score ?? 0),
        languages: row.languages as string[],
        contactName: row.contact_name as string,
        contactTitle: row.contact_title as string,
        description: row.description as string,
    };
}

function mapQuoteRow(row: Record<string, unknown>): TradeQuote {
    return {
        id: row.id as string,
        rfqId: row.rfq_id as string,
        supplierId: row.supplier_id as string,
        supplierName: row.supplier_name as string,
        supplierCity: (row.supplier_city ?? '') as string,
        supplierVerification: (row.supplier_verification ?? 'basic') as string,
        quoteNumber: row.quote_number as string,
        status: row.status as TradeQuote['status'],
        submittedAt: row.submitted_at as string,
        unitPrice: Number(row.unit_price),
        currency: row.currency as string,
        totalPrice: Number(row.total_price),
        priceValidUntil: row.price_valid_until as string,
        moq: row.moq as number,
        leadTimeDays: row.lead_time_days as number,
        incoterm: row.incoterm as string,
        shippingCost: row.shipping_cost != null ? Number(row.shipping_cost) : undefined,
        paymentTerms: row.payment_terms as string,
        sampleAvailable: row.sample_available as boolean,
        samplePrice: row.sample_price != null ? Number(row.sample_price) : undefined,
        aiComparisonScore: row.ai_comparison_score != null ? Number(row.ai_comparison_score) : undefined,
        aiNotes: row.ai_notes as string | undefined,
        supplierNotes: row.supplier_notes as string | undefined,
        isNegotiable: row.is_negotiable as boolean,
    };
}

function mapRfqRow(row: Record<string, unknown>, quotes: TradeQuote[]): TradeRFQ {
    return {
        id: row.id as string,
        rfqNumber: row.rfq_number as string,
        title: row.title as string,
        status: row.status as TradeRFQ['status'],
        createdAt: row.created_at as string,
        expiresAt: row.expires_at as string,
        productName: row.product_name as string,
        category: row.category as string,
        detailedRequirements: (row.detailed_requirements ?? '') as string,
        specifications: (row.specifications ?? []) as { key: string; value: string }[],
        quantity: row.quantity as number,
        quantityUnit: row.quantity_unit as string,
        targetPricePerUnit: row.target_price_per_unit != null ? Number(row.target_price_per_unit) : undefined,
        targetCurrency: row.target_currency as string,
        destinationPort: (row.destination_port ?? '') as string,
        incoterm: (row.incoterm ?? '') as string,
        requiredByDate: row.required_by_date as string | undefined,
        targetCategories: row.target_categories as string[],
        invitedSupplierIds: row.invited_supplier_ids as string[] | undefined,
        aiScore: row.ai_score != null ? Number(row.ai_score) : undefined,
        aiSuggestions: row.ai_suggestions as string[] | undefined,
        viewCount: row.view_count as number,
        quoteCount: row.quote_count as number,
        quotes,
        selectedQuoteId: row.selected_quote_id as string | undefined,
    };
}

// ============================================================
// Suppliers
// ============================================================

export async function fetchTradeSuppliers(): Promise<TradeSupplier[]> {
    const { data, error } = await supabase
        .from('trade_suppliers')
        .select('*')
        .order('ai_match_score', { ascending: false, nullsFirst: false });

    if (error) throw new Error(`Failed to fetch trade suppliers: ${error.message}`);
    if (!data || data.length === 0) {
        const { MOCK_SUPPLIERS } = await import('./mock-suppliers');
        return MOCK_SUPPLIERS;
    }
    return data.map(row => mapSupplierRow(row as Record<string, unknown>));
}

export async function fetchTradeSupplierById(id: string): Promise<TradeSupplier | null> {
    const { data, error } = await supabase
        .from('trade_suppliers')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !data) {
        const { MOCK_SUPPLIERS } = await import('./mock-suppliers');
        return MOCK_SUPPLIERS.find(s => s.id === id) ?? null;
    }
    return mapSupplierRow(data as Record<string, unknown>);
}

// ============================================================
// RFQs
// ============================================================

export async function fetchTradeRfqs(): Promise<TradeRFQ[]> {
    const { data: rfqRows, error } = await supabase
        .from('trade_rfqs')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch RFQs: ${error.message}`);
    if (!rfqRows || rfqRows.length === 0) {
        const { MOCK_RFQS } = await import('./mock-rfqs');
        return MOCK_RFQS;
    }

    const rfqIds = rfqRows.map(r => r.id);
    const { data: quoteRows } = await supabase
        .from('trade_quotes')
        .select('*')
        .in('rfq_id', rfqIds);

    const quotesByRfq = new Map<string, TradeQuote[]>();
    (quoteRows ?? []).forEach(q => {
        const mapped = mapQuoteRow(q as Record<string, unknown>);
        const existing = quotesByRfq.get(mapped.rfqId) ?? [];
        existing.push(mapped);
        quotesByRfq.set(mapped.rfqId, existing);
    });

    return rfqRows.map(row =>
        mapRfqRow(row as Record<string, unknown>, quotesByRfq.get(row.id as string) ?? [])
    );
}

export async function fetchTradeRfqById(id: string): Promise<TradeRFQ | null> {
    const { data: rfqRow, error } = await supabase
        .from('trade_rfqs')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !rfqRow) {
        const { MOCK_RFQS } = await import('./mock-rfqs');
        return MOCK_RFQS.find(r => r.id === id) ?? null;
    }

    const { data: quoteRows } = await supabase
        .from('trade_quotes')
        .select('*')
        .eq('rfq_id', id);

    const quotes = (quoteRows ?? []).map(q => mapQuoteRow(q as Record<string, unknown>));
    return mapRfqRow(rfqRow as Record<string, unknown>, quotes);
}

// ============================================================
// Prices
// ============================================================

export async function fetchTradePrices(): Promise<TradePriceData[]> {
    const { data, error } = await supabase
        .from('trade_prices')
        .select('*')
        .order('product_name');

    if (error) throw new Error(`Failed to fetch prices: ${error.message}`);
    if (!data || data.length === 0) {
        const { MOCK_PRICES } = await import('./mock-prices');
        return MOCK_PRICES;
    }
    return data.map(row => ({
        id: row.id,
        productName: row.product_name,
        category: row.category,
        currentPrice: Number(row.current_price),
        previousPrice: Number(row.previous_price),
        currency: row.currency,
        unit: row.unit,
        trend: row.trend as TradePriceData['trend'],
        changePercent: Number(row.change_percent),
        benchmarks: row.benchmarks as TradePriceData['benchmarks'],
        history: row.history as TradePriceData['history'],
        aiSummary: row.ai_summary ?? undefined,
    }));
}

export async function fetchTradePriceAlerts(): Promise<TradePriceAlert[]> {
    const { data, error } = await supabase
        .from('trade_price_alerts')
        .select('*')
        .eq('is_active', true);

    if (error) throw new Error(`Failed to fetch price alerts: ${error.message}`);
    if (!data || data.length === 0) {
        const { MOCK_PRICE_ALERTS } = await import('./mock-prices');
        return MOCK_PRICE_ALERTS;
    }
    return data.map(row => ({
        id: row.id,
        productName: row.product_name,
        condition: row.condition as TradePriceAlert['condition'],
        threshold: Number(row.threshold),
        currency: row.currency,
        isActive: row.is_active,
        triggeredAt: row.triggered_at ?? undefined,
    }));
}

// ============================================================
// Shipments
// ============================================================

export async function fetchTradeShipments(): Promise<TradeShipment[]> {
    const { data, error } = await supabase
        .from('trade_shipments')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch shipments: ${error.message}`);
    if (!data || data.length === 0) {
        const { MOCK_SHIPMENTS } = await import('./mock-shipments');
        return MOCK_SHIPMENTS;
    }
    return data.map(row => ({
        id: row.id,
        shipmentNumber: row.shipment_number,
        status: row.status as TradeShipment['status'],
        riskLevel: row.risk_level as TradeShipment['riskLevel'],
        supplierName: row.supplier_name,
        supplierId: row.supplier_id,
        buyerCompany: row.buyer_company,
        origin: row.origin as TradeShipment['origin'],
        destination: row.destination as TradeShipment['destination'],
        shippingMethod: row.shipping_method as TradeShipment['shippingMethod'],
        carrierName: row.carrier_name,
        trackingNumber: row.tracking_number ?? undefined,
        containerNumber: row.container_number ?? undefined,
        bookedAt: row.booked_at,
        estimatedDeparture: row.estimated_departure,
        actualDeparture: row.actual_departure ?? undefined,
        estimatedArrival: row.estimated_arrival,
        actualArrival: row.actual_arrival ?? undefined,
        description: row.description,
        weightKg: Number(row.weight_kg),
        volumeCbm: Number(row.volume_cbm),
        value: Number(row.value),
        currency: row.currency,
        incoterm: row.incoterm,
        milestones: row.milestones as TradeShipment['milestones'],
        documents: row.documents as TradeShipment['documents'],
        riskAlerts: row.risk_alerts as TradeShipment['riskAlerts'],
    }));
}

export async function fetchTradeShipmentById(id: string): Promise<TradeShipment | null> {
    const { data, error } = await supabase
        .from('trade_shipments')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !data) {
        const { MOCK_SHIPMENTS } = await import('./mock-shipments');
        return MOCK_SHIPMENTS.find(s => s.id === id) ?? null;
    }
    return {
        id: data.id,
        shipmentNumber: data.shipment_number,
        status: data.status as TradeShipment['status'],
        riskLevel: data.risk_level as TradeShipment['riskLevel'],
        supplierName: data.supplier_name,
        supplierId: data.supplier_id,
        buyerCompany: data.buyer_company,
        origin: data.origin as TradeShipment['origin'],
        destination: data.destination as TradeShipment['destination'],
        shippingMethod: data.shipping_method as TradeShipment['shippingMethod'],
        carrierName: data.carrier_name,
        trackingNumber: data.tracking_number ?? undefined,
        containerNumber: data.container_number ?? undefined,
        bookedAt: data.booked_at,
        estimatedDeparture: data.estimated_departure,
        actualDeparture: data.actual_departure ?? undefined,
        estimatedArrival: data.estimated_arrival,
        actualArrival: data.actual_arrival ?? undefined,
        description: data.description,
        weightKg: Number(data.weight_kg),
        volumeCbm: Number(data.volume_cbm),
        value: Number(data.value),
        currency: data.currency,
        incoterm: data.incoterm,
        milestones: data.milestones as TradeShipment['milestones'],
        documents: data.documents as TradeShipment['documents'],
        riskAlerts: data.risk_alerts as TradeShipment['riskAlerts'],
    };
}

// ============================================================
// Compliance
// ============================================================

export async function fetchTradeCompliance(): Promise<TradeComplianceRecord[]> {
    const { data, error } = await supabase
        .from('trade_compliance')
        .select('*')
        .order('overall_score', { ascending: false });

    if (error) throw new Error(`Failed to fetch compliance: ${error.message}`);
    if (!data || data.length === 0) {
        const { MOCK_COMPLIANCE } = await import('./mock-compliance');
        return MOCK_COMPLIANCE;
    }
    return data.map(row => ({
        id: row.id,
        supplierId: row.supplier_id,
        supplierName: row.supplier_name,
        overallScore: Number(row.overall_score),
        level: row.level as TradeComplianceRecord['level'],
        lastAuditDate: row.last_audit_date,
        nextAuditDue: row.next_audit_due,
        categories: row.categories as TradeComplianceRecord['categories'],
        documents: row.documents as TradeComplianceRecord['documents'],
        auditTrail: row.audit_trail as TradeComplianceRecord['auditTrail'],
    }));
}

// ============================================================
// Deals
// ============================================================

export async function fetchTradeDeals(): Promise<TradeDeal[]> {
    const { data, error } = await supabase
        .from('trade_deals')
        .select('*')
        .order('updated_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch deals: ${error.message}`);
    if (!data || data.length === 0) {
        const { MOCK_DEALS } = await import('./mock-deals');
        return MOCK_DEALS;
    }
    return data.map(row => ({
        id: row.id,
        dealNumber: row.deal_number,
        title: row.title,
        status: row.status as TradeDeal['status'],
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        supplierId: row.supplier_id,
        supplierName: row.supplier_name,
        supplierCity: row.supplier_city,
        buyerCompany: row.buyer_company,
        productName: row.product_name,
        category: row.category,
        quantity: row.quantity,
        quantityUnit: row.quantity_unit,
        currentTerms: row.current_terms as TradeDeal['currentTerms'],
        termHistory: row.term_history as TradeDeal['termHistory'],
        messages: row.messages as TradeDeal['messages'],
        aiStrategyNotes: row.ai_strategy_notes ?? undefined,
        aiRecommendedPrice: row.ai_recommended_price != null ? Number(row.ai_recommended_price) : undefined,
        aiConfidence: row.ai_confidence != null ? Number(row.ai_confidence) : undefined,
        milestones: row.milestones as TradeDeal['milestones'],
        rfqId: row.rfq_id ?? undefined,
    }));
}

export async function fetchTradeDealById(id: string): Promise<TradeDeal | null> {
    const { data, error } = await supabase
        .from('trade_deals')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !data) {
        const { MOCK_DEALS } = await import('./mock-deals');
        return MOCK_DEALS.find(d => d.id === id) ?? null;
    }
    return {
        id: data.id,
        dealNumber: data.deal_number,
        title: data.title,
        status: data.status as TradeDeal['status'],
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        supplierId: data.supplier_id,
        supplierName: data.supplier_name,
        supplierCity: data.supplier_city,
        buyerCompany: data.buyer_company,
        productName: data.product_name,
        category: data.category,
        quantity: data.quantity,
        quantityUnit: data.quantity_unit,
        currentTerms: data.current_terms as TradeDeal['currentTerms'],
        termHistory: data.term_history as TradeDeal['termHistory'],
        messages: data.messages as TradeDeal['messages'],
        aiStrategyNotes: data.ai_strategy_notes ?? undefined,
        aiRecommendedPrice: data.ai_recommended_price != null ? Number(data.ai_recommended_price) : undefined,
        aiConfidence: data.ai_confidence != null ? Number(data.ai_confidence) : undefined,
        milestones: data.milestones as TradeDeal['milestones'],
        rfqId: data.rfq_id ?? undefined,
    };
}

// ============================================================
// Dashboard
// ============================================================

export async function fetchTradeDashboardStats(): Promise<TradeDashboardStats> {
    // Fetch all dashboard data in parallel
    const [insightsResult, activityResult, alertsResult, rfqCount, shipmentCount, dealCount, complianceResult] =
        await Promise.all([
            supabase.from('trade_ai_insights').select('*').order('created_at', { ascending: false }).limit(5),
            supabase.from('trade_activity').select('*').order('created_at', { ascending: false }).limit(6),
            supabase.from('trade_alerts').select('*').order('created_at', { ascending: false }).limit(5),
            supabase.from('trade_rfqs').select('id', { count: 'exact' }).in('status', ['open', 'quoted', 'comparing']),
            supabase.from('trade_shipments').select('id', { count: 'exact' }).in('status', ['booked', 'in_transit', 'customs']),
            supabase.from('trade_deals').select('id', { count: 'exact' }).in('status', ['exploring', 'negotiating', 'terms_agreed']),
            supabase.from('trade_compliance').select('overall_score'),
        ]);

    // Check if we have any data in the system
    const hasData = (insightsResult.data?.length ?? 0) > 0 || (activityResult.data?.length ?? 0) > 0;
    if (!hasData) {
        const { MOCK_DASHBOARD_STATS } = await import('./mock-data');
        return MOCK_DASHBOARD_STATS;
    }

    const insights: TradeAIInsightItem[] = (insightsResult.data ?? []).map(row => ({
        id: row.id, title: row.title, content: row.content,
        type: row.type as TradeAIInsightItem['type'],
        priority: row.priority as TradeAIInsightItem['priority'],
        createdAt: row.created_at,
        actionLabel: row.action_label ?? undefined,
        actionHref: row.action_href ?? undefined,
    }));

    const activity: TradeActivityItem[] = (activityResult.data ?? []).map(row => ({
        id: row.id, type: row.type as TradeActivityItem['type'],
        title: row.title, description: row.description,
        timestamp: row.created_at, href: row.href ?? undefined,
    }));

    const alerts: TradeAlert[] = (alertsResult.data ?? []).map(row => ({
        id: row.id, level: row.level as TradeAlert['level'],
        title: row.title, description: row.description,
        module: row.module as TradeAlert['module'],
        createdAt: row.created_at, isRead: row.is_read,
        href: row.href ?? undefined,
    }));

    const complianceScores = (complianceResult.data ?? []).map(r => Number(r.overall_score));
    const avgCompliance = complianceScores.length > 0
        ? Math.round(complianceScores.reduce((a, b) => a + b, 0) / complianceScores.length)
        : 0;

    return {
        activeRfqs: rfqCount.count ?? 0,
        pendingQuotes: 0, // computed separately if needed
        activeShipments: shipmentCount.count ?? 0,
        activeDeals: dealCount.count ?? 0,
        complianceScore: avgCompliance,
        totalTradeValue: 0, // aggregation from deals/shipments
        currency: 'USD',
        aiInsights: insights,
        recentActivity: activity,
        alerts,
    };
}
