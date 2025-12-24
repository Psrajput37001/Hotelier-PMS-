
import React from 'react';
import { UserRole } from '../types';

interface DashboardProps {
  role?: UserRole;
  theme?: 'light' | 'dark';
}

const Dashboard: React.FC<DashboardProps> = ({ role = 'HOTEL_ADMIN', theme = 'dark' }) => {
  const isSuper = role === 'SUPERADMIN';
  const isDark = theme === 'dark';

  const stats = isSuper 
    ? [
        { label: 'Active Hotels', value: '08', color: 'amber-500', icon: '🏨' },
        { label: 'Pending Tenants', value: '02', color: 'slate-400', icon: '⏳' },
        { label: 'Global Revenue', value: '$2.4M', color: 'emerald-500', icon: '💰' },
      ]
    : [
        { label: 'Booked Rooms', value: '12', color: 'red-500', icon: '🛏️' },
        { label: 'Available Rooms', value: '24', color: 'emerald-500', icon: '✨' },
        { label: 'Total Staff', value: '08', color: 'blue-500', icon: '👥' },
      ];

  return (
    <div className="p-6 sm:p-10 space-y-8 animate-fadeIn max-w-[1600px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className={`
            p-8 sm:p-10 rounded-[2.5rem] shadow-sm flex flex-col items-center justify-center transition-all hover:scale-[1.02] border-b-[6px]
            ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}
            ${stat.color === 'amber-500' ? 'border-b-amber-500' : ''}
            ${stat.color === 'emerald-500' ? 'border-b-emerald-500' : ''}
            ${stat.color === 'red-500' ? 'border-b-red-500' : ''}
            ${stat.color === 'blue-500' ? 'border-b-blue-500' : ''}
            ${stat.color === 'slate-400' ? 'border-b-slate-400' : ''}
          `}>
            <span className="text-3xl mb-4">{stat.icon}</span>
            <h1 className={`text-5xl sm:text-6xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>{stat.value}</h1>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-3">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`lg:col-span-2 p-8 sm:p-10 rounded-[2.5rem] shadow-sm border ${isDark ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-100'}`}>
          <div className="flex justify-between items-center mb-10">
            <h3 className={`text-xl font-black uppercase tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{isSuper ? 'System Traffic' : 'Occupancy Flow'}</h3>
            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${isDark ? 'bg-white/5 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>Live Telemetry</span>
          </div>
          <div className={`h-72 sm:h-80 rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center ${isDark ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
             <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500 mb-4 animate-pulse">
               <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
             </div>
             <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-slate-500">Processing Analytics Stream</p>
          </div>
        </div>

        <div className={`p-8 sm:p-10 rounded-[2.5rem] shadow-2xl ${isDark ? 'bg-slate-900 text-white' : 'bg-slate-950 text-white'}`}>
          <h3 className="text-xl font-black mb-8 uppercase tracking-tight text-amber-500">Operational Logs</h3>
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex gap-4 items-start border-l-2 border-amber-500/30 pl-5 py-0.5 group">
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-100 group-hover:text-amber-400 transition-colors">{isSuper ? `System Sync Complete: Node 0${i}` : `Reservation Updated: Guest ${i*100}`}</p>
                  <p className="text-[9px] text-slate-500 font-black uppercase mt-1.5">{i * 2} min ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
