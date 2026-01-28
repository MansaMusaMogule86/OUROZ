
import React from 'react';

interface WholesaleGateProps {
  onApplyBuyer: () => void;
  onApplySupplier: () => void;
  onLoginAsAdmin: () => void;
}

const WholesaleGate: React.FC<WholesaleGateProps> = ({ onApplyBuyer, onApplySupplier, onLoginAsAdmin }) => {
  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-12 text-center">
        <h2 className="text-4xl font-serif font-bold text-slate-900 mb-6">Trade Verification Gate</h2>
        <p className="text-lg text-slate-600 mb-12 max-w-2xl mx-auto">
          Danat Al Jazeera's Trade Hub is restricted to verified businesses and export-ready suppliers. Please apply below to access wholesale pricing and bulk trade features.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-xl font-bold mb-4">Bulk Buyer</h3>
            <ul className="text-left text-sm text-slate-500 space-y-3 mb-8">
              <li className="flex items-center gap-2">✓ Wholesale Pricing</li>
              <li className="flex items-center gap-2">✓ Request for Quotes (RFQ)</li>
              <li className="flex items-center gap-2">✓ Logistics Tracking</li>
            </ul>
            <button 
              onClick={onApplyBuyer}
              className="w-full py-3 border-2 border-primary-600 text-primary-600 font-bold rounded-xl hover:bg-primary-50 transition-colors"
            >
              Apply as Buyer
            </button>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-xl font-bold mb-4">Artisan Supplier</h3>
            <ul className="text-left text-sm text-slate-500 space-y-3 mb-8">
              <li className="flex items-center gap-2">✓ Direct GCC Exposure</li>
              <li className="flex items-center gap-2">✓ Secure Financial Payouts</li>
              <li className="flex items-center gap-2">✓ Documentation Support</li>
            </ul>
            <button 
              onClick={onApplySupplier}
              className="w-full py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors shadow-lg"
            >
              Apply as Supplier
            </button>
          </div>
        </div>

        <div className="mt-12 text-sm text-slate-400">
          Already verified? <button onClick={onLoginAsAdmin} className="text-primary-600 font-bold hover:underline">Sign In</button>
        </div>
      </div>
    </div>
  );
};

export default WholesaleGate;
