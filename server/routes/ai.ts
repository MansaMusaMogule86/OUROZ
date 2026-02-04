import { Router, Request, Response } from 'express';
import { GoogleGenAI, Modality } from '@google/genai';

const router = Router();

const getAI = () => new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

// Image Generation
router.post('/generate-image', async (req: Request, res: Response) => {
    try {
        const { prompt, size } = req.body;
        const ai = getAI();

        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-image-preview',
            contents: { parts: [{ text: prompt }] },
            config: {
                imageConfig: {
                    aspectRatio: '1:1',
                    imageSize: size || '1K'
                }
            }
        });

        const parts = response.candidates?.[0]?.content?.parts ?? [];
        const imagePart = parts.find((p: any) => p.inlineData);
        const imageData = imagePart?.inlineData?.data;

        res.json({
            success: true,
            image: imageData ? `data:image/png;base64,${imageData}` : null
        });
    } catch (error: any) {
        console.error('Image generation error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Image Editing
router.post('/edit-image', async (req: Request, res: Response) => {
    try {
        const { base64Image, prompt } = req.body;
        const ai = getAI();

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    { inlineData: { data: base64Image, mimeType: 'image/png' } },
                    { text: prompt }
                ]
            }
        });

        const parts = response.candidates?.[0]?.content?.parts ?? [];
        const imagePart = parts.find((p: any) => p.inlineData);
        const imageData = imagePart?.inlineData?.data;

        res.json({
            success: true,
            image: imageData ? `data:image/png;base64,${imageData}` : null
        });
    } catch (error: any) {
        console.error('Image edit error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Video Generation
router.post('/generate-video', async (req: Request, res: Response) => {
    try {
        const { prompt, imageBase64, isPortrait } = req.body;
        const ai = getAI();

        let operation = await ai.models.generateVideos({
            model: 'veo-3.1-fast-generate-preview',
            prompt,
            image: imageBase64 ? {
                imageBytes: imageBase64,
                mimeType: 'image/png'
            } : undefined,
            config: {
                numberOfVideos: 1,
                resolution: '720p',
                aspectRatio: isPortrait ? '9:16' : '16:9'
            }
        });

        // Poll for completion
        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 8000));
            operation = await ai.operations.getVideosOperation({ operation });
        }

        const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;

        if (videoUri) {
            // Fetch the video and return as base64
            const videoResponse = await fetch(`${videoUri}&key=${process.env.GEMINI_API_KEY}`);
            const videoBlob = await videoResponse.arrayBuffer();
            const base64Video = Buffer.from(videoBlob).toString('base64');

            res.json({
                success: true,
                video: `data:video/mp4;base64,${base64Video}`
            });
        } else {
            res.json({ success: false, error: 'No video generated' });
        }
    } catch (error: any) {
        console.error('Video generation error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Grounded Query (Search + Maps)
router.post('/grounded-query', async (req: Request, res: Response) => {
    try {
        const { query, useThinking, latLng } = req.body;
        const ai = getAI();

        const config: any = {
            tools: [{ googleSearch: {} }, { googleMaps: {} }]
        };

        if (useThinking) {
            config.thinkingConfig = { thinkingBudget: 32768 };
        }

        if (latLng) {
            config.toolConfig = { retrievalConfig: { latLng } };
        }

        const response = await ai.models.generateContent({
            model: useThinking ? 'gemini-3-pro-preview' : 'gemini-2.5-flash',
            contents: query,
            config
        });

        const sources: any[] = [];
        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        chunks.forEach((chunk: any) => {
            if (chunk.web) sources.push({ title: chunk.web.title, uri: chunk.web.uri });
            if (chunk.maps) sources.push({ title: chunk.maps.title, uri: chunk.maps.uri });
        });

        res.json({
            success: true,
            text: response.text || "I couldn't generate a response.",
            sources
        });
    } catch (error: any) {
        console.error('Grounded query error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Audio Transcription
router.post('/transcribe', async (req: Request, res: Response) => {
    try {
        const { base64Audio } = req.body;
        const ai = getAI();

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: {
                parts: [
                    { inlineData: { data: base64Audio, mimeType: 'audio/pcm;rate=16000' } },
                    { text: 'Transcribe the following audio precisely. Only return the text.' }
                ]
            }
        });

        res.json({ success: true, text: response.text });
    } catch (error: any) {
        console.error('Transcription error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Negotiation Advice
router.post('/negotiation-advice', async (req: Request, res: Response) => {
    try {
        const { history, draft } = req.body;
        const ai = getAI();

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `You are a world-class trade negotiator specializing in Moroccan-GCC commerce. 
Analyze the following negotiation history and current contract draft. 
Provide brief, actionable strategic advice to the user.

Negotiation History:
${history}

Current Draft:
${draft}

Strategy Advice:`,
        });

        res.json({ success: true, text: response.text });
    } catch (error: any) {
        console.error('Negotiation advice error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Analyze Trade Document
router.post('/analyze-document', async (req: Request, res: Response) => {
    try {
        const { base64, mimeType } = req.body;
        const ai = getAI();

        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: {
                parts: [
                    { inlineData: { data: base64, mimeType } },
                    { text: 'Analyze this trade document (export license, tax ID, or certificate). Verify its authenticity and extract key compliance data relevant to Moroccan-GCC trade.' }
                ]
            }
        });

        res.json({ success: true, text: response.text });
    } catch (error: any) {
        console.error('Document analysis error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Analyze Visual Content
router.post('/analyze-visual', async (req: Request, res: Response) => {
    try {
        const { base64, mimeType } = req.body;
        const ai = getAI();

        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: {
                parts: [
                    { inlineData: { data: base64, mimeType } },
                    { text: 'Analyze this visual content for product quality, branding, and specifications relevant to Moroccan-GCC trade.' }
                ]
            }
        });

        res.json({ success: true, text: response.text });
    } catch (error: any) {
        console.error('Visual analysis error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Text to Speech
router.post('/text-to-speech', async (req: Request, res: Response) => {
    try {
        const { text } = req.body;
        const ai = getAI();

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-preview-tts',
            contents: [{ parts: [{ text }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' },
                    },
                },
            },
        });

        const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        res.json({ success: true, audio: audioData });
    } catch (error: any) {
        console.error('TTS error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

export { router as aiRouter };
