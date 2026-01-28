
import React, { useState } from 'react';
import { generateImage, editImageWithPrompt, generateVeoVideo } from '../../services/geminiService';

const AIStudio: React.FC = () => {
  const [mode, setMode] = useState<'IMAGE' | 'VIDEO' | 'EDIT'>('IMAGE');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [size, setSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [isPortrait, setIsPortrait] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const handleAction = async () => {
    setLoading(true);
    setResult(null);
    try {
      if (mode === 'IMAGE') {
        // High quality generation (Requires Key)
        if (!(window as any).aistudio?.hasSelectedApiKey()) {
            await (window as any).aistudio?.openSelectKey();
        }
        const res = await generateImage(prompt, size);
        setResult(res);
      } else if (mode === 'VIDEO') {
        // Veo generation (Requires Key)
        if (!(window as any).aistudio?.hasSelectedApiKey()) {
            await (window as any).aistudio?.openSelectKey();
        }
        const res = await generateVeoVideo(prompt, selectedFile || undefined, isPortrait);
        setResult(res);
      } else if (mode === 'EDIT' && selectedFile) {
        // Nano banana editing
        const res = await editImageWithPrompt(selectedFile.split(',')[1], prompt);
        setResult(res);
      }
    } catch (e) {
      console.error(e);
      alert("An error occurred during generation. If using Veo or Pro models, ensure your API key is selected.");
    } finally {
      setLoading(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedFile(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-8">
      <header className="text-center space-y-4">
        <h2 className="text-5xl font-serif font-bold text-gray-900">Creative <span className="text-primary-600">Studio</span></h2>
        <p className="text-gray-500 max-w-xl mx-auto text-lg">Harness the power of Veo 3 and Gemini Pro to generate world-class product visuals for the Moroccan trade market.</p>
      </header>

      <div className="grid lg:grid-cols-[350px_1fr] gap-12">
        <aside className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 space-y-8 h-fit sticky top-24">
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest text-primary-600">Creation Mode</p>
            <div className="grid grid-cols-1 gap-2">
              <button onClick={() => { setMode('IMAGE'); setResult(null); }} className={`p-4 rounded-2xl text-left transition-all ${mode === 'IMAGE' ? 'bg-primary-600 text-white shadow-lg' : 'hover:bg-gray-50 text-gray-600'}`}>
                <span className="block text-lg font-bold">Image Gen</span>
                <span className="text-xs opacity-80">Gemini 3 Pro (1K-4K)</span>
              </button>
              <button onClick={() => { setMode('VIDEO'); setResult(null); }} className={`p-4 rounded-2xl text-left transition-all ${mode === 'VIDEO' ? 'bg-primary-600 text-white shadow-lg' : 'hover:bg-gray-50 text-gray-600'}`}>
                <span className="block text-lg font-bold">Veo Video</span>
                <span className="text-xs opacity-80">Cinematic 3.1 Preview</span>
              </button>
              <button onClick={() => { setMode('EDIT'); setResult(null); }} className={`p-4 rounded-2xl text-left transition-all ${mode === 'EDIT' ? 'bg-primary-600 text-white shadow-lg' : 'hover:bg-gray-50 text-gray-600'}`}>
                <span className="block text-lg font-bold">Smart Edit</span>
                <span className="text-xs opacity-80">Nano Banana powered</span>
              </button>
            </div>
          </div>

          {(mode === 'EDIT' || mode === 'VIDEO') && (
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest text-primary-600">Reference Image</p>
              <label className="block w-full border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center cursor-pointer hover:border-primary-400 transition-colors">
                <input type="file" className="hidden" onChange={onFileChange} accept="image/*" />
                {selectedFile ? <img src={selectedFile} className="h-24 mx-auto rounded-lg mb-2" /> : <div className="text-2xl mb-2">📸</div>}
                <span className="text-xs font-bold text-gray-500 uppercase">{selectedFile ? "Change Image" : "Upload Reference"}</span>
              </label>
            </div>
          )}

          {mode === 'IMAGE' && (
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest text-primary-600">Output Quality</p>
              <div className="flex gap-2">
                {['1K', '2K', '4K'].map(s => (
                  <button key={s} onClick={() => setSize(s as any)} className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${size === s ? 'bg-primary-600 border-primary-600 text-white' : 'bg-white border-gray-200 text-gray-600'}`}>{s}</button>
                ))}
              </div>
            </div>
          )}

          {mode === 'VIDEO' && (
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest text-primary-600">Aspect Ratio</p>
              <div className="flex gap-2">
                <button onClick={() => setIsPortrait(false)} className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${!isPortrait ? 'bg-primary-600 border-primary-600 text-white' : 'bg-white border-gray-200 text-gray-600'}`}>16:9 Landscape</button>
                <button onClick={() => setIsPortrait(true)} className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${isPortrait ? 'bg-primary-600 border-primary-600 text-white' : 'bg-white border-gray-200 text-gray-600'}`}>9:16 Portrait</button>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-gray-100">
            <button 
              disabled={loading || (mode === 'EDIT' && !selectedFile)}
              onClick={handleAction}
              className={`w-full py-4 rounded-2xl font-bold text-lg shadow-2xl transition-all transform active:scale-95 flex items-center justify-center gap-3 ${loading ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-secondary-500 text-white hover:bg-secondary-600'}`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <span>✨ Generate</span>
                </>
              )}
            </button>
            <p className="text-[10px] text-gray-400 text-center mt-3 uppercase font-bold">Paid API key required for Veo/Pro</p>
          </div>
        </aside>

        <main className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 min-h-[500px] flex flex-col">
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full text-2xl md:text-3xl font-serif font-bold text-gray-900 border-none focus:ring-0 placeholder:text-gray-200 bg-transparent resize-none h-32"
              placeholder={mode === 'EDIT' ? "Describe the changes... e.g., 'Make it look like a vintage postcard'" : "Enter your vision... e.g., 'Cinematic view of a Moroccan spice market at dusk'"}
            />
            
            <div className="flex-1 border-t border-gray-50 flex items-center justify-center relative overflow-hidden rounded-2xl bg-gray-50 mt-4 group">
              {loading ? (
                <div className="text-center space-y-4 animate-pulse">
                   <div className="w-16 h-16 bg-primary-100 rounded-full mx-auto flex items-center justify-center text-primary-500 text-3xl">🎨</div>
                   <p className="font-bold text-gray-400 uppercase tracking-widest text-sm">Synthesizing Pixels...</p>
                </div>
              ) : result ? (
                mode === 'VIDEO' ? (
                  <video src={result} controls className="max-w-full max-h-full rounded-lg shadow-2xl" />
                ) : (
                  <img src={result} className="max-w-full max-h-full object-contain rounded-lg shadow-2xl transition-transform hover:scale-105 duration-700" alt="Generated result" />
                )
              ) : (
                <div className="text-center text-gray-300">
                  <div className="text-6xl mb-4">✨</div>
                  <p className="font-bold uppercase tracking-widest text-sm">Ready for your prompt</p>
                </div>
              )}
            </div>

            {result && (
              <div className="flex justify-end gap-3 mt-6">
                <a href={result} download={`danat-ai-${mode.toLowerCase()}.png`} className="px-6 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-bold hover:bg-gray-200 transition-colors">Download Output</a>
                <button onClick={() => setResult(null)} className="px-6 py-2 bg-primary-50 text-primary-600 rounded-full text-sm font-bold hover:bg-primary-100 transition-colors">New Session</button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="bg-primary-50 p-6 rounded-3xl border border-primary-100">
                <h4 className="font-bold text-primary-900 mb-2">Pro Tip: Lighting</h4>
                <p className="text-sm text-primary-700">Mention "golden hour" or "cinematic studio lighting" to enhance Moroccan textures like copper and silk.</p>
             </div>
             <div className="bg-secondary-50 p-6 rounded-3xl border border-secondary-100">
                <h4 className="font-bold text-secondary-900 mb-2">Veo 3 Dynamics</h4>
                <p className="text-sm text-secondary-700">Use active verbs like "flowing", "steaming", or "rotating" for high-impact video results.</p>
             </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AIStudio;
