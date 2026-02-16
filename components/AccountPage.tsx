
import React, { useState } from 'react';
import { User, UserRole, ApplicationStatus } from '../types';

interface AccountPageProps {
  user: User;
  onBack: () => void;
  onUpdateUser: (user: User) => void;
  onNavigate: (view: string) => void;
}

const AccountPage: React.FC<AccountPageProps> = ({ user, onBack, onUpdateUser, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'settings'>('profile');
  const [editName, setEditName] = useState(user.name);
  const [editCompany, setEditCompany] = useState(user.companyName || '');

  const handleSave = () => {
    onUpdateUser({
      ...user,
      name: editName,
      companyName: editCompany || undefined
    });
  };

  return (
    <div className="animate-fade-in space-y-12 pb-32">
      {/* Header */}
      <div className="glass-vogue rounded-[3rem] p-12 border border-gold/10">
        <div className="flex items-center gap-8">
          <div className="w-24 h-24 rounded-full bg-gold/10 border-2 border-gold/30 flex items-center justify-center">
            <span className="heading-vogue text-4xl text-gold">{user.name.charAt(0)}</span>
          </div>
          <div className="flex-1">
            <h1 className="heading-vogue text-3xl text-henna">{user.name}</h1>
            <div className="flex items-center gap-4 mt-2">
              <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                user.role === UserRole.ADMIN ? 'bg-majorelle/10 text-majorelle' :
                user.role === UserRole.BUYER ? 'bg-emerald-50 text-emerald-600' :
                user.role === UserRole.SUPPLIER ? 'bg-gold/10 text-gold' :
                'bg-henna/5 text-henna/40'
              }`}>
                {user.role}
              </span>
              {user.status !== ApplicationStatus.NONE && (
                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                  user.status === ApplicationStatus.APPROVED ? 'bg-emerald-50 text-emerald-600' :
                  user.status === ApplicationStatus.PENDING ? 'bg-amber-50 text-amber-600' :
                  'bg-red-50 text-red-600'
                }`}>
                  {user.status}
                </span>
              )}
            </div>
          </div>
          <button onClick={onBack} className="heading-vogue text-[10px] text-gold tracking-[0.3em] hover:text-henna transition-colors">
            ← Back
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(['profile', 'orders', 'settings'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-3 rounded-full heading-vogue text-[10px] tracking-[0.3em] transition-all ${
              activeTab === tab
                ? 'bg-henna text-white shadow-lg'
                : 'text-henna/40 hover:text-henna hover:bg-sahara/50 border border-gold/10'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'profile' && (
        <div className="glass-vogue rounded-[2rem] p-10 border border-gold/10 space-y-8">
          <h2 className="heading-vogue text-xl text-henna">Profile Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-gold/60 uppercase tracking-widest">Display Name</label>
              <input
                value={editName}
                onChange={e => setEditName(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl border border-gold/20 bg-sahara/30 focus:bg-white/80 focus:ring-4 focus:ring-gold/10 outline-none transition-all font-serif"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-gold/60 uppercase tracking-widest">Company Name</label>
              <input
                value={editCompany}
                onChange={e => setEditCompany(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl border border-gold/20 bg-sahara/30 focus:bg-white/80 focus:ring-4 focus:ring-gold/10 outline-none transition-all font-serif"
                placeholder="Optional"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-gold/60 uppercase tracking-widest">User ID</label>
              <input
                value={user.id}
                disabled
                className="w-full px-6 py-4 rounded-2xl border border-gold/10 bg-sahara/20 text-henna/40 font-serif cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-gold/60 uppercase tracking-widest">Role</label>
              <input
                value={user.role}
                disabled
                className="w-full px-6 py-4 rounded-2xl border border-gold/10 bg-sahara/20 text-henna/40 font-serif cursor-not-allowed"
              />
            </div>
          </div>
          <button
            onClick={handleSave}
            className="px-12 py-4 bg-henna text-white rounded-full heading-vogue text-[10px] tracking-[0.3em] hover:bg-majorelle transition-all shadow-lg"
          >
            Save Changes
          </button>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="glass-vogue rounded-[2rem] p-10 border border-gold/10 space-y-8">
          <h2 className="heading-vogue text-xl text-henna">Order History</h2>
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <div className="w-20 h-20 rounded-full bg-sahara/50 flex items-center justify-center">
              <span className="text-3xl text-gold/30">📦</span>
            </div>
            <p className="text-henna/40 font-serif italic">No orders yet</p>
            <button
              onClick={() => onNavigate('SHOP')}
              className="px-8 py-3 border border-gold/20 text-henna rounded-full heading-vogue text-[10px] tracking-[0.3em] hover:bg-sahara/50 transition-all"
            >
              Start Shopping
            </button>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="glass-vogue rounded-[2rem] p-10 border border-gold/10 space-y-8">
          <h2 className="heading-vogue text-xl text-henna">Account Settings</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-6 rounded-2xl bg-sahara/30 border border-gold/5">
              <div>
                <p className="font-bold text-henna">Email Notifications</p>
                <p className="text-sm text-henna/40">Receive updates on orders and promotions</p>
              </div>
              <div className="w-12 h-7 bg-gold/30 rounded-full relative cursor-pointer">
                <div className="w-5 h-5 bg-gold rounded-full absolute top-1 right-1 shadow-sm"></div>
              </div>
            </div>
            <div className="flex items-center justify-between p-6 rounded-2xl bg-sahara/30 border border-gold/5">
              <div>
                <p className="font-bold text-henna">Language</p>
                <p className="text-sm text-henna/40">Choose your preferred language</p>
              </div>
              <select className="px-4 py-2 rounded-xl border border-gold/20 bg-white/50 font-serif text-sm">
                <option>English</option>
                <option>العربية</option>
                <option>Français</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-6 rounded-2xl bg-sahara/30 border border-gold/5">
              <div>
                <p className="font-bold text-henna">Currency</p>
                <p className="text-sm text-henna/40">Display prices in your currency</p>
              </div>
              <select className="px-4 py-2 rounded-xl border border-gold/20 bg-white/50 font-serif text-sm">
                <option>AED (د.إ)</option>
                <option>USD ($)</option>
                <option>MAD (DH)</option>
                <option>SAR (﷼)</option>
              </select>
            </div>
          </div>

          {user.role === UserRole.GUEST && (
            <div className="p-8 rounded-2xl bg-gold/5 border border-gold/20 space-y-4">
              <h3 className="heading-vogue text-lg text-henna">Upgrade Your Account</h3>
              <p className="text-sm text-henna/50 font-serif italic">Apply for a Buyer or Supplier account to unlock wholesale pricing and trade features.</p>
              <div className="flex gap-4">
                <button
                  onClick={() => onNavigate('APPLY_BUYER')}
                  className="px-8 py-3 bg-henna text-white rounded-full heading-vogue text-[10px] tracking-[0.3em] hover:bg-majorelle transition-all"
                >
                  Apply as Buyer
                </button>
                <button
                  onClick={() => onNavigate('APPLY_SUPPLIER')}
                  className="px-8 py-3 border border-gold/30 text-henna rounded-full heading-vogue text-[10px] tracking-[0.3em] hover:bg-sahara/50 transition-all"
                >
                  Apply as Supplier
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Amud Vault', view: 'AMUD_ENGINE' },
          { label: 'AI Studio', view: 'AI_STUDIO' },
          { label: 'About OUROZ', view: 'ABOUT' },
          { label: 'Collective', view: 'SHOP' },
        ].map((link, i) => (
          <button
            key={i}
            onClick={() => onNavigate(link.view)}
            className="p-4 rounded-2xl bg-sahara/30 border border-gold/10 text-center hover:bg-gold/10 hover:border-gold/30 transition-all"
          >
            <p className="heading-vogue text-[10px] text-henna tracking-[0.2em]">{link.label}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AccountPage;
