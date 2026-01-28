
import React, { useState, useEffect } from 'react';
import { getNegotiationAdvice } from '../../services/geminiService';

const NegotiationRoom: React.FC = () => {
  const [messages, setMessages] = useState([
    { role: 'supplier', text: 'We can offer $42/unit for 1000 units.', time: '10:00 AM' },
    { role: 'user', text: 'Our target is $38. We are a recurring buyer.', time: '10:05 AM' }
  ]);
  const [contract, setContract] = useState({
    price: 40,
    qty: 1000,
    shipping: 'CIF Dubai',
    payment: '30% Advance'
  });
  const [advice, setAdvice] = useState('');
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  const fetchAdvice = async () => {
    setLoadingAdvice(true);
    try {
      const history = messages.map(m => `${m.role}: ${m.text}`).join('\n');
      const draft = JSON.stringify(contract);
      const res = await getNegotiationAdvice(history, draft);
      setAdvice(res || '');
    } finally {
      setLoadingAdvice(false);
    }
  };

  return (
    <div className="h-[700px] flex flex-col md:flex-row gap-4">
      {/* Left: Chat & History */}
      <div className="flex-1 flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
          <h4 className="font-bold flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
            Negotiation Stream
          </h4>
          <button 
            onClick={fetchAdvice}
            disabled={loadingAdvice}
            className="text-xs bg-primary-100 text-primary-700 px-3 py-1 rounded-full font-bold hover:bg-primary-200"
          >
            {loadingAdvice ? 'Thinking...' : '💡 AI Strategist'}
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4" role="status" aria-live="polite">
          {advice && (
            <div className="bg-primary-50 border border-primary-100 p-3 rounded-lg text-sm text-primary-900 italic">
              <strong>Strategist:</strong> {advice}
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${m.role === 'user' ? 'bg-primary-600 text-white rounded-tr-none' : 'bg-gray-100 text-gray-800 rounded-tl-none'}`}>
                {m.text}
              </div>
              <span className="text-[10px] text-gray-400 mt-1 uppercase">{m.time}</span>
            </div>
          ))}
        </div>

        <div className="p-4 border-t flex gap-2">
          <input className="flex-1 border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary-500" placeholder="Type your counter-offer..." />
          <button className="bg-primary-600 text-white px-4 py-2 rounded-lg font-bold">Send</button>
        </div>
      </div>

      {/* Right: Live Contract Sheet */}
      <div className="w-full md:w-[400px] bg-white rounded-xl border border-primary-200 shadow-md p-6 flex flex-col">
        <div className="flex justify-between items-start mb-6">
          <h4 className="text-xl font-bold font-serif text-primary-900 underline decoration-secondary-500 underline-offset-4">Contract Draft</h4>
          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded font-bold uppercase">Work in Progress</span>
        </div>

        <div className="space-y-4 flex-1">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Unit Price (USD)</label>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">${contract.price}</span>
              <div className="flex gap-1">
                <button onClick={() => setContract({...contract, price: contract.price - 1})} className="w-6 h-6 border rounded hover:bg-gray-100">-</button>
                <button onClick={() => setContract({...contract, price: contract.price + 1})} className="w-6 h-6 border rounded hover:bg-gray-100">+</button>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Quantity</label>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold">{contract.qty} Units</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Shipping Terms</label>
            <select 
              value={contract.shipping} 
              onChange={(e) => setContract({...contract, shipping: e.target.value})}
              className="w-full bg-transparent font-bold focus:ring-0 border-none p-0 cursor-pointer"
            >
              <option>CIF Dubai</option>
              <option>FOB Casablanca</option>
              <option>EXW Essaouira</option>
            </select>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          <button className="w-full py-3 bg-secondary-500 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-secondary-600 transition-transform active:scale-[0.98]">
            Finalize & Sign Deal
          </button>
          <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest">Legal review pending</p>
        </div>
      </div>
    </div>
  );
};

export default NegotiationRoom;
