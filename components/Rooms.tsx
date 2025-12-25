
import React, { useState } from 'react';
import { PropertySetupData, Room } from '../types';

interface RoomsProps {
  theme?: 'light' | 'dark';
  setupData?: PropertySetupData;
}

const Rooms: React.FC<RoomsProps> = ({ theme = 'dark', setupData }) => {
  const isDark = theme === 'dark';
  const [filter, setFilter] = useState('All');

  const rooms = setupData?.roomInventory || [];
  const categories = setupData?.roomCategories || [];

  const filteredRooms = filter === 'All' ? rooms : rooms.filter(r => r.category === filter);

  return (
    <div className="p-6 sm:p-10 h-full overflow-y-auto max-w-[1600px] mx-auto">
      <div className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className={`text-2xl lg:text-3xl font-black uppercase tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>Physical Inventory</h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Manage architectural room nodes</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setFilter('All')}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === 'All' ? 'bg-amber-500 text-black' : (isDark ? 'bg-white/5 text-slate-500' : 'bg-slate-100 text-slate-500')}`}
          >
            All
          </button>
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === cat ? 'bg-amber-500 text-black' : (isDark ? 'bg-white/5 text-slate-500' : 'bg-slate-100 text-slate-500')}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-5">
        {filteredRooms.map((room, i) => (
          <div 
            key={i} 
            className={`p-6 rounded-[2rem] flex flex-col items-center justify-center space-y-2 shadow-sm border transition-all hover:scale-105 active:scale-95 group relative overflow-hidden ${isDark ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-100'}`}
          >
            <div className={`absolute top-0 left-0 w-full h-1.5 ${room.status === 'Available' ? 'bg-emerald-500' : 'bg-red-500'}`} />
            <div className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40">Node</div>
            <h3 className={`text-3xl font-[1000] tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>{room.number}</h3>
            <p className="text-[8px] font-black uppercase tracking-widest text-amber-500 truncate w-full text-center px-2">{room.category}</p>
          </div>
        ))}
      </div>
      
      {rooms.length === 0 && (
        <div className="h-96 flex items-center justify-center text-slate-500 font-black uppercase tracking-[0.5em] text-xs">
          No Inventory Nodes Found
        </div>
      )}
    </div>
  );
};

export default Rooms;
