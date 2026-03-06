/**
 * OUROZ Authentication Routes
 * Register, Login, Me, Refresh, Password Reset
 */

import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { pool } from '../db/connection.js';
import { config } from '../config.js';
import { AppError } from '../utils/errors.js';
import { authenticate } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validation.js';
import { z } from 'zod';

const router = Router();

// ──────────────────────────────────────
// Schemas
// ──────────────────────────────────────

const registerSchema = z.object({
    email: z.string().email().max(255),
    password: z.string().min(8).max(128),
    firstName: z.string().min(1).max(100),
    lastName: z.string().min(1).max(100),
    role: z.enum(['BUYER', 'SUPPLIER']).default('BUYER'),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

const refreshSchema = z.object({
    refreshToken: z.string().min(1),
});

// ──────────────────────────────────────
// Helpers
// ──────────────────────────────────────

function hashPassword(password: string, salt: string): string {
    return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
}

function generateSalt(): string {
    return crypto.randomBytes(16).toString('hex');
}

function signTokens(userId: string, email: string, role: string) {
    const accessToken = jwt.sign(
        { userId, email, role },
        config.jwtSecret,
        { expiresIn: config.jwtExpiresIn }
    );
    const refreshToken = jwt.sign(
        { userId, type: 'refresh' },
        config.jwtSecret,
        { expiresIn: config.jwtRefreshExpiresIn }
    );
    return { accessToken, refreshToken };
}

// ──────────────────────────────────────
// POST /api/auth/register
// ──────────────────────────────────────

router.post(
    '/register',
    validateRequest(registerSchema),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password, firstName, lastName, role } = req.body;

            // Check duplicate
            const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
            if (existing.rows.length > 0) {
                throw new AppError('An account with this email already exists', 409);
            }

            const salt = generateSalt();
            const hashedPassword = hashPassword(password, salt);

            const result = await pool.query(
                `INSERT INTO users (email, password_hash, password_salt, first_name, last_name, role, status)
                 VALUES ($1, $2, $3, $4, $5, $6, 'ACTIVE')
                 RETURNING id, email, role, first_name, last_name, created_at`,
                [email, hashedPassword, salt, firstName, lastName, role]
            );

            const user = result.rows[0];
            const tokens = signTokens(user.id, user.email, user.role);

            res.status(201).json({
                success: true,
                data: {
                    user: {
                        id: user.id,
                        email: user.email,
                        firstName: user.first_name,
                        lastName: user.last_name,
                        role: user.role,
                    },
                    ...tokens,
                },
            });
        } catch (error) {
            next(error);
        }
    }
);

// ──────────────────────────────────────
// POST /api/auth/login
// ──────────────────────────────────────

router.post(
    '/login',
    validateRequest(loginSchema),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body;

            const result = await pool.query(
                `SELECT id, email, role, password_hash, password_salt, first_name, last_name, status
                 FROM users WHERE email = $1`,
                [email]
            );

            if (result.rows.length === 0) {
                throw new AppError('Invalid email or password', 401);
            }

            const user = result.rows[0];

            if (user.status !== 'ACTIVE') {
                throw new AppError('Account is suspended or inactive', 403);
            }

            const hashed = hashPassword(password, user.password_salt);
            if (hashed !== user.password_hash) {
                throw new AppError('Invalid email or password', 401);
            }

            const tokens = signTokens(user.id, user.email, user.role);

            // Update last login
            await pool.query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [user.id]);

            res.json({
                success: true,
                data: {
                    user: {
                        id: user.id,
                        email: user.email,
                        firstName: user.first_name,
                        lastName: user.last_name,
                        role: user.role,
                    },
                    ...tokens,
                },
            });
        } catch (error) {
            next(error);
        }
    }
);

// ──────────────────────────────────────
// GET /api/auth/me
// ──────────────────────────────────────

router.get(
    '/me',
    authenticate,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user!.id;

            const result = await pool.query(
                `SELECT u.id, u.email, u.role, u.first_name, u.last_name, u.avatar_url,
                        u.created_at, u.last_login_at,
                        s.id as supplier_id, s.company_name, s.verification_level
                 FROM users u
                 LEFT JOIN suppliers s ON s.user_id = u.id
                 WHERE u.id = $1`,
                [userId]
            );

            if (result.rows.length === 0) {
                throw new AppError('User not found', 404);
            }

            const u = result.rows[0];

            res.json({
                success: true,
                data: {
                    id: u.id,
                    email: u.email,
                    firstName: u.first_name,
                    lastName: u.last_name,
                    role: u.role,
                    avatarUrl: u.avatar_url,
                    createdAt: u.created_at,
                    lastLoginAt: u.last_login_at,
                    supplier: u.supplier_id ? {
                        id: u.supplier_id,
                        companyName: u.company_name,
                        verificationLevel: u.verification_level,
                    } : null,
                },
            });
        } catch (error) {
            next(error);
        }
    }
);

// ──────────────────────────────────────
// POST /api/auth/refresh
// ──────────────────────────────────────

router.post(
    '/refresh',
    validateRequest(refreshSchema),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { refreshToken } = req.body;

            const decoded = jwt.verify(refreshToken, config.jwtSecret) as {
                userId: string;
                type: string;
            };

            if (decoded.type !== 'refresh') {
                throw new AppError('Invalid refresh token', 401);
            }

            const result = await pool.query(
                'SELECT id, email, role, status FROM users WHERE id = $1',
                [decoded.userId]
            );

            if (result.rows.length === 0) {
                throw new AppError('User not found', 401);
            }

            const user = result.rows[0];
            if (user.status !== 'ACTIVE') {
                throw new AppError('Account is suspended', 403);
            }

            const tokens = signTokens(user.id, user.email, user.role);

            res.json({ success: true, data: tokens });
        } catch (error) {
            if (error instanceof jwt.JsonWebTokenError) {
                next(new AppError('Invalid or expired refresh token', 401));
            } else {
                next(error);
            }
        }
    }
);

export { router as authRouter };
