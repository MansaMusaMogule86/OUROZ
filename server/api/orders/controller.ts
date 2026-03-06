/**
 * OUROZ Orders Controller
 */

import { Request, Response, NextFunction } from 'express';
import { pool } from '../../db/connection.js';
import { AppError } from '../../utils/errors.js';
import type { CreateOrderBody, UpdateOrderStatusBody, ListOrdersQuery } from './schemas.js';
import crypto from 'crypto';

/**
 * POST /api/orders — Create a new order
 */
export async function createOrder(req: Request, res: Response, next: NextFunction) {
    const client = await pool.connect();
    try {
        const userId = req.user!.id;
        const body = req.body as CreateOrderBody;

        await client.query('BEGIN');

        // Validate and price each item
        let subtotal = 0;
        const orderItems: Array<{
            variantId: string;
            quantity: number;
            priceAtPurchase: number;
            productName: string;
            variantSku: string;
            variantLabel: string | null;
            productImageUrl: string | null;
        }> = [];

        for (const item of body.items) {
            const variantRes = await client.query(
                `SELECT v.id, v.sku, v.retail_price, v.stock_quantity, v.weight AS weight_label,
                        p.name as product_name, p.image_urls
                 FROM product_variants v
                 JOIN products p ON p.id = v.product_id
                 WHERE v.id = $1 AND v.is_active = TRUE AND p.is_active = TRUE`,
                [item.variantId]
            );

            if (variantRes.rows.length === 0) {
                throw new AppError(`Variant ${item.variantId} not found or inactive`, 400);
            }

            const variant = variantRes.rows[0];
            if (variant.stock_quantity < item.quantity) {
                throw new AppError(`Insufficient stock for ${variant.product_name} (${variant.sku})`, 400);
            }

            const price = parseFloat(variant.retail_price);
            subtotal += price * item.quantity;

            orderItems.push({
                variantId: item.variantId,
                quantity: item.quantity,
                priceAtPurchase: price,
                productName: variant.product_name,
                variantSku: variant.sku,
                variantLabel: variant.weight_label,
                productImageUrl: variant.image_urls?.[0] ?? null,
            });

            // Decrement stock
            await client.query(
                'UPDATE product_variants SET stock_quantity = stock_quantity - $1 WHERE id = $2',
                [item.quantity, item.variantId]
            );
        }

        const shippingCost = subtotal >= 200 ? 0 : 15; // Free shipping over 200
        const vatRate = 0.05; // 5% UAE VAT
        const vatAmount = (subtotal + shippingCost) * vatRate;
        const total = subtotal + shippingCost + vatAmount;

        const orderNumber = `ORZ-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;

        // Insert order
        const orderRes = await client.query(
            `INSERT INTO orders (user_id, order_number, subtotal, shipping_cost, vat_amount, total,
                                 currency, is_wholesale, status, shipping_name, shipping_phone,
                                 shipping_address, shipping_emirate, notes)
             VALUES ($1, $2, $3, $4, $5, $6, 'AED', $7, 'pending', $8, $9, $10, $11, $12)
             RETURNING id, order_number, total, status, created_at`,
            [userId, orderNumber, subtotal, shippingCost, vatAmount, total,
                body.isWholesale, body.shippingName, body.shippingPhone,
                body.shippingAddress, body.shippingEmirate ?? null, body.notes ?? null]
        );

        const order = orderRes.rows[0];

        // Insert order items
        for (const item of orderItems) {
            await client.query(
                `INSERT INTO order_items (order_id, variant_id, product_name, variant_sku, variant_label,
                                          product_image_url, price_at_purchase, quantity, line_total)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                [order.id, item.variantId, item.productName, item.variantSku, item.variantLabel,
                item.productImageUrl, item.priceAtPurchase, item.quantity,
                item.priceAtPurchase * item.quantity]
            );
        }

        await client.query('COMMIT');

        res.status(201).json({
            success: true,
            data: {
                id: order.id,
                orderNumber: order.order_number,
                total: parseFloat(order.total),
                status: order.status,
                createdAt: order.created_at,
            },
        });
    } catch (error) {
        await client.query('ROLLBACK');
        next(error);
    } finally {
        client.release();
    }
}

/**
 * GET /api/orders — List user's orders
 */
export async function listOrders(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.user!.id;
        const { page, limit, status } = req.query as unknown as ListOrdersQuery;
        const offset = (page - 1) * limit;

        const conditions = ['o.user_id = $1'];
        const params: (string | number)[] = [userId];
        let paramIdx = 2;

        if (status) {
            conditions.push(`o.status = $${paramIdx}`);
            params.push(status);
            paramIdx++;
        }

        const where = conditions.join(' AND ');

        const countRes = await pool.query(`SELECT COUNT(*) FROM orders o WHERE ${where}`, params);
        const total = parseInt(countRes.rows[0].count);

        const result = await pool.query(
            `SELECT o.id, o.order_number, o.subtotal, o.shipping_cost, o.vat_amount, o.total,
                    o.currency, o.is_wholesale, o.status, o.shipping_name, o.created_at, o.updated_at,
                    (SELECT json_agg(json_build_object(
                        'id', oi.id, 'product_name', oi.product_name, 'variant_sku', oi.variant_sku,
                        'product_image_url', oi.product_image_url, 'price_at_purchase', oi.price_at_purchase,
                        'quantity', oi.quantity, 'line_total', oi.line_total
                    )) FROM order_items oi WHERE oi.order_id = o.id) as items
             FROM orders o
             WHERE ${where}
             ORDER BY o.created_at DESC
             LIMIT $${paramIdx} OFFSET $${paramIdx + 1}`,
            [...params, limit, offset]
        );

        res.json({
            success: true,
            data: {
                orders: result.rows,
                pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
            },
        });
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/orders/:id — Single order detail
 */
export async function getOrder(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.user!.id;
        const { id } = req.params;

        const result = await pool.query(
            `SELECT o.*,
                    (SELECT json_agg(json_build_object(
                        'id', oi.id, 'product_name', oi.product_name, 'variant_sku', oi.variant_sku,
                        'variant_label', oi.variant_label, 'product_image_url', oi.product_image_url,
                        'price_at_purchase', oi.price_at_purchase, 'quantity', oi.quantity,
                        'line_total', oi.line_total
                    )) FROM order_items oi WHERE oi.order_id = o.id) as items
             FROM orders o
             WHERE o.id = $1 AND o.user_id = $2`,
            [id, userId]
        );

        if (result.rows.length === 0) {
            throw new AppError('Order not found', 404);
        }

        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        next(error);
    }
}

/**
 * PUT /api/orders/:id/status — Update order status (admin)
 */
export async function updateOrderStatus(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const body = req.body as UpdateOrderStatusBody;

        const result = await pool.query(
            `UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING id, status`,
            [body.status, id]
        );

        if (result.rows.length === 0) {
            throw new AppError('Order not found', 404);
        }

        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        next(error);
    }
}

/**
 * POST /api/orders/:id/cancel — Cancel an order
 */
export async function cancelOrder(req: Request, res: Response, next: NextFunction) {
    const client = await pool.connect();
    try {
        const userId = req.user!.id;
        const { id } = req.params;

        await client.query('BEGIN');

        const orderRes = await client.query(
            `SELECT id, status FROM orders WHERE id = $1 AND user_id = $2`,
            [id, userId]
        );

        if (orderRes.rows.length === 0) {
            throw new AppError('Order not found', 404);
        }

        if (!['pending', 'confirmed'].includes(orderRes.rows[0].status)) {
            throw new AppError('Order cannot be cancelled in its current status', 400);
        }

        // Restore stock
        const items = await client.query(
            'SELECT variant_id, quantity FROM order_items WHERE order_id = $1',
            [id]
        );
        for (const item of items.rows) {
            await client.query(
                'UPDATE product_variants SET stock_quantity = stock_quantity + $1 WHERE id = $2',
                [item.quantity, item.variant_id]
            );
        }

        await client.query(
            `UPDATE orders SET status = 'cancelled', updated_at = NOW() WHERE id = $1`,
            [id]
        );

        await client.query('COMMIT');
        res.json({ success: true, message: 'Order cancelled' });
    } catch (error) {
        await client.query('ROLLBACK');
        next(error);
    } finally {
        client.release();
    }
}
