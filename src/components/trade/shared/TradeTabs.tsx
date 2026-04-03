'use client';

import { useState } from 'react';
import { clsx } from 'clsx';

interface TradeTab {
    id: string;
    label: string;
    count?: number;
}

interface TradeTabsProps {
    tabs: TradeTab[];
    activeTab?: string;
    onTabChange?: (id: string) => void;
    className?: string;
}

export default function TradeTabs({
    tabs,
    activeTab: controlledTab,
    onTabChange,
    className,
}: TradeTabsProps) {
    const [internalTab, setInternalTab] = useState(tabs[0]?.id ?? '');
    const activeTab = controlledTab ?? internalTab;

    function handleClick(id: string) {
        setInternalTab(id);
        onTabChange?.(id);
    }

    return (
        <div className={clsx('flex gap-1 border-b border-stone-200', className)}>
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => handleClick(tab.id)}
                    className={clsx(
                        'px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors relative',
                        activeTab === tab.id
                            ? 'text-stone-900'
                            : 'text-stone-400 hover:text-stone-600',
                    )}
                >
                    <span className="flex items-center gap-1.5">
                        {tab.label}
                        {tab.count !== undefined && (
                            <span
                                className={clsx(
                                    'text-[9px] font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center',
                                    activeTab === tab.id
                                        ? 'bg-stone-900 text-white'
                                        : 'bg-stone-100 text-stone-500',
                                )}
                            >
                                {tab.count}
                            </span>
                        )}
                    </span>
                    {activeTab === tab.id && (
                        <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-stone-900" />
                    )}
                </button>
            ))}
        </div>
    );
}
