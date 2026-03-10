'use client';

/** Centered spinner shown while Trade OS data is loading. */
export function TradeLoadingState({ message = 'Loading...' }: { message?: string }) {
    return (
        <div className="py-20 text-center">
            <div className="inline-block w-6 h-6 border-2 border-stone-200 border-t-stone-600 rounded-full animate-spin mb-3" />
            <p className="text-sm text-stone-400">{message}</p>
        </div>
    );
}

/** Centered error message with optional retry button. */
export function TradeErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
    return (
        <div className="py-20 text-center">
            <p className="text-sm text-red-600 mb-2">{message}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="text-xs text-stone-600 underline hover:text-stone-800 transition-colors"
                >
                    Try again
                </button>
            )}
        </div>
    );
}
