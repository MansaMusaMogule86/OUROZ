
import React, { useState, useRef, useEffect } from 'react';
import { groundedAssistantQuery, transcribeAudio, textToSpeech } from '../../services/geminiService';
import { AIMessage, Product } from '../../types';
import { DUMMY_PRODUCTS } from '../../constants';

interface AssistantProps {
  isChef?: boolean;
  wishlist?: Product[];
  onToggleVault?: (product: Product) => void;
}

const Assistant: React.FC<AssistantProps> = ({ isChef = false, wishlist = [], onToggleVault }) => {
  const [messages, setMessages] = useState<AIMessage[]>([
    { 
      role: 'model', 
      text: isChef 
        ? "Welcome to my Atelier. I am Chef ADAFER. I source the botanical and mineral souls of Moroccan gastronomy. How shall we curate your next culinary legacy?"
        : "Marhaban. I am the Amud: the logistical heart of OUROZ. I map trade rails and verify lineage. Where does your vision lead today?" 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [useThinking, setUseThinking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showUpsell, setShowUpsell] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading, showUpsell]);

  const handleSend = async (textOverride?: string) => {
    const text = textOverride || input;
    if (!text.trim() || loading) return;

    const userMsg: AIMessage = { role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setShowUpsell(false);

    try {
      const systemPrompt = isChef 
        ? "You are Chef ADAFER, a world-class culinary curator. When the user asks for recipes or ingredients, suggest heritage vessels. Use an elegant, authoritative tone."
        : "You are The Amud, the logistical engine for OUROZ trade. Focus on verification, trade rails, and authentic Amazigh lineages.";
        
      const res = await groundedAssistantQuery(`${systemPrompt} User Inquiry: ${text}`, useThinking);
      const modelMsg: AIMessage = { 
        role: 'model', 
        text: res.text, 
        sources: res.sources,
        isThinking: useThinking 
      };
      setMessages(prev => [...prev, modelMsg]);
      
      if (isChef) {
        // High-conversion trigger: Detect recipe/food intent and show upsell
        const lowerRes = res.text.toLowerCase();
        if (lowerRes.includes('recipe') || lowerRes.includes('cook') || lowerRes.includes('ingredient') || lowerRes.includes('tagine')) {
          setTimeout(() => setShowUpsell(true), 1000);
        }
      }

      if (!useThinking) {
        await textToSpeech(res.text.slice(0, 150) + "...");
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: 'model', text: "Forgive me, the signals are obscured. Attempt again." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = () => {
    if (!onToggleVault) return;
    
    // Find the premium versions in our catalog
    const premiumTagine = DUMMY_PRODUCTS.find(p => p.slug === 'ceramic-tagine-green');
    const safiPlate = DUMMY_PRODUCTS.find(p => p.slug === 'safi-plate-21cm');

    if (premiumTagine) onToggleVault(premiumTagine);
    if (safiPlate) onToggleVault(safiPlate);

    // Visual feedback for "Direct-to-Amud" injection
    setShowUpsell(false);
    setMessages(prev => [...prev, { 
      role: 'model', 
      text: "The upgrade is complete. Your Amud vault has been injected with the Safi Emerald glazes and High Atlas clay masterworks. Your legacy is secured." 
    }]);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64 = (reader.result as string).split(',')[1];
          const transcription = await transcribeAudio(base64);
          if (transcription) setInput(transcription);
        };
        reader.readAsDataURL(audioBlob);
      };
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) { console.error(err); }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const accentColor = isChef ? 'text-emerald' : 'text-majorelle';
  const shimmerClass = loading ? 'animate-iridescent-yz' : 'animate-pulse-soft';

  return (
    <div className="fixed inset-0 pt-28 pb-10 flex flex-col items-center justify-center animate-fade-in pointer-events-none px-4 z-[165]">
      <div className={`w-full max-w-4xl h-[75vh] flex flex-col glass-vogue rounded-extreme floating-glass overflow-hidden relative pointer-events-auto border-opacity-40 shadow-luxury ${isChef ? 'border-emerald/40' : 'border-gold/40'}`}>
        
        {/* Floating Engine Header */}
        <div className={`p-10 border-b flex items-center justify-between bg-white/5 backdrop-blur-3xl sticky top-0 z-20 ${isChef ? 'border-emerald/20' : 'border-gold/10'}`}>
          <div className="flex items-center gap-8">
            <div className={`w-16 h-16 rounded-full glass-vogue flex items-center justify-center shadow-gold-ambient bg-white/5 ${shimmerClass}`}>
              <span className={`text-5xl font-serif select-none yaz-shimmer`}>ⵣ</span>
            </div>
            <div>
              <h3 className="heading-vogue text-xl leading-none">{isChef ? 'Chef ADAFER' : 'The Amud Engine'}</h3>
              <p className={`text-[9px] font-black uppercase tracking-[0.4em] mt-2 italic opacity-60 ${isChef ? 'text-emerald' : 'text-gold'}`}>
                {isChef ? 'Creative Atelier' : 'Logistical Intelligence'}
              </p>
            </div>
          </div>
          
          <button 
            onClick={() => setUseThinking(!useThinking)}
            className={`flex items-center gap-4 px-6 py-2 rounded-full border transition-all ${useThinking ? 'bg-indigo border-indigo text-sahara shadow-luxury' : 'bg-transparent border-gold/30 text-gold hover:bg-gold/10'}`}
          >
            <span className="text-[9px] font-black uppercase tracking-[0.3em]">{useThinking ? 'Deep Logic' : 'Standard'}</span>
            <div className={`w-8 h-4 rounded-full relative transition-colors ${useThinking ? 'bg-white/30' : 'bg-gold/20'}`}>
              <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-all ${useThinking ? 'right-0.5' : 'left-0.5'}`}></div>
            </div>
          </button>
        </div>

        {/* Weightless Narrative Bubbles */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-12 space-y-12 scrollbar-hide bg-gradient-to-b from-transparent to-sahara/10">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}>
              <div className={`max-w-[80%] ${m.role === 'user' ? 'order-2' : ''}`}>
                {m.isThinking && (
                  <div className="text-[9px] text-indigo font-black uppercase mb-4 ml-4 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-indigo rounded-full animate-ping"></div> Deep Analysis
                  </div>
                )}
                <div className={`p-8 rounded-[40px] text-lg font-serif font-light leading-relaxed backdrop-blur-3xl shadow-gold-ambient border ${
                  m.role === 'user' 
                    ? 'bg-indigo/80 text-white rounded-tr-none border-indigo/20' 
                    : isChef 
                      ? 'bg-emerald/[0.03] text-henna rounded-tl-none border-emerald/30'
                      : 'bg-white/5 text-henna rounded-tl-none border-gold/40'
                }`}>
                  <div className="whitespace-pre-wrap italic opacity-95">{m.text}</div>
                  {m.sources && m.sources.length > 0 && (
                    <div className="mt-8 pt-8 border-t border-gold/10">
                      <p className="text-[9px] font-black uppercase tracking-[0.4em] text-gold/40 mb-5">Verified Nodes</p>
                      <div className="grid grid-cols-1 gap-3">
                        {m.sources.map((s, idx) => (
                          <a 
                            key={idx} href={s.uri} target="_blank" rel="noopener noreferrer" 
                            className="flex items-center gap-4 p-4 glass-vogue rounded-3xl hover:bg-gold/10 transition-all group border-gold/10"
                          >
                            <span className="text-xl opacity-60 group-hover:opacity-100 transition-opacity">{s.uri?.includes('maps') ? '📍' : '🌐'}</span>
                            <span className="text-xs font-medium text-henna group-hover:text-gold transition-colors truncate">{s.title || "Reference"}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Upsell Logic: Chef's Recommendation Card */}
          {isChef && showUpsell && (
            <div className="animate-slide-up px-2 pb-4">
              <div className="glass-vogue rounded-[40px] p-10 border-emerald/50 bg-emerald/[0.05] relative overflow-hidden shadow-luxury">
                <div className="absolute top-0 right-0 p-6 opacity-[0.03]">
                  <span className="text-[12rem] font-serif">ⵣ</span>
                </div>
                
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-2 h-2 rounded-full bg-emerald animate-pulse"></div>
                  <h4 className="heading-vogue text-[11px] text-emerald tracking-[0.4em]">Chef’s Private Recommendation</h4>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-10 mb-10">
                  <div className="w-48 h-48 rounded-[32px] overflow-hidden shadow-2xl border-2 border-white/20 shrink-0">
                    <img 
                      src="https://images.unsplash.com/photo-1590333746438-2834503f5533?auto=format&fit=crop&q=80&w=300" 
                      className="w-full h-full object-cover" 
                      alt="Artisan Upgrade" 
                    />
                  </div>
                  <div className="flex-1 space-y-4">
                    <p className="text-3xl font-serif text-henna leading-tight">Safi Masterwork <span className="italic text-emerald">Upgrade</span></p>
                    <p className="text-lg text-henna/60 font-serif italic leading-relaxed">
                      "Standard clay satisfies the body, but heritage Safi Emerald glaze feeds the soul. Swap your base items for the Syndicate’s artisan tier."
                    </p>
                    <div className="flex gap-4">
                       <span className="px-4 py-2 bg-emerald/10 text-emerald text-[9px] font-black uppercase rounded-lg border border-emerald/20">+4 Artisan Trace</span>
                       <span className="px-4 py-2 bg-emerald/10 text-emerald text-[9px] font-black uppercase rounded-lg border border-emerald/20">Double-Fired Quality</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleUpgrade}
                  className="group relative w-full py-7 bg-imperial-red text-sahara rounded-full font-black text-[11px] uppercase tracking-[0.5em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all overflow-hidden"
                >
                  <div className="absolute inset-0 yaz-shimmer-ring opacity-30 group-hover:opacity-60 animate-yaz-rotate pointer-events-none"></div>
                  <span className="relative z-10 flex items-center justify-center gap-4">
                    Upgrade My Amud <span className="text-xl">ⵣ</span>
                  </span>
                </button>
              </div>
            </div>
          )}

          {loading && (
            <div className="flex justify-start animate-slide-up">
              <div className="glass-vogue p-8 rounded-[40px] rounded-tl-none border border-gold/30 flex items-center gap-6 shadow-gold-ambient bg-white/5">
                <div className="flex gap-2">
                  <div className="w-2.5 h-2.5 bg-gold rounded-full animate-bounce"></div>
                  <div className="w-2.5 h-2.5 bg-gold rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2.5 h-2.5 bg-gold rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
                <span className="text-[10px] font-black text-gold uppercase tracking-[0.4em] italic">Synthesizing...</span>
              </div>
            </div>
          )}
        </div>

        {/* Floating Pill Input Bar */}
        <div className="px-10 py-10 bg-transparent flex justify-center sticky bottom-0 z-30">
          <div className={`relative w-full max-w-3xl flex items-center gap-4 glass-vogue rounded-full px-8 py-5 shadow-luxury border bg-white/5 ${isChef ? 'border-emerald/40' : 'border-gold/50'}`}>
            <button 
              onMouseDown={startRecording} onMouseUp={stopRecording}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg ${isRecording ? 'bg-imperial-red text-white animate-pulse' : 'bg-indigo text-white hover:bg-indigo/80'}`}
              title="Speak it"
            >
              <span className="text-[10px] font-black uppercase">{isRecording ? '•' : 'Say'}</span>
            </button>
            
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if(e.key === 'Enter') handleSend(); }}
              placeholder={isChef ? "Describe your culinary vision..." : "Verify a lineage or map a route..."}
              className="flex-1 bg-transparent border-none focus:ring-0 text-xl font-serif font-light text-henna placeholder:text-henna/20 py-2 italic"
            />

            <button 
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${input.trim() ? 'bg-indigo text-white scale-110 shadow-lg' : 'bg-gold/10 text-gold/30 cursor-not-allowed'}`}
              title="Type it"
            >
              <span className="text-[10px] font-black uppercase tracking-widest">Send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assistant;
