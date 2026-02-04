/**
 * OUROZ Products Section Component
 * Displays supplier's featured products with pagination
 */

import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useSupplierProducts } from '../../../hooks/useSupplier';

interface ProductsSectionProps {
    supplierId: string;
    onProductClick: (productId: string) => void;
    onViewAll: () => void;
}

const ProductsSection: React.FC<ProductsSectionProps> = ({
    supplierId,
    onProductClick,
    onViewAll,
}) => {
    const { products, pagination, loading, error, setParams } = useSupplierProducts(supplierId, {
        limit: 8,
        sort: 'popular',
    });

    if (loading) {
        return (
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i}>
                                <div className="aspect-square bg-gray-200 rounded-xl mb-3"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <p className="text-red-500">Failed to load products: {error}</p>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Products</h2>
                <p className="text-gray-500 text-center py-8">No products listed yet.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Featured Products</h2>
                <button
                    onClick={onViewAll}
                    className="text-amber-600 hover:text-amber-700 text-sm font-medium flex items-center gap-1"
                >
                    View All Products <ChevronRight className="w-4 h-4" />
                </button>
            </div>

            {/* Sort Options */}
            <div className="mb-4">
                <select
                    onChange={(e) => setParams({ sort: e.target.value as any })}
                    className="text-sm border rounded-lg px-3 py-2"
                    defaultValue="popular"
                >
                    <option value="popular">Most Popular</option>
                    <option value="recent">Newest</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                </select>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {products.map(product => (
                    <div
                        key={product.id}
                        onClick={() => onProductClick(product.id)}
                        className="cursor-pointer group"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && onProductClick(product.id)}
                    >
                        <div className="aspect-square rounded-xl overflow-hidden mb-3 bg-gray-100">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                loading="lazy"
                            />
                        </div>
                        <h3 className="font-medium text-gray-900 text-sm line-clamp-2 group-hover:text-amber-600 transition">
                            {product.name}
                        </h3>
                        <p className="text-amber-600 font-semibold mt-1">
                            ${product.price.min} - ${product.price.max}
                        </p>
                        <p className="text-xs text-gray-500">
                            MOQ: {product.moq} • {product.orders.toLocaleString()} orders
                        </p>
                    </div>
                ))}
            </div>

            {/* Pagination info */}
            {pagination && pagination.totalPages > 1 && (
                <p className="text-center text-sm text-gray-500 mt-4">
                    Showing {products.length} of {pagination.total} products
                </p>
            )}
        </div>
    );
};

export default ProductsSection;
