/**
 * OUROZ RFQ Controller
 */

import { Request, Response, NextFunction } from 'express';
import { pool } from '../../db/connection.js';
import { AppError } from '../../utils/errors.js';
import type { CreateRfqBody, SubmitQuoteBody, ListRfqQuery } from './schemas.js';

/**
 * POST /api/rfq — Create new RFQ (buyer)
 */
export async function createRfq(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.user!.id;
        const body = req.body as CreateRfqBody;

        const result = await pool.query(
            `INSERT INTO rfqs (buyer_id, title, description, category_id, quantity, unit,
                               target_price, currency, incoterms, delivery_deadline,
                               specifications, attachments, status)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'OPEN')
             RETURNING id, title, status, created_at`,
            [userId, body.title, body.description, body.categoryId ?? null,
                body.quantity, body.unit, body.targetPrice ?? null, body.currency,
                body.incoterms ?? null, body.deliveryDeadline ?? null,
                body.specifications ?? null, JSON.stringify(body.attachments ?? [])]
        );

        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/rfq — List RFQs
 */
export async function listRfqs(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.user!.id;
        const userRole = req.user!.role;
        const { page, limit, status } = req.query as unknown as ListRfqQuery;
        const offset = (page - 1) * limit;

        const conditions: string[] = [];
        const params: (string | number)[] = [];
        let paramIdx = 1;

        // Buyers see their own RFQs, suppliers see all OPEN ones
        if (userRole === 'SUPPLIER') {
            conditions.push(`r.status = 'OPEN'`);
        } else {
            conditions.push(`r.buyer_id = $${paramIdx}`);
            params.push(userId);
            paramIdx++;
        }

        if (status) {
            conditions.push(`r.status = $${paramIdx}`);
            params.push(status);
            paramIdx++;
        }

        const where = conditions.length > 0 ? conditions.join(' AND ') : '1=1';

        const countRes = await pool.query(`SELECT COUNT(*) FROM rfqs r WHERE ${where}`, params);
        const total = parseInt(countRes.rows[0].count);

        const result = await pool.query(
            `SELECT r.id, r.title, r.description, r.quantity, r.unit, r.target_price,
                    r.currency, r.incoterms, r.status, r.created_at, r.delivery_deadline,
                    u.first_name || ' ' || LEFT(u.last_name, 1) || '.' as buyer_name,
                    c.name as category_name,
                    (SELECT COUNT(*) FROM rfq_quotes q WHERE q.rfq_id = r.id) as quote_count
             FROM rfqs r
             JOIN users u ON u.id = r.buyer_id
             LEFT JOIN categories c ON c.id = r.category_id
             WHERE ${where}
             ORDER BY r.created_at DESC
             LIMIT $${paramIdx} OFFSET $${paramIdx + 1}`,
            [...params, limit, offset]
        );

        res.json({
            success: true,
            data: {
                rfqs: result.rows,
                pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
            },
        });
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/rfq/:id — RFQ detail with quotes
 */
export async function getRfqDetail(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;

        const rfqRes = await pool.query(
            `SELECT r.*,
                    u.first_name || ' ' || LEFT(u.last_name, 1) || '.' as buyer_name,
                    c.name as category_name
             FROM rfqs r
             JOIN users u ON u.id = r.buyer_id
             LEFT JOIN categories c ON c.id = r.category_id
             WHERE r.id = $1`,
            [id]
        );

        if (rfqRes.rows.length === 0) {
            throw new AppError('RFQ not found', 404);
        }

        // Fetch quotes
        const quotesRes = await pool.query(
            `SELECT q.id, q.unit_price, q.currency, q.moq, q.lead_time_days,
                    q.valid_until, q.notes, q.incoterms, q.status, q.created_at,
                    s.company_name as supplier_name, s.id as supplier_id,
                    s.verification_level
             FROM rfq_quotes q
             JOIN suppliers s ON s.id = q.supplier_id
             WHERE q.rfq_id = $1
             ORDER BY q.created_at DESC`,
            [id]
        );

        res.json({
            success: true,
            data: {
                ...rfqRes.rows[0],
                quotes: quotesRes.rows,
            },
        });
    } catch (error) {
        next(error);
    }
}

/**
 * POST /api/rfq/:id/quotes — Submit a quote (supplier)
 */
export async function submitQuote(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params;
        const supplierId = req.user!.supplierId;
        const body = req.body as SubmitQuoteBody;

        if (!supplierId) {
            throw new AppError('Only suppliers can submit quotes', 403);
        }

        // Check RFQ is open
        const rfqRes = await pool.query('SELECT status FROM rfqs WHERE id = $1', [id]);
        if (rfqRes.rows.length === 0) throw new AppError('RFQ not found', 404);
        if (rfqRes.rows[0].status !== 'OPEN') throw new AppError('RFQ is not accepting quotes', 400);

        // Check for duplicate quote
        const existing = await pool.query(
            'SELECT id FROM rfq_quotes WHERE rfq_id = $1 AND supplier_id = $2',
            [id, supplierId]
        );
        if (existing.rows.length > 0) {
            throw new AppError('You have already submitted a quote for this RFQ', 400);
        }

        const result = await pool.query(
            `INSERT INTO rfq_quotes (rfq_id, supplier_id, unit_price, currency, moq,
                                     lead_time_days, valid_until, notes, incoterms, status)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'SUBMITTED')
             RETURNING id, created_at`,
            [id, supplierId, body.unitPrice, body.currency, body.moq,
                body.leadTimeDays, body.validUntil, body.notes ?? null, body.incoterms ?? null]
        );

        // Update RFQ status to QUOTED if first quote
        await pool.query(
            `UPDATE rfqs SET status = 'QUOTED', updated_at = NOW() WHERE id = $1 AND status = 'OPEN'`,
            [id]
        );

        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
        next(error);
    }
}

/**
 * POST /api/rfq/:id/quotes/:quoteId/accept — Accept a quote (buyer)
 */
export async function acceptQuote(req: Request, res: Response, next: NextFunction) {
    const client = await pool.connect();
    try {
        const userId = req.user!.id;
        const { id, quoteId } = req.params;

        await client.query('BEGIN');

        // Verify ownership
        const rfqRes = await client.query('SELECT buyer_id FROM rfqs WHERE id = $1', [id]);
        if (rfqRes.rows.length === 0) throw new AppError('RFQ not found', 404);
        if (rfqRes.rows[0].buyer_id !== userId) throw new AppError('Not your RFQ', 403);

        // Accept the chosen quote
        await client.query(
            `UPDATE rfq_quotes SET status = 'ACCEPTED', updated_at = NOW() WHERE id = $1 AND rfq_id = $2`,
            [quoteId, id]
        );

        // Reject all other quotes
        await client.query(
            `UPDATE rfq_quotes SET status = 'REJECTED', updated_at = NOW() WHERE rfq_id = $1 AND id != $2`,
            [id, quoteId]
        );

        // Close the RFQ
        await client.query(
            `UPDATE rfqs SET status = 'CLOSED', updated_at = NOW() WHERE id = $1`,
            [id]
        );

        await client.query('COMMIT');
        res.json({ success: true, message: 'Quote accepted' });
    } catch (error) {
        await client.query('ROLLBACK');
        next(error);
    } finally {
        client.release();
    }
}

/**
 * POST /api/rfq/:id/close — Close an RFQ (buyer)
 */
export async function closeRfq(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.user!.id;
        const { id } = req.params;

        const result = await pool.query(
            `UPDATE rfqs SET status = 'CLOSED', updated_at = NOW()
             WHERE id = $1 AND buyer_id = $2 RETURNING id, status`,
            [id, userId]
        );

        if (result.rows.length === 0) {
            throw new AppError('RFQ not found or not yours', 404);
        }

        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        next(error);
    }
}
