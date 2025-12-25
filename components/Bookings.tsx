
import React, { useState, useEffect } from 'react';
import { Reservation, UserSession, ReservationStatus, PropertySetupData } from '../types';
import { Icons } from '../constants';
import ReservationModal from './ReservationModal';

interface BookingsProps {
  theme?: 'light' | 'dark';
  session?: UserSession;
}

const Bookings: React.FC<BookingsProps> = ({ theme = 'dark', session }) => {
  const isDark = theme === 'dark';
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Reservation | undefined>(undefined);
  
  // Persistent Bookings Storage per Client
  const [bookings, setBookings] = useState<Reservation[]>(() => {
    const saved = localStorage.getItem(`bookings_${session?.clientId}`);
    if (saved) return JSON.parse(saved);
    
    // Default Mock Data if empty
    return [
      { 
        id: 'RES-1001', 
        clientId: session?.clientId || 'DEMO',
        guestName: 'Alex Thorne', 
        email: 'alex.t@obsidian.com', 
        phone: '+1 555 0192',
        roomNumber: '101', 
        roomType: 'Deluxe', 
        checkIn: '2025-05-10', 
        checkOut: '2025-05-15', 
        adults: 2,
        children: 0,
        status: 'Confirmed', 
        source: 'Online',
        totalAmount: 1250.00,
        createdAt: new Date().toISOString()
      },
      { 
        id: 'RES-1002', 
        clientId: session?.clientId || 'DEMO',
        guestName: 'Sarah Jenkins', 
        email: 'sj@web.io', 
        phone: '+44 20 7946 0012',
        roomNumber: '302', 
        roomType: 'Superior', 
        checkIn: '2025-05-12', 
        checkOut: '2025-05-14', 
        adults: 1,
        children: 1,
        status: 'Checked-In', 
        source: 'Walk-In',
        totalAmount: 640.50,
        createdAt: new Date().toISOString()
      }
    ];
  });

  useEffect(() => {
    if (session?.clientId) {
      localStorage.setItem(`bookings_${session.clientId}`, JSON.stringify(bookings));
    }
  }, [bookings, session?.clientId]);

  const handleSaveReservation = (res: Reservation) => {
    if (selectedBooking) {
      setBookings(prev => prev.map(b => b.id === res.id ? res : b));
    } else {
      setBookings(prev => [res, ...prev]);
    }
    setIsModalOpen(false);
    setSelectedBooking(undefined);
  };

  const handleStatusChange = (id: string, newStatus: ReservationStatus) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
  };

  const filteredBookings = bookings.filter(b => 
    b.guestName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.roomNumber.includes(searchTerm)
  );

  const getStatusColor = (status: ReservationStatus) => {
    switch (status) {
      case 'Confirmed': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'Checked-In': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'Checked-Out': return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
      case 'Cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'Pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  return (
    <div className="p-6 sm:p-10 h-full flex flex-col overflow-hidden max-w-[1600px] mx-auto animate-fadeIn">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-10 items-center justify-between">
        <div className="w-full sm:w-1/2 relative group">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors">
            <Icons.Search />
          </div>
          <input 
            type="text" 
            placeholder="Search manifests by Guest, ID or Room..." 
            className={`w-full pl-14 pr-6 py-4 rounded-2xl outline-none transition-all shadow-sm font-bold text-sm ${
              isDark ? 'bg-slate-900 border-white/5 text-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500' : 'bg-white border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500/20'
            } border`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <button 
          onClick={() => { setSelectedBooking(undefined); setIsModalOpen(true); }}
          className={`${isDark ? 'bg-amber-500 text-black shadow-amber-500/20' : 'bg-indigo-600 text-white shadow-indigo-600/10'} px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-95 shadow-xl flex items-center gap-3`}
        >
          <Icons.Add /> New Reservation
        </button>
      </div>

      {/* Reservation Manifest Table */}
      <div className={`flex-1 overflow-auto rounded-[2.5rem] border shadow-sm hide-scrollbar ${isDark ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-100'}`}>
        <div className="min-w-[1100px]">
          <table className="w-full text-left border-collapse">
            <thead className={`${isDark ? 'bg-black/40 text-slate-500' : 'bg-slate-50 text-slate-500'}`}>
              <tr>
                <th className="p-6 font-black uppercase text-[9px] tracking-[0.2em]">Manifest ID</th>
                <th className="p-6 font-black uppercase text-[9px] tracking-[0.2em]">Guest Details</th>
                <th className="p-6 font-black uppercase text-[9px] tracking-[0.2em]">Room / Source</th>
                <th className="p-6 font-black uppercase text-[9px] tracking-[0.2em]">Duration</th>
                <th className="p-6 font-black uppercase text-[9px] tracking-[0.2em]">Lifecycle</th>
                <th className="p-6 font-black uppercase text-[9px] tracking-[0.2em]">Total Amount</th>
                <th className="p-6 font-black uppercase text-[9px] tracking-[0.2em] text-center">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-white/5' : 'divide-slate-100'}`}>
              {filteredBookings.length > 0 ? filteredBookings.map((b) => (
                <tr key={b.id} className={`transition-all group ${isDark ? 'hover:bg-white/[0.02] text-slate-300' : 'hover:bg-slate-50 text-slate-700'}`}>
                  <td className="p-6 font-mono text-[11px] font-black text-amber-500">{b.id}</td>
                  <td className="p-6">
                    <div className={`font-black text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{b.guestName}</div>
                    <div className="text-[10px] text-slate-500 font-bold tracking-tight opacity-70">{b.phone}</div>
                  </td>
                  <td className="p-6">
                    <div className="flex flex-col">
                      <span className={`text-[10px] font-black uppercase ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>RM {b.roomNumber} • {b.roomType}</span>
                      <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">{b.source}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-bold">{b.checkIn}</span>
                      <div className="w-4 h-[1px] bg-slate-700" />
                      <span className="text-[10px] font-bold">{b.checkOut}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className={`px-4 py-2 rounded-full text-[8px] font-black uppercase tracking-[0.2em] border ${getStatusColor(b.status)}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="p-6 font-black text-sm">
                    {session?.setupData?.currency || '$'} {b.totalAmount.toLocaleString()}
                  </td>
                  <td className="p-6">
                    <div className="flex justify-center gap-2">
                      {b.status === 'Confirmed' && (
                        <button 
                          onClick={() => handleStatusChange(b.id, 'Checked-In')}
                          className="px-3 py-2 rounded-xl bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-all text-[8px] font-black uppercase tracking-widest"
                        >
                          Check In
                        </button>
                      )}
                      {b.status === 'Checked-In' && (
                        <button 
                          onClick={() => handleStatusChange(b.id, 'Checked-Out')}
                          className="px-3 py-2 rounded-xl bg-slate-500/10 text-slate-300 hover:bg-slate-500 hover:text-white transition-all text-[8px] font-black uppercase tracking-widest"
                        >
                          Check Out
                        </button>
                      )}
                      <button 
                        onClick={() => { setSelectedBooking(b); setIsModalOpen(true); }}
                        className={`p-2 rounded-xl transition-all ${isDark ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-200 text-slate-600'}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="p-20 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-20">
                      <Icons.Bookings />
                      <p className="text-[10px] font-black uppercase tracking-[0.5em]">No Manifests Detected</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <ReservationModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveReservation}
          booking={selectedBooking}
          theme={theme}
          setupData={session?.setupData}
          clientId={session?.clientId || 'DEMO'}
        />
      )}
    </div>
  );
};

export default Bookings;
