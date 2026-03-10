'use client';

/**
 * Global error boundary — catches errors in root layout.
 * Must render its own <html>/<body> since the root layout may have failed.
 */
export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html lang="en">
            <body style={{ margin: 0, fontFamily: "'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#FAF6F1',
                    padding: '24px',
                }}>
                    <div style={{ textAlign: 'center', maxWidth: '480px' }}>
                        <h1 style={{
                            fontFamily: "'Playfair Display', Georgia, serif",
                            fontSize: '28px',
                            color: '#1A1A1A',
                            marginBottom: '12px',
                        }}>
                            Something went wrong
                        </h1>
                        <p style={{ fontSize: '14px', color: '#78716c', lineHeight: '1.6', marginBottom: '24px' }}>
                            We encountered an unexpected error. Please try again or return to the homepage.
                        </p>
                        {process.env.NODE_ENV === 'development' && error.message && (
                            <pre style={{
                                fontSize: '12px',
                                color: '#9B1B30',
                                background: '#fef2f2',
                                padding: '12px',
                                borderRadius: '8px',
                                textAlign: 'left',
                                overflowX: 'auto',
                                marginBottom: '24px',
                                border: '1px solid #fecaca',
                            }}>
                                {error.message}
                            </pre>
                        )}
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                            <button
                                onClick={reset}
                                style={{
                                    padding: '10px 24px',
                                    background: '#1A1A1A',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                }}
                            >
                                Try again
                            </button>
                            <a
                                href="/"
                                style={{
                                    padding: '10px 24px',
                                    background: 'transparent',
                                    color: '#1A1A1A',
                                    border: '1px solid #d6d3d1',
                                    borderRadius: '8px',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    textDecoration: 'none',
                                }}
                            >
                                Go home
                            </a>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    );
}
