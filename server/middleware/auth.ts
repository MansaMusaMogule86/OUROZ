/**
 * OUROZ Authentication & Authorization Middleware
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { pool } from '../db/connection';
import { AppError } from '../utils/errors';

// ============================================
// TYPE DEFINITIONS
// ============================================

export type UserRole = 'BUYER' | 'SUPPLIER' | 'ADMIN' | 'SUPER_ADMIN';

export interface AuthUser {
    id: string;
    email: string;
    role: UserRole;
    supplierId?: string; // Only for SUPPLIER role
}

declare global {
    namespace Express {
        interface Request {
            user?: AuthUser;
        }
    }
}

// ============================================
// MIDDLEWARE: authenticate
// Verifies JWT token and attaches user to request
// ============================================

export async function authenticate(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AppError('Authentication required', 401);
        }

        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
            userId: string;
            email: string;
            role: UserRole;
        };

        // Get user from database
        const result = await pool.query(
            `SELECT u.id, u.email, u.role, u.status, s.id as supplier_id
             FROM users u
             LEFT JOIN suppliers s ON s.user_id = u.id
             WHERE u.id = $1`,
            [decoded.userId]
        );

        if (result.rows.length === 0) {
            throw new AppError('User not found', 401);
        }

        const user = result.rows[0];

        if (user.status !== 'ACTIVE') {
            throw new AppError('Account is not active', 403);
        }

        req.user = {
            id: user.id,
            email: user.email,
            role: user.role,
            supplierId: user.supplier_id,
        };

        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            next(new AppError('Invalid token', 401));
        } else {
            next(error);
        }
    }
}

// ============================================
// MIDDLEWARE: optionalAuth
// Same as authenticate but doesn't fail if no token
// ============================================

export async function optionalAuth(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next();
        }

        const token = authHeader.substring(7);
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
            userId: string;
            email: string;
            role: UserRole;
        };

        const result = await pool.query(
            `SELECT u.id, u.email, u.role, s.id as supplier_id
             FROM users u
             LEFT JOIN suppliers s ON s.user_id = u.id
             WHERE u.id = $1 AND u.status = 'ACTIVE'`,
            [decoded.userId]
        );

        if (result.rows.length > 0) {
            const user = result.rows[0];
            req.user = {
                id: user.id,
                email: user.email,
                role: user.role,
                supplierId: user.supplier_id,
            };
        }

        next();
    } catch {
        // Token invalid, continue without auth
        next();
    }
}

// ============================================
// MIDDLEWARE: authorize
// Checks if user has required role
// ============================================

export function authorize(allowedRoles: UserRole[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return next(new AppError('Authentication required', 401));
        }

        if (!allowedRoles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action', 403));
        }

        next();
    };
}

// ============================================
// PERMISSION MATRIX
// ============================================

/**
 * SUPPLIER PROFILE PERMISSIONS:
 *
 * ┌─────────────────────────────────────┬─────────┬──────────┬─────────┬───────────────┐
 * │ Action                              │ Buyer   │ Supplier │ Admin   │ Notes         │
 * ├─────────────────────────────────────┼─────────┼──────────┼─────────┼───────────────┤
 * │ READ profile (public)              │ ✓       │ ✓        │ ✓       │ No auth req   │
 * │ READ products                       │ ✓       │ ✓        │ ✓       │ No auth req   │
 * │ READ reviews                        │ ✓       │ ✓        │ ✓       │ No auth req   │
 * │ READ gallery                        │ ✓       │ ✓        │ ✓       │ No auth req   │
 * ├─────────────────────────────────────┼─────────┼──────────┼─────────┼───────────────┤
 * │ WRITE review                        │ ✓       │ ✗        │ ✗       │ 1 per buyer   │
 * │ WRITE favorite                      │ ✓       │ ✗        │ ✗       │               │
 * │ WRITE report                        │ ✓       │ ✓        │ ✗       │ Rate limited  │
 * ├─────────────────────────────────────┼─────────┼──────────┼─────────┼───────────────┤
 * │ UPDATE own profile                  │ ✗       │ ✓ *      │ ✗       │ *Owner only   │
 * │ UPDATE own contact                  │ ✗       │ ✓ *      │ ✗       │ *Owner only   │
 * │ UPDATE own gallery                  │ ✗       │ ✓ *      │ ✗       │ *Owner only   │
 * │ UPDATE own certifications           │ ✗       │ ✓ *      │ ✗       │ *Owner only   │
 * │ UPDATE review response              │ ✗       │ ✓ *      │ ✗       │ *Owner only   │
 * ├─────────────────────────────────────┼─────────┼──────────┼─────────┼───────────────┤
 * │ UPDATE verification level           │ ✗       │ ✗        │ ✓       │               │
 * │ UPDATE supplier status              │ ✗       │ ✗        │ ✓       │               │
 * │ UPDATE certification verification   │ ✗       │ ✗        │ ✓       │               │
 * ├─────────────────────────────────────┼─────────┼──────────┼─────────┼───────────────┤
 * │ DELETE own gallery item             │ ✗       │ ✓ *      │ ✗       │ *Owner only   │
 * │ DELETE own certification            │ ✗       │ ✓ *      │ ✗       │ *Owner only   │
 * │ DELETE favorite                     │ ✓ *     │ ✗        │ ✗       │ *Own only     │
 * │ DELETE any supplier (soft)          │ ✗       │ ✗        │ ✓       │ SUPER_ADMIN   │
 * └─────────────────────────────────────┴─────────┴──────────┴─────────┴───────────────┘
 *
 * NOTES:
 * - "Owner only" means the supplier can only modify their own profile
 * - Buyers can only create 1 review per supplier
 * - Reports are rate-limited to 1 per 24 hours per user per supplier
 * - Gallery limited to 20 items per supplier
 * - Trade Assurance and verification levels can only be set by Admins
 */
