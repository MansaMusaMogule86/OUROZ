'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.12, duration: 0.7, ease: 'easeOut' as const },
    }),
};

export default function BrandEntryClient() {
    return (
        <div
            className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
            style={{
                backgroundColor: '#E5D3B3',
                backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper-fibers.png")',
            }}
        >
            {/* Thin dark top bar */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#1a1a1a]/80 z-50" />

            {/* ── Right-side Watermark ─────────────────────────────────────
                Two large stacked ⵣ symbols — top in Sahara/Imperial warmth,
                bottom in Zellige Green — exactly matching reference screenshot */}
            <div
                className="absolute right-0 top-0 bottom-0 pointer-events-none select-none z-0 flex flex-col justify-center"
                style={{ width: '40vw', overflow: 'hidden' }}
            >
                {/* Top ⵣ — warm Imperial Red / Sahara Sand tone */}
                <span
                    style={{
                        fontFamily: 'serif',
                        fontSize: 'clamp(260px, 28vw, 420px)',
                        lineHeight: 0.85,
                        color: '#913023',
                        opacity: 0.13,
                        display: 'block',
                        marginRight: '-20px',
                    }}
                >
                    ⵣ
                </span>
                {/* Bottom ⵣ — Zellige Green tone */}
                <span
                    style={{
                        fontFamily: 'serif',
                        fontSize: 'clamp(260px, 28vw, 420px)',
                        lineHeight: 0.85,
                        color: '#2D4B43',
                        opacity: 0.13,
                        display: 'block',
                        marginRight: '-20px',
                        marginTop: '-40px',
                    }}
                >
                    ⵣ
                </span>
            </div>

            {/* ── Navigation ─────────────────────────────────────────────── */}
            <nav className="absolute top-[3px] left-0 right-0 flex justify-between items-center px-8 md:px-14 py-5 z-40">
                {/* Logo: Amazigh symbol + OUROZ */}
                <Link href="/" className="flex items-center gap-2 text-[#1a1a1a] hover:opacity-70 transition-opacity">
                    {/* Amazigh ⵣ symbol as icon */}
                    <span
                        style={{
                            fontFamily: 'serif',
                            fontSize: '22px',
                            lineHeight: 1,
                            color: '#913023',
                        }}
                    >
                        ⵣ
                    </span>
                    <span
                        style={{
                            fontFamily: "'Playfair Display', Georgia, serif",
                            fontSize: '15px',
                            letterSpacing: '0.22em',
                            fontWeight: 600,
                            color: '#1a1a1a',
                        }}
                    >
                        OUROZ
                    </span>
                </Link>

                {/* Nav links */}
                <div
                    className="hidden md:flex gap-12"
                    style={{
                        fontFamily: 'Montserrat, sans-serif',
                        fontSize: '10px',
                        letterSpacing: '0.25em',
                        textTransform: 'uppercase',
                        color: '#1a1a1a',
                        fontWeight: 600,
                    }}
                >
                    <Link href="/shop" className="hover:opacity-60 transition-opacity">SHOP</Link>
                    <Link href="/suppliers" className="hover:opacity-60 transition-opacity">SUPPLIERS</Link>
                    <Link href="/journal" className="hover:opacity-60 transition-opacity">JOURNAL</Link>
                    <Link href="/about" className="hover:opacity-60 transition-opacity">ABOUT</Link>
                    <Link href="/contact" className="hover:opacity-60 transition-opacity">CONTACT</Link>
                </div>
            </nav>

            {/* ── Center Content ─────────────────────────────────────────── */}
            <motion.div
                initial="hidden"
                animate="visible"
                className="relative z-10 text-center flex flex-col items-center px-4"
            >
                {/* Halo + Symbol */}
                <motion.div
                    variants={fadeUp}
                    custom={0}
                    className="relative flex items-center justify-center mb-1"
                    style={{ marginBottom: '-10px' }}
                >
                    {/* Glowing circular halo */}
                    <div
                        style={{
                            position: 'absolute',
                            width: '230px',
                            height: '230px',
                            borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(255,255,255,0.88) 28%, rgba(255,255,255,0.35) 65%, transparent 100%)',
                            filter: 'blur(4px)',
                        }}
                    />
                    {/* ⵣ with Imperial Red → Zellige Green gradient */}
                    <span
                        style={{
                            fontFamily: 'serif',
                            fontSize: '150px',
                            lineHeight: 1,
                            display: 'block',
                            position: 'relative',
                            zIndex: 2,
                            background: 'linear-gradient(165deg, #D4825A 0%, #913023 30%, #5E7A60 70%, #2D4B43 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}
                    >
                        ⵣ
                    </span>
                </motion.div>

                {/* OUROZ */}
                <motion.h1
                    variants={fadeUp}
                    custom={1}
                    style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: 'clamp(68px, 10vw, 112px)',
                        fontWeight: 700,
                        letterSpacing: '0.04em',
                        color: '#1a1a1a',
                        margin: 0,
                        lineHeight: 1,
                    }}
                >
                    OUROZ
                </motion.h1>

                {/* Tagline */}
                <motion.p
                    variants={fadeUp}
                    custom={2}
                    style={{
                        fontFamily: 'Montserrat, sans-serif',
                        fontSize: '13px',
                        letterSpacing: '0.3em',
                        color: '#B08D5B',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        marginTop: '12px',
                        marginBottom: '48px',
                    }}
                >
                    MOROCCAN PROVISIONS FROM{' '}
                    <span
                        style={{
                            fontFamily: "'Playfair Display', Georgia, serif",
                            textTransform: 'lowercase',
                            fontStyle: 'italic',
                            letterSpacing: '0.05em',
                            fontSize: '11px',
                        }}
                    >
                        the
                    </span>{' '}
                    ATLAS
                </motion.p>

                {/* Buttons */}
                <motion.div variants={fadeUp} custom={3} className="flex flex-row gap-5 items-center">
                    <Link
                        href="/shop"
                        style={{
                            fontFamily: 'Montserrat, sans-serif',
                            fontWeight: 600,
                            fontSize: '13px',
                            letterSpacing: '0.04em',
                            color: '#ffffff',
                            backgroundColor: '#1a1a1a',
                            borderRadius: '50px',
                            padding: '17px 40px',
                            textDecoration: 'none',
                            display: 'inline-block',
                        }}
                    >
                        Explore Products
                    </Link>
                    <Link
                        href="/suppliers"
                        style={{
                            fontFamily: 'Montserrat, sans-serif',
                            fontWeight: 600,
                            fontSize: '13px',
                            letterSpacing: '0.04em',
                            color: '#1a1a1a',
                            backgroundColor: 'transparent',
                            borderRadius: '50px',
                            padding: '16px 40px',
                            textDecoration: 'none',
                            display: 'inline-block',
                            border: '1.5px solid rgba(0,0,0,0.22)',
                        }}
                    >
                        Supplier Login
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    );
}
