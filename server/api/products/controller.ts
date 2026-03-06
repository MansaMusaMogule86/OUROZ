/**
 * OUROZ Products Controller
 */

import { Request, Response, NextFunction } from 'express';
import { pool } from '../../db/connection.js';
import { AppError } from '../../utils/errors.js';
import type { ListProductsQuery } from './schemas.js';

/**
 * GET /api/products
 */
export async function listProducts(req: Request, res: Response, next: NextFunction) {
    try {
        const { page, limit, category, search, sort, featured, minPrice, maxPrice } =
            req.query as unknown as ListProductsQuery;

        const offset = (page - 1) * limit;
        const conditions: string[] = ['p.is_active = TRUE'];
        const params: (string | number | boolean)[] = [];
        let paramIdx = 1;

        if (category) {
            conditions.push(`c.slug = $${paramIdx}`);
            params.push(category);
            paramIdx++;
        }
        if (search) {
            conditions.push(`(p.name ILIKE $${paramIdx} OR p.description ILIKE $${paramIdx})`);
            params.push(`%${search}%`);
            paramIdx++;
        }
        if (featured) {
            conditions.push(`p.is_featured = TRUE`);
        }
        if (minPrice !== undefined) {
            conditions.push(`p.price >= $${paramIdx}`);
            params.push(minPrice);
            paramIdx++;
        }
        if (maxPrice !== undefined) {
            conditions.push(`p.price <= $${paramIdx}`);
            params.push(maxPrice);
            paramIdx++;
        }

        const where = conditions.join(' AND ');

        const sortMap: Record<string, string> = {
            popular: 'p.total_orders DESC NULLS LAST',
            recent: 'p.created_at DESC',
            price_low: 'p.price ASC NULLS LAST',
            price_high: 'p.price DESC NULLS LAST',
            name: 'p.name ASC',
        };
        const orderBy = sortMap[sort] || 'p.created_at DESC';

        // Count
        const countRes = await pool.query(
            `SELECT COUNT(*) FROM products p LEFT JOIN categories c ON c.id = p.category_id WHERE ${where}`,
            params
        );
        const total = parseInt(countRes.rows[0].count);

        // Data
        const dataRes = await pool.query(
            `SELECT p.id, p.slug, p.name, p.description, p.price, p.compare_price,
                    p.image_urls, p.is_featured, p.created_at,
                    c.id as category_id, c.name as category_name, c.slug as category_slug,
                    b.id as brand_id, b.name as brand_name
             FROM products p
             LEFT JOIN categories c ON c.id = p.category_id
             LEFT JOIN brands b ON b.id = p.brand_id
             WHERE ${where}
             ORDER BY ${orderBy}
             LIMIT $${paramIdx} OFFSET $${paramIdx + 1}`,
            [...params, limit, offset]
        );

        res.json({
            success: true,
            data: {
                products: dataRes.rows,
                pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
            },
        });
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/products/:slug
 */
export async function getProductBySlug(req: Request, res: Response, next: NextFunction) {
    try {
        const { slug } = req.params;

        const result = await pool.query(
            `SELECT p.*, c.name as category_name, c.slug as category_slug,
                    b.name as brand_name, b.logo_url as brand_logo
             FROM products p
             LEFT JOIN categories c ON c.id = p.category_id
             LEFT JOIN brands b ON b.id = p.brand_id
             WHERE p.slug = $1 AND p.is_active = TRUE`,
            [slug]
        );

        if (result.rows.length === 0) {
            throw new AppError('Product not found', 404);
        }

        // Get variants
        const variants = await pool.query(
            `SELECT v.*, (SELECT json_agg(json_build_object('min_quantity', pt.min_quantity, 'price', pt.price, 'label', pt.label))
                          FROM price_tiers pt WHERE pt.variant_id = v.id) as price_tiers
             FROM product_variants v WHERE v.product_id = $1 AND v.is_active = TRUE
             ORDER BY v.sort_order`,
            [result.rows[0].id]
        );

        res.json({
            success: true,
            data: {
                ...result.rows[0],
                variants: variants.rows,
            },
        });
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/products/featured
 */
export async function getFeaturedProducts(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await pool.query(
            `SELECT p.id, p.slug, p.name, p.price, p.compare_price, p.image_urls, p.is_featured,
                    c.name as category_name
             FROM products p
             LEFT JOIN categories c ON c.id = p.category_id
             WHERE p.is_active = TRUE AND p.is_featured = TRUE
             ORDER BY p.created_at DESC
             LIMIT 12`
        );

        res.json({ success: true, data: result.rows });
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/categories
 */
export async function listCategories(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await pool.query(
            `SELECT id, slug, name, name_ar, name_fr, icon, image_url, parent_id, sort_order
             FROM categories WHERE is_active = TRUE ORDER BY sort_order ASC, name ASC`
        );
        res.json({ success: true, data: result.rows });
    } catch (error) {
        next(error);
    }
}
