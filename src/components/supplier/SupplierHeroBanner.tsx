/**
 * OUROZ Supplier Hero Banner Component
 * Displays banner image with floating action buttons
 */

import React, { useState } from 'react';
import { Heart, Share2, Flag } from 'lucide-react';
import { useSupplierActions } from '../../hooks/useSupplier';

interface SupplierHeroBannerProps {
    bannerUrl?: string;
    supplierId: string;
    isFavorited: boolean;
    onFavoriteChange: () => void;
}

const SupplierHeroBanner: React.FC<SupplierHeroBannerProps> = ({
    bannerUrl,
    supplierId,
    isFavorited,
    onFavoriteChange,
}) => {
    const [favorited, setFavorited] = useState(isFavorited);
    const [showReportModal, setShowReportModal] = useState(false);
    const { toggleFavorite, loading } = useSupplierActions();

    const handleFavoriteClick = async () => {
        const success = await toggleFavorite(supplierId, favorited);
        if (success) {
            setFavorited(!favorited);
            onFavoriteChange();
        }
    };

    const handleShare = async () => {
        const url = window.location.href;
        if (navigator.share) {
            await navigator.share({ title: 'Supplier Profile', url });
        } else {
            await navigator.clipboard.writeText(url);
            // TODO: Show toast notification
        }
    };

    const defaultBanner = 'https://images.unsplash.com/photo-1596097635121-14b63a7e0a66?w=1600';

    return (
        <div className="relative h-72 md:h-96">
            <img
                src={bannerUrl || defaultBanner}
                alt="Supplier banner"
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

            {/* Floating Actions */}
            <div className="absolute top-4 right-4 flex gap-2">
                <button
                    onClick={handleFavoriteClick}
                    disabled={loading}
                    className="p-2 bg-white/90 backdrop-blur rounded-lg hover:bg-white transition disabled:opacity-50"
                    aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
                >
                    <Heart
                        className={`w-5 h-5 ${favorited ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                    />
                </button>
                <button
                    onClick={handleShare}
                    className="p-2 bg-white/90 backdrop-blur rounded-lg hover:bg-white transition"
                    aria-label="Share profile"
                >
                    <Share2 className="w-5 h-5 text-gray-600" />
                </button>
                <button
                    onClick={() => setShowReportModal(true)}
                    className="p-2 bg-white/90 backdrop-blur rounded-lg hover:bg-white transition"
                    aria-label="Report supplier"
                >
                    <Flag className="w-5 h-5 text-gray-600" />
                </button>
            </div>

            {/* Report Modal would go here */}
            {showReportModal && (
                <ReportModal
                    supplierId={supplierId}
                    onClose={() => setShowReportModal(false)}
                />
            )}
        </div>
    );
};

// Simple Report Modal Component
const ReportModal: React.FC<{
    supplierId: string;
    onClose: () => void;
}> = ({ supplierId, onClose }) => {
    const [reason, setReason] = useState<string>('');
    const [description, setDescription] = useState('');
    const { reportSupplier, loading } = useSupplierActions();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reason) return;

        const result = await reportSupplier(supplierId, {
            reason: reason as any,
            description: description || undefined,
        });

        if (result.success) {
            onClose();
            // TODO: Show success toast
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-semibold mb-4">Report Supplier</h3>
                <form onSubmit={handleSubmit}>
                    <select
                        value={reason}
                        onChange={e => setReason(e.target.value)}
                        className="w-full p-3 border rounded-lg mb-4"
                        required
                    >
                        <option value="">Select a reason</option>
                        <option value="SPAM">Spam</option>
                        <option value="FRAUD">Suspected Fraud</option>
                        <option value="INAPPROPRIATE">Inappropriate Content</option>
                        <option value="FAKE_INFO">Fake Information</option>
                        <option value="OTHER">Other</option>
                    </select>
                    <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="Additional details (optional)"
                        className="w-full p-3 border rounded-lg mb-4 h-24 resize-none"
                    />
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2 border rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !reason}
                            className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
                        >
                            Submit Report
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SupplierHeroBanner;
