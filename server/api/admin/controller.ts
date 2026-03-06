/**
 * OUROZ Admin Controller
 */

import { Request, Response, NextFunction } from 'express';
import { pool } from '../../db/connection.js';
import { AppError } from '../../utils/errors.js';

/**
 * GET /api/admin/dashboard — Dashboard metrics
 */
export async function getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
        const [users, suppliers, products, orders, rfqs, revenue] = await Promise.all([
            pool.query(`SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '30 days') as new_30d FROM users`),
            pool.query(`SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE status = 'ACTIVE') as active, COUNT(*) FILTER (WHERE verification_level = 'UNVERIFIED') as unverified FROM suppliers`),
            pool.query(`SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE is_active = TRUE) as active FROM products`),
            pool.query(`SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE status = 'pending') as pending, SUM(total) as revenue FROM orders`),
            pool.query(`SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE status = 'OPEN') as open FROM rfqs`),
            pool.query(`SELECT COALESCE(SUM(total), 0) as total_revenue, COALESCE(SUM(total) FILTER (WHERE created_at > NOW() - INTERVAL '30 days'), 0) as revenue_30d FROM orders WHERE status != 'cancelled'`),
        ]);

        res.json({
            success: true,
            data: {
                users: { total: parseInt(users.rows[0].total), new30d: parseInt(users.rows[0].new_30d) },
                suppliers: { total: parseInt(suppliers.rows[0].total), active: parseInt(suppliers.rows[0].active), unverified: parseInt(suppliers.rows[0].unverified) },
                products: { total: parseInt(products.rows[0].total), active: parseInt(products.rows[0].active) },
                orders: { total: parseInt(orders.rows[0].total), pending: parseInt(orders.rows[0].pending) },
                rfqs: { total: parseInt(rfqs.rows[0].total), open: parseInt(rfqs.rows[0].open) },
                revenue: { total: parseFloat(revenue.rows[0].total_revenue) || 0, last30d: parseFloat(revenue.rows[0].revenue_30d) || 0 },
            },
        });
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/admin/users — List all users
 */
export async function listUsers(req: Request, res: Response, next: NextFunction) {
    try {
        const { page = 1, limit = 50, role, status, search } = req.query;
        const offset = (Number(page) - 1) * Number(limit);

        const conditions: string[] = [];
        const params: (string | number)[] = [];
        let idx = 1;

        if (role) { conditions.push(`u.role = $${idx}`); params.push(String(role)); idx++; }
        if (status) { conditions.push(`u.status = $${idx}`); params.push(String(status)); idx++; }
        if (search) { conditions.push(`(u.email ILIKE $${idx} OR u.first_name ILIKE $${idx} OR u.last_name ILIKE $${idx})`); params.push(`%${search}%`); idx++; }

        const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

        const countRes = await pool.query(`SELECT COUNT(*) FROM users u ${where}`, params);
        const total = parseInt(countRes.rows[0].count);

        const result = await pool.query(
            `SELECT u.id, u.email, u.first_name, u.last_name, u.role, u.status, u.created_at, u.last_login_at
             FROM users u ${where}
             ORDER BY u.created_at DESC
             LIMIT $${idx} OFFSET $${idx + 1}`,
            [...params, Number(limit), offset]
        );

        res.json({
            success: true,
            data: { users: result.rows, pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) } },
        });
    } catch (error) {
        next(error);
    }
}

/**
 * PUT /api/admin/users/:id/status — Update user status
 */
export async function updateUserStatus(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const { status, reason } = req.body;

        if (!['ACTIVE', 'SUSPENDED', 'BANNED'].includes(status)) {
            throw new AppError('Invalid status', 400);
        }

        await pool.query('UPDATE users SET status = $1, updated_at = NOW() WHERE id = $2', [status, id]);

        // Audit log
        await pool.query(
            `INSERT INTO admin_audit_log (admin_id, action, target_type, target_id, details)
             VALUES ($1, 'UPDATE_USER_STATUS', 'USER', $2, $3)`,
            [req.user!.id, id, JSON.stringify({ status, reason })]
        ).catch(() => { }); // Best-effort logging

        res.json({ success: true });
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/admin/suppliers — List suppliers for verification
 */
export async function listSuppliersForVerification(req: Request, res: Response, next: NextFunction) {
    try {
        const { page = 1, limit = 50, verificationLevel } = req.query;
        const offset = (Number(page) - 1) * Number(limit);

        const conditions: string[] = [];
        const params: (string | number)[] = [];
        let idx = 1;

        if (verificationLevel) {
            conditions.push(`s.verification_level = $${idx}`);
            params.push(String(verificationLevel));
            idx++;
        }

        const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

        const result = await pool.query(
            `SELECT s.id, s.company_name, s.verification_level, s.status, s.region, s.city,
                    s.has_export_license, s.created_at,
                    u.email, u.first_name, u.last_name,
                    (SELECT COUNT(*) FROM supplier_products WHERE supplier_id = s.id) as product_count
             FROM suppliers s
             JOIN users u ON u.id = s.user_id
             ${where}
             ORDER BY s.created_at DESC
             LIMIT $${idx} OFFSET $${idx + 1}`,
            [...params, Number(limit), offset]
        );

        res.json({ success: true, data: result.rows });
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/admin/orders — All orders
 */
export async function listAllOrders(req: Request, res: Response, next: NextFunction) {
    try {
        const { page = 1, limit = 50, status } = req.query;
        const offset = (Number(page) - 1) * Number(limit);

        const conditions: string[] = [];
        const params: (string | number)[] = [];
        let idx = 1;

        if (status) { conditions.push(`o.status = $${idx}`); params.push(String(status)); idx++; }

        const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

        const countRes = await pool.query(`SELECT COUNT(*) FROM orders o ${where}`, params);
        const total = parseInt(countRes.rows[0].count);

        const result = await pool.query(
            `SELECT o.id, o.order_number, o.total, o.currency, o.status, o.is_wholesale,
                    o.shipping_name, o.created_at,
                    u.email, u.first_name, u.last_name
             FROM orders o
             JOIN users u ON u.id = o.user_id
             ${where}
             ORDER BY o.created_at DESC
             LIMIT $${idx} OFFSET $${idx + 1}`,
            [...params, Number(limit), offset]
        );

        res.json({
            success: true,
            data: { orders: result.rows, pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) } },
        });
    } catch (error) {
        next(error);
    }
}
