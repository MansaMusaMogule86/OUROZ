import { WebSocketServer, WebSocket } from 'ws';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';

interface ClientSession {
    ws: WebSocket;
    geminiSession: any;
}

const activeSessions = new Map<WebSocket, ClientSession>();

export function setupLiveAudioProxy(wss: WebSocketServer) {
    wss.on('connection', async (clientWs: WebSocket) => {
        console.log('🎙️ Live audio client connected');

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

            // Connect to Gemini Live API
            const geminiSession = await ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-12-2025',
                callbacks: {
                    onopen: () => {
                        console.log('✅ Gemini Live session opened');
                        clientWs.send(JSON.stringify({ type: 'connected' }));
                    },
                    onmessage: (msg: LiveServerMessage) => {
                        // Forward Gemini responses to client
                        const parts = msg.serverContent?.modelTurn?.parts ?? [];
                        const audioBase64 = parts[0]?.inlineData?.data;
                        if (audioBase64) {
                            clientWs.send(JSON.stringify({
                                type: 'audio',
                                data: audioBase64
                            }));
                        }

                        if (msg.serverContent?.interrupted) {
                            clientWs.send(JSON.stringify({ type: 'interrupted' }));
                        }
                    },
                    onerror: (error) => {
                        console.error('Gemini Live error:', error);
                        clientWs.send(JSON.stringify({ type: 'error', message: String(error) }));
                    },
                    onclose: () => {
                        console.log('Gemini Live session closed');
                        clientWs.send(JSON.stringify({ type: 'closed' }));
                    }
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: {
                        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } }
                    },
                    systemInstruction: 'You are Danat Al Jazeera support. Help Moroccan suppliers and GCC buyers with trade, shipping, and onboarding questions. Be helpful and professional.'
                }
            });

            activeSessions.set(clientWs, { ws: clientWs, geminiSession });

            // Handle client messages
            clientWs.on('message', async (data: Buffer) => {
                try {
                    const message = JSON.parse(data.toString());

                    if (message.type === 'audio') {
                        // Forward audio to Gemini
                        geminiSession.sendRealtimeInput({
                            media: {
                                data: message.data,
                                mimeType: 'audio/pcm;rate=16000'
                            }
                        });
                    }
                } catch (error) {
                    console.error('Error processing client message:', error);
                }
            });

            clientWs.on('close', () => {
                console.log('🔌 Live audio client disconnected');
                const session = activeSessions.get(clientWs);
                if (session?.geminiSession) {
                    session.geminiSession.close();
                }
                activeSessions.delete(clientWs);
            });

            clientWs.on('error', (error: Error) => {
                console.error('WebSocket error:', error);
                activeSessions.delete(clientWs);
            });

        } catch (error) {
            console.error('Failed to establish Gemini Live session:', error);
            clientWs.send(JSON.stringify({
                type: 'error',
                message: 'Failed to connect to AI service'
            }));
            clientWs.close();
        }
    });

    console.log('🎧 Live Audio WebSocket proxy ready');
}
