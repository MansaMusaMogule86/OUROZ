/**
 * OUROZ Messaging Controller
 */

import { Request, Response, NextFunction } from 'express';
import { pool } from '../../db/connection.js';
import { AppError } from '../../utils/errors.js';

/**
 * GET /api/messages/conversations — List user's conversations
 */
export async function listConversations(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.user!.id;

        const result = await pool.query(
            `SELECT c.id, c.subject, c.context_type, c.context_id, c.created_at, c.updated_at,
                    (SELECT json_build_object('text', m.text, 'created_at', m.created_at, 'sender_id', m.sender_id)
                     FROM messages m WHERE m.conversation_id = c.id ORDER BY m.created_at DESC LIMIT 1) as last_message,
                    (SELECT COUNT(*) FROM messages m WHERE m.conversation_id = c.id AND m.sender_id != $1 AND m.read_at IS NULL) as unread_count,
                    CASE
                        WHEN c.buyer_id = $1 THEN json_build_object('id', s.id, 'name', s.company_name)
                        ELSE json_build_object('id', u.id, 'name', u.first_name || ' ' || u.last_name)
                    END as other_party
             FROM conversations c
             LEFT JOIN suppliers s ON s.user_id = c.supplier_user_id
             LEFT JOIN users u ON u.id = c.buyer_id
             WHERE c.buyer_id = $1 OR c.supplier_user_id = $1
             ORDER BY c.updated_at DESC`,
            [userId]
        );

        res.json({ success: true, data: result.rows });
    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/messages/conversations/:id — Get messages in a conversation
 */
export async function getConversation(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.user!.id;
        const { id } = req.params;

        // Verify user is part of conversation
        const convRes = await pool.query(
            `SELECT * FROM conversations WHERE id = $1 AND (buyer_id = $2 OR supplier_user_id = $2)`,
            [id, userId]
        );
        if (convRes.rows.length === 0) throw new AppError('Conversation not found', 404);

        const messages = await pool.query(
            `SELECT m.id, m.text, m.sender_id, m.attachments, m.read_at, m.created_at,
                    u.first_name || ' ' || LEFT(u.last_name, 1) || '.' as sender_name
             FROM messages m
             JOIN users u ON u.id = m.sender_id
             WHERE m.conversation_id = $1
             ORDER BY m.created_at ASC`,
            [id]
        );

        // Mark as read
        await pool.query(
            `UPDATE messages SET read_at = NOW() WHERE conversation_id = $1 AND sender_id != $2 AND read_at IS NULL`,
            [id, userId]
        );

        res.json({
            success: true,
            data: {
                conversation: convRes.rows[0],
                messages: messages.rows,
            },
        });
    } catch (error) {
        next(error);
    }
}

/**
 * POST /api/messages/conversations/:id/send — Send a message
 */
export async function sendMessage(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.user!.id;
        const { id } = req.params;
        const { text, attachments } = req.body;

        if (!text || typeof text !== 'string' || text.trim().length === 0) {
            throw new AppError('Message text is required', 400);
        }

        // Verify user is part of conversation
        const convRes = await pool.query(
            `SELECT id FROM conversations WHERE id = $1 AND (buyer_id = $2 OR supplier_user_id = $2)`,
            [id, userId]
        );
        if (convRes.rows.length === 0) throw new AppError('Conversation not found', 404);

        const result = await pool.query(
            `INSERT INTO messages (conversation_id, sender_id, text, attachments)
             VALUES ($1, $2, $3, $4)
             RETURNING id, text, sender_id, created_at`,
            [id, userId, text.trim(), JSON.stringify(attachments ?? [])]
        );

        // Update conversation timestamp
        await pool.query('UPDATE conversations SET updated_at = NOW() WHERE id = $1', [id]);

        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
        next(error);
    }
}

/**
 * POST /api/messages/start — Start a new conversation
 */
export async function startConversation(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.user!.id;
        const { recipientUserId, subject, contextType, contextId, initialMessage } = req.body;

        if (!recipientUserId || !initialMessage) {
            throw new AppError('recipientUserId and initialMessage are required', 400);
        }

        // Check for existing conversation in same context
        if (contextType && contextId) {
            const existing = await pool.query(
                `SELECT id FROM conversations
                 WHERE context_type = $1 AND context_id = $2
                 AND ((buyer_id = $3 AND supplier_user_id = $4) OR (buyer_id = $4 AND supplier_user_id = $3))`,
                [contextType, contextId, userId, recipientUserId]
            );
            if (existing.rows.length > 0) {
                // Send to existing conversation
                await pool.query(
                    `INSERT INTO messages (conversation_id, sender_id, text) VALUES ($1, $2, $3)`,
                    [existing.rows[0].id, userId, initialMessage]
                );
                await pool.query('UPDATE conversations SET updated_at = NOW() WHERE id = $1', [existing.rows[0].id]);
                return res.json({ success: true, data: { conversationId: existing.rows[0].id, isExisting: true } });
            }
        }

        // Create new conversation
        const convRes = await pool.query(
            `INSERT INTO conversations (buyer_id, supplier_user_id, subject, context_type, context_id)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id`,
            [userId, recipientUserId, subject ?? null, contextType ?? null, contextId ?? null]
        );

        // Send initial message
        await pool.query(
            `INSERT INTO messages (conversation_id, sender_id, text) VALUES ($1, $2, $3)`,
            [convRes.rows[0].id, userId, initialMessage]
        );

        res.status(201).json({ success: true, data: { conversationId: convRes.rows[0].id, isExisting: false } });
    } catch (error) {
        next(error);
    }
}
