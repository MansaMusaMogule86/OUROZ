'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

function SignupForm() {
    const searchParams = useSearchParams();
    const returnTo = searchParams.get('return') || '/shop';

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        const { error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { full_name: fullName },
                emailRedirectTo: `${window.location.origin}/auth/callback?return=${encodeURIComponent(returnTo)}`,
            },
        });

        if (authError) {
            setError(authError.message);
            setLoading(false);
            return;
        }

        setSuccess(true);
        setLoading(false);
    };

    const handleGoogleSignup = async () => {
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

    if (success) {
        return (
            <div className="w-full max-w-md text-center space-y-6">
                <div className="w-16 h-16 mx-auto bg-emerald-100 rounded-full flex items-center justify-center text-3xl">&#x2713;</div>
                <h1 className="text-2xl font-bold text-[var(--color-charcoal)]">Check your email</h1>
                <p className="text-[var(--color-charcoal)]/60">
                    We sent a confirmation link to <strong>{email}</strong>. Click the link to activate your account.
                </p>
                <Link href="/auth/login" className="inline-block text-amber-600 font-medium hover:text-amber-700">
                    Back to login
                </Link>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md space-y-8">
            <div className="text-center">
                <Link href="/shop" className="inline-flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-white border border-amber-700/20 flex items-center justify-center">
                        <img src="/logo/logo.png" alt="OUROZ" className="w-[82%] h-[82%] object-contain" draggable={false} />
                    </div>
                    <span className="text-2xl font-serif font-bold text-[var(--color-charcoal)]">OUROZ</span>
                </Link>
                <h1 className="mt-6 text-3xl font-bold text-[var(--color-charcoal)]">Create your account</h1>
                <p className="mt-2 text-sm text-[var(--color-charcoal)]/60">Join OUROZ for authentic Moroccan products</p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">{error}</div>
            )}

            <button
                type="button"
                onClick={handleGoogleSignup}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-xl bg-white hover:bg-gray-50 transition text-sm font-medium disabled:opacity-50"
            >
                <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Continue with Google
            </button>

            <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                <div className="relative flex justify-center text-sm"><span className="px-4 bg-[var(--color-sahara)] text-[var(--color-charcoal)]/40">or sign up with email</span></div>
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-[var(--color-charcoal)]/70 mb-1">Full Name</label>
                    <input id="name" type="text" required value={fullName} onChange={e => setFullName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none transition"
                        placeholder="Your full name" />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[var(--color-charcoal)]/70 mb-1">Email</label>
                    <input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none transition"
                        placeholder="you@example.com" />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-[var(--color-charcoal)]/70 mb-1">Password</label>
                    <input id="password" type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none transition"
                        placeholder="Min 6 characters" />
                </div>
                <div>
                    <label htmlFor="confirm" className="block text-sm font-medium text-[var(--color-charcoal)]/70 mb-1">Confirm Password</label>
                    <input id="confirm" type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none transition"
                        placeholder="Repeat password" />
                </div>
                <button type="submit" disabled={loading}
                    className="w-full py-3 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 transition disabled:opacity-50">
                    {loading ? 'Creating account...' : 'Create Account'}
                </button>
            </form>

            <p className="text-center text-sm text-[var(--color-charcoal)]/50">
                Already have an account?{' '}
                <Link href={`/auth/login?return=${encodeURIComponent(returnTo)}`} className="text-amber-600 font-medium hover:text-amber-700">Sign in</Link>
            </p>
        </div>
    );
}

export default function SignupPage() {
    return (
        <div className="min-h-screen bg-[var(--color-sahara)] flex items-center justify-center px-4">
            <Suspense fallback={<div className="text-[var(--color-charcoal)]/50">Loading...</div>}>
                <SignupForm />
            </Suspense>
        </div>
    );
}
