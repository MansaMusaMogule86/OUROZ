
import React, { useState } from 'react';
import { UserRole } from '../../types';
import RFQBuilder from './RFQBuilder';
import NegotiationRoom from './NegotiationRoom';
import VerificationWorkflow from './VerificationWorkflow';

interface DashboardProps {
  role: UserRole;
}

const B2BDashboard: React.FC<DashboardProps> = ({ role }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'rfqs' | 'negotiations' | 'verification'>('overview');

  const stats = [
    { label: 'Active RFQs', value: '12', icon: '📋' },
    { label: 'Pending Quotes', value: '5', icon: '💰' },
    { label: 'In Negotiation', value: '3', icon: '🤝' },
    { label: 'Transit Status', value: '2 Shipments', icon: '🚢' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'rfqs': return <RFQBuilder />;
      case 'negotiations': return <NegotiationRoom />;
      case 'verification': return <VerificationWorkflow />;
      default: return (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-gray-500 text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-lg">Recent Transactions</h3>
              <button className="text-primary-600 text-sm font-semibold hover:underline">View All</button>
            </div>
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-xs uppercase text-gray-400 font-bold">
                <tr>
                  <th className="px-6 py-4">Item</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Quantity</th>
                  <th className="px-6 py-4">Value</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {[1, 2, 3].map(item => (
                  <tr key={item} className="hover:bg-gray-50 transition-colors cursor-pointer">
                    <td className="px-6 py-4 font-medium">Moroccan Argan Oil Bulk</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold">SHIPPED</span>
                    </td>
                    <td className="px-6 py-4">500 Liters</td>
                    <td className="px-6 py-4 font-semibold">$22,500.00</td>
                    <td className="px-6 py-4 text-gray-400">Oct 24, 2024</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <aside className="w-full md:w-64 space-y-2">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`w-full text-left px-4 py-3 rounded-lg transition-colors font-medium flex items-center gap-3 ${activeTab === 'overview' ? 'bg-primary-600 text-white shadow-lg' : 'hover:bg-gray-200'}`}
        >
          <span>📊</span> Dashboard
        </button>
        <button 
          onClick={() => setActiveTab('rfqs')}
          className={`w-full text-left px-4 py-3 rounded-lg transition-colors font-medium flex items-center gap-3 ${activeTab === 'rfqs' ? 'bg-primary-600 text-white shadow-lg' : 'hover:bg-gray-200'}`}
        >
          <span>📋</span> RFQ Builder
        </button>
        <button 
          onClick={() => setActiveTab('negotiations')}
          className={`w-full text-left px-4 py-3 rounded-lg transition-colors font-medium flex items-center gap-3 ${activeTab === 'negotiations' ? 'bg-primary-600 text-white shadow-lg' : 'hover:bg-gray-200'}`}
        >
          <span>🤝</span> Negotiations
        </button>
        <button 
          onClick={() => setActiveTab('verification')}
          className={`w-full text-left px-4 py-3 rounded-lg transition-colors font-medium flex items-center gap-3 ${activeTab === 'verification' ? 'bg-primary-600 text-white shadow-lg' : 'hover:bg-gray-200'}`}
        >
          <span>🛡️</span> Compliance Vault
        </button>
      </aside>

      <section className="flex-1 min-w-0">
        {renderContent()}
      </section>
    </div>
  );
};

export default B2BDashboard;
