/**
 * Morocco Trade OS — Compliance Mock Data
 */

import type { TradeComplianceRecord } from '@/types/trade';

export const MOCK_COMPLIANCE: TradeComplianceRecord[] = [
    {
        id: 'comp-001',
        supplierId: 'sup-001',
        supplierName: 'Sahara Gold Cooperative',
        overallScore: 94,
        level: 'premium',
        lastAuditDate: '2025-12-15',
        nextAuditDue: '2026-06-15',
        categories: {
            documentation: 96,
            exportLicensing: 92,
            qualityCertification: 98,
            financialStanding: 88,
            tradeHistory: 95,
        },
        documents: [
            { id: 'cd-1', type: 'Export License', name: 'ONSSA Export License', status: 'verified', uploadedAt: '2025-12-10', expiresAt: '2026-12-10', verifiedBy: 'Trade Compliance Team', verifiedAt: '2025-12-12' },
            { id: 'cd-2', type: 'Organic Certification', name: 'USDA Organic Certificate', status: 'verified', uploadedAt: '2025-06-15', expiresAt: '2027-06-15' },
            { id: 'cd-3', type: 'Quality Standard', name: 'Ecocert Certificate', status: 'verified', uploadedAt: '2025-03-20', expiresAt: '2027-03-20' },
            { id: 'cd-4', type: 'Insurance', name: 'Product Liability Insurance', status: 'verified', uploadedAt: '2025-11-01', expiresAt: '2026-11-01' },
        ],
        auditTrail: [
            { id: 'at-1', action: 'Full compliance audit completed', actor: 'Trade Compliance Team', timestamp: '2025-12-15T10:00:00Z', details: 'Score: 94/100. All documents verified. Renewal recommended for premium status.' },
            { id: 'at-2', action: 'Document uploaded: USDA Organic Certificate', actor: 'Fatima El Amrani', timestamp: '2025-06-15T09:30:00Z', details: 'New certificate uploaded, valid until June 2027' },
            { id: 'at-3', action: 'Verification level upgraded to Gold', actor: 'System', timestamp: '2025-01-20T14:00:00Z', details: 'Met all criteria for Gold verification: 50+ transactions, 95%+ on-time delivery, complete documentation' },
        ],
    },
    {
        id: 'comp-002',
        supplierId: 'sup-005',
        supplierName: 'Fez Artisan Zellige Co.',
        overallScore: 91,
        level: 'premium',
        lastAuditDate: '2025-11-20',
        nextAuditDue: '2026-05-20',
        categories: {
            documentation: 93,
            exportLicensing: 90,
            qualityCertification: 95,
            financialStanding: 85,
            tradeHistory: 92,
        },
        documents: [
            { id: 'cd-5', type: 'Artisan Mark', name: 'Moroccan Artisan Certification', status: 'verified', uploadedAt: '2025-09-01' },
            { id: 'cd-6', type: 'Heritage Partner', name: 'UNESCO Heritage Partnership', status: 'verified', uploadedAt: '2025-01-15' },
            { id: 'cd-7', type: 'Export License', name: 'ONSSA Export License', status: 'verified', uploadedAt: '2025-10-05', expiresAt: '2026-10-05' },
        ],
        auditTrail: [
            { id: 'at-4', action: 'Compliance review completed', actor: 'Trade Compliance Team', timestamp: '2025-11-20T11:00:00Z', details: 'Score: 91/100. Heritage partnership documentation impressive. Financial standing could improve.' },
        ],
    },
    {
        id: 'comp-003',
        supplierId: 'sup-006',
        supplierName: 'Casablanca Leather Works',
        overallScore: 93,
        level: 'premium',
        lastAuditDate: '2026-01-10',
        nextAuditDue: '2026-07-10',
        categories: {
            documentation: 95,
            exportLicensing: 94,
            qualityCertification: 96,
            financialStanding: 90,
            tradeHistory: 89,
        },
        documents: [
            { id: 'cd-8', type: 'Quality Standard', name: 'ISO 9001 Certificate', status: 'verified', uploadedAt: '2025-12-20', expiresAt: '2027-12-20' },
            { id: 'cd-9', type: 'Sustainability', name: 'LWG Certificate', status: 'verified', uploadedAt: '2025-08-15', expiresAt: '2026-08-15' },
            { id: 'cd-10', type: 'Free Zone', name: 'Free Zone Operating Permit', status: 'verified', uploadedAt: '2025-07-01', expiresAt: '2027-07-01' },
        ],
        auditTrail: [
            { id: 'at-5', action: 'Full compliance audit completed', actor: 'Trade Compliance Team', timestamp: '2026-01-10T09:00:00Z', details: 'Score: 93/100. ISO and LWG certifications verified. Free zone operations documented.' },
        ],
    },
    {
        id: 'comp-004',
        supplierId: 'sup-002',
        supplierName: 'Atlas Provisions Group',
        overallScore: 82,
        level: 'standard',
        lastAuditDate: '2025-10-05',
        nextAuditDue: '2026-04-05',
        categories: {
            documentation: 85,
            exportLicensing: 88,
            qualityCertification: 80,
            financialStanding: 78,
            tradeHistory: 80,
        },
        documents: [
            { id: 'cd-11', type: 'Quality Standard', name: 'ISO 22000 Certificate', status: 'verified', uploadedAt: '2025-09-10', expiresAt: '2027-01-10' },
            { id: 'cd-12', type: 'Export License', name: 'ONSSA Export License', status: 'verified', uploadedAt: '2025-08-20', expiresAt: '2026-12-20' },
            { id: 'cd-13', type: 'Insurance', name: 'Product Liability Insurance', status: 'expired', uploadedAt: '2024-11-01', expiresAt: '2025-11-01' },
        ],
        auditTrail: [
            { id: 'at-6', action: 'Compliance review completed', actor: 'Trade Compliance Team', timestamp: '2025-10-05T15:00:00Z', details: 'Score: 82/100. Insurance document needs renewal. Financial standing below premium threshold.' },
        ],
    },
    {
        id: 'comp-005',
        supplierId: 'sup-007',
        supplierName: 'Taliouine Saffron Estate',
        overallScore: 89,
        level: 'premium',
        lastAuditDate: '2025-11-01',
        nextAuditDue: '2026-05-01',
        categories: {
            documentation: 90,
            exportLicensing: 88,
            qualityCertification: 95,
            financialStanding: 82,
            tradeHistory: 90,
        },
        documents: [
            { id: 'cd-14', type: 'Quality Standard', name: 'ISO 3632 Grade I Certification', status: 'verified', uploadedAt: '2025-10-15' },
            { id: 'cd-15', type: 'Geographic Indication', name: 'OMPIC Geographic Indication', status: 'verified', uploadedAt: '2025-06-20' },
            { id: 'cd-16', type: 'Phytosanitary', name: 'Phytosanitary Certificate', status: 'pending', uploadedAt: '2026-03-01', expiresAt: '2026-03-12' },
        ],
        auditTrail: [
            { id: 'at-7', action: 'Document flagged: Phytosanitary certificate expiring', actor: 'System', timestamp: '2026-03-06T08:00:00Z', details: 'Certificate expires March 12 — renewal required before next shipment clearance' },
        ],
    },
    {
        id: 'comp-006',
        supplierId: 'sup-003',
        supplierName: 'Souss Valley Organics',
        overallScore: 75,
        level: 'standard',
        lastAuditDate: '2025-09-15',
        nextAuditDue: '2026-03-15',
        categories: {
            documentation: 78,
            exportLicensing: 80,
            qualityCertification: 72,
            financialStanding: 68,
            tradeHistory: 75,
        },
        documents: [
            { id: 'cd-17', type: 'Organic Certification', name: 'Ecocert Certificate', status: 'verified', uploadedAt: '2025-08-10' },
            { id: 'cd-18', type: 'Export License', name: 'ONSSA Export License', status: 'verified', uploadedAt: '2025-07-15', expiresAt: '2026-07-15' },
        ],
        auditTrail: [
            { id: 'at-8', action: 'Compliance review completed', actor: 'Trade Compliance Team', timestamp: '2025-09-15T10:00:00Z', details: 'Score: 75/100. Limited documentation. Needs more quality certifications for premium status.' },
        ],
    },
    {
        id: 'comp-007',
        supplierId: 'sup-008',
        supplierName: 'Meknes Olive Estates',
        overallScore: 86,
        level: 'standard',
        lastAuditDate: '2025-10-20',
        nextAuditDue: '2026-04-20',
        categories: {
            documentation: 88,
            exportLicensing: 90,
            qualityCertification: 85,
            financialStanding: 82,
            tradeHistory: 84,
        },
        documents: [
            { id: 'cd-19', type: 'Organic Certification', name: 'EU Organic Certificate', status: 'verified', uploadedAt: '2025-09-05', expiresAt: '2027-09-05' },
            { id: 'cd-20', type: 'Food Safety', name: 'HACCP Certificate', status: 'verified', uploadedAt: '2025-08-01' },
        ],
        auditTrail: [],
    },
    {
        id: 'comp-008',
        supplierId: 'sup-009',
        supplierName: 'Marrakech Artisan Textiles',
        overallScore: 72,
        level: 'basic',
        lastAuditDate: '2025-08-10',
        nextAuditDue: '2026-02-10',
        categories: {
            documentation: 70,
            exportLicensing: 75,
            qualityCertification: 68,
            financialStanding: 65,
            tradeHistory: 82,
        },
        documents: [
            { id: 'cd-21', type: 'Artisan Mark', name: 'Moroccan Artisan Certification', status: 'verified', uploadedAt: '2025-05-20' },
        ],
        auditTrail: [
            { id: 'at-9', action: 'Audit overdue notification', actor: 'System', timestamp: '2026-02-15T08:00:00Z', details: 'Next audit was due Feb 10 — scheduling recommended' },
        ],
    },
];
