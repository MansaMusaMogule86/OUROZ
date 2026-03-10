'use client';

import Link from 'next/link';

/**
 * Trade OS error boundary — catches unhandled errors in any Trade OS page.
 * Shows a branded error screen within the Trade OS shell layout.
 */
export default function TradeError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="py-20 text-center max-w-md mx-auto">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                <span className="text-red-500 text-lg">!</span>
            </div>
            <h2
                className="text-lg font-bold text-stone-900 mb-2"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
                Trade OS Error
            </h2>
            <p className="text-sm text-stone-500 mb-4">
                Something went wrong loading this module. Your data is safe.
            </p>
            {process.env.NODE_ENV === 'development' && error.message && (
                <pre className="text-xs text-red-700 bg-red-50 border border-red-100 rounded-lg p-3 text-left overflow-x-auto mb-6">
                    {error.message}
                </pre>
            )}
            <div className="flex gap-3 justify-center">
                <button
                    onClick={reset}
                    className="px-5 py-2.5 bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-stone-800 transition-colors"
                >
                    Retry
                </button>
                <Link
                    href="/trade"
                    className="px-5 py-2.5 border border-stone-200 text-stone-600 text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-stone-50 transition-colors"
                >
                    Command Center
                </Link>
            </div>
        </div>
    );
}
