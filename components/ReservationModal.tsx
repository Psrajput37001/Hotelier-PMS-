
import React, { useState, useEffect } from 'react';
import { Reservation, ReservationStatus, BookingSource, PropertySetupData } from '../types';
import { Icons } from '../constants';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (res: Reservation) => void;
  booking?: Reservation;
  theme: 'light' | 'dark';
  setupData?: PropertySetupData;
  clientId: string;
}

const ReservationModal: React.FC<ReservationModalProps> = ({ isOpen, onClose, onSave, booking, theme, setupData, clientId }) => {
  const isDark = theme === 'dark';
  const [formData, setFormData] = useState<Partial<Reservation>>(booking || {
    id: `RES-${Math.floor(Math.random() * 9000) + 1000}`,
    clientId,
    guestName: '',
    email: '',
    phone: '',
    roomNumber: '',
    roomType: setupData?.roomCategories[0] || 'Standard',
    checkIn: new Date().toISOString().split('T')[0],
    checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    adults: 1,
    children: 0,
    status: 'Pending',
    source: 'Walk-In',
    totalAmount: 0,
    specialRequests: '',
    internalNotes: '',
    createdAt: new Date().toISOString()
  });

  const [pricing, setPricing] = useState(0);

  // Dynamic Pricing Logic
  useEffect(() => {
    const calculateTotal = () => {
      if (!formData.checkIn || !formData.checkOut) return 0;
      
      const start = new Date(formData.checkIn);
      const end = new Date(formData.checkOut);
      const nights = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)));
      
      // Base pricing from room category
      let rate = 150; // Default fallback
      if (formData.roomType === 'Superior') rate = 250;
      if (formData.roomType === 'Deluxe') rate = 450;
      if (formData.roomType === 'Presidential') rate = 1200;

      // Seasonal / Weekend Multiplier (simplified)
      const dayOfWeek = start.getDay();
      const multiplier = (dayOfWeek === 0 || dayOfWeek === 6) ? 1.2 : 1.0;

      // Guest logic
      const extraGuestCharge = (formData.adults || 1) > 2 ? ((formData.adults || 1) - 2) * 50 : 0;
      
      const total = (rate * nights * multiplier) + (extraGuestCharge * nights);
      const withTax = total * 1.18; // 18% GST

      setPricing(parseFloat(withTax.toFixed(2)));
      setFormData(prev => ({ ...prev, totalAmount: parseFloat(withTax.toFixed(2)) }));
    };

    calculateTotal();
  }, [formData.checkIn, formData.checkOut, formData.roomType, formData.adults]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Reservation);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className={`w-full max-w-4xl rounded-[2.5rem] border shadow-2xl overflow-hidden transition-all duration-500 ${isDark ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-100'}`}>
        {/* Header */}
        <div className={`p-8 border-b flex justify-between items-center ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
          <div>
            <h3 className={`text-2xl font-black tracking-tighter uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {booking ? 'Update Manifest' : 'Initialize Reservation'}
            </h3>
            <p className="text-amber-500 text-[9px] font-black uppercase tracking-[0.4em] mt-1">Terminal Secure Mode • {formData.id}</p>
          </div>
          <button onClick={onClose} className="p-3 rounded-full hover:bg-red-500/10 text-slate-500 hover:text-red-500 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 lg:p-10 flex flex-col lg:flex-row gap-10">
          <div className="flex-1 space-y-6">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Guest Identification</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder="Guest Full Name" 
                  required
                  className={`w-full p-4 rounded-xl border outline-none font-bold text-sm ${isDark ? 'bg-black/40 border-white/5 text-white focus:border-amber-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-600'}`}
                  value={formData.guestName}
                  onChange={e => setFormData({...formData, guestName: e.target.value})}
                />
                <input 
                  type="text" 
                  placeholder="Contact Frequency (Phone)" 
                  required
                  className={`w-full p-4 rounded-xl border outline-none font-bold text-sm ${isDark ? 'bg-black/40 border-white/5 text-white focus:border-amber-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-600'}`}
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <input 
                type="email" 
                placeholder="Digital Mail (Email Address)" 
                required
                className={`w-full p-4 rounded-xl border outline-none font-bold text-sm ${isDark ? 'bg-black/40 border-white/5 text-white focus:border-amber-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-600'}`}
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Operational Parameters</label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                   <span className="text-[8px] font-black text-amber-500 uppercase ml-1">Arrival</span>
                   <input 
                    type="date" 
                    required
                    className={`w-full p-4 rounded-xl border outline-none font-bold text-xs ${isDark ? 'bg-black/40 border-white/5 text-white focus:border-amber-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-600'}`}
                    value={formData.checkIn}
                    onChange={e => setFormData({...formData, checkIn: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                   <span className="text-[8px] font-black text-amber-500 uppercase ml-1">Departure</span>
                   <input 
                    type="date" 
                    required
                    className={`w-full p-4 rounded-xl border outline-none font-bold text-xs ${isDark ? 'bg-black/40 border-white/5 text-white focus:border-amber-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-600'}`}
                    value={formData.checkOut}
                    onChange={e => setFormData({...formData, checkOut: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Room Node</label>
                <select 
                  className={`w-full p-4 rounded-xl border outline-none font-bold text-xs ${isDark ? 'bg-black/40 border-white/5 text-white' : 'bg-slate-50 border-slate-200'}`}
                  value={formData.roomNumber}
                  onChange={e => setFormData({...formData, roomNumber: e.target.value})}
                  required
                >
                  <option value="">Auto Allocate</option>
                  {setupData?.roomInventory.map(r => (
                    <option key={r.id} value={r.number}>{r.number} ({r.category})</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 ml-1">Lifecycle Status</label>
                <select 
                  className={`w-full p-4 rounded-xl border outline-none font-bold text-xs ${isDark ? 'bg-black/40 border-white/5 text-white' : 'bg-slate-50 border-slate-200'}`}
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value as ReservationStatus})}
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Checked-In">Checked-In</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          <aside className="w-full lg:w-80 space-y-6">
             <div className={`p-8 rounded-[2rem] border-2 border-amber-500/30 flex flex-col items-center justify-center relative overflow-hidden ${isDark ? 'bg-amber-500/5' : 'bg-amber-50'}`}>
                <div className="absolute top-0 right-0 p-2 opacity-20">
                   <Icons.Accounting />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500 mb-2">Calculated Total</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold opacity-60">{setupData?.currency || '$'}</span>
                  <span className="text-4xl font-black tracking-tighter">{pricing.toLocaleString()}</span>
                </div>
                <p className="text-[8px] font-black text-slate-500 uppercase mt-4 tracking-widest text-center italic">Includes Dynamic Multipliers & 18% Tax</p>
             </div>

             <div className="space-y-4">
                <div className="flex gap-4">
                   <div className="flex-1 space-y-2">
                      <label className="text-[9px] font-black uppercase text-slate-500 ml-1">Adults</label>
                      <input type="number" min="1" className={`w-full p-3 rounded-xl border font-black text-center ${isDark ? 'bg-black/20 border-white/5' : 'bg-white'}`} value={formData.adults} onChange={e => setFormData({...formData, adults: parseInt(e.target.value)})}/>
                   </div>
                   <div className="flex-1 space-y-2">
                      <label className="text-[9px] font-black uppercase text-slate-500 ml-1">Kids</label>
                      <input type="number" min="0" className={`w-full p-3 rounded-xl border font-black text-center ${isDark ? 'bg-black/20 border-white/5' : 'bg-white'}`} value={formData.children} onChange={e => setFormData({...formData, children: parseInt(e.target.value)})}/>
                   </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-500 ml-1">Booking Source</label>
                  <select className={`w-full p-3 rounded-xl border font-black text-xs ${isDark ? 'bg-black/20 border-white/5' : 'bg-white'}`} value={formData.source} onChange={e => setFormData({...formData, source: e.target.value as BookingSource})}>
                    <option value="Walk-In">Walk-In</option>
                    <option value="Phone">Phone</option>
                    <option value="Online">Online</option>
                    <option value="OTA">OTA (Expedia/Booking)</option>
                  </select>
                </div>
             </div>

             <button type="submit" className={`w-full py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.4em] transition-all shadow-2xl active:scale-95 ${isDark ? 'bg-amber-500 text-black shadow-amber-500/30' : 'bg-slate-900 text-white shadow-slate-900/30'}`}>
                Finalize Entry
             </button>
          </aside>
        </form>
      </div>
    </div>
  );
};

export default ReservationModal;
