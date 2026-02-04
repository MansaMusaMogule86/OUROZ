/**
 * OUROZ Supplier Profile Page Component
 * Main page container that orchestrates all supplier profile sections
 */

import React, { useState } from 'react';
import { useSupplierProfile } from '../../hooks/useSupplier';
import { Language } from '../../types/supplier';

// Child components (defined below or in separate files)
import SupplierHeroBanner from './SupplierHeroBanner';
import SupplierProfileHeader from './SupplierProfileHeader';
import SupplierTabs from './SupplierTabs';
import AboutSection from './sections/AboutSection';
import ProductsSection from './sections/ProductsSection';
import GallerySection from './sections/GallerySection';
import ReviewsSection from './sections/ReviewsSection';
import BusinessDetailsCard from './cards/BusinessDetailsCard';
import CertificationsCard from './cards/CertificationsCard';
import ContactCard from './cards/ContactCard';
import LoadingState from '../ui/LoadingState';
import ErrorState from '../ui/ErrorState';

// ============================================
// PROPS INTERFACE
// ============================================

export interface SupplierProfilePageProps {
    /** Supplier UUID from URL params */
    supplierId: string;
    /** Current UI language */
    language?: Language;
    /** Navigation callback */
    onNavigate: (path: string) => void;
}

// ============================================
// TAB TYPES
// ============================================

export type TabId = 'about' | 'products' | 'gallery' | 'reviews';

// ============================================
// COMPONENT
// ============================================

const SupplierProfilePage: React.FC<SupplierProfilePageProps> = ({
    supplierId,
    language = 'en',
    onNavigate,
}) => {
    // State
    const [activeTab, setActiveTab] = useState<TabId>('about');

    // Data fetching
    const { supplier, loading, error, refetch } = useSupplierProfile(supplierId);

    // Loading state
    if (loading) {
        return <LoadingState message="Loading supplier profile..." />;
    }

    // Error state
    if (error || !supplier) {
        return (
            <ErrorState
                title="Supplier Not Found"
                message={error || 'The supplier profile could not be loaded.'}
                onRetry={refetch}
            />
        );
    }

    // Get localized company name
    const getLocalizedName = () => {
        if (language === 'ar' && supplier.companyNameAr) return supplier.companyNameAr;
        if (language === 'fr' && supplier.companyNameFr) return supplier.companyNameFr;
        return supplier.companyName;
    };

    // Tab config
    const tabs = [
        { id: 'about' as TabId, label: 'About' },
        { id: 'products' as TabId, label: `Products (${supplier.productCount})` },
        { id: 'gallery' as TabId, label: 'Gallery' },
        { id: 'reviews' as TabId, label: `Reviews (${supplier.rating.count})` },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Banner with floating actions */}
            <SupplierHeroBanner
                bannerUrl={supplier.banner}
                supplierId={supplier.id}
                isFavorited={supplier.isFavorited}
                onFavoriteChange={refetch}
            />

            {/* Profile Header */}
            <div className="container mx-auto px-4 -mt-24 relative z-10">
                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
                    <SupplierProfileHeader
                        supplier={supplier}
                        localizedName={getLocalizedName()}
                        onContactClick={() => onNavigate(`/contact/${supplier.id}`)}
                        onRFQClick={() => onNavigate(`/rfq/create?supplier=${supplier.id}`)}
                    />

                    {/* Tabs */}
                    <SupplierTabs
                        tabs={tabs}
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                    />
                </div>

                {/* Tab Content + Sidebar */}
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6 pb-12">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-6">
                        {activeTab === 'about' && (
                            <AboutSection supplier={supplier} />
                        )}
                        {activeTab === 'products' && (
                            <ProductsSection
                                supplierId={supplier.id}
                                onProductClick={(productId) => onNavigate(`/product/${productId}`)}
                                onViewAll={() => onNavigate(`/supplier/${supplier.id}/products`)}
                            />
                        )}
                        {activeTab === 'gallery' && (
                            <GallerySection supplierId={supplier.id} />
                        )}
                        {activeTab === 'reviews' && (
                            <ReviewsSection
                                supplierId={supplier.id}
                                averageRating={supplier.rating.avg}
                                totalCount={supplier.rating.count}
                            />
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-6">
                        <BusinessDetailsCard supplier={supplier} />
                        <CertificationsCard certifications={supplier.certifications} />
                        <ContactCard supplier={supplier} />
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default SupplierProfilePage;
