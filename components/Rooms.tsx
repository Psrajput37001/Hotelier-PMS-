
import React from 'react';
import { Room } from '../types';

interface RoomsProps {
  theme?: 'light' | 'dark';
}

const Rooms: React.FC<RoomsProps> = ({ theme = 'dark' }) => {
  const isDark = theme === 'dark';
  const rooms: Room[] = [
    { id: '1', type: 'Superior', number: '101', status: 'Booked' },
    { id: '2', type: 'Delux', number: '202', status: 'Available' },
    { id: '3', type: 'Guest', number: '305', status: 'Available' },
    { id: '4', type: 'Single', number: '410', status: 'Booked' },
    { id: '5', type: 'Superior', number: '102', status: 'Available' },
    { id: '6', type: 'Delux', number: '203', status: 'Available' },
    { id: '7', type: 'Single', number: '411', status: 'Available' },
    { id: '8', type: 'Guest', number: '306', status: 'Booked' },
  ];

  const getStatusColor = (type: string) => {
    switch (type) {
      case 'Superior': return 'bg-indigo-600 shadow-indigo-600/20';
      case 'Delux': return 'bg-pink-500 shadow-pink-500/20';
      case 'Guest': return 'bg-emerald-500 shadow-emerald-500/20';
      case 'Single': return 'bg-cyan-500 shadow-cyan-500/20';
      default: return 'bg-slate-500 shadow-slate-500/20';
    }
  };

  return (
    <div className="p-6 sm:p-10 h-full overflow-y-auto max-w-[1600px] mx-auto">
      <div className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className={`text-2xl font-black uppercase tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>Room Management</h2>
          <p className="text-slate-500 text-xs font-medium uppercase tracking-widest mt-1">Live physical inventory</p>
        </div>
        <button className={`${isDark ? 'bg-amber-500 text-black' : 'bg-indigo-600 text-white'} px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-lg`}>
          Provision Room
        </button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6">
        {rooms.map((room) => (
          <div 
            key={room.id} 
            className={`${getStatusColor(room.type)} p-8 rounded-[2rem] shadow-xl text-white flex flex-col items-center justify-center space-y-3 transition-all hover:scale-[1.05] hover:-translate-y-1 cursor-pointer group`}
          >
            <div className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 group-hover:opacity-100 transition-opacity">Room</div>
            <h3 className="text-4xl font-black tracking-tighter">{room.number}</h3>
            <div className="flex flex-col items-center gap-2 pt-2">
              <p className="text-[10px] font-black uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full">{room.type}</p>
              <span className={`text-[9px] uppercase font-black px-2.5 py-1 rounded-full border border-white/20 ${room.status === 'Available' ? 'bg-white/20' : 'bg-black/20'}`}>
                {room.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rooms;
