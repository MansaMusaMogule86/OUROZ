'use client';

import { clsx } from 'clsx';

/* ----------------------------------------------------------------
   TradeTable — Lightweight data table with sticky header
   ---------------------------------------------------------------- */

export interface TradeColumn<T> {
    key: string;
    header: string;
    render: (row: T) => React.ReactNode;
    align?: 'left' | 'center' | 'right';
    width?: string;
}

interface TradeTableProps<T> {
    columns: TradeColumn<T>[];
    data: T[];
    rowKey: (row: T) => string;
    onRowClick?: (row: T) => void;
    emptyMessage?: string;
    className?: string;
}

export default function TradeTable<T>({
    columns,
    data,
    rowKey,
    onRowClick,
    emptyMessage = 'No data available',
    className,
}: TradeTableProps<T>) {
    if (data.length === 0) {
        return (
            <div className="py-12 text-center text-sm text-stone-400">{emptyMessage}</div>
        );
    }

    return (
        <div className={clsx('overflow-x-auto', className)}>
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-stone-200">
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                className={clsx(
                                    'px-4 py-3 text-[9px] font-semibold uppercase tracking-[0.22em] text-stone-500 whitespace-nowrap',
                                    col.align === 'center' && 'text-center',
                                    col.align === 'right' && 'text-right',
                                )}
                                style={col.width ? { width: col.width } : undefined}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row) => (
                        <tr
                            key={rowKey(row)}
                            onClick={onRowClick ? () => onRowClick(row) : undefined}
                            className={clsx(
                                'border-b border-stone-100 transition-colors',
                                onRowClick && 'cursor-pointer hover:bg-stone-50',
                            )}
                        >
                            {columns.map((col) => (
                                <td
                                    key={col.key}
                                    className={clsx(
                                        'px-4 py-3 text-sm text-stone-700',
                                        col.align === 'center' && 'text-center',
                                        col.align === 'right' && 'text-right',
                                    )}
                                >
                                    {col.render(row)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
