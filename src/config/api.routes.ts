/**
 * API Routes Configuration
 * Central configuration for all API endpoints
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const API_ROUTES = {
    // Auth
    auth: {
        login: '/auth/login',
        register: '/auth/register',
        logout: '/auth/logout',
        refresh: '/auth/refresh',
        forgotPassword: '/auth/forgot-password',
        resetPassword: '/auth/reset-password',
        verifyEmail: '/auth/verify-email',
        me: '/auth/me',
    },

    // Users
    users: {
        profile: '/users/profile',
        updateProfile: '/users/profile',
        addresses: '/users/addresses',
        notifications: '/users/notifications',
        preferences: '/users/preferences',
    },

    // Buyers
    buyers: {
        register: '/buyers/register',
        profile: (id: string) => `/buyers/${id}`,
        dashboard: '/buyers/dashboard',
        orders: '/buyers/orders',
        rfqs: '/buyers/rfqs',
        favorites: '/buyers/favorites',
        messages: '/buyers/messages',
        reviews: '/buyers/reviews',
    },

    // Suppliers (Moroccan-focused)
    suppliers: {
        register: '/suppliers/register',
        list: '/suppliers',
        profile: (id: string) => `/suppliers/${id}`,
        products: (id: string) => `/suppliers/${id}/products`,
        dashboard: '/suppliers/dashboard',
        orders: '/suppliers/orders',
        quotes: '/suppliers/quotes',
        verification: '/suppliers/verification',
        documents: '/suppliers/documents',
        analytics: '/suppliers/analytics',

        // Moroccan-specific
        exportLicense: '/suppliers/export-license',
        certifications: '/suppliers/certifications',
        factoryTour: '/suppliers/factory-tour',
    },

    // Products
    products: {
        list: '/products',
        search: '/products/search',
        detail: (slug: string) => `/products/${slug}`,
        create: '/products',
        update: (id: string) => `/products/${id}`,
        delete: (id: string) => `/products/${id}`,
        featured: '/products/featured',
        trending: '/products/trending',
        byCategory: (slug: string) => `/products/category/${slug}`,
        bySupplier: (id: string) => `/products/supplier/${id}`,
    },

    // Categories
    categories: {
        list: '/categories',
        tree: '/categories/tree',
        detail: (slug: string) => `/categories/${slug}`,
        products: (slug: string) => `/categories/${slug}/products`,
        suppliers: (slug: string) => `/categories/${slug}/suppliers`,
    },

    // RFQ (Request for Quotation)
    rfq: {
        create: '/rfq',
        list: '/rfq',
        detail: (id: string) => `/rfq/${id}`,
        quotes: (id: string) => `/rfq/${id}/quotes`,
        submitQuote: (id: string) => `/rfq/${id}/quotes`,
        acceptQuote: (id: string, quoteId: string) => `/rfq/${id}/quotes/${quoteId}/accept`,
        rejectQuote: (id: string, quoteId: string) => `/rfq/${id}/quotes/${quoteId}/reject`,
        close: (id: string) => `/rfq/${id}/close`,
        extend: (id: string) => `/rfq/${id}/extend`,
    },

    // Orders
    orders: {
        create: '/orders',
        list: '/orders',
        detail: (id: string) => `/orders/${id}`,
        cancel: (id: string) => `/orders/${id}/cancel`,
        confirm: (id: string) => `/orders/${id}/confirm`,
        updateStatus: (id: string) => `/orders/${id}/status`,
        timeline: (id: string) => `/orders/${id}/timeline`,
        documents: (id: string) => `/orders/${id}/documents`,
    },

    // Payments & Escrow
    payments: {
        initiate: '/payments/initiate',
        confirm: '/payments/confirm',
        status: (id: string) => `/payments/${id}/status`,
        release: (id: string) => `/payments/${id}/release`,
        refund: (id: string) => `/payments/${id}/refund`,
        history: '/payments/history',
    },

    escrow: {
        create: '/escrow/create',
        fund: (id: string) => `/escrow/${id}/fund`,
        release: (id: string) => `/escrow/${id}/release`,
        dispute: (id: string) => `/escrow/${id}/dispute`,
        status: (id: string) => `/escrow/${id}/status`,
    },

    // Shipping & Logistics
    shipping: {
        quote: '/shipping/quote',
        create: '/shipping/create',
        track: (id: string) => `/shipping/${id}/track`,
        documents: (id: string) => `/shipping/${id}/documents`,
        partners: '/shipping/partners',
    },

    // Messaging
    messages: {
        conversations: '/messages/conversations',
        conversation: (id: string) => `/messages/conversations/${id}`,
        send: (id: string) => `/messages/conversations/${id}/send`,
        markRead: (id: string) => `/messages/conversations/${id}/read`,
        start: '/messages/start',
    },

    // Reviews
    reviews: {
        create: '/reviews',
        list: '/reviews',
        bySupplier: (id: string) => `/reviews/supplier/${id}`,
        byProduct: (id: string) => `/reviews/product/${id}`,
        respond: (id: string) => `/reviews/${id}/respond`,
        report: (id: string) => `/reviews/${id}/report`,
    },

    // Disputes
    disputes: {
        create: '/disputes',
        list: '/disputes',
        detail: (id: string) => `/disputes/${id}`,
        evidence: (id: string) => `/disputes/${id}/evidence`,
        resolve: (id: string) => `/disputes/${id}/resolve`,
        escalate: (id: string) => `/disputes/${id}/escalate`,
    },

    // Admin
    admin: {
        dashboard: '/admin/dashboard',
        users: '/admin/users',
        suppliers: '/admin/suppliers',
        products: '/admin/products',
        orders: '/admin/orders',
        disputes: '/admin/disputes',
        reports: '/admin/reports',
        verification: '/admin/verification',
        settings: '/admin/settings',
        auditLog: '/admin/audit-log',
    },

    // Analytics
    analytics: {
        overview: '/analytics/overview',
        sales: '/analytics/sales',
        traffic: '/analytics/traffic',
        products: '/analytics/products',
        buyers: '/analytics/buyers',
        geographic: '/analytics/geographic',
    },

    // Search (Elasticsearch)
    search: {
        products: '/search/products',
        suppliers: '/search/suppliers',
        suggestions: '/search/suggestions',
        trending: '/search/trending',
    },

    // Upload
    upload: {
        image: '/upload/image',
        document: '/upload/document',
        video: '/upload/video',
        bulk: '/upload/bulk',
    },

    // Webhooks
    webhooks: {
        payment: '/webhooks/payment',
        shipping: '/webhooks/shipping',
    },
};

export default API_ROUTES;
