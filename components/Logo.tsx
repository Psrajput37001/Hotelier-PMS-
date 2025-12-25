
import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  shrunk?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', shrunk = false }) => {
  const baseScale = {
    sm: 0.5,
    md: 0.7,
    lg: 1.0,
    xl: 1.8,
  };

  const currentScale = shrunk ? 0.45 : baseScale[size];

  return (
    <div 
      className={`flex flex-col items-start select-none transition-all duration-500 ease-out will-change-transform ${className}`} 
      style={{ transform: `scale(${currentScale})`, transformOrigin: 'left center' }}
    >
      <div className="flex items-center gap-1.5">
        {/* HOTELIER Box */}
        <div className="relative">
          <div className="absolute inset-0 bg-amber-500/20 blur-lg animate-pulse -z-10"></div>
          <div className="border-[1.5px] border-amber-500/60 px-4 py-2.5 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.25)] bg-white dark:bg-slate-900/40 backdrop-blur-md rounded-sm">
             <h1 className="text-2xl font-[1000] tracking-[0.15em] text-slate-900 dark:text-white leading-none uppercase">
               Hotelier
             </h1>
          </div>
        </div>

        {/* HIGH INTENSITY GLOWING CORE */}
        <div className="relative flex items-center justify-center w-6">
           <style>
            {`
              @keyframes coreGlow {
                0%, 100% { transform: scale(1) rotate(45deg); opacity: 0.7; filter: drop-shadow(0 0 2px #fbbf24); }
                50% { transform: scale(1.4) rotate(45deg); opacity: 1; filter: drop-shadow(0 0 15px #fbbf24); }
              }
            `}
          </style>
          <div className="w-1.5 h-1.5 bg-amber-400 rotate-45 shadow-[0_0_15px_#fbbf24] animate-[coreGlow_1.5s_infinite]"></div>
        </div>

        {/* PMS Box */}
        <div className="relative">
          <div className="border-[1.5px] border-slate-900/20 dark:border-white/20 px-3 py-2.5 flex items-center justify-center shadow-sm bg-white dark:bg-slate-900/40 backdrop-blur-md rounded-sm">
             <h1 className="text-2xl font-[1000] tracking-widest text-amber-500 leading-none">
               PMS
             </h1>
          </div>
        </div>
      </div>
      
      {!shrunk && size !== 'sm' && (
        <div className="mt-3 opacity-40 pl-1 transition-all duration-500">
          <span className="text-[7px] font-black uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400 whitespace-nowrap">
            Powered by Adveda Solutions
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
