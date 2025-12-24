
import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const scale = {
    sm: 0.45,
    md: 0.75,
    lg: 1.2,
    xl: 2.2,
  };

  const currentScale = scale[size];

  return (
    <div 
      className={`flex items-center gap-6 select-none ${className}`} 
      style={{ transform: `scale(${currentScale})`, transformOrigin: 'left center' }}
    >
      <div className="relative w-16 h-16 group">
        {/* Luxury Architectural 'H' Signet */}
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <style>
            {`
              @keyframes dash {
                to { stroke-dashoffset: 0; }
              }
              @keyframes shimmer {
                0% { opacity: 0.3; }
                50% { opacity: 1; }
                100% { opacity: 0.3; }
              }
              .logo-path {
                stroke-dasharray: 200;
                stroke-dashoffset: 200;
                animation: dash 3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
              }
              .logo-accent {
                animation: shimmer 4s ease-in-out infinite;
              }
            `}
          </style>

          {/* Background Signet Diamond */}
          <path d="M40 5L75 40L40 75L5 40L40 5Z" stroke="url(#gold_gradient)" strokeWidth="0.5" className="logo-accent" />

          {/* The Architectural H */}
          <path 
            d="M25 65V15" 
            stroke="url(#gold_gradient)" 
            strokeWidth="5" 
            strokeLinecap="butt"
            className="logo-path"
          />
          <path 
            d="M55 15V65" 
            stroke="url(#gold_gradient_alt)" 
            strokeWidth="5" 
            strokeLinecap="butt"
            className="logo-path"
            style={{ animationDelay: '0.4s' }}
          />
          <path 
            d="M25 40H55" 
            stroke="url(#gold_center)" 
            strokeWidth="3"
            className="logo-path"
            style={{ animationDelay: '0.8s' }}
          />

          <defs>
            <linearGradient id="gold_gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#92400E" />
              <stop offset="50%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#78350F" />
            </linearGradient>
            <linearGradient id="gold_gradient_alt" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#78350F" />
              <stop offset="50%" stopColor="#FCD34D" />
              <stop offset="100%" stopColor="#92400E" />
            </linearGradient>
            <linearGradient id="gold_center" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#92400E" />
              <stop offset="50%" stopColor="#FEF3C7" />
              <stop offset="100%" stopColor="#92400E" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      <div className="flex flex-col -space-y-1 mt-1">
        <div className="flex items-baseline">
          <h1 className="text-3xl font-[1000] tracking-[-0.04em] text-slate-900 dark:text-white transition-colors duration-500">
            HOTELIER <span className="text-amber-500">PMS</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[8px] font-black uppercase tracking-[0.6em] text-slate-400 dark:text-slate-500 whitespace-nowrap">
            Powered by Adveda Solutions
          </span>
        </div>
      </div>
    </div>
  );
};

export default Logo;
