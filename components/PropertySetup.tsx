
import React, { useState } from 'react';
import { PropertySetupData, Room } from '../types';
import Logo from './Logo';

interface PropertySetupProps {
  onComplete: (data: PropertySetupData) => void;
  theme?: 'light' | 'dark';
}

const PropertySetup: React.FC<PropertySetupProps> = ({ onComplete, theme = 'dark' }) => {
  const [step, setStep] = useState(1);
  const isDark = theme === 'dark';

  const [setupData, setSetupData] = useState<PropertySetupData>({
    address: '',
    taxId: '',
    floors: 1,
    totalRooms: 0,
    currency: 'USD',
    roomCategories: ['Superior', 'Deluxe', 'Standard'],
    roomInventory: []
  });

  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const nextStep = () => {
    if (step === 2 && setupData.totalRooms > 0) {
      const roomsPerFloor = Math.ceil(setupData.totalRooms / setupData.floors);
      const inv: Room[] = Array.from({ length: setupData.totalRooms }).map((_, i) => {
        const floor = Math.floor(i / roomsPerFloor) + 1;
        const roomInFloor = (i % roomsPerFloor) + 1;
        return {
          id: `room-${i}-${Date.now()}`,
          number: `${floor}${roomInFloor.toString().padStart(2, '0')}`,
          category: setupData.roomCategories[0],
          status: 'Available',
          floor: floor
        };
      });
      setSetupData({ ...setupData, roomInventory: inv });
    }
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const finalize = () => {
    onComplete(setupData);
  };

  return (
    <div className={`fixed inset-0 z-[200] flex items-center justify-center p-4 transition-colors duration-700 ${isDark ? 'bg-slate-950/95' : 'bg-slate-100/95'} backdrop-blur-xl overflow-y-auto`}>
      <div className={`w-full max-w-4xl rounded-[2.5rem] lg:rounded-[3rem] shadow-2xl border transition-all duration-500 overflow-hidden ${isDark ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-200'}`}>
        
        {/* Header */}
        <div className={`p-6 lg:p-10 border-b flex flex-col sm:flex-row justify-between items-center gap-4 ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
          <div className="text-center sm:text-left">
            <h2 className={`text-xl lg:text-3xl font-black uppercase tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>Property Architect</h2>
            <p className="text-amber-500 text-[9px] font-black uppercase tracking-[0.3em] mt-1">Configure your hospitality core</p>
          </div>
          <div className="flex gap-1.5 lg:gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className={`h-1 lg:h-1.5 w-8 lg:w-10 rounded-full transition-all duration-500 ${step >= s ? 'bg-amber-500' : (isDark ? 'bg-white/10' : 'bg-slate-100')}`} />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 lg:p-10 max-h-[60vh] overflow-y-auto hide-scrollbar">
          {step === 1 && (
            <div className="space-y-6 lg:space-y-10 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                <div className="space-y-4">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Brand Logo</label>
                  <div className={`relative h-40 lg:h-56 rounded-3xl border-2 border-dashed flex items-center justify-center transition-all group overflow-hidden ${isDark ? 'border-white/10 bg-black/20' : 'border-slate-200 bg-slate-50'}`}>
                    {logoPreview ? (
                      <img src={logoPreview} className="w-full h-full object-contain p-4" alt="Hotel Logo" />
                    ) : (
                      <div className="text-center space-y-2 opacity-50">
                        <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                        <p className="text-[8px] font-black uppercase tracking-widest">Identify your Node</p>
                      </div>
                    )}
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleLogoUpload} accept="image/*" />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Address</label>
                    <textarea 
                      placeholder="Property Location Details..."
                      className={`w-full p-4 rounded-2xl border outline-none font-bold text-sm h-28 lg:h-32 resize-none ${isDark ? 'bg-black/40 border-white/5 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                      value={setupData.address}
                      onChange={e => setSetupData({...setupData, address: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3 lg:gap-4">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Tax ID</label>
                      <input type="text" placeholder="GST/Udyam" className={`w-full p-3.5 rounded-xl border outline-none font-black text-[10px] uppercase ${isDark ? 'bg-black/40 border-white/5 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} value={setupData.taxId} onChange={e => setSetupData({...setupData, taxId: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Currency</label>
                      <select className={`w-full p-3.5 rounded-xl border outline-none font-black text-[10px] ${isDark ? 'bg-black/40 border-white/5 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`} value={setupData.currency} onChange={e => setSetupData({...setupData, currency: e.target.value})}>
                        <option value="INR">INR (₹)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-fadeIn py-4">
              <div className="max-w-xl mx-auto space-y-8">
                <div className="text-center space-y-1">
                  <h3 className="text-lg font-black uppercase tracking-tight">Physical Scale</h3>
                  <p className="text-slate-500 text-[10px] font-bold">Define the magnitude of your property.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-8">
                  <div className={`p-6 lg:p-10 rounded-3xl border text-center space-y-4 ${isDark ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-amber-500">Total Floors</label>
                    <input type="number" min="1" className={`w-full text-center text-4xl font-black bg-transparent outline-none ${isDark ? 'text-white' : 'text-slate-900'}`} value={setupData.floors} onChange={e => setSetupData({...setupData, floors: parseInt(e.target.value) || 1})} />
                  </div>
                  <div className={`p-6 lg:p-10 rounded-3xl border text-center space-y-4 ${isDark ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-amber-500">Total Rooms</label>
                    <input type="number" min="1" className={`w-full text-center text-4xl font-black bg-transparent outline-none ${isDark ? 'text-white' : 'text-slate-900'}`} value={setupData.totalRooms} onChange={e => setSetupData({...setupData, totalRooms: parseInt(e.target.value) || 0})} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 lg:space-y-8 animate-fadeIn">
               <div className="text-center space-y-1">
                  <h3 className="text-lg font-black uppercase tracking-tight">Room Categories</h3>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Identify your suite levels</p>
                </div>
                <div className="flex flex-wrap gap-3 justify-center">
                  {setupData.roomCategories.map((cat, i) => (
                    <div key={i} className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl border ${isDark ? 'bg-black/40 border-amber-500/20' : 'bg-white border-slate-200'}`}>
                      <span className="font-black text-xs">{cat}</span>
                      <button onClick={() => setSetupData({...setupData, roomCategories: setupData.roomCategories.filter((_, idx) => idx !== i)})} className="text-red-500 font-black">×</button>
                    </div>
                  ))}
                  <button 
                    onClick={() => {
                      const name = prompt("Category Name:");
                      if (name) setSetupData({...setupData, roomCategories: [...setupData.roomCategories, name]});
                    }}
                    className={`px-5 py-3.5 rounded-2xl border-2 border-dashed font-black text-[10px] uppercase tracking-widest ${isDark ? 'border-white/10 text-slate-500' : 'border-slate-200 text-slate-400'}`}
                  >
                    + Add Category
                  </button>
                </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-8 animate-fadeIn">
              <div className="text-center space-y-1">
                <h3 className="text-lg font-black uppercase tracking-tight">Inventory Map</h3>
                <p className="text-slate-500 text-[10px] font-bold">Assign identities to your physical nodes.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {setupData.roomInventory.map((room, i) => (
                  <div key={i} className={`p-4 rounded-2xl border flex items-center gap-3 ${isDark ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                    <input type="text" value={room.number} onChange={e => {
                      const newInv = [...setupData.roomInventory];
                      newInv[i].number = e.target.value;
                      setSetupData({...setupData, roomInventory: newInv});
                    }} className={`w-14 p-2.5 rounded-xl font-black text-center text-xs ${isDark ? 'bg-slate-800' : 'bg-white'}`} />
                    <select value={room.category} onChange={e => {
                      const newInv = [...setupData.roomInventory];
                      newInv[i].category = e.target.value;
                      setSetupData({...setupData, roomInventory: newInv});
                    }} className={`flex-1 p-2.5 rounded-xl font-bold text-[10px] ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
                      {setupData.roomCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`p-6 lg:p-10 border-t flex justify-between items-center ${isDark ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
          {step > 1 ? (
            <button onClick={prevStep} className="px-6 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest text-slate-500 hover:text-amber-500 transition-colors">
              Back
            </button>
          ) : <div />}
          
          {step < 4 ? (
            <button 
              onClick={nextStep}
              disabled={step === 2 && setupData.totalRooms <= 0}
              className={`px-8 lg:px-12 py-4 lg:py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl active:scale-95 ${
                isDark ? 'bg-amber-500 text-black' : 'bg-slate-900 text-white'
              } disabled:opacity-50`}
            >
              Continue
            </button>
          ) : (
            <button 
              onClick={finalize}
              className={`px-8 lg:px-12 py-4 lg:py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl active:scale-95 ${
                isDark ? 'bg-white text-black' : 'bg-amber-500 text-black'
              }`}
            >
              Initialize Property
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertySetup;
