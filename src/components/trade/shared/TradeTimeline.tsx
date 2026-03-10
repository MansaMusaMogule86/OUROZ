'use client';

import { clsx } from 'clsx';

interface TimelineStep {
    id: string;
    label: string;
    status: 'completed' | 'current' | 'pending' | 'delayed';
    date?: string;
    detail?: string;
}

interface TradeTimelineProps {
    steps: TimelineStep[];
    orientation?: 'vertical' | 'horizontal';
    className?: string;
}

const dotStyles: Record<string, string> = {
    completed: 'bg-emerald-500 border-emerald-200',
    current: 'bg-blue-500 border-blue-200 ring-4 ring-blue-100',
    pending: 'bg-stone-200 border-stone-100',
    delayed: 'bg-red-500 border-red-200',
};

const lineColors: Record<string, string> = {
    completed: 'bg-emerald-300',
    current: 'bg-blue-300',
    pending: 'bg-stone-200',
    delayed: 'bg-red-300',
};

export default function TradeTimeline({
    steps,
    orientation = 'vertical',
    className,
}: TradeTimelineProps) {
    if (orientation === 'horizontal') {
        return (
            <div className={clsx('flex items-start', className)}>
                {steps.map((step, i) => (
                    <div key={step.id} className="flex items-start flex-1 last:flex-none">
                        <div className="flex flex-col items-center">
                            <div className={clsx('w-3 h-3 rounded-full border-2 flex-shrink-0', dotStyles[step.status])} />
                            <span className={clsx(
                                'mt-2 text-[9px] font-semibold uppercase tracking-wider text-center max-w-[80px]',
                                step.status === 'current' ? 'text-blue-700' : 'text-stone-500',
                            )}>
                                {step.label}
                            </span>
                            {step.date && (
                                <span className="text-[9px] text-stone-400">{step.date}</span>
                            )}
                        </div>
                        {i < steps.length - 1 && (
                            <div className={clsx('h-0.5 flex-1 mt-1.5 mx-1', lineColors[step.status])} />
                        )}
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className={clsx('flex flex-col', className)}>
            {steps.map((step, i) => (
                <div key={step.id} className="flex gap-3">
                    {/* Dot + Line */}
                    <div className="flex flex-col items-center">
                        <div className={clsx('w-3 h-3 rounded-full border-2 flex-shrink-0 mt-0.5', dotStyles[step.status])} />
                        {i < steps.length - 1 && (
                            <div className={clsx('w-0.5 flex-1 min-h-[24px]', lineColors[step.status])} />
                        )}
                    </div>
                    {/* Content */}
                    <div className="pb-4">
                        <span className={clsx(
                            'text-xs font-semibold block',
                            step.status === 'current' ? 'text-blue-700' :
                            step.status === 'delayed' ? 'text-red-700' : 'text-stone-700',
                        )}>
                            {step.label}
                        </span>
                        {step.date && (
                            <span className="text-[10px] text-stone-400 block">{step.date}</span>
                        )}
                        {step.detail && (
                            <span className="text-[10px] text-stone-500 block mt-0.5">{step.detail}</span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
