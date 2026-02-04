
const API_BASE = import.meta.env.DEV ? 'http://localhost:3001' : '/api';

/**
 * Image Generation with Gemini 3 Pro
 */
export const generateImage = async (prompt: string, size: '1K' | '2K' | '4K') => {
  const response = await fetch(`${API_BASE}/api/ai/generate-image`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, size })
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.error);
  return data.image;
};

/**
 * Image Editing with Gemini 2.5 Flash Image
 */
export const editImageWithPrompt = async (base64Image: string, prompt: string) => {
  const response = await fetch(`${API_BASE}/api/ai/edit-image`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ base64Image, prompt })
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.error);
  return data.image;
};

/**
 * Video Generation with Veo 3.1
 */
export const generateVeoVideo = async (prompt: string, imageBase64?: string, isPortrait: boolean = false) => {
  const response = await fetch(`${API_BASE}/api/ai/generate-video`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, imageBase64, isPortrait })
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.error);
  return data.video;
};

/**
 * Search and Maps Grounding Assistant
 */
export const groundedAssistantQuery = async (query: string, useThinking: boolean = false) => {
  // Get location if possible for Maps
  let latLng = undefined;
  try {
    const pos = await new Promise<GeolocationPosition>((res, rej) =>
      navigator.geolocation.getCurrentPosition(res, rej, { timeout: 5000 })
    );
    latLng = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
  } catch (e) {
    console.debug("Location not available for maps grounding");
  }

  const response = await fetch(`${API_BASE}/api/ai/grounded-query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, useThinking, latLng })
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.error);

  return {
    text: data.text,
    sources: data.sources
  };
};

/**
 * Audio Transcription
 */
export const transcribeAudio = async (base64Audio: string) => {
  const response = await fetch(`${API_BASE}/api/ai/transcribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ base64Audio })
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.error);
  return data.text;
};

/**
 * Negotiation Advice with Gemini 3 Flash
 */
export const getNegotiationAdvice = async (history: string, draft: string) => {
  const response = await fetch(`${API_BASE}/api/ai/negotiation-advice`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ history, draft })
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.error);
  return data.text;
};

/**
 * Vision: Analyze Trade Documents (Export Licenses, ID, etc.)
 */
export const analyzeTradeDocument = async (base64: string, mimeType: string) => {
  const response = await fetch(`${API_BASE}/api/ai/analyze-document`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ base64, mimeType })
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.error);
  return data.text;
};

/**
 * Vision: Analyze Product Images or Videos
 */
export const analyzeVisualContent = async (base64: string, mimeType: string) => {
  const response = await fetch(`${API_BASE}/api/ai/analyze-visual`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ base64, mimeType })
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.error);
  return data.text;
};

export const textToSpeech = async (text: string) => {
  const response = await fetch(`${API_BASE}/api/ai/text-to-speech`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.error);
  return data.audio;
};
