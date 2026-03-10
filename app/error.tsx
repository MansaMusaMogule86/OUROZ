'use client';

import Link from 'next/link';

/**
 * App-level error boundary — catches unhandled errors in any page
 * rendered under the root layout.
 */
export default function AppError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="min-h-[60vh] flex items-center justify-center px-6">
            <div className="text-center max-w-md">
                <h1
                    className="text-2xl font-bold text-stone-900 mb-3"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                    Something went wrong
                </h1>
                <p className="text-sm text-stone-500 leading-relaxed mb-6">
                    An unexpected error occurred. Please try again or navigate back.
                </p>
                {process.env.NODE_ENV === 'development' && error.message && (
                    <pre className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg p-3 text-left overflow-x-auto mb-6">
                        {error.message}
                    </pre>
                )}
                <div className="flex gap-3 justify-center">
                    <button
                        onClick={reset}
                        className="px-5 py-2.5 bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-stone-800 transition-colors"
                    >
                        Try again
                    </button>
                    <Link
                        href="/"
                        className="px-5 py-2.5 border border-stone-300 text-stone-700 text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-stone-50 transition-colors"
                    >
                        Go home
                    </Link>
                </div>
            </div>
        </div>
    );
}
