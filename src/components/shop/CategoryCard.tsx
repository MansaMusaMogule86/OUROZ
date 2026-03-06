'use client';

/**
 * OUROZ — CategoryCard
 * Premium editorial category card with cinematic hover interactions.
 * Uses Next.js Image for optimized delivery.
 */

import Link from 'next/link';
import Image from 'next/image';

export interface CategoryCardData {
    slug: string;
    title: string;
    subtitle: string;
    imageUrl: string;
    featured?: boolean;
}

interface CategoryCardProps {
    data: CategoryCardData;
    className?: string;
    priority?: boolean;
}

export default function CategoryCard({ data, className = '', priority = false }: CategoryCardProps) {
    const { slug, title, subtitle, imageUrl, featured } = data;

    return (
        <Link
            href={`/shop/${slug}`}
            className={`category-card group relative block overflow-hidden cursor-pointer ${className}`}
            style={{ borderRadius: '14px' }}
        >
            {/* Image Layer */}
            <div className="absolute inset-0 overflow-hidden" style={{ borderRadius: '14px' }}>
                <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    sizes={featured ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'}
                    priority={priority}
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                />
            </div>

            {/* Gradient Overlay */}
            <div
                className="absolute inset-0 transition-opacity duration-500 ease-out"
                style={{
                    borderRadius: '14px',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.18) 45%, rgba(0,0,0,0.02) 100%)',
                }}
            />
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                    borderRadius: '14px',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.05) 100%)',
                }}
            />

            {/* Content Layer */}
            <div className="relative h-full flex flex-col justify-end p-6 md:p-8 z-10">
                {/* Title */}
                <h3
                    className="text-white transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1"
                    style={{
                        fontFamily: 'var(--font-serif, "Playfair Display", serif)',
                        fontSize: featured ? '26px' : '20px',
                        fontWeight: 400,
                        letterSpacing: '0.02em',
                        lineHeight: 1.2,
                    }}
                >
                    {title}
                </h3>

                {/* Subtitle */}
                <p
                    className="mt-1.5 text-white/55 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5"
                    style={{
                        fontSize: '12px',
                        fontWeight: 300,
                        letterSpacing: '0.06em',
                    }}
                >
                    {subtitle}
                </p>

                {/* Gold Accent Line */}
                <div className="mt-3 overflow-hidden">
                    <div
                        className="h-px w-8 origin-left transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] scale-x-0 group-hover:scale-x-100 md:scale-x-0"
                        style={{ backgroundColor: '#D4AF37' }}
                    />
                    {/* Mobile: always visible at reduced opacity */}
                    <div
                        className="h-px w-8 md:hidden"
                        style={{ backgroundColor: 'rgba(212, 175, 55, 0.5)' }}
                    />
                </div>

                {/* View Collection — hover reveal */}
                <div
                    className="mt-4 opacity-0 translate-y-1.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hidden md:block"
                >
                    <span
                        className="text-white/70"
                        style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase',
                        }}
                    >
                        View Collection →
                    </span>
                </div>
            </div>
        </Link>
    );
}
