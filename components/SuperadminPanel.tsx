
import React, { useState } from 'react';
import { HotelTenant, ModuleConfig } from '../types';
import { Icons } from '../constants';

interface SuperadminPanelProps {
  tenants: HotelTenant[];
  setTenants: React.Dispatch<React.SetStateAction<HotelTenant[]>>;
  theme?: 'light' | 'dark';
}

const SuperadminPanel: React.FC<SuperadminPanelProps> = ({ tenants, setTenants, theme = 'dark' }) => {
  const isDark = theme === 'dark';
  const [isAdding, setIsAdding] = useState(false);
  const [newHotel, setNewHotel] = useState({ 
    name: '', 
    ownerName: '', 
    location: '', 
    username: '', 
    password: '',
    clientId: '' 
  });
  
  const [modules, setModules] = useState<ModuleConfig>({
    inventory: true,
    reservations: true,
    personnel: true,
    accounting: true,
    concierge: true
  });

  const handleAddHotel = () => {
    if (!newHotel.name || !newHotel.ownerName || !newHotel.clientId || !newHotel.username || !newHotel.password) {
      alert("All fields are mandatory for node initialization.");
      return;
    }

    // Check for duplicate clientId
    if (tenants.some(t => t.clientId.toUpperCase() === newHotel.clientId.toUpperCase())) {
      alert("Error: Client ID already exists in the network.");
      return;
    }
    
    const tenant: HotelTenant = {
      id: Date.now().toString(),
      clientId: newHotel.clientId.toUpperCase(),
      name: newHotel.name,
      ownerName: newHotel.ownerName,
      username: newHotel.username,
      location: newHotel.location,
      onboardedAt: new Date().toISOString().split('T')[0],
      status: 'Active',
      modules: { ...modules },
      isSetupComplete: false
    };

    setTenants([tenant, ...tenants]);
    setIsAdding(false);
    setNewHotel({ name: '', ownerName: '', location: '', username: '', password: '', clientId: '' });
  };

  return (
    <div className="p-4 sm:p-10 space-y-8 animate-fadeIn max-w-[1400px] mx-auto pb-24">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className={`text-2xl lg:text-3xl font-black uppercase tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>Property Provisioning</h2>
          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em] mt-1">Network Infrastructure Control</p>
        </div>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className={`${isDark ? 'bg-amber-500 text-black' : 'bg-slate-900 text-white'} px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-3 shadow-xl active:scale-95 w-full sm:w-auto justify-center`}
          >
            <Icons.Add /> Provision New Node
          </button>
        )}
      </div>

      {isAdding && (
        <div className={`border-2 p-6 sm:p-10 rounded-[2.5rem] shadow-2xl animate-fadeIn relative ${isDark ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-100'}`}>
           <button onClick={() => setIsAdding(false)} className="absolute top-8 right-8 p-2 text-slate-400 hover:text-red-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
           </button>

          <h3 className="text-lg font-black mb-8 uppercase tracking-tight">Node Deployment Config</h3>
          
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Client ID</label>
                  <input type="text" placeholder="EX: LUX-01" className={`w-full p-4 rounded-xl outline-none font-black text-xs border uppercase ${isDark ? 'bg-black/40 border-white/5 text-amber-500' : 'bg-slate-50 border-slate-200 text-slate-900'}`} value={newHotel.clientId} onChange={e => setNewHotel({...newHotel, clientId: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Region</label>
                  <input type="text" placeholder="City, Country" className={`w-full p-4 rounded-xl border outline-none font-bold text-xs ${isDark ? 'bg-black/40 border-white/5 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} value={newHotel.location} onChange={e => setNewHotel({...newHotel, location: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Property Name</label>
                <input type="text" placeholder="Full Brand Name" className={`w-full p-4 rounded-xl border outline-none font-black text-sm ${isDark ? 'bg-black/40 border-white/5 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} value={newHotel.name} onChange={e => setNewHotel({...newHotel, name: e.target.value})} />
              </div>

              <div className={`p-6 rounded-3xl border ${isDark ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest mb-4">Master Account</p>
                <div className="space-y-4">
                  <input type="text" placeholder="Owner Full Name" className={`w-full p-3 rounded-xl border outline-none text-xs font-bold ${isDark ? 'bg-slate-900 border-white/5 text-white' : 'bg-white border-slate-200'}`} value={newHotel.ownerName} onChange={e => setNewHotel({...newHotel, ownerName: e.target.value})} />
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder="Username" className={`w-full p-3 rounded-xl border outline-none text-xs font-bold ${isDark ? 'bg-slate-900 border-white/5 text-white' : 'bg-white border-slate-200'}`} value={newHotel.username} onChange={e => setNewHotel({...newHotel, username: e.target.value})} />
                    <input type="password" placeholder="Password" className={`w-full p-3 rounded-xl border outline-none text-xs font-bold ${isDark ? 'bg-slate-900 border-white/5 text-white' : 'bg-white border-slate-200'}`} value={newHotel.password} onChange={e => setNewHotel({...newHotel, password: e.target.value})} />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8 flex flex-col">
              <div className="space-y-6 flex-1">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Provision Core Modules</label>
                <div className="grid grid-cols-2 gap-3">
                  {(Object.keys(modules) as Array<keyof ModuleConfig>).map((key) => (
                    <button 
                      key={key} 
                      onClick={() => setModules(prev => ({ ...prev, [key]: !prev[key] }))}
                      className={`p-4 rounded-xl border text-left flex justify-between items-center transition-all ${modules[key] ? 'border-amber-500 bg-amber-500/5' : (isDark ? 'border-white/5 opacity-40' : 'border-slate-100 opacity-40')}`}
                    >
                      <span className="text-[9px] font-black uppercase tracking-tight">{key}</span>
                      <div className={`w-3 h-3 rounded-full border ${modules[key] ? 'bg-amber-500 border-amber-500' : 'border-slate-400'}`} />
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={handleAddHotel} className={`w-full py-5 rounded-3xl font-black text-[10px] uppercase tracking-[0.4em] mt-6 transition-all shadow-xl active:scale-[0.98] ${isDark ? 'bg-white text-black hover:bg-amber-500' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>
                Provision Infrastructure
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tenants Table */}
      <div className={`rounded-[2.5rem] border overflow-hidden shadow-sm ${isDark ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-100'}`}>
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left">
            <thead className={`${isDark ? 'bg-black/40 text-slate-500' : 'bg-slate-50 text-slate-400'}`}>
              <tr>
                <th className="p-6 uppercase text-[9px] tracking-widest font-black">Client Node</th>
                <th className="p-6 uppercase text-[9px] tracking-widest font-black">Property Details</th>
                <th className="p-6 uppercase text-[9px] tracking-widest font-black hidden sm:table-cell">Location</th>
                <th className="p-6 uppercase text-[9px] tracking-widest font-black text-center">Admin Handle</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-white/5' : 'divide-slate-50'}`}>
              {tenants.map(t => (
                <tr key={t.id} className="group hover:bg-amber-500/5 transition-colors">
                  <td className="p-6">
                    <span className="font-mono font-black text-amber-500 text-[10px] bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20">{t.clientId}</span>
                  </td>
                  <td className="p-6">
                    <div className="font-black text-sm">{t.name}</div>
                    <div className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">{t.ownerName}</div>
                  </td>
                  <td className="p-6 hidden sm:table-cell">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-tighter">{t.location}</div>
                  </td>
                  <td className="p-6 text-center">
                    <div className={`text-[9px] font-black font-mono px-3 py-1 rounded-full border inline-block ${isDark ? 'border-white/5 text-slate-400' : 'border-slate-100 text-slate-500'}`}>
                      @{t.username}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {tenants.length === 0 && (
          <div className="p-20 text-center opacity-20 font-black uppercase text-[10px] tracking-[0.5em]">No nodes active</div>
        )}
      </div>
    </div>
  );
};

export default SuperadminPanel;
