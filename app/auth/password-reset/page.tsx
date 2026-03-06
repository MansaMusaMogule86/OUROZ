'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function PasswordResetPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [sent, setSent] = useState(false);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/update-password`,
        });

        if (resetError) {
            setError(resetError.message);
            setLoading(false);
            return;
        }

        setSent(true);
        setLoading(false);
    };

    if (sent) {
        return (
            <div className="min-h-screen bg-[var(--color-sahara)] flex items-center justify-center px-4">
                <div className="w-full max-w-md text-center space-y-6">
                    <div className="w-16 h-16 mx-auto bg-amber-100 rounded-full flex items-center justify-center text-3xl">✉</div>
                    <h1 className="text-2xl font-bold text-[var(--color-charcoal)]">Check your email</h1>
                    <p className="text-[var(--color-charcoal)]/60">
                        If an account exists for <strong>{email}</strong>, we sent a password reset link.
                    </p>
                    <Link href="/auth/login" className="inline-block text-amber-600 font-medium hover:text-amber-700">Back to login</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--color-sahara)] flex items-center justify-center px-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <Link href="/shop" className="inline-flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-amber-800 rounded-full flex items-center justify-center">
                            <span className="text-white font-serif text-lg">ⵣ</span>
                        </div>
                        <span className="text-2xl font-serif font-bold text-[var(--color-charcoal)]">OUROZ</span>
                    </Link>
                    <h1 className="mt-6 text-3xl font-bold text-[var(--color-charcoal)]">Reset password</h1>
                    <p className="mt-2 text-sm text-[var(--color-charcoal)]/60">Enter your email and we'll send a reset link</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">{error}</div>
                )}

                <form onSubmit={handleReset} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-[var(--color-charcoal)]/70 mb-1">Email</label>
                        <input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none transition"
                            placeholder="you@example.com" />
                    </div>
                    <button type="submit" disabled={loading}
                        className="w-full py-3 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 transition disabled:opacity-50">
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>

                <p className="text-center text-sm text-[var(--color-charcoal)]/50">
                    <Link href="/auth/login" className="text-amber-600 font-medium hover:text-amber-700">Back to login</Link>
                </p>
            </div>
        </div>
    );
}
