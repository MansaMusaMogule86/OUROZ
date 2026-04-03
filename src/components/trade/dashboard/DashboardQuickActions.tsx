'use client';

import Link from 'next/link';
import TradeCard from '@/components/trade/shared/TradeCard';

const quickActions = [
    { label: 'Create RFQ', href: '/trade/rfq/new', icon: '◇', desc: 'Source new products' },
    { label: 'Find Suppliers', href: '/trade/suppliers', icon: '⬡', desc: 'AI-powered search' },
    { label: 'Track Shipments', href: '/trade/logistics', icon: '◻', desc: 'Live tracking' },
    { label: 'Check Prices', href: '/trade/prices', icon: '◐', desc: 'Market intelligence' },
];

export default function DashboardQuickActions() {
    return (
        <div>
            <h2 className="text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-500 mb-3">
                Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action) => (
                    <Link key={action.href} href={action.href}>
                        <TradeCard padding="md" hover>
                            <span className="text-lg text-stone-300 block mb-2">{action.icon}</span>
                            <p className="text-xs font-semibold text-stone-800">{action.label}</p>
                            <p className="text-[10px] text-stone-500 mt-0.5">{action.desc}</p>
                        </TradeCard>
                    </Link>
                ))}
            </div>
        </div>
    );
}
