'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function UpdatePasswordPage() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleUpdate = async (e: React.FormEvent) => {
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

        const { error: updateError } = await supabase.auth.updateUser({ password });

        if (updateError) {
            setError(updateError.message);
            setLoading(false);
            return;
        }

        router.push('/shop');
    };

    return (
        <div className="min-h-screen bg-[var(--color-sahara)] flex items-center justify-center px-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <Link href="/shop" className="inline-flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-white border border-amber-700/20 flex items-center justify-center">
                            <img src="/logo/logo.png" alt="OUROZ" className="w-[82%] h-[82%] object-contain" draggable={false} />
                        </div>
                        <span className="text-2xl font-serif font-bold text-[var(--color-charcoal)]">OUROZ</span>
                    </Link>
                    <h1 className="mt-6 text-3xl font-bold text-[var(--color-charcoal)]">Set new password</h1>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">{error}</div>
                )}

                <form onSubmit={handleUpdate} className="space-y-4">
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-[var(--color-charcoal)]/70 mb-1">New Password</label>
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
                        {loading ? 'Updating...' : 'Update Password'}
                    </button>
                </form>
            </div>
        </div>
    );
}
