/**
 * OUROZ App Router
 * Main application routing configuration
 */

import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Lazy load pages for code splitting
const LandingPage = lazy(() => import('./pages/LandingPage'));
const BuyerMarketplace = lazy(() => import('./pages/BuyerMarketplace'));
const SupplierDashboard = lazy(() => import('./pages/SupplierDashboard'));
const SupplierProfile = lazy(() => import('./pages/SupplierProfile'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const RFQSystem = lazy(() => import('./pages/RFQSystem'));
const MessagingSystem = lazy(() => import('./pages/MessagingSystem'));
const OrderManagement = lazy(() => import('./pages/OrderManagement'));
const Checkout = lazy(() => import('./pages/Checkout'));

// Loading component
const PageLoader: React.FC = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-700 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <span className="text-white text-2xl font-serif">ⵣ</span>
            </div>
            <p className="text-gray-500">Loading...</p>
        </div>
    </div>
);

// Route configuration
interface AppRoute {
    path: string;
    element: React.ReactNode;
    protected?: boolean;
    supplierOnly?: boolean;
    buyerOnly?: boolean;
}

const routes: AppRoute[] = [
    // Public routes
    { path: '/', element: <LandingPage language="en" onNavigate={() => { }} /> },
    { path: '/marketplace', element: <BuyerMarketplace language="en" onNavigate={() => { }} /> },
    { path: '/supplier/:id', element: <SupplierProfile supplierId="" language="en" onNavigate={() => { }} /> },
    { path: '/product/:slug', element: <ProductDetail productSlug="" language="en" onNavigate={() => { }} /> },

    // Buyer routes (protected)
    { path: '/rfq', element: <RFQSystem language="en" userId="" userType="buyer" onNavigate={() => { }} />, protected: true, buyerOnly: true },
    { path: '/messages', element: <MessagingSystem language="en" userId="" userType="buyer" onNavigate={() => { }} />, protected: true },
    { path: '/orders', element: <OrderManagement language="en" userId="" userType="buyer" onNavigate={() => { }} />, protected: true },
    { path: '/checkout', element: <Checkout language="en" userId="" onNavigate={() => { }} />, protected: true, buyerOnly: true },

    // Supplier routes (protected, Morocco only)
    { path: '/supplier', element: <SupplierDashboard language="en" supplierId="" onNavigate={() => { }} />, protected: true, supplierOnly: true },
    { path: '/supplier/dashboard', element: <SupplierDashboard language="en" supplierId="" onNavigate={() => { }} />, protected: true, supplierOnly: true },
];

// Main App Router
const AppRouter: React.FC = () => {
    return (
        <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
                <Routes>
                    {routes.map(route => (
                        <Route
                            key={route.path}
                            path={route.path}
                            element={route.element}
                        />
                    ))}
                    {/* Fallback route */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
};

export default AppRouter;

/*
 * Route Protection HOC (to be implemented)
 * 
 * const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
 *   const { isAuthenticated } = useAuth();
 *   if (!isAuthenticated) return <Navigate to="/login" />;
 *   return <>{children}</>;
 * };
 * 
 * const SupplierRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
 *   const { user } = useAuth();
 *   if (user?.type !== 'supplier') return <Navigate to="/marketplace" />;
 *   return <>{children}</>;
 * };
 */
