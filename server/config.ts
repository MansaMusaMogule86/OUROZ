/**
 * OUROZ Server Configuration
 * Centralized environment variable access with defaults and validation.
 */

import dotenv from 'dotenv';
dotenv.config();

function required(key: string): string {
    const val = process.env[key];
    if (!val) throw new Error(`Missing required env var: ${key}`);
    return val;
}

function optional(key: string, fallback: string): string {
    return process.env[key] ?? fallback;
}

export const config = {
    env: optional('NODE_ENV', 'development'),
    port: parseInt(optional('PORT', '3001')),

    // JWT
    jwtSecret: optional('JWT_SECRET', 'dev-secret-change-in-production'),
    jwtExpiresIn: optional('JWT_EXPIRES_IN', '7d'),
    jwtRefreshExpiresIn: optional('JWT_REFRESH_EXPIRES_IN', '30d'),

    // Database
    databaseUrl: process.env.DATABASE_URL ?? undefined,
    db: {
        host: optional('DB_HOST', 'localhost'),
        port: parseInt(optional('DB_PORT', '5432')),
        user: optional('DB_USER', 'postgres'),
        password: optional('DB_PASSWORD', 'postgres'),
        name: optional('DB_NAME', 'ouroz'),
    },

    // AI
    geminiApiKey: process.env.GEMINI_API_KEY ?? '',

    // CORS
    corsOrigins: optional('CORS_ORIGINS', 'http://localhost:3000,http://127.0.0.1:3000').split(','),

    // Rate limiting
    rateLimitWindowMs: parseInt(optional('RATE_LIMIT_WINDOW_MS', '900000')), // 15 min
    rateLimitMax: parseInt(optional('RATE_LIMIT_MAX', '100')),

    // Supabase (for direct server client if needed)
    supabaseUrl: process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',

    isDev() {
        return this.env === 'development';
    },
    isProd() {
        return this.env === 'production';
    },
} as const;

export default config;
