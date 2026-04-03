/**
 * OUROZ Supplier Profile React Hooks
 * Custom hooks for supplier data fetching and mutations
 */

import { useState, useEffect, useCallback } from 'react';
import {
    SupplierProfile,
    // FeaturedProduct, // REMOVED: Replaced by Product from product.types
    Review,
    GalleryItem,
    GetProductsParams,
    GetReviewsParams,
    CreateReviewPayload,
    ReportSupplierPayload,
    PaginationInfo,
    RatingDistribution,
} from '../types/supplier';
import {
    Product, // NEW
    CreateProductPayload, // NEW
    UpdateProductPayload, // NEW
    PaginatedProductsResponse, // NEW
} from '../types/product.types'; // NEW

const API_BASE = '/api/suppliers';

// ============================================
// HELPER: API Fetch wrapper
// ============================================

async function apiFetch<T>(
    url: string,
    options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: string }> {
    try {
        const token = localStorage.getItem('auth_token');
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        };

        const response = await fetch(url, { ...options, headers });
        const json = await response.json();

        if (!response.ok) {
            return { success: false, error: json.message || 'Request failed' };
        }

        return { success: true, data: json.data };
    } catch (error) {
        return { success: false, error: 'Network error' };
    }
}

// ============================================
// HOOK: useSupplierProfile
// Fetches supplier profile by ID
// ============================================

interface UseSupplierProfileResult {
    supplier: SupplierProfile | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export function useSupplierProfile(supplierId: string): UseSupplierProfileResult {
    const [supplier, setSupplier] = useState<SupplierProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSupplier = useCallback(async () => {
        if (!supplierId) return;

        setLoading(true);
        setError(null);

        const result = await apiFetch<SupplierProfile>(`${API_BASE}/${supplierId}`);

        if (result.success && result.data) {
            setSupplier(result.data);
        } else {
            setError(result.error || 'Failed to load supplier');
        }

        setLoading(false);
    }, [supplierId]);

    useEffect(() => {
        fetchSupplier();
    }, [fetchSupplier]);

    return { supplier, loading, error, refetch: fetchSupplier };
}

// ============================================
// HOOK: useSupplierProducts
// Fetches paginated supplier products
// ============================================

interface UseSupplierProductsResult {
    products: Product[]; // Changed from FeaturedProduct[]
    pagination: PaginationInfo | null;
    loading: boolean;
    error: string | null;
    fetchPage: (page: number) => void;
    setParams: (params: GetProductsParams) => void;
    createProduct: (payload: CreateProductPayload) => Promise<{ success: boolean; error?: string; productId?: string }>; // NEW
    updateProduct: (productId: string, payload: UpdateProductPayload) => Promise<{ success: boolean; error?: string }>; // NEW
    deleteProduct: (productId: string) => Promise<{ success: boolean; error?: string }>; // NEW
}

export function useSupplierProducts(
    supplierId: string,
    initialParams: GetProductsParams = {}
): UseSupplierProductsResult {
    const [products, setProducts] = useState<Product[]>([]); // Changed from FeaturedProduct[]
    const [pagination, setPagination] = useState<PaginationInfo | null>(null);
    const [params, setParams] = useState<GetProductsParams>(initialParams);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = useCallback(async () => {
        if (!supplierId) return;

        setLoading(true);
        setError(null);

        const queryParams = new URLSearchParams();
        if (params.page) queryParams.set('page', String(params.page));
        if (params.limit) queryParams.set('limit', String(params.limit));
        if (params.category) queryParams.set('category', params.category);
        if (params.sort) queryParams.set('sort', params.sort);

        const url = `${API_BASE}/${supplierId}/products?${queryParams}`;
        const result = await apiFetch<PaginatedProductsResponse>(url); // Changed type

        if (result.success && result.data) {
            setProducts(result.data.products);
            setPagination(result.data.pagination);
        } else {
            setError(result.error || 'Failed to load products');
        }

        setLoading(false);
    }, [supplierId, params]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const fetchPage = (page: number) => {
        setParams(prev => ({ ...prev, page }));
    };

    // NEW: Product management functions
    const createProduct = async (
        payload: CreateProductPayload
    ): Promise<{ success: boolean; error?: string; productId?: string }> => {
        // setLoading(true); // Decide if you want to set loading for mutations
        const result = await apiFetch<{ id: string }>(`${API_BASE}/${supplierId}/products`, {
            method: 'POST',
            body: JSON.stringify(payload),
        });
        // setLoading(false);
        if (result.success) {
            fetchProducts(); // Refetch products to update the list
            return { success: true, productId: result.data?.id };
        }
        return { success: false, error: result.error };
    };

    const updateProduct = async (
        productId: string,
        payload: UpdateProductPayload
    ): Promise<{ success: boolean; error?: string }> => {
        // setLoading(true);
        const result = await apiFetch(`${API_BASE}/${supplierId}/products/${productId}`, {
            method: 'PUT',
            body: JSON.stringify(payload),
        });
        // setLoading(false);
        if (result.success) {
            fetchProducts(); // Refetch products to update the list
        }
        return { success: result.success, error: result.error };
    };

    const deleteProduct = async (productId: string): Promise<{ success: boolean; error?: string }> => {
        // setLoading(true);
        const result = await apiFetch(`${API_BASE}/${supplierId}/products/${productId}`, {
            method: 'DELETE',
        });
        // setLoading(false);
        if (result.success) {
            fetchProducts(); // Refetch products to update the list
        }
        return { success: result.success, error: result.error };
    };


    return { products, pagination, loading, error, fetchPage, setParams, createProduct, updateProduct, deleteProduct };
}

// ============================================
// HOOK: useSupplierReviews
// Fetches paginated supplier reviews
// ============================================

interface UseSupplierReviewsResult {
    reviews: Review[];
    distribution: RatingDistribution[];
    pagination: PaginationInfo | null;
    loading: boolean;
    error: string | null;
    fetchPage: (page: number) => void;
    setParams: (params: GetReviewsParams) => void;
}

export function useSupplierReviews(
    supplierId: string,
    initialParams: GetReviewsParams = {}
): UseSupplierReviewsResult {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [distribution, setDistribution] = useState<RatingDistribution[]>([]);
    const [pagination, setPagination] = useState<PaginationInfo | null>(null);
    const [params, setParams] = useState<GetReviewsParams>(initialParams);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchReviews = useCallback(async () => {
        if (!supplierId) return;

        setLoading(true);
        setError(null);

        const queryParams = new URLSearchParams();
        if (params.page) queryParams.set('page', String(params.page));
        if (params.limit) queryParams.set('limit', String(params.limit));
        if (params.rating) queryParams.set('rating', String(params.rating));
        if (params.sort) queryParams.set('sort', params.sort);

        const url = `${API_BASE}/${supplierId}/reviews?${queryParams}`;
        const result = await apiFetch<{
            reviews: Review[];
            distribution: RatingDistribution[];
            pagination: PaginationInfo;
        }>(url);

        if (result.success && result.data) {
            setReviews(result.data.reviews);
            setDistribution(result.data.distribution);
            setPagination(result.data.pagination);
        } else {
            setError(result.error || 'Failed to load reviews');
        }

        setLoading(false);
    }, [supplierId, params]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    const fetchPage = (page: number) => {
        setParams(prev => ({ ...prev, page }));
    };

    return { reviews, distribution, pagination, loading, error, fetchPage, setParams };
}

// ============================================
// HOOK: useSupplierGallery
// Fetches supplier gallery items
// ============================================

interface UseSupplierGalleryResult {
    gallery: GalleryItem[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export function useSupplierGallery(supplierId: string): UseSupplierGalleryResult {
    const [gallery, setGallery] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchGallery = useCallback(async () => {
        if (!supplierId) return;

        setLoading(true);
        setError(null);

        const result = await apiFetch<GalleryItem[]>(`${API_BASE}/${supplierId}/gallery`);

        if (result.success && result.data) {
            setGallery(result.data);
        } else {
            setError(result.error || 'Failed to load gallery');
        }

        setLoading(false);
    }, [supplierId]);

    useEffect(() => {
        fetchGallery();
    }, [fetchGallery]);

    return { gallery, loading, error, refetch: fetchGallery };
}

// ============================================
// HOOK: useSupplierActions
// Mutation hooks for supplier interactions
// ============================================

interface UseSupplierActionsResult {
    toggleFavorite: (supplierId: string, isFavorited: boolean) => Promise<boolean>;
    createReview: (supplierId: string, payload: CreateReviewPayload) => Promise<{ success: boolean; error?: string }>;
    reportSupplier: (supplierId: string, payload: ReportSupplierPayload) => Promise<{ success: boolean; error?: string }>;
    loading: boolean;
}

export function useSupplierActions(): UseSupplierActionsResult {
    const [loading, setLoading] = useState(false);

    const toggleFavorite = async (supplierId: string, isFavorited: boolean): Promise<boolean> => {
        setLoading(true);
        const method = isFavorited ? 'DELETE' : 'POST';
        const result = await apiFetch(`${API_BASE}/${supplierId}/favorite`, { method });
        setLoading(false);
        return result.success;
    };

    const createReview = async (
        supplierId: string,
        payload: CreateReviewPayload
    ): Promise<{ success: boolean; error?: string }> => {
        setLoading(true);
        const result = await apiFetch(`${API_BASE}/${supplierId}/reviews`, {
            method: 'POST',
            body: JSON.stringify(payload),
        });
        setLoading(false);
        return { success: result.success, error: result.error };
    };

    const reportSupplier = async (
        supplierId: string,
        payload: ReportSupplierPayload
    ): Promise<{ success: boolean; error?: string }> => {
        setLoading(true);
        const result = await apiFetch(`${API_BASE}/${supplierId}/report`, {
            method: 'POST',
            body: JSON.stringify(payload),
        });
        setLoading(false);
        return { success: result.success, error: result.error };
    };

    return { toggleFavorite, createReview, reportSupplier, loading };
}
