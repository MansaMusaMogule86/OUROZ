
import React, { useState } from 'react';
import { INCOTERMS } from '../../constants';

const RFQBuilder: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    product: '',
    quantity: 0,
    incoterms: 'FOB',
    specs: '',
    deadline: ''
  });

  return (
    <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm max-w-2xl mx-auto">
      <div className="flex justify-between mb-8">
        {[1, 2, 3].map(i => (
          <div key={i} className={`flex items-center ${i !== 3 ? 'flex-1' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= i ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
              {i}
            </div>
            {i !== 3 && <div className={`h-1 flex-1 mx-2 ${step > i ? 'bg-primary-600' : 'bg-gray-200'}`}></div>}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <h3 className="text-xl font-bold">Basic Requirements</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Category / Name</label>
            <input 
              type="text" 
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary-500 outline-none" 
              placeholder="e.g. Cosmetic Grade Argan Oil"
              value={formData.product}
              onChange={(e) => setFormData({...formData, product: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Quantity</label>
              <input 
                type="number" 
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary-500 outline-none"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
              <select className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary-500 outline-none">
                <option>Liters</option>
                <option>Kilograms</option>
                <option>Units</option>
                <option>Containers (20ft)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <h3 className="text-xl font-bold">Logistics & Specs</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Incoterms</label>
            <div className="grid grid-cols-3 gap-2">
              {INCOTERMS.map(term => (
                <button
                  key={term}
                  onClick={() => setFormData({...formData, incoterms: term})}
                  className={`py-2 border rounded-lg text-sm font-semibold transition-colors ${formData.incoterms === term ? 'bg-primary-50 border-primary-600 text-primary-600' : 'border-gray-200 hover:bg-gray-50'}`}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Technical Specifications</label>
            <textarea 
              rows={4}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary-500 outline-none"
              placeholder="List purity requirements, packaging types, etc..."
              value={formData.specs}
              onChange={(e) => setFormData({...formData, specs: e.target.value})}
            />
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6 text-center">
          <div className="text-5xl mb-4">📝</div>
          <h3 className="text-xl font-bold">Ready to Broadcast?</h3>
          <p className="text-gray-500">Your RFQ will be sent to verified Moroccan suppliers meeting your criteria.</p>
          <div className="bg-gray-50 p-4 rounded-lg text-left text-sm space-y-2 border border-gray-100">
            <p><strong>Item:</strong> {formData.product}</p>
            <p><strong>Quantity:</strong> {formData.quantity}</p>
            <p><strong>Shipping:</strong> {formData.incoterms}</p>
          </div>
        </div>
      )}

      <div className="mt-8 flex justify-between">
        <button 
          onClick={() => setStep(s => Math.max(1, s - 1))}
          className={`px-6 py-2 border rounded-lg font-semibold transition-colors ${step === 1 ? 'invisible' : 'hover:bg-gray-50'}`}
        >
          Previous
        </button>
        <button 
          onClick={() => step < 3 ? setStep(s => s + 1) : alert('RFQ Submitted!')}
          className="px-6 py-2 bg-secondary-500 text-white rounded-lg font-bold shadow-lg hover:bg-secondary-600 transition-colors focus:ring-2 focus:ring-primary-500 ring-offset-2"
        >
          {step === 3 ? 'Submit RFQ' : 'Next Step'}
        </button>
      </div>
    </div>
  );
};

export default RFQBuilder;
