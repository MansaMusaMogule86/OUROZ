import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import dotenv from 'dotenv';
import { aiRouter } from './routes/ai.js';
import { setupLiveAudioProxy } from './routes/liveAudio.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true
}));
app.use(express.json({ limit: '50mb' }));

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// AI routes
app.use('/api/ai', aiRouter);

// Create HTTP server
const server = createServer(app);

// WebSocket server for Live Audio
const wss = new WebSocketServer({ server, path: '/ws/live-audio' });
setupLiveAudioProxy(wss);

server.listen(PORT, () => {
    console.log(`🚀 OUROZ API Server running on port ${PORT}`);
    console.log(`   HTTP:      http://localhost:${PORT}`);
    console.log(`   WebSocket: ws://localhost:${PORT}/ws/live-audio`);
});
