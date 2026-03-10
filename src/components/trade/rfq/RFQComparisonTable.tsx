'use client';

import { clsx } from 'clsx';
import TradeBadge from '@/components/trade/shared/TradeBadge';
import { formatCurrency } from '@/lib/trade/trade-utils';
import type { TradeQuote } from '@/types/trade';

interface RFQComparisonTableProps {
    quotes: TradeQuote[];
    className?: string;
}

export default function RFQComparisonTable({ quotes, className }: RFQComparisonTableProps) {
    if (quotes.length === 0) return null;

    const bestPrice = Math.min(...quotes.map((q) => q.unitPrice));
    const bestLead = Math.min(...quotes.map((q) => q.leadTimeDays));
    const bestScore = Math.max(...quotes.map((q) => q.aiComparisonScore || 0));

    const rows: { label: string; getValue: (q: TradeQuote) => React.ReactNode }[] = [
        {
            label: 'Unit Price',
            getValue: (q) => (
                <span className={clsx('font-semibold', q.unitPrice === bestPrice && 'text-emerald-600')}>
                    {formatCurrency(q.unitPrice, q.currency)}
                    {q.unitPrice === bestPrice && ' ✓'}
                </span>
            ),
        },
        {
            label: 'Total Price',
            getValue: (q) => formatCurrency(q.totalPrice, q.currency),
        },
        {
            label: 'MOQ',
            getValue: (q) => `${q.moq} units`,
        },
        {
            label: 'Lead Time',
            getValue: (q) => (
                <span className={clsx(q.leadTimeDays === bestLead && 'text-emerald-600 font-semibold')}>
                    {q.leadTimeDays} days{q.leadTimeDays === bestLead && ' ✓'}
                </span>
            ),
        },
        {
            label: 'Incoterm',
            getValue: (q) => q.incoterm,
        },
        {
            label: 'Payment',
            getValue: (q) => q.paymentTerms,
        },
        {
            label: 'Sample',
            getValue: (q) => q.sampleAvailable ? 'Available' : 'No',
        },
        {
            label: 'Negotiable',
            getValue: (q) => q.isNegotiable ? 'Yes' : 'Fixed',
        },
        {
            label: 'AI Score',
            getValue: (q) => (
                <span className={clsx('font-semibold', (q.aiComparisonScore || 0) === bestScore && 'text-emerald-600')}>
                    {q.aiComparisonScore || '—'}{(q.aiComparisonScore || 0) === bestScore && ' ✓'}
                </span>
            ),
        },
    ];

    return (
        <div className={clsx('overflow-x-auto', className)}>
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-stone-200">
                        <th className="px-4 py-3 text-[9px] font-semibold uppercase tracking-[0.22em] text-stone-500 w-32">
                            Criteria
                        </th>
                        {quotes.map((q) => (
                            <th key={q.id} className="px-4 py-3">
                                <div className="text-xs font-semibold text-stone-800">{q.supplierName}</div>
                                <div className="text-[10px] text-stone-500">{q.supplierCity}</div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => (
                        <tr key={row.label} className="border-b border-stone-50">
                            <td className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-stone-500">
                                {row.label}
                            </td>
                            {quotes.map((q) => (
                                <td key={q.id} className="px-4 py-2.5 text-xs text-stone-700">
                                    {row.getValue(q)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
