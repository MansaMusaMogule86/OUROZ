
import React, { useState } from 'react';
import { analyzeTradeDocument } from '../../services/geminiService';
import { VerificationStatus } from '../../types';

const VerificationWorkflow: React.FC = () => {
  const [status, setStatus] = useState<VerificationStatus>(VerificationStatus.NOT_STARTED);
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setStatus(VerificationStatus.PENDING);
    setLoading(true);

    // AI Analysis simulation
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1];
      try {
        const result = await analyzeTradeDocument(base64, f.type);
        setAnalysis(result || 'Document analyzed successfully.');
        setStatus(VerificationStatus.VERIFIED);
      } catch (err) {
        setAnalysis('Failed to analyze document. Please check the image quality.');
        setStatus(VerificationStatus.REJECTED);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(f);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900">Supplier Onboarding</h3>
        <p className="text-gray-500">To maintain trade integrity, all suppliers must upload valid export licenses and tax documentation.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className={`p-4 rounded-xl border-2 transition-all ${status === VerificationStatus.PENDING ? 'border-primary-500 bg-primary-50' : 'border-gray-100 bg-gray-50'}`}>
          <div className="text-xl mb-1">📤</div>
          <p className="text-xs font-bold uppercase text-gray-400">Step 1</p>
          <p className="font-bold">Upload Docs</p>
        </div>
        <div className={`p-4 rounded-xl border-2 transition-all ${status === VerificationStatus.VERIFIED ? 'border-green-500 bg-green-50' : 'border-gray-100 bg-gray-50'}`}>
          <div className="text-xl mb-1">🤖</div>
          <p className="text-xs font-bold uppercase text-gray-400">Step 2</p>
          <p className="font-bold">AI Analysis</p>
        </div>
        <div className={`p-4 rounded-xl border-2 transition-all ${status === VerificationStatus.VERIFIED ? 'border-secondary-500 bg-secondary-50' : 'border-gray-100 bg-gray-50'}`}>
          <div className="text-xl mb-1">✨</div>
          <p className="text-xs font-bold uppercase text-gray-400">Step 3</p>
          <p className="font-bold">Verified Status</p>
        </div>
      </div>

      <div className="border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center transition-hover hover:border-primary-400">
        <div className="text-5xl mb-4">📄</div>
        <h4 className="text-lg font-bold mb-2">Export License & Tax ID</h4>
        <p className="text-sm text-gray-500 mb-6">Drag and drop or click to upload. High-quality JPEG/PNG/PDF accepted.</p>
        <input 
          type="file" 
          id="doc-upload" 
          className="hidden" 
          onChange={handleFileUpload}
          accept="image/*,application/pdf"
        />
        <label 
          htmlFor="doc-upload"
          className="inline-block px-8 py-3 bg-primary-600 text-white font-bold rounded-lg cursor-pointer hover:bg-primary-700 transition-shadow shadow-lg"
        >
          Select Files
        </label>
      </div>

      {loading && (
        <div className="mt-8 p-6 bg-slate-50 rounded-xl flex items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          <div>
            <p className="font-bold">Analyzing Compliance Documents...</p>
            <p className="text-sm text-gray-500 italic">Our AI is verifying company identities and license validity.</p>
          </div>
        </div>
      )}

      {analysis && !loading && (
        <div className={`mt-8 p-6 rounded-xl border-l-4 ${status === VerificationStatus.VERIFIED ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
          <h4 className="font-bold text-gray-900 mb-2">Verification Insight</h4>
          <div className="text-sm text-gray-700 whitespace-pre-wrap">{analysis}</div>
          {status === VerificationStatus.VERIFIED && (
            <div className="mt-4 flex items-center gap-2 text-green-700 font-bold text-sm">
              <span>🛡️</span> Identity Verified Successfully
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VerificationWorkflow;
