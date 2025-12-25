
import React from 'react';
import { UserRole, PropertySetupData } from '../types';

interface DashboardProps {
  role?: UserRole;
  theme?: 'light' | 'dark';
  setupData?: PropertySetupData;
}

const Dashboard: React.FC<DashboardProps> = ({ role = 'HOTEL_ADMIN', theme = 'dark', setupData }) => {
  const isSuper = role === 'SUPERADMIN';
  const isDark = theme === 'dark';

  const stats = isSuper 
    ? [
        { label: 'Network Nodes', value: '14', color: 'amber-500', icon: '🏢' },
        { label: 'System Uptime', value: '99.9%', color: 'emerald-500', icon: '⚡' },
        { label: 'Global Revenue', value: '$3.8M', color: 'emerald-500', icon: '💰' },
      ]
    : [
        { label: 'Available Inventory', value: setupData?.totalRooms.toString() || '0', color: 'emerald-500', icon: '✨' },
        { label: 'Total Floors', value: setupData?.floors.toString() || '0', color: 'blue-500', icon: '🏢' },
        { label: 'Tax ID Scope', value: setupData?.taxId || 'N/A', color: 'amber-500', icon: '📄' },
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
            ${stat.color === 'blue-500' ? 'border-b-blue-500' : ''}
          `}>
            <span className="text-3xl mb-4">{stat.icon}</span>
            <h1 className={`text-5xl sm:text-6xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>{stat.value}</h1>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-3 text-center">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`lg:col-span-2 p-8 sm:p-10 rounded-[2.5rem] shadow-sm border ${isDark ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-100'}`}>
          <div className="flex justify-between items-center mb-10">
            <h3 className={`text-xl font-black uppercase tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Operational Status</h3>
            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${isDark ? 'bg-amber-500/10 text-amber-500' : 'bg-slate-100 text-slate-500'}`}>Live</span>
          </div>
          <div className={`h-72 sm:h-80 rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center ${isDark ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
             <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-slate-500">Node Synchronized with Adveda Cloud</p>
          </div>
        </div>

        <div className={`p-8 sm:p-10 rounded-[2.5rem] shadow-2xl ${isDark ? 'bg-slate-900 text-white' : 'bg-slate-950 text-white'}`}>
          <h3 className="text-xl font-black mb-8 uppercase tracking-tight text-amber-500">System Logs</h3>
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex gap-4 items-start border-l-2 border-amber-500/30 pl-5 py-0.5 group">
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-100 group-hover:text-amber-400 transition-colors">Client Node Check-in Completed</p>
                  <p className="text-[9px] text-slate-500 font-black uppercase mt-1.5">{i * 10} min ago</p>
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
