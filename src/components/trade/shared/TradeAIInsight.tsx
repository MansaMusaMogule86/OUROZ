'use client';

import { clsx } from 'clsx';

interface TradeAIInsightProps {
    title: string;
    content: string;
    type?: 'opportunity' | 'risk' | 'recommendation' | 'market';
    actionLabel?: string;
    onAction?: () => void;
    className?: string;
}

const typeIcons: Record<string, string> = {
    opportunity: '✦',
    risk: '⚠',
    recommendation: '→',
    market: '◐',
};

export default function TradeAIInsight({
    title,
    content,
    type = 'recommendation',
    actionLabel,
    onAction,
    className,
}: TradeAIInsightProps) {
    return (
        <div
            className={clsx(
                'relative rounded-xl border border-amber-200/60 bg-[#FFFBF5] p-5 overflow-hidden',
                className,
            )}
        >
            {/* Gold left accent */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-400 to-amber-600" />

            <div className="pl-3">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-amber-600 text-sm">{typeIcons[type]}</span>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-700">
                        AI Insight
                    </span>
                </div>

                <h4
                    className="text-sm font-semibold text-stone-900 mb-1"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                    {title}
                </h4>

                <p className="text-xs text-stone-600 leading-relaxed">{content}</p>

                {actionLabel && onAction && (
                    <button
                        onClick={onAction}
                        className="mt-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-amber-700 hover:text-amber-900 transition-colors"
                    >
                        {actionLabel} →
                    </button>
                )}
            </div>
        </div>
    );
}
