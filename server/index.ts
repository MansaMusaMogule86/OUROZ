/**
 * OUROZ API Server
 * Express + WebSocket with all API routes
 */

import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';

import { config } from './config.js';
import { errorHandler } from './utils/errors.js';

// Routes
import { aiRouter } from './routes/ai.js';
import { authRouter } from './routes/auth.js';
import { setupLiveAudioProxy } from './routes/liveAudio.js';
import supplierRoutes from './api/suppliers/routes.js';
import productRoutes from './api/products/routes.js';
import orderRoutes from './api/orders/routes.js';
import rfqRoutes from './api/rfq/routes.js';
import messageRoutes from './api/messages/routes.js';
import adminRoutes from './api/admin/routes.js';

dotenv.config();

const app = express();

// ──────────────────────────────────────
// Middleware
// ──────────────────────────────────────

app.use(cors({
    origin: config.corsOrigins,
    credentials: true,
}));
app.use(express.json({ limit: '50mb' }));

// Request logging (dev only)
if (config.isDev()) {
    app.use((req, _res, next) => {
        console.log(`${req.method} ${req.path}`);
        next();
    });
}

// ──────────────────────────────────────
// Health check
// ──────────────────────────────────────

app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString(), env: config.env });
});

// ──────────────────────────────────────
// API Routes
// ──────────────────────────────────────

app.use('/api/auth', authRouter);
app.use('/api/ai', aiRouter);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/rfq', rfqRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/admin', adminRoutes);

// ──────────────────────────────────────
// 404 handler
// ──────────────────────────────────────

app.use((_req, res) => {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Endpoint not found' } });
});

// ──────────────────────────────────────
// Error handler (must be last)
// ──────────────────────────────────────

app.use(errorHandler);

// ──────────────────────────────────────
// Start server
// ──────────────────────────────────────

const server = createServer(app);

// WebSocket server for Live Audio
const wss = new WebSocketServer({ server, path: '/ws/live-audio' });
setupLiveAudioProxy(wss);

server.listen(config.port, () => {
    console.log(`🚀 OUROZ API Server running on port ${config.port}`);
    console.log(`   HTTP:      http://localhost:${config.port}`);
    console.log(`   WebSocket: ws://localhost:${config.port}/ws/live-audio`);
    console.log(`   Env:       ${config.env}`);
    console.log(`   Routes:    auth, ai, suppliers, products, orders, rfq, messages, admin`);
});
