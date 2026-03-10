/**
 * Morocco Trade OS — Dashboard Mock Data
 */

import type {
    TradeDashboardStats,
    TradeAIInsightItem,
    TradeActivityItem,
    TradeAlert,
} from '@/types/trade';

export const MOCK_AI_INSIGHTS: TradeAIInsightItem[] = [
    {
        id: 'ai-1',
        title: 'Argan Oil Price Drop Detected',
        content: 'Argan oil wholesale prices in the Souss-Massa region dropped 8% this week. Three verified suppliers now quote below $42/L. Consider locking in Q3 supply contracts at current rates.',
        type: 'opportunity',
        priority: 'high',
        createdAt: '2026-03-08T09:15:00Z',
        actionLabel: 'View Price Intelligence',
        actionHref: '/trade/prices',
    },
    {
        id: 'ai-2',
        title: 'Shipment SHP-007 Customs Risk',
        content: 'Phytosanitary certificate for the Marrakech saffron shipment expires in 4 days. Customs clearance typically takes 3–5 days at Jebel Ali. Recommend expediting documentation.',
        type: 'risk',
        priority: 'high',
        createdAt: '2026-03-07T14:30:00Z',
        actionLabel: 'View Shipment',
        actionHref: '/trade/logistics',
    },
    {
        id: 'ai-3',
        title: 'New Verified Zellige Supplier',
        content: 'Atlas Zellige Cooperative in Fes-Meknes achieved Gold verification. Their handcut zellige tiles are 15% below market average with 98% on-time delivery. Strong match for your open RFQ.',
        type: 'recommendation',
        priority: 'medium',
        createdAt: '2026-03-06T11:00:00Z',
        actionLabel: 'View Supplier',
        actionHref: '/trade/suppliers',
    },
    {
        id: 'ai-4',
        title: 'EU Organic Regulation Update',
        content: 'New EU organic certification requirements take effect April 1. Three of your active suppliers need updated documentation. Compliance vault flagged affected records.',
        type: 'market',
        priority: 'medium',
        createdAt: '2026-03-05T16:45:00Z',
        actionLabel: 'Review Compliance',
        actionHref: '/trade/compliance',
    },
];

export const MOCK_ACTIVITY: TradeActivityItem[] = [
    {
        id: 'act-1',
        type: 'quote',
        title: 'New quote received',
        description: 'Sahara Gold Cooperative submitted a quote for RFQ #0042 — Virgin Argan Oil',
        timestamp: '2026-03-08T10:30:00Z',
        href: '/trade/rfq',
    },
    {
        id: 'act-2',
        type: 'shipment',
        title: 'Shipment departed Casablanca',
        description: 'SHP-003: 2,400kg premium leather goods cleared port and is in transit to Dubai',
        timestamp: '2026-03-08T08:15:00Z',
        href: '/trade/logistics',
    },
    {
        id: 'act-3',
        type: 'deal',
        title: 'Deal terms updated',
        description: 'Fez Artisan Zellige Co. counter-offered at $18.50/piece for 5,000 handcut tiles',
        timestamp: '2026-03-07T17:45:00Z',
        href: '/trade/deals',
    },
    {
        id: 'act-4',
        type: 'compliance',
        title: 'Document verified',
        description: 'ONSSA Export License for Atlas Provisions Group verified — valid until Dec 2026',
        timestamp: '2026-03-07T14:20:00Z',
        href: '/trade/compliance',
    },
    {
        id: 'act-5',
        type: 'rfq',
        title: 'RFQ published',
        description: 'RFQ #0045 — Organic Saffron Threads (Grade I) sent to 6 suppliers',
        timestamp: '2026-03-07T09:00:00Z',
        href: '/trade/rfq',
    },
    {
        id: 'act-6',
        type: 'price',
        title: 'Price alert triggered',
        description: 'Extra Virgin Olive Oil dropped below $8.50/L — your threshold was $9.00/L',
        timestamp: '2026-03-06T22:10:00Z',
        href: '/trade/prices',
    },
];

export const MOCK_ALERTS: TradeAlert[] = [
    {
        id: 'alert-1',
        level: 'high',
        title: 'Certificate expiring in 4 days',
        description: 'Phytosanitary certificate for SHP-007 saffron shipment expires March 12',
        module: 'logistics',
        createdAt: '2026-03-08T09:00:00Z',
        isRead: false,
        href: '/trade/logistics',
    },
    {
        id: 'alert-2',
        level: 'medium',
        title: 'RFQ #0042 closing soon',
        description: '2 days remaining — 4 quotes received, target was 6 quotes',
        module: 'rfq',
        createdAt: '2026-03-08T08:00:00Z',
        isRead: false,
        href: '/trade/rfq',
    },
    {
        id: 'alert-3',
        level: 'low',
        title: 'Deal negotiation stalled',
        description: 'DEAL-003 Olive Oil contract — no activity for 5 days',
        module: 'deals',
        createdAt: '2026-03-07T12:00:00Z',
        isRead: true,
        href: '/trade/deals',
    },
];

export const MOCK_DASHBOARD_STATS: TradeDashboardStats = {
    activeRfqs: 7,
    pendingQuotes: 12,
    activeShipments: 4,
    activeDeals: 3,
    complianceScore: 87,
    totalTradeValue: 284500,
    currency: 'USD',
    aiInsights: MOCK_AI_INSIGHTS,
    recentActivity: MOCK_ACTIVITY,
    alerts: MOCK_ALERTS,
};
