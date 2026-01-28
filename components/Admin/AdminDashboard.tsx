
import React, { useState } from 'react';
import { MOCK_APPLICATIONS } from '../../constants';
import { ApplicationStatus, TradeApplication } from '../../types';

const AdminDashboard: React.FC = () => {
  const [apps, setApps] = useState<TradeApplication[]>(MOCK_APPLICATIONS);

  const handleAction = (id: string, newStatus: ApplicationStatus) => {
    setApps(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-serif font-bold">Admin Control Center</h2>
        <div className="flex gap-4">
          <div className="bg-primary-100 text-primary-700 px-4 py-2 rounded-lg font-bold">
            Total Applications: {apps.length}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">Pending Trade Verifications</h3>
        </div>
        
        <table className="w-full text-left">
          <thead className="bg-white text-xs uppercase text-gray-400 font-bold border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">Company</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Country</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {apps.map(app => (
              <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-bold text-gray-900">{app.companyName}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold ${app.type === 'BUYER' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                    {app.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500">{app.country}</td>
                <td className="px-6 py-4 text-gray-400 text-sm">{app.createdAt}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                    app.status === ApplicationStatus.PENDING ? 'bg-yellow-100 text-yellow-700' : 
                    app.status === ApplicationStatus.APPROVED ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {app.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {app.status === ApplicationStatus.PENDING && (
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleAction(app.id, ApplicationStatus.APPROVED)}
                        className="bg-green-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleAction(app.id, ApplicationStatus.REJECTED)}
                        className="bg-red-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {apps.length === 0 && (
          <div className="p-12 text-center text-gray-400 font-medium">
            No pending applications at this time.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
