
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
    xl: 2.0,
  };

  const currentScale = shrunk ? 0.45 : baseScale[size];

  return (
    <div 
      className={`flex items-center gap-4 select-none transition-all duration-500 ease-out will-change-transform ${className}`} 
      style={{ transform: `scale(${currentScale})`, transformOrigin: 'left center' }}
    >
      <div className="flex items-center gap-3">
        {/* HOTELIER Box */}
        <div className="relative">
          <div className="absolute inset-0 bg-amber-500/10 blur-xl animate-pulse -z-10"></div>
          <div className="border border-amber-500/40 px-4 py-2 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.2)] dark:bg-white/5 bg-white backdrop-blur-sm">
             <h1 className="text-2xl font-[1000] tracking-[0.1em] text-slate-900 dark:text-white leading-none">
               HOTELIER
             </h1>
             {/* Subtle internal glow on border */}
             <div className="absolute inset-0 border border-amber-500/20 pointer-events-none"></div>
          </div>
        </div>

        {/* HIGH INTENSITY GLOWING CORE */}
        <div className="relative flex items-center justify-center w-8">
           <style>
            {`
              @keyframes highGlow {
                0%, 100% { transform: scale(1); opacity: 0.8; filter: drop-shadow(0 0 2px #fbbf24); }
                50% { transform: scale(1.3); opacity: 1; filter: drop-shadow(0 0 12px #fbbf24); }
              }
            `}
          </style>
          <div className="w-2 h-2 bg-amber-400 rotate-45 shadow-[0_0_20px_#fbbf24] animate-[highGlow_2s_infinite]"></div>
          <div className="absolute w-6 h-6 border border-amber-500/10 rounded-full animate-ping"></div>
        </div>

        {/* PMS Box */}
        <div className="relative">
          <div className="border border-amber-500/40 px-3 py-2 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.2)] dark:bg-white/5 bg-white backdrop-blur-sm">
             <h1 className="text-2xl font-[1000] tracking-widest text-amber-500 leading-none">
               PMS
             </h1>
          </div>
        </div>
      </div>
      
      {!shrunk && (
        <div className={`flex flex-col ml-4 transition-all duration-500`}>
          <div className="h-px w-8 bg-amber-500/30 mb-2"></div>
          <span className="text-[7px] font-black uppercase tracking-[0.7em] text-slate-400 dark:text-slate-500 whitespace-nowrap">
            Powered by Adveda Solutions
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
