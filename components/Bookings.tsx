
import React, { useState } from 'react';
import { Booking } from '../types';
import { Icons } from '../constants';

interface BookingsProps {
  theme?: 'light' | 'dark';
}

const Bookings: React.FC<BookingsProps> = ({ theme = 'dark' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const isDark = theme === 'dark';
  
  const bookings: Booking[] = [
    { id: '01', guestName: 'John Doe', email: 'john@hotelier.cloud', roomType: 'Superior', checkIn: '2023-12-01', checkOut: '2023-12-05', status: 'Confirmed' },
    { id: '02', guestName: 'Jane Smith', email: 'jane@residency.io', roomType: 'Delux', checkIn: '2023-12-02', checkOut: '2023-12-04', status: 'Pending' },
    { id: '03', guestName: 'Alice Johnson', email: 'alice@traveler.com', roomType: 'Single', checkIn: '2023-12-05', checkOut: '2023-12-10', status: 'Confirmed' },
    { id: '04', guestName: 'Mark Wilson', email: 'mark.w@corp.net', roomType: 'Guest', checkIn: '2023-12-06', checkOut: '2023-12-07', status: 'Confirmed' },
  ];

  const filteredBookings = bookings.filter(b => 
    b.guestName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 sm:p-10 h-full flex flex-col overflow-hidden max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row gap-4 mb-10">
        <div className="flex-1 relative">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
            <Icons.Search />
          </div>
          <input 
            type="text" 
            placeholder="Search manifests..." 
            className={`w-full pl-14 pr-6 py-4 rounded-2xl outline-none transition-all shadow-sm font-bold text-sm ${
              isDark ? 'bg-slate-900 border-white/5 text-white focus:ring-2 focus:ring-amber-500/20' : 'bg-white border-slate-200 text-slate-900 focus:ring-2 focus:ring-indigo-500/20'
            } border`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className={`${isDark ? 'bg-amber-500 text-black shadow-amber-500/10' : 'bg-indigo-600 text-white shadow-indigo-600/10'} px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl`}>
          Create Reservation
        </button>
      </div>

      <div className={`flex-1 overflow-auto rounded-[2.5rem] border shadow-sm hide-scrollbar ${isDark ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-100'}`}>
        <div className="min-w-[900px]">
          <table className="w-full text-left border-collapse">
            <thead className={`${isDark ? 'bg-black/40 text-slate-400' : 'bg-slate-50 text-slate-500'}`}>
              <tr>
                <th className="p-6 font-black uppercase text-[10px] tracking-[0.2em]">ID</th>
                <th className="p-6 font-black uppercase text-[10px] tracking-[0.2em]">Guest Details</th>
                <th className="p-6 font-black uppercase text-[10px] tracking-[0.2em]">Provisioning</th>
                <th className="p-6 font-black uppercase text-[10px] tracking-[0.2em]">Arrival</th>
                <th className="p-6 font-black uppercase text-[10px] tracking-[0.2em]">Departure</th>
                <th className="p-6 font-black uppercase text-[10px] tracking-[0.2em]">State</th>
                <th className="p-6 font-black uppercase text-[10px] tracking-[0.2em] text-center">Terminal</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-white/5' : 'divide-slate-50'}`}>
              {filteredBookings.map((b) => (
                <tr key={b.id} className={`transition-colors group ${isDark ? 'hover:bg-white/[0.02] text-slate-300' : 'hover:bg-slate-50 text-slate-700'}`}>
                  <td className="p-6 font-mono text-[10px] font-black text-amber-600">{b.id}</td>
                  <td className="p-6">
                    <div className={`font-black text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{b.guestName}</div>
                    <div className="text-[10px] text-slate-500 font-bold tracking-tight">{b.email}</div>
                  </td>
                  <td className="p-6">
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>{b.roomType}</span>
                  </td>
                  <td className="p-6 text-xs font-bold">{b.checkIn}</td>
                  <td className="p-6 text-xs font-bold">{b.checkOut}</td>
                  <td className="p-6">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      b.status === 'Confirmed' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="p-6">
                    <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                      <button className={`p-2 rounded-xl transition-all ${isDark ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-200 text-slate-600'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Bookings;
