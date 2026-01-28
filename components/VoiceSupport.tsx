
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';

interface VoiceSupportProps {
  onClose: () => void;
}

// Helper functions for audio processing according to guidelines
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const VoiceSupport: React.FC<VoiceSupportProps> = ({ onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState('Standby');
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sources = useRef(new Set<AudioBufferSourceNode>());
  const nextStartTime = useRef(0);

  const startSession = async () => {
    // Fix: Correct GoogleGenAI initialization
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    setIsActive(true);
    setStatus('Connecting...');

    try {
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = outputCtx;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const createBlob = (data: Float32Array): Blob => {
        const l = data.length;
        const int16 = new Int16Array(l);
        for (let i = 0; i < l; i++) {
          int16[i] = data[i] * 32768;
        }
        return {
          data: encode(new Uint8Array(int16.buffer)),
          mimeType: 'audio/pcm;rate=16000',
        };
      };

      // Fix: Use sessionPromise pattern to ensure data is streamed only after resolved connection
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setStatus('Active');
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              // CRITICAL: Solely rely on sessionPromise resolves to send inputs
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (msg: LiveServerMessage) => {
            // Fix: Standard extraction of audio output from Gemini Live API
            const audioBase64 = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioBase64) {
              nextStartTime.current = Math.max(nextStartTime.current, outputCtx.currentTime);
              const audioBuffer = await decodeAudioData(
                decode(audioBase64),
                outputCtx,
                24000,
                1,
              );
              
              const sourceNode = outputCtx.createBufferSource();
              sourceNode.buffer = audioBuffer;
              sourceNode.connect(outputCtx.destination);
              sourceNode.addEventListener('ended', () => {
                sources.current.delete(sourceNode);
              });
              
              sourceNode.start(nextStartTime.current);
              nextStartTime.current += audioBuffer.duration;
              sources.current.add(sourceNode);
            }

            if (msg.serverContent?.interrupted) {
              for (const source of sources.current.values()) {
                source.stop();
              }
              sources.current.clear();
              nextStartTime.current = 0;
            }
          },
          onerror: (e) => {
            console.error('Live Error', e);
            setStatus('Error');
          },
          onclose: () => {
            setStatus('Closed');
            setIsActive(false);
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
      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setStatus('Access Denied');
    }
  };

  const stopSession = () => {
    if (sessionRef.current) {
      sessionRef.current.close();
    }
    for (const source of sources.current.values()) {
      source.stop();
    }
    sources.current.clear();
    setIsActive(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-80 overflow-hidden flex flex-col">
        <div className="p-4 bg-primary-600 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-400 animate-ping' : 'bg-gray-400'}`}></div>
            <span className="font-bold text-sm uppercase tracking-wider">AI Voice Concierge</span>
          </div>
          <button onClick={onClose} className="hover:text-gray-200">✕</button>
        </div>

        <div className="p-8 text-center space-y-4">
          <div className="w-20 h-20 bg-primary-50 rounded-full mx-auto flex items-center justify-center text-primary-600 text-4xl">
            🎙️
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase mb-1">Status</p>
            <p className="text-lg font-bold text-gray-900">{status}</p>
          </div>
          
          <p className="text-sm text-gray-500">
            {isActive ? "Speak now! I'm listening to your trade queries." : "Connect to start a real-time voice conversation with our trade specialist."}
          </p>

          <button
            onClick={isActive ? stopSession : startSession}
            className={`w-full py-3 rounded-xl font-bold transition-all ${isActive ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100' : 'bg-primary-600 text-white shadow-lg hover:bg-primary-700'}`}
          >
            {isActive ? 'Disconnect' : 'Start Voice Conversation'}
          </button>
        </div>

        <div className="p-3 bg-gray-50 border-t border-gray-100 text-[10px] text-center text-gray-400 font-medium">
          EN / AR / FR SUPPORTED
        </div>
      </div>
    </div>
  );
};

export default VoiceSupport;
