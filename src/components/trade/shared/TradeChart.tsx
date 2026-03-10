'use client';

import { clsx } from 'clsx';

/* ----------------------------------------------------------------
   TradeChart — Pure CSS/SVG chart components
   No external chart library dependencies.
   ---------------------------------------------------------------- */

/* ── Line / Area Chart ───────────────────────────────────────────── */

interface DataPoint {
    label: string;
    value: number;
}

interface TradeLineChartProps {
    data: DataPoint[];
    height?: number;
    color?: string;
    showArea?: boolean;
    showDots?: boolean;
    showLabels?: boolean;
    className?: string;
}

export function TradeLineChart({
    data,
    height = 120,
    color = '#059669',
    showArea = true,
    showDots = true,
    showLabels = false,
    className,
}: TradeLineChartProps) {
    if (data.length < 2) return null;

    const padding = { top: 8, right: 8, bottom: showLabels ? 24 : 8, left: 8 };
    const width = 400;
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const values = data.map((d) => d.value);
    const min = Math.min(...values) * 0.95;
    const max = Math.max(...values) * 1.05;
    const range = max - min || 1;

    const points = data.map((d, i) => ({
        x: padding.left + (i / (data.length - 1)) * chartW,
        y: padding.top + chartH - ((d.value - min) / range) * chartH,
    }));

    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
    const areaPath = `${linePath} L${points[points.length - 1].x},${padding.top + chartH} L${points[0].x},${padding.top + chartH} Z`;

    return (
        <div className={clsx('w-full', className)}>
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="none">
                {showArea && (
                    <path d={areaPath} fill={color} opacity={0.08} />
                )}
                <path d={linePath} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" />
                {showDots && points.map((p, i) => (
                    <circle key={i} cx={p.x} cy={p.y} r={3} fill="white" stroke={color} strokeWidth={2} />
                ))}
                {showLabels && data.map((d, i) => (
                    <text
                        key={i}
                        x={points[i].x}
                        y={height - 4}
                        textAnchor="middle"
                        className="fill-stone-400"
                        fontSize={9}
                    >
                        {d.label}
                    </text>
                ))}
            </svg>
        </div>
    );
}

/* ── Bar Chart ───────────────────────────────────────────────────── */

interface TradeBarChartProps {
    data: DataPoint[];
    height?: number;
    color?: string;
    showLabels?: boolean;
    className?: string;
}

export function TradeBarChart({
    data,
    height = 120,
    color = '#059669',
    showLabels = true,
    className,
}: TradeBarChartProps) {
    const maxVal = Math.max(...data.map((d) => d.value), 1);

    return (
        <div className={clsx('w-full', className)}>
            <div className="flex items-end gap-1.5" style={{ height }}>
                {data.map((d, i) => {
                    const barH = (d.value / maxVal) * (height - (showLabels ? 24 : 0));
                    return (
                        <div key={i} className="flex flex-col items-center flex-1 gap-1">
                            <div
                                className="w-full rounded-t transition-all duration-300"
                                style={{ height: barH, backgroundColor: color, opacity: 0.7 + (0.3 * d.value / maxVal) }}
                            />
                            {showLabels && (
                                <span className="text-[8px] text-stone-400 truncate max-w-full">{d.label}</span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/* ── Donut Chart ─────────────────────────────────────────────────── */

interface DonutSegment {
    label: string;
    value: number;
    color: string;
}

interface TradeDonutChartProps {
    segments: DonutSegment[];
    size?: number;
    strokeWidth?: number;
    centerLabel?: string;
    centerValue?: string;
    className?: string;
}

export function TradeDonutChart({
    segments,
    size = 100,
    strokeWidth = 12,
    centerLabel,
    centerValue,
    className,
}: TradeDonutChartProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;

    let accumulated = 0;

    return (
        <div className={clsx('relative inline-flex items-center justify-center', className)} style={{ width: size, height: size }}>
            <svg width={size} height={size} className="-rotate-90">
                {segments.map((seg, i) => {
                    const pct = seg.value / total;
                    const dashLen = pct * circumference;
                    const dashOff = -accumulated * circumference;
                    accumulated += pct;
                    return (
                        <circle
                            key={i}
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            fill="none"
                            stroke={seg.color}
                            strokeWidth={strokeWidth}
                            strokeDasharray={`${dashLen} ${circumference - dashLen}`}
                            strokeDashoffset={dashOff}
                        />
                    );
                })}
            </svg>
            {(centerLabel || centerValue) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    {centerValue && (
                        <span
                            className="text-lg font-bold text-stone-800"
                            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                        >
                            {centerValue}
                        </span>
                    )}
                    {centerLabel && (
                        <span className="text-[8px] uppercase tracking-wider text-stone-500 font-semibold">{centerLabel}</span>
                    )}
                </div>
            )}
        </div>
    );
}
