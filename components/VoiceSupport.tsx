
import React, { useState, useRef } from 'react';

interface VoiceSupportProps {
  onClose: () => void;
}

// Helper functions for audio processing
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

const WS_URL = import.meta.env.DEV
  ? 'ws://localhost:3001/ws/live-audio'
  : `wss://${window.location.host}/ws/live-audio`;

const VoiceSupport: React.FC<VoiceSupportProps> = ({ onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState('Standby');
  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sources = useRef(new Set<AudioBufferSourceNode>());
  const nextStartTime = useRef(0);

  const startSession = async () => {
    setIsActive(true);
    setStatus('Connecting...');

    try {
      // Set up audio contexts
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      inputContextRef.current = inputCtx;
      audioContextRef.current = outputCtx;

      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Connect to WebSocket proxy
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected to proxy');
      };

      ws.onmessage = async (event) => {
        try {
          const message = JSON.parse(event.data);

          if (message.type === 'connected') {
            setStatus('Active');

            // Start streaming audio to server
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);

            scriptProcessor.onaudioprocess = (e) => {
              if (ws.readyState === WebSocket.OPEN) {
                const inputData = e.inputBuffer.getChannelData(0);
                const l = inputData.length;
                const int16 = new Int16Array(l);
                for (let i = 0; i < l; i++) {
                  int16[i] = inputData[i] * 32768;
                }
                ws.send(JSON.stringify({
                  type: 'audio',
                  data: encode(new Uint8Array(int16.buffer))
                }));
              }
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          }

          if (message.type === 'audio') {
            // Play received audio
            nextStartTime.current = Math.max(nextStartTime.current, outputCtx.currentTime);
            const audioBuffer = await decodeAudioData(
              decode(message.data),
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

          if (message.type === 'interrupted') {
            for (const source of sources.current.values()) {
              source.stop();
            }
            sources.current.clear();
            nextStartTime.current = 0;
          }

          if (message.type === 'error') {
            console.error('Server error:', message.message);
            setStatus('Error');
          }

          if (message.type === 'closed') {
            setStatus('Closed');
            setIsActive(false);
          }
        } catch (error) {
          console.error('Error processing message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setStatus('Connection Error');
      };

      ws.onclose = () => {
        setStatus('Disconnected');
        setIsActive(false);
      };

    } catch (err) {
      console.error(err);
      setStatus('Access Denied');
      setIsActive(false);
    }
  };

  const stopSession = () => {
    // Close WebSocket
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    // Stop all audio sources
    for (const source of sources.current.values()) {
      source.stop();
    }
    sources.current.clear();

    // Stop media stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    // Close audio contexts
    if (inputContextRef.current) {
      inputContextRef.current.close();
      inputContextRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    setIsActive(false);
    setStatus('Standby');
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
