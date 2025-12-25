
import React, { useState } from 'react';
import { PropertySetupData } from '../types';
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
      // Pre-populate inventory grid
      const inv = Array.from({ length: setupData.totalRooms }).map((_, i) => ({
        number: `${Math.floor(i / (setupData.totalRooms / setupData.floors) + 1)}${(i % (setupData.totalRooms / setupData.floors) + 1).toString().padStart(2, '0')}`,
        category: setupData.roomCategories[0]
      }));
      setSetupData({ ...setupData, roomInventory: inv });
    }
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const finalize = () => {
    onComplete(setupData);
  };

  return (
    <div className={`fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 transition-colors duration-700 ${isDark ? 'bg-slate-950/95' : 'bg-slate-100/95'} backdrop-blur-xl overflow-y-auto`}>
      <div className={`w-full max-w-4xl rounded-[3rem] shadow-2xl border transition-all duration-500 overflow-hidden ${isDark ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-200'}`}>
        
        {/* Header Area */}
        <div className={`p-8 lg:p-12 border-b flex flex-col sm:flex-row justify-between items-center gap-6 ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
          <div className="text-center sm:text-left">
            <h2 className={`text-3xl font-black tracking-tighter uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>Property Architect</h2>
            <p className="text-amber-500 text-[10px] font-black uppercase tracking-[0.4em] mt-1">Configure your hospitality core</p>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className={`h-1.5 w-10 rounded-full transition-all duration-500 ${step >= s ? 'bg-amber-500' : (isDark ? 'bg-white/10' : 'bg-slate-100')}`} />
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8 lg:p-12">
          {step === 1 && (
            <div className="space-y-8 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Brand Visual (Logo)</label>
                    <div className={`relative h-48 rounded-[2rem] border-2 border-dashed flex items-center justify-center transition-all group overflow-hidden ${isDark ? 'border-white/10 bg-black/20' : 'border-slate-200 bg-slate-50'}`}>
                      {logoPreview ? (
                        <img src={logoPreview} className="w-full h-full object-contain p-4" alt="Hotel Logo" />
                      ) : (
                        <div className="text-center space-y-2">
                          <svg className="w-10 h-10 mx-auto text-slate-500 group-hover:text-amber-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                          <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Click to Upload Identity</p>
                        </div>
                      )}
                      <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleLogoUpload} accept="image/*" />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Legal Address</label>
                    <textarea 
                      placeholder="Property Location Details..."
                      className={`w-full p-5 rounded-[1.5rem] border outline-none font-bold text-sm h-32 resize-none transition-all ${isDark ? 'bg-black/40 border-white/5 text-white focus:border-amber-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-600'}`}
                      value={setupData.address}
                      onChange={e => setSetupData({...setupData, address: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Tax / GST ID</label>
                      <input 
                        type="text" 
                        placeholder="GST123456"
                        className={`w-full p-4 rounded-xl border outline-none font-black text-xs uppercase ${isDark ? 'bg-black/40 border-white/5 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                        value={setupData.taxId}
                        onChange={e => setSetupData({...setupData, taxId: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Currency</label>
                      <select 
                        className={`w-full p-4 rounded-xl border outline-none font-black text-xs ${isDark ? 'bg-black/40 border-white/5 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                        value={setupData.currency}
                        onChange={e => setSetupData({...setupData, currency: e.target.value})}
                      >
                        <option value="INR">INR (₹)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-10 animate-fadeIn">
              <div className="max-w-xl mx-auto space-y-8">
                <div className="text-center space-y-2">
                  <h3 className={`text-xl font-black uppercase tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Physical Scale</h3>
                  <p className="text-slate-500 text-xs font-bold">Define the magnitude of your property nodes.</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className={`p-8 rounded-[2rem] border text-center space-y-4 ${isDark ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="text-4xl">🏢</div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-amber-500">Vertical Floors</label>
                    <input 
                      type="number" 
                      min="1"
                      className={`w-24 text-center text-3xl font-black bg-transparent border-b-2 outline-none ${isDark ? 'border-white/10 text-white' : 'border-slate-200 text-slate-900'}`}
                      value={setupData.floors}
                      onChange={e => setSetupData({...setupData, floors: parseInt(e.target.value) || 1})}
                    />
                  </div>

                  <div className={`p-8 rounded-[2rem] border text-center space-y-4 ${isDark ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="text-4xl">🛏️</div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-amber-500">Total Rooms</label>
                    <input 
                      type="number" 
                      min="1"
                      className={`w-24 text-center text-3xl font-black bg-transparent border-b-2 outline-none ${isDark ? 'border-white/10 text-white' : 'border-slate-200 text-slate-900'}`}
                      value={setupData.totalRooms}
                      onChange={e => setSetupData({...setupData, totalRooms: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-fadeIn">
               <div className="text-center space-y-2 mb-8">
                  <h3 className={`text-xl font-black uppercase tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Room Categories</h3>
                  <p className="text-slate-500 text-xs font-bold">What types of accommodations do you offer?</p>
                </div>
                <div className="flex flex-wrap gap-4 justify-center">
                  {setupData.roomCategories.map((cat, i) => (
                    <div key={i} className={`flex items-center gap-3 px-6 py-4 rounded-2xl border ${isDark ? 'bg-black/40 border-amber-500/20 text-white' : 'bg-white border-indigo-600/20 text-slate-900'}`}>
                      <span className="font-black text-sm">{cat}</span>
                      <button 
                        onClick={() => setSetupData({...setupData, roomCategories: setupData.roomCategories.filter((_, idx) => idx !== i)})}
                        className="text-red-500 font-black hover:scale-125 transition-transform"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={() => {
                      const name = prompt("Enter new category name:");
                      if (name) setSetupData({...setupData, roomCategories: [...setupData.roomCategories, name]});
                    }}
                    className={`px-6 py-4 rounded-2xl border-2 border-dashed font-black text-xs uppercase tracking-widest ${isDark ? 'border-white/10 text-slate-500 hover:text-white' : 'border-slate-200 text-slate-400 hover:text-indigo-600'}`}
                  >
                    + Add Category
                  </button>
                </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-8 animate-fadeIn">
              <div className="text-center space-y-2 mb-8">
                <h3 className={`text-xl font-black uppercase tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Inventory Mapping</h3>
                <p className="text-slate-500 text-xs font-bold">Assign identities to your physical room nodes.</p>
              </div>

              <div className="max-h-[400px] overflow-y-auto pr-4 hide-scrollbar space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {setupData.roomInventory.map((room, i) => (
                    <div key={i} className={`p-4 rounded-2xl border flex items-center gap-4 ${isDark ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                      <div className="w-10 text-[10px] font-black text-slate-500">#{i + 1}</div>
                      <input 
                        type="text" 
                        value={room.number}
                        onChange={e => {
                          const newInv = [...setupData.roomInventory];
                          newInv[i].number = e.target.value;
                          setSetupData({...setupData, roomInventory: newInv});
                        }}
                        className={`w-20 p-2 rounded-lg font-black text-center ${isDark ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'}`}
                        placeholder="No."
                      />
                      <select 
                        value={room.category}
                        onChange={e => {
                          const newInv = [...setupData.roomInventory];
                          newInv[i].category = e.target.value;
                          setSetupData({...setupData, roomInventory: newInv});
                        }}
                        className={`flex-1 p-2 rounded-lg font-bold text-[10px] ${isDark ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'}`}
                      >
                        {setupData.roomCategories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className={`p-8 lg:p-12 border-t flex justify-between items-center ${isDark ? 'border-white/5 bg-black/20' : 'border-slate-100 bg-slate-50'}`}>
          {step > 1 ? (
            <button onClick={prevStep} className="px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-colors">
              Previous Stage
            </button>
          ) : <div />}
          
          {step < 4 ? (
            <button 
              onClick={nextStep}
              disabled={step === 2 && setupData.totalRooms <= 0}
              className={`px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] transition-all shadow-xl active:scale-95 ${
                isDark ? 'bg-amber-500 text-black shadow-amber-500/20' : 'bg-indigo-600 text-white shadow-indigo-600/20'
              } disabled:opacity-50`}
            >
              Next Architecture Stage
            </button>
          ) : (
            <button 
              onClick={finalize}
              className={`px-12 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] transition-all shadow-xl active:scale-95 ${
                isDark ? 'bg-white text-black hover:bg-amber-500' : 'bg-slate-900 text-white hover:bg-indigo-600'
              }`}
            >
              Finalize Architecture
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertySetup;
