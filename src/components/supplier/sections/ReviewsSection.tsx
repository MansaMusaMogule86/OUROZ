/**
 * OUROZ Reviews Section Component
 * Displays supplier reviews with rating distribution and pagination
 */

import React, { useState } from 'react';
import { Star, CheckCircle } from 'lucide-react';
import { useSupplierReviews } from '../../../hooks/useSupplier';
import { Review, RatingDistribution } from '../../../types/supplier';

interface ReviewsSectionProps {
    supplierId: string;
    averageRating: number;
    totalCount: number;
}

// ============================================
// SUB-COMPONENTS
// ============================================

const RatingStars: React.FC<{ rating: number; size?: 'sm' | 'md' }> = ({ rating, size = 'md' }) => {
    const starSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
    return (
        <div className="flex items-center">
            {[1, 2, 3, 4, 5].map(star => (
                <Star
                    key={star}
                    className={`${starSize} ${
                        star <= Math.round(rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-gray-300'
                    }`}
                />
            ))}
        </div>
    );
};

const RatingDistributionBar: React.FC<{
    distribution: RatingDistribution[];
}> = ({ distribution }) => (
    <div className="flex-1 space-y-1">
        {distribution.map(({ stars, percentage }) => (
            <div key={stars} className="flex items-center gap-2 text-sm">
                <span className="w-3 text-right">{stars}</span>
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-amber-400 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
                <span className="w-10 text-right text-gray-500">{percentage}%</span>
            </div>
        ))}
    </div>
);

const ReviewCard: React.FC<{ review: Review }> = ({ review }) => {
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div className="border-b pb-6 last:border-b-0 last:pb-0">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-medium">
                        {review.buyer.avatar ? (
                            <img
                                src={review.buyer.avatar}
                                alt=""
                                className="w-full h-full rounded-full object-cover"
                            />
                        ) : (
                            review.buyer.name.charAt(0).toUpperCase()
                        )}
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">{review.buyer.name}</p>
                        <div className="flex items-center gap-2">
                            <RatingStars rating={review.rating} size="sm" />
                            {review.isVerifiedPurchase && (
                                <span className="flex items-center gap-1 text-xs text-green-600">
                                    <CheckCircle className="w-3 h-3" />
                                    Verified Purchase
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <span className="text-sm text-gray-500">{formatDate(review.createdAt)}</span>
            </div>

            {/* Title & Content */}
            {review.title && (
                <h4 className="font-medium text-gray-900 mb-2">{review.title}</h4>
            )}
            <p className="text-gray-600 mb-3">{review.content}</p>

            {/* Detailed Ratings */}
            {review.detailedRatings && (
                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                    {review.detailedRatings.communication && (
                        <span>Communication: {review.detailedRatings.communication}/5</span>
                    )}
                    {review.detailedRatings.quality && (
                        <span>Quality: {review.detailedRatings.quality}/5</span>
                    )}
                    {review.detailedRatings.delivery && (
                        <span>Delivery: {review.detailedRatings.delivery}/5</span>
                    )}
                </div>
            )}

            {/* Supplier Response */}
            {review.response && (
                <div className="bg-gray-50 rounded-lg p-4 mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-1">Supplier Response</p>
                    <p className="text-sm text-gray-600">{review.response}</p>
                    {review.responseAt && (
                        <p className="text-xs text-gray-400 mt-2">
                            Responded on {formatDate(review.responseAt)}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

// ============================================
// MAIN COMPONENT
// ============================================

const ReviewsSection: React.FC<ReviewsSectionProps> = ({
    supplierId,
    averageRating,
    totalCount,
}) => {
    const [filterRating, setFilterRating] = useState<number | undefined>(undefined);
    const { reviews, distribution, pagination, loading, error, setParams } = useSupplierReviews(
        supplierId,
        { limit: 10 }
    );

    const handleFilterChange = (rating: number | undefined) => {
        setFilterRating(rating);
        setParams({ rating, page: 1 });
    };

    if (loading && reviews.length === 0) {
        return (
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="animate-pulse">
                    <div className="h-32 bg-gray-200 rounded mb-6"></div>
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-24 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <p className="text-red-500">Failed to load reviews: {error}</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm">
            {/* Rating Summary */}
            <div className="flex items-start gap-6 mb-6 pb-6 border-b">
                <div className="text-center">
                    <p className="text-5xl font-bold text-gray-900">{averageRating.toFixed(1)}</p>
                    <RatingStars rating={averageRating} />
                    <p className="text-sm text-gray-500 mt-1">{totalCount} reviews</p>
                </div>
                <RatingDistributionBar distribution={distribution} />
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2 mb-6">
                <button
                    onClick={() => handleFilterChange(undefined)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                        filterRating === undefined
                            ? 'bg-amber-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    All Reviews
                </button>
                {[5, 4, 3, 2, 1].map(rating => (
                    <button
                        key={rating}
                        onClick={() => handleFilterChange(rating)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition flex items-center gap-1 ${
                            filterRating === rating
                                ? 'bg-amber-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        {rating} <Star className="w-3 h-3" />
                    </button>
                ))}
            </div>

            {/* Reviews List */}
            {reviews.length > 0 ? (
                <div className="space-y-6">
                    {reviews.map(review => (
                        <ReviewCard key={review.id} review={review} />
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500 py-8">
                    {filterRating
                        ? `No ${filterRating}-star reviews yet.`
                        : 'No reviews yet.'}
                </p>
            )}

            {/* Load More */}
            {pagination && pagination.page < pagination.totalPages && (
                <button
                    onClick={() => setParams({ page: pagination.page + 1 })}
                    className="w-full mt-6 py-3 border rounded-lg text-gray-700 hover:bg-gray-50 transition"
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Load More Reviews'}
                </button>
            )}
        </div>
    );
};

export default ReviewsSection;
