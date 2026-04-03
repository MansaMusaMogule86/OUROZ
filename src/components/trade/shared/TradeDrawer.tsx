'use client';

import { useEffect } from 'react';
import { clsx } from 'clsx';

interface TradeDrawerProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    width?: string;
    children: React.ReactNode;
    className?: string;
}

export default function TradeDrawer({
    open,
    onClose,
    title,
    width = '480px',
    children,
    className,
}: TradeDrawerProps) {
    // Close on Escape key
    useEffect(() => {
        if (!open) return;
        function handleKey(e: KeyboardEvent) {
            if (e.key === 'Escape') onClose();
        }
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [open, onClose]);

    // Prevent body scroll when open
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [open]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
                onClick={onClose}
            />

            {/* Panel */}
            <div
                className={clsx(
                    'relative bg-white h-full shadow-2xl flex flex-col animate-[slideInRight_0.2s_ease-out]',
                    className,
                )}
                style={{ width, maxWidth: '100vw' }}
            >
                {/* Header */}
                {title && (
                    <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200">
                        <h2
                            className="text-base font-semibold text-stone-900"
                            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                        >
                            {title}
                        </h2>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition-colors"
                        >
                            ✕
                        </button>
                    </div>
                )}

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {children}
                </div>
            </div>

            <style>{`
                @keyframes slideInRight {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
            `}</style>
        </div>
    );
}
