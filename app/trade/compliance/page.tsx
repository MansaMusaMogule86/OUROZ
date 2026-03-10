'use client';

import { useState, useMemo } from 'react';
import TradeCard, { TradeCardTitle } from '@/components/trade/shared/TradeCard';
import TradeBadge from '@/components/trade/shared/TradeBadge';
import TradeScoreRing from '@/components/trade/shared/TradeScoreRing';
import TradeProgressBar from '@/components/trade/shared/TradeProgressBar';
import TradeTimeline from '@/components/trade/shared/TradeTimeline';
import TradeDrawer from '@/components/trade/shared/TradeDrawer';
import { TradeLoadingState, TradeErrorState } from '@/components/trade/shared/TradeLoadingState';
import { COMPLIANCE_LEVEL_CONFIG, DOCUMENT_STATUS_CONFIG } from '@/lib/trade/trade-constants';
import { formatDate } from '@/lib/trade/trade-utils';
import { useTradeData } from '@/hooks/useTradeData';
import { fetchTradeCompliance } from '@/lib/trade/trade-service';
import type { TradeComplianceRecord } from '@/types/trade';

export default function CompliancePage() {
    const { data: records, loading, error, refetch } = useTradeData(() => fetchTradeCompliance(), []);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const selected = records.find((c) => c.id === selectedId);

    const avgScore = useMemo(() => {
        if (records.length === 0) return 0;
        return Math.round(records.reduce((sum, c) => sum + c.overallScore, 0) / records.length);
    }, [records]);

    if (loading) return <TradeLoadingState message="Loading compliance records..." />;
    if (error) return <TradeErrorState message={error} onRetry={refetch} />;

    return (
        <div className="space-y-6 max-w-7xl">
            <div>
                <h1
                    className="text-2xl font-bold text-stone-900"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                    Compliance Vault
                </h1>
                <p className="text-sm text-stone-500 mt-1">
                    Supplier compliance records, certifications, and audit trails
                </p>
            </div>

            {/* Summary stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <TradeCard padding="md">
                    <div className="flex items-center gap-3">
                        <TradeScoreRing score={avgScore} size={52} strokeWidth={4} />
                        <div>
                            <p className="text-[9px] font-semibold uppercase tracking-wider text-stone-500">Avg Score</p>
                            <p className="text-xs text-stone-600">Across all suppliers</p>
                        </div>
                    </div>
                </TradeCard>
                <TradeCard padding="md">
                    <p className="text-[9px] font-semibold uppercase tracking-wider text-stone-500">Premium</p>
                    <p className="text-2xl font-bold text-stone-900" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                        {records.filter((c) => c.level === 'premium').length}
                    </p>
                </TradeCard>
                <TradeCard padding="md">
                    <p className="text-[9px] font-semibold uppercase tracking-wider text-stone-500">Standard</p>
                    <p className="text-2xl font-bold text-stone-900" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                        {records.filter((c) => c.level === 'standard').length}
                    </p>
                </TradeCard>
                <TradeCard padding="md">
                    <p className="text-[9px] font-semibold uppercase tracking-wider text-stone-500">Needs Attention</p>
                    <p className="text-2xl font-bold text-red-600" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                        {records.filter((c) => c.overallScore < 80).length}
                    </p>
                </TradeCard>
            </div>

            {/* Compliance records */}
            <div className="space-y-3">
                {records.length === 0 && (
                    <div className="py-16 text-center text-sm text-stone-400">
                        No compliance records found
                    </div>
                )}
                {records.map((record) => {
                    const levelConf = COMPLIANCE_LEVEL_CONFIG[record.level];
                    return (
                        <button
                            key={record.id}
                            onClick={() => setSelectedId(record.id)}
                            className="w-full text-left"
                        >
                            <TradeCard padding="md" hover>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                        <TradeScoreRing score={record.overallScore} size={48} strokeWidth={4} />
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <h3 className="text-sm font-semibold text-stone-900 truncate">
                                                    {record.supplierName}
                                                </h3>
                                                <TradeBadge label={levelConf.label} variant={levelConf.variant} />
                                            </div>
                                            <p className="text-[10px] text-stone-500">
                                                Last audit: {formatDate(record.lastAuditDate)} · Next due: {formatDate(record.nextAuditDue)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 flex-shrink-0 ml-4">
                                        {Object.entries(record.categories).slice(0, 3).map(([key, val]) => (
                                            <div key={key} className="w-16">
                                                <TradeProgressBar
                                                    value={val}
                                                    size="sm"
                                                    showValue={false}
                                                />
                                                <span className="text-[8px] uppercase tracking-wider text-stone-400 mt-0.5 block text-center">
                                                    {key.replace(/([A-Z])/g, ' $1').trim().slice(0, 6)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </TradeCard>
                        </button>
                    );
                })}
            </div>

            {/* Detail drawer */}
            <TradeDrawer
                open={!!selected}
                onClose={() => setSelectedId(null)}
                title={selected?.supplierName}
                width="560px"
            >
                {selected && <ComplianceDetail record={selected} />}
            </TradeDrawer>
        </div>
    );
}

function ComplianceDetail({ record }: { record: TradeComplianceRecord }) {
    const levelConf = COMPLIANCE_LEVEL_CONFIG[record.level];

    return (
        <div className="space-y-6">
            {/* Score */}
            <div className="flex items-center gap-4">
                <TradeScoreRing score={record.overallScore} size={72} strokeWidth={5} />
                <div>
                    <TradeBadge label={levelConf.label} variant={levelConf.variant} size="md" />
                    <p className="text-xs text-stone-500 mt-1">
                        Last audit: {formatDate(record.lastAuditDate)}
                    </p>
                </div>
            </div>

            {/* Category breakdown */}
            <div>
                <TradeCardTitle className="mb-3">Score Breakdown</TradeCardTitle>
                <div className="space-y-3">
                    {Object.entries(record.categories).map(([key, val]) => (
                        <TradeProgressBar
                            key={key}
                            value={val}
                            label={key.replace(/([A-Z])/g, ' $1').trim()}
                            size="sm"
                        />
                    ))}
                </div>
            </div>

            {/* Documents */}
            <div>
                <TradeCardTitle className="mb-3">Documents</TradeCardTitle>
                <div className="space-y-2">
                    {record.documents.map((doc) => {
                        const docConf = DOCUMENT_STATUS_CONFIG[doc.status];
                        return (
                            <div key={doc.id} className="flex items-center justify-between py-2.5 border-b border-stone-50">
                                <div>
                                    <p className="text-xs font-medium text-stone-700">{doc.name}</p>
                                    <p className="text-[10px] text-stone-400">{doc.type}</p>
                                    {doc.expiresAt && (
                                        <p className="text-[10px] text-stone-400">Expires: {formatDate(doc.expiresAt)}</p>
                                    )}
                                </div>
                                <TradeBadge label={docConf.label} variant={docConf.variant} dot />
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Audit trail */}
            {record.auditTrail.length > 0 && (
                <div>
                    <TradeCardTitle className="mb-3">Audit Trail</TradeCardTitle>
                    <TradeTimeline
                        steps={record.auditTrail.map((entry) => ({
                            id: entry.id,
                            label: entry.action,
                            status: 'completed' as const,
                            date: formatDate(entry.timestamp),
                            detail: `${entry.actor} — ${entry.details}`,
                        }))}
                    />
                </div>
            )}
        </div>
    );
}
