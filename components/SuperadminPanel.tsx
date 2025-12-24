
import React, { useState } from 'react';
import { HotelTenant, ModuleConfig } from '../types';
import { generateClientID } from '../lib/supabase';
import { Icons } from '../constants';

interface SuperadminPanelProps {
  theme?: 'light' | 'dark';
}

const SuperadminPanel: React.FC<SuperadminPanelProps> = ({ theme = 'dark' }) => {
  const isDark = theme === 'dark';
  const [tenants, setTenants] = useState<HotelTenant[]>([
    { 
      id: '1', 
      clientId: 'NYC782', 
      name: 'Grand Plaza NYC', 
      ownerName: 'Robert De Niro',
      username: 'grand_admin',
      location: 'New York', 
      onboardedAt: '2023-12-01', 
      status: 'Active',
      modules: { inventory: true, reservations: true, personnel: true, accounting: false, concierge: true }
    },
    { 
      id: '2', 
      clientId: 'LHR091', 
      name: 'Regent London', 
      ownerName: 'James Bond',
      username: 'regent_hq',
      location: 'London', 
      onboardedAt: '2024-01-15', 
      status: 'Active',
      modules: { inventory: true, reservations: true, personnel: false, accounting: true, concierge: false }
    }
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newHotel, setNewHotel] = useState({ 
    name: '', 
    ownerName: '', 
    location: '', 
    username: '', 
    password: '',
    clientId: generateClientID() 
  });
  
  const [modules, setModules] = useState<ModuleConfig>({
    inventory: true,
    reservations: true,
    personnel: false,
    accounting: false,
    concierge: false
  });

  const handleAddHotel = () => {
    if (!newHotel.name || !newHotel.ownerName || !newHotel.clientId) return;
    
    const tenant: HotelTenant = {
      id: Date.now().toString(),
      clientId: newHotel.clientId.toUpperCase(),
      name: newHotel.name,
      ownerName: newHotel.ownerName,
      username: newHotel.username,
      location: newHotel.location,
      onboardedAt: new Date().toISOString().split('T')[0],
      status: 'Active',
      modules: { ...modules }
    };

    setTenants([tenant, ...tenants]);
    setIsAdding(false);
    setNewHotel({ 
      name: '', 
      ownerName: '', 
      location: '', 
      username: '', 
      password: '', 
      clientId: generateClientID() 
    });
  };

  const toggleModule = (key: keyof ModuleConfig) => {
    setModules(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="p-6 sm:p-10 space-y-8 animate-fadeIn max-w-[1400px] mx-auto pb-32 lg:pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <div>
          <h2 className={`text-3xl lg:text-4xl font-black tracking-tighter uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>Tenant Management</h2>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em] mt-2">Enterprise provisioning terminal</p>
        </div>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className={`${isDark ? 'bg-amber-500 text-black shadow-amber-500/10' : 'bg-indigo-600 text-white shadow-indigo-600/10'} px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95`}
          >
            <Icons.Add /> Onboard New Instance
          </button>
        )}
      </div>

      {isAdding && (
        <div className={`border-2 p-6 sm:p-10 rounded-[2.5rem] shadow-2xl animate-slideDown overflow-hidden relative ${isDark ? 'bg-slate-900 border-amber-500/20' : 'bg-white border-indigo-500/20'}`}>
           <div className="absolute top-8 right-8">
              <button onClick={() => setIsAdding(false)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
           </div>

          <h3 className={`text-xl font-black mb-8 tracking-tight uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>Database Deployment Config</h3>
          
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Scope ID (Auto)</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      readOnly
                      className={`w-full p-4 rounded-2xl outline-none font-mono font-black text-sm uppercase ${isDark ? 'bg-black/40 text-amber-500 border border-white/5' : 'bg-slate-50 text-indigo-600 border border-slate-100'}`}
                      value={newHotel.clientId}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Geographic Region</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Dubai" 
                    className={`w-full p-4 rounded-2xl outline-none font-bold text-sm border ${isDark ? 'bg-black/40 text-white border-white/10 focus:border-amber-500' : 'bg-slate-50 text-slate-900 border-slate-100 focus:border-indigo-600'}`}
                    value={newHotel.location}
                    onChange={e => setNewHotel({...newHotel, location: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Hotel Corporate Name</label>
                <input 
                  type="text" 
                  placeholder="Atlantis The Palm" 
                  className={`w-full p-4 rounded-2xl outline-none font-black text-lg border ${isDark ? 'bg-black/40 text-white border-white/10 focus:border-amber-500' : 'bg-slate-50 text-slate-900 border-slate-100 focus:border-indigo-600'}`}
                  value={newHotel.name}
                  onChange={e => setNewHotel({...newHotel, name: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Master Account Principal</label>
                <input 
                  type="text" 
                  placeholder="Owner / CEO Name" 
                  className={`w-full p-4 rounded-2xl outline-none font-bold text-sm border ${isDark ? 'bg-black/40 text-white border-white/10 focus:border-amber-500' : 'bg-slate-50 text-slate-900 border-slate-100 focus:border-indigo-600'}`}
                  value={newHotel.ownerName}
                  onChange={e => setNewHotel({...newHotel, ownerName: e.target.value})}
                />
              </div>
            </div>

            <div className={`p-8 rounded-[2rem] space-y-6 flex flex-col border ${isDark ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] pb-3 border-b border-slate-200/10">Feature Matrix Provisions</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                {(Object.keys(modules) as Array<keyof ModuleConfig>).map((key) => (
                  <label key={key} className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all shadow-sm group ${modules[key] ? (isDark ? 'bg-amber-500/10 border-amber-500/20' : 'bg-indigo-600/10 border-indigo-600/20') : (isDark ? 'bg-white/5 border-transparent hover:border-white/10' : 'bg-white border-transparent hover:border-slate-200')}`}>
                    <input 
                      type="checkbox" 
                      checked={modules[key]} 
                      onChange={() => toggleModule(key)}
                      className="w-5 h-5 accent-amber-500 rounded-lg"
                    />
                    <div className="flex-1">
                      <p className={`text-[10px] font-black uppercase tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{key}</p>
                    </div>
                  </label>
                ))}
              </div>
              <button 
                onClick={handleAddHotel} 
                className={`w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all shadow-2xl active:scale-[0.98] ${isDark ? 'bg-white text-black hover:bg-amber-500' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
              >
                Provision Instance
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tenants View */}
      <div className={`rounded-[2.5rem] border overflow-hidden shadow-sm transition-colors duration-500 ${isDark ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-100'}`}>
        <div className="hidden lg:block">
          <table className="w-full text-left">
            <thead className={`${isDark ? 'bg-black text-slate-500' : 'bg-slate-50 text-slate-400'}`}>
              <tr>
                <th className="p-6 uppercase text-[10px] tracking-[0.3em] font-black">Client Node</th>
                <th className="p-6 uppercase text-[10px] tracking-[0.3em] font-black">Brand Identity</th>
                <th className="p-6 uppercase text-[10px] tracking-[0.3em] font-black">Region</th>
                <th className="p-6 uppercase text-[10px] tracking-[0.3em] font-black">Modules</th>
                <th className="p-6 uppercase text-[10px] tracking-[0.3em] font-black text-center">Terminal</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-white/5' : 'divide-slate-50'}`}>
              {tenants.map(t => (
                <tr key={t.id} className={`transition-colors group ${isDark ? 'hover:bg-white/[0.01]' : 'hover:bg-slate-50'}`}>
                  <td className="p-6">
                    <span className="font-mono font-black text-amber-600 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20 text-[10px]">{t.clientId}</span>
                  </td>
                  <td className="p-6">
                    <div className={`font-black text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>{t.name}</div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Lead: {t.ownerName}</div>
                  </td>
                  <td className="p-6">
                    <div className={`text-sm font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{t.location}</div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Sync: {t.onboardedAt}</div>
                  </td>
                  <td className="p-6">
                    <div className="flex gap-1.5 flex-wrap max-w-[140px]">
                      {Object.entries(t.modules).map(([mod, active]) => active && (
                        <span key={mod} className={`text-[8px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-full ${isDark ? 'bg-white/5 text-slate-400' : 'bg-slate-100 text-slate-600'}`}>
                          {mod}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-6 text-center">
                    <button className={`p-2 rounded-xl transition-all ${isDark ? 'text-slate-500 hover:text-amber-500 hover:bg-amber-500/10' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'}`}>
                      <Icons.Dashboard />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View - Cards */}
        <div className="lg:hidden divide-y divide-slate-100">
          {tenants.map(t => (
            <div key={t.id} className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-mono font-black text-amber-600 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20 text-[10px]">{t.clientId}</span>
                  <h4 className={`text-xl font-black mt-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>{t.name}</h4>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">{t.location}</p>
                </div>
                <button className="p-3 bg-slate-100 text-slate-600 rounded-2xl"><Icons.Dashboard /></button>
              </div>
              <div className={`p-4 rounded-2xl flex flex-wrap gap-2 ${isDark ? 'bg-black/20' : 'bg-slate-50'}`}>
                {Object.entries(t.modules).map(([mod, active]) => active && (
                  <span key={mod} className="text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-lg bg-white/10 text-slate-500">
                    {mod}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuperadminPanel;
