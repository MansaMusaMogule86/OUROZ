/**
 * OUROZ Error Handling Utilities
 * Centralized error classes and handlers for edge cases
 */

// ============================================
// CUSTOM ERROR CLASS
// ============================================

export class AppError extends Error {
    public statusCode: number;
    public isOperational: boolean;
    public code?: string;

    constructor(message: string, statusCode: number = 500, code?: string) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        this.code = code;

        Error.captureStackTrace(this, this.constructor);
    }
}

// ============================================
// COMMON ERRORS
// ============================================

export const Errors = {
    // 400 Bad Request
    VALIDATION_ERROR: (details: string) => new AppError(`Validation failed: ${details}`, 400, 'VALIDATION_ERROR'),
    INVALID_INPUT: (field: string) => new AppError(`Invalid input for field: ${field}`, 400, 'INVALID_INPUT'),
    DUPLICATE_ENTRY: (field: string) => new AppError(`${field} already exists`, 400, 'DUPLICATE_ENTRY'),
    REVIEW_EXISTS: () => new AppError('You have already reviewed this supplier', 400, 'REVIEW_EXISTS'),
    REPORT_RATE_LIMITED: () => new AppError('You have already reported this supplier recently', 400, 'REPORT_RATE_LIMITED'),
    GALLERY_LIMIT: () => new AppError('Maximum 20 gallery items allowed', 400, 'GALLERY_LIMIT'),

    // 401 Unauthorized
    AUTH_REQUIRED: () => new AppError('Authentication required', 401, 'AUTH_REQUIRED'),
    INVALID_TOKEN: () => new AppError('Invalid or expired token', 401, 'INVALID_TOKEN'),
    TOKEN_EXPIRED: () => new AppError('Token has expired', 401, 'TOKEN_EXPIRED'),

    // 403 Forbidden
    FORBIDDEN: () => new AppError('You do not have permission to perform this action', 403, 'FORBIDDEN'),
    NOT_OWNER: () => new AppError('You can only modify your own resources', 403, 'NOT_OWNER'),
    ACCOUNT_SUSPENDED: () => new AppError('Your account has been suspended', 403, 'ACCOUNT_SUSPENDED'),

    // 404 Not Found
    NOT_FOUND: (resource: string) => new AppError(`${resource} not found`, 404, 'NOT_FOUND'),
    SUPPLIER_NOT_FOUND: () => new AppError('Supplier not found', 404, 'SUPPLIER_NOT_FOUND'),
    PRODUCT_NOT_FOUND: () => new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND'),
    REVIEW_NOT_FOUND: () => new AppError('Review not found', 404, 'REVIEW_NOT_FOUND'),

    // 429 Too Many Requests
    RATE_LIMITED: () => new AppError('Too many requests, please try again later', 429, 'RATE_LIMITED'),

    // 500 Server Error
    INTERNAL: () => new AppError('Internal server error', 500, 'INTERNAL_ERROR'),
    DATABASE: () => new AppError('Database error occurred', 500, 'DATABASE_ERROR'),
};

// ============================================
// ERROR HANDLER MIDDLEWARE
// ============================================

import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: Error | AppError, req: Request, res: Response, next: NextFunction) {
    // Default values
    let statusCode = 500;
    let message = 'Internal server error';
    let code = 'INTERNAL_ERROR';

    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
        code = err.code || 'ERROR';
    }

    // Log error (only server errors in production)
    if (statusCode >= 500) {
        console.error('[ERROR]', {
            timestamp: new Date().toISOString(),
            path: req.path,
            method: req.method,
            statusCode,
            message: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        });
    }

    // Send response
    res.status(statusCode).json({
        success: false,
        error: {
            code,
            message,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
        },
    });
}
