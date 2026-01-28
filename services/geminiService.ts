
import { GoogleGenAI, Type, GenerateContentResponse, Modality, VideoGenerationReferenceType } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Image Generation with Gemini 3 Pro
 */
export const generateImage = async (prompt: string, size: '1K' | '2K' | '4K') => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: { parts: [{ text: prompt }] },
    config: {
      imageConfig: {
        aspectRatio: "1:1",
        imageSize: size
      }
    }
  });

  const imagePart = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
  return imagePart?.inlineData?.data ? `data:image/png;base64,${imagePart.inlineData.data}` : null;
};

/**
 * Image Editing with Gemini 2.5 Flash Image
 */
export const editImageWithPrompt = async (base64Image: string, prompt: string) => {
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

  const imagePart = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
  return imagePart?.inlineData?.data ? `data:image/png;base64,${imagePart.inlineData.data}` : null;
};

/**
 * Video Generation with Veo 3.1
 */
export const generateVeoVideo = async (prompt: string, imageBase64?: string, isPortrait: boolean = false) => {
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

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 8000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};

/**
 * Search and Maps Grounding Assistant
 */
export const groundedAssistantQuery = async (query: string, useThinking: boolean = false) => {
  const ai = getAI();
  
  const config: any = {
    tools: [{ googleSearch: {} }, { googleMaps: {} }]
  };

  if (useThinking) {
    config.thinkingConfig = { thinkingBudget: 32768 };
  }

  // Get location if possible for Maps
  let latLng = undefined;
  try {
    const pos = await new Promise<GeolocationPosition>((res, rej) => navigator.geolocation.getCurrentPosition(res, rej));
    latLng = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
    config.toolConfig = { retrievalConfig: { latLng } };
  } catch (e) {
    console.debug("Location not available for maps grounding");
  }

  const response: GenerateContentResponse = await ai.models.generateContent({
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

  return {
    text: response.text || "I couldn't generate a response.",
    sources
  };
};

/**
 * Audio Transcription
 */
export const transcribeAudio = async (base64Audio: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Audio, mimeType: 'audio/pcm;rate=16000' } },
        { text: "Transcribe the following audio precisely. Only return the text." }
      ]
    }
  });
  return response.text;
};

// Fix: Added missing getNegotiationAdvice export to fix NegotiationRoom.tsx error
/**
 * Negotiation Advice with Gemini 3 Flash
 */
export const getNegotiationAdvice = async (history: string, draft: string) => {
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
  return response.text;
};

// Fix: Renamed analyzeVisualContent to analyzeTradeDocument to fix VerificationWorkflow.tsx error
/**
 * Vision: Analyze Trade Documents (Export Licenses, ID, etc.)
 */
export const analyzeTradeDocument = async (base64: string, mimeType: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        { inlineData: { data: base64, mimeType } },
        { text: "Analyze this trade document (export license, tax ID, or certificate). Verify its authenticity and extract key compliance data relevant to Moroccan-GCC trade." }
      ]
    }
  });
  return response.text;
};

/**
 * Vision: Analyze Product Images or Videos
 */
export const analyzeVisualContent = async (base64: string, mimeType: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        { inlineData: { data: base64, mimeType } },
        { text: "Analyze this visual content for product quality, branding, and specifications relevant to Moroccan-GCC trade." }
      ]
    }
  });
  return response.text;
};

export const textToSpeech = async (text: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
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
  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
};
