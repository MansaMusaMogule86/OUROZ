'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const returnTo = searchParams.get('return') || '/shop';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

        if (authError) {
            setError(authError.message);
            setLoading(false);
            return;
        }

        router.push(returnTo);
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError(null);

        const { error: authError } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: `${window.location.origin}/auth/callback?return=${encodeURIComponent(returnTo)}` },
        });

        if (authError) {
            setError(authError.message);
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-[400px]">
            <div className="text-center mb-8">
                <Link href="/" className="inline-flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-[#DD7117] rounded-full flex items-center justify-center">
                        <span className="text-white text-[15px] font-serif leading-none translate-y-[-1px]">&#11581;</span>
                    </div>
                    <span className="text-[22px] font-heading font-bold uppercase tracking-[0.2em] text-[var(--color-charcoal)]">
                        OUROZ
                    </span>
                </Link>
                <h1 className="text-3xl font-heading font-semibold text-[var(--color-charcoal)] tracking-tight">Welcome back</h1>
                <p className="mt-2 text-sm text-[var(--color-charcoal)]/50 font-body">Sign in to your account to continue</p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-[10px] p-4 text-sm text-red-700 mb-6">{error}</div>
            )}

            <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-[var(--color-charcoal)]/[0.08] rounded-[10px] bg-white hover:bg-gray-50 transition text-[13px] font-medium text-[var(--color-charcoal)] shadow-[0_2px_10px_rgba(0,0,0,0.02)] disabled:opacity-50"
            >
                <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Continue with Google
            </button>

            <div className="relative my-7">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[var(--color-charcoal)]/[0.06]"></div>
                </div>
                <div className="relative flex justify-center text-[12px]">
                    <span className="px-4 bg-[var(--color-sahara)] text-[var(--color-charcoal)]/40 font-body">or sign in with email</span>
                </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-[13px] font-medium text-[var(--color-charcoal)]/70 mb-1.5 font-body">Email</label>
                    <input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)}
                        className="w-full px-4 py-[14px] text-[13px] rounded-[10px] border border-[var(--color-charcoal)]/[0.08] bg-white text-[var(--color-charcoal)] focus:ring-[3px] focus:ring-[#DD7117]/20 focus:border-[#DD7117] outline-none transition shadow-[0_2px_10px_rgba(0,0,0,0.02)] placeholder-[var(--color-charcoal)]/30 font-body"
                        placeholder="you@example.com" />
                </div>
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <label htmlFor="password" className="block text-[13px] font-medium text-[var(--color-charcoal)]/70 font-body">Password</label>
                        <Link href="/auth/password-reset" className="text-[12px] font-medium text-[#DD7117] hover:underline font-body transition-all">Forgot password?</Link>
                    </div>
                    <input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)}
                        className="w-full px-4 py-[14px] text-[13px] rounded-[10px] border border-[var(--color-charcoal)]/[0.08] bg-white text-[var(--color-charcoal)] focus:ring-[3px] focus:ring-[#DD7117]/20 focus:border-[#DD7117] outline-none transition shadow-[0_2px_10px_rgba(0,0,0,0.02)] placeholder-[var(--color-charcoal)]/30 font-body"
                        placeholder="••••••••" />
                </div>
                <div className="pt-2">
                    <button type="submit" disabled={loading}
                        className="w-full py-[14px] bg-[#DD7117] text-white rounded-[10px] text-[14px] font-semibold hover:bg-[#c96211] transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed font-body">
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </div>
            </form>

            <p className="text-center text-[13px] text-[var(--color-charcoal)]/50 mt-8 font-body">
                Don&apos;t have an account?{' '}
                <Link href={`/auth/signup?return=${encodeURIComponent(returnTo)}`} className="text-[#DD7117] font-medium hover:underline transition-all">
                    Create one
                </Link>
            </p>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-[var(--color-sahara)] flex items-center justify-center px-4">
            <Suspense fallback={<div className="text-[var(--color-charcoal)]/50">Loading...</div>}>
                <LoginForm />
            </Suspense>
        </div>
    );
}
