
import React, { useState } from 'react';

interface ApplicationFormProps {
  type: 'BUYER' | 'SUPPLIER';
  onSuccess: () => void;
  onCancel: () => void;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({ type, onSuccess, onCancel }) => {
  // Fix: Added 'details' property to state and removed unused properties 'volume' and 'categories'
  const [formData, setFormData] = useState({
    companyName: '',
    country: '',
    details: '',
    licenseId: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    onSuccess();
  };

  return (
    <div className="max-w-xl mx-auto py-12">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl p-8">
        <div className="mb-8">
          <button onClick={onCancel} className="text-sm text-primary-600 font-bold mb-4 hover:underline">← Back</button>
          <h2 className="text-3xl font-serif font-bold">Apply as {type === 'BUYER' ? 'Trade Buyer' : 'Wholesale Supplier'}</h2>
          <p className="text-gray-500 mt-2">Please provide your business credentials for verification.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Company Registered Name</label>
            <input 
              required
              className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-primary-500 outline-none"
              value={formData.companyName}
              onChange={e => setFormData({...formData, companyName: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Country of Operations</label>
              <input 
                required
                className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-primary-500 outline-none"
                value={formData.country}
                onChange={e => setFormData({...formData, country: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Business License #</label>
              <input 
                required
                className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-primary-500 outline-none"
                value={formData.licenseId}
                onChange={e => setFormData({...formData, licenseId: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              {type === 'BUYER' ? 'Monthly Purchase Volume (USD)' : 'Production Capacity / Categories'}
            </label>
            <textarea 
              rows={3}
              className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-primary-500 outline-none"
              // Fix: formData now correctly includes 'details' property
              value={formData.details}
              onChange={e => setFormData({...formData, details: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-secondary-500 text-white rounded-2xl font-bold text-lg shadow-lg hover:bg-secondary-600 transition-colors"
          >
            Submit Verification Application
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;
