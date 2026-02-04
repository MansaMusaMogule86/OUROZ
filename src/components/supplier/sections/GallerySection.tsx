/**
 * OUROZ Gallery Section Component
 * Displays supplier's factory/facility photos and videos
 */

import React, { useState } from 'react';
import { Play, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSupplierGallery } from '../../../hooks/useSupplier';
import { GalleryItem } from '../../../types/supplier';

interface GallerySectionProps {
    supplierId: string;
}

const GallerySection: React.FC<GallerySectionProps> = ({ supplierId }) => {
    const { gallery, loading, error } = useSupplierGallery(supplierId);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    if (loading) {
        return (
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="aspect-square bg-gray-200 rounded-xl"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <p className="text-red-500">Failed to load gallery: {error}</p>
            </div>
        );
    }

    // Separate videos and images
    const videos = gallery.filter(item => item.type === 'VIDEO');
    const images = gallery.filter(item => item.type === 'IMAGE');

    if (gallery.length === 0) {
        return (
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Factory & Facility Gallery</h2>
                <p className="text-gray-500 text-center py-8">No gallery items available.</p>
            </div>
        );
    }

    const openLightbox = (index: number) => setLightboxIndex(index);
    const closeLightbox = () => setLightboxIndex(null);

    const navigateLightbox = (direction: 'prev' | 'next') => {
        if (lightboxIndex === null) return;
        const newIndex = direction === 'prev'
            ? (lightboxIndex - 1 + images.length) % images.length
            : (lightboxIndex + 1) % images.length;
        setLightboxIndex(newIndex);
    };

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Factory & Facility Gallery</h2>

            {/* Video Section */}
            {videos.length > 0 && (
                <div className="mb-4">
                    {videos.map((video, i) => (
                        <div
                            key={video.id}
                            className="relative aspect-video rounded-xl overflow-hidden bg-gray-900 mb-4"
                        >
                            {/* Video thumbnail/placeholder */}
                            {video.thumbnail && (
                                <img
                                    src={video.thumbnail}
                                    alt={video.title || 'Video thumbnail'}
                                    className="w-full h-full object-cover opacity-70"
                                />
                            )}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <button
                                    className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition"
                                    aria-label="Play video"
                                    onClick={() => {
                                        // TODO: Open video player modal
                                        window.open(video.url, '_blank');
                                    }}
                                >
                                    <Play className="w-8 h-8 text-amber-600 ml-1" />
                                </button>
                            </div>
                            <p className="absolute bottom-4 left-4 text-white font-medium">
                                {video.title || 'Factory Tour Video'}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* Image Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((img, index) => (
                    <div
                        key={img.id}
                        className="aspect-square rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition"
                        onClick={() => openLightbox(index)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && openLightbox(index)}
                    >
                        <img
                            src={img.thumbnail || img.url}
                            alt={img.title || `Gallery image ${index + 1}`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />
                    </div>
                ))}
            </div>

            {/* Lightbox Modal */}
            {lightboxIndex !== null && (
                <Lightbox
                    images={images}
                    currentIndex={lightboxIndex}
                    onClose={closeLightbox}
                    onNavigate={navigateLightbox}
                />
            )}
        </div>
    );
};

// ============================================
// LIGHTBOX COMPONENT
// ============================================

interface LightboxProps {
    images: GalleryItem[];
    currentIndex: number;
    onClose: () => void;
    onNavigate: (direction: 'prev' | 'next') => void;
}

const Lightbox: React.FC<LightboxProps> = ({ images, currentIndex, onClose, onNavigate }) => {
    const currentImage = images[currentIndex];

    // Handle keyboard navigation
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft') onNavigate('prev');
            if (e.key === 'ArrowRight') onNavigate('next');
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose, onNavigate]);

    return (
        <div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={onClose}
        >
            {/* Close button */}
            <button
                className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-lg transition"
                onClick={onClose}
                aria-label="Close lightbox"
            >
                <X className="w-6 h-6" />
            </button>

            {/* Navigation buttons */}
            {images.length > 1 && (
                <>
                    <button
                        className="absolute left-4 p-2 text-white hover:bg-white/10 rounded-lg transition"
                        onClick={(e) => { e.stopPropagation(); onNavigate('prev'); }}
                        aria-label="Previous image"
                    >
                        <ChevronLeft className="w-8 h-8" />
                    </button>
                    <button
                        className="absolute right-4 p-2 text-white hover:bg-white/10 rounded-lg transition"
                        onClick={(e) => { e.stopPropagation(); onNavigate('next'); }}
                        aria-label="Next image"
                    >
                        <ChevronRight className="w-8 h-8" />
                    </button>
                </>
            )}

            {/* Image */}
            <img
                src={currentImage.url}
                alt={currentImage.title || 'Gallery image'}
                className="max-h-[90vh] max-w-[90vw] object-contain"
                onClick={(e) => e.stopPropagation()}
            />

            {/* Caption & counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center text-white">
                {currentImage.title && (
                    <p className="font-medium mb-1">{currentImage.title}</p>
                )}
                <p className="text-sm text-white/70">
                    {currentIndex + 1} / {images.length}
                </p>
            </div>
        </div>
    );
};

export default GallerySection;
