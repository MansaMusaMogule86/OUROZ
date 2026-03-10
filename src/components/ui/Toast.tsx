'use client';

import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ToastVariant = 'success' | 'error' | 'info';

interface ToastItem {
    id: number;
    message: string;
    variant: ToastVariant;
}

interface ToastContextValue {
    toast: (message: string, variant?: ToastVariant) => void;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });
export const useToast = () => useContext(ToastContext);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

const TOAST_DURATION = 3500;

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<ToastItem[]>([]);
    const idRef = useRef(0);

    const toast = useCallback((message: string, variant: ToastVariant = 'success') => {
        const id = ++idRef.current;
        setItems((prev) => [...prev, { id, message, variant }]);
        setTimeout(() => {
            setItems((prev) => prev.filter((t) => t.id !== id));
        }, TOAST_DURATION);
    }, []);

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}
            <ToastContainer items={items} />
        </ToastContext.Provider>
    );
}

// ---------------------------------------------------------------------------
// Container + Toast Item
// ---------------------------------------------------------------------------

const variantStyles: Record<ToastVariant, { bg: string; border: string; text: string }> = {
    success: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800' },
    error: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800' },
    info: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800' },
};

function ToastContainer({ items }: { items: ToastItem[] }) {
    if (items.length === 0) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
            {items.map((item) => (
                <ToastNotification key={item.id} item={item} />
            ))}
        </div>
    );
}

function ToastNotification({ item }: { item: ToastItem }) {
    const [visible, setVisible] = useState(false);
    const s = variantStyles[item.variant];

    useEffect(() => {
        // Trigger enter animation
        requestAnimationFrame(() => setVisible(true));
        // Trigger exit animation before removal
        const timer = setTimeout(() => setVisible(false), TOAST_DURATION - 300);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div
            className={`pointer-events-auto px-4 py-3 rounded-lg border shadow-lg text-sm font-medium transition-all duration-300 ${s.bg} ${s.border} ${s.text} ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
        >
            {item.message}
        </div>
    );
}
