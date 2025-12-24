
import React, { useState } from 'react';
import { UserSession } from '../types';
import Logo from './Logo';

interface LoginProps {
  onLogin: (session: UserSession) => void;
  theme?: 'light' | 'dark';
  toggleTheme?: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, theme = 'dark', toggleTheme }) => {
  const [clientId, setClientId] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const isDark = theme === 'dark';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Superadmin Credentials
    if (clientId.toUpperCase() === 'SUPERADMIN' && username.toUpperCase() === 'SUPERADMIN' && password === 'Reset@852') {
       onLogin({ role: 'SUPERADMIN', username: 'SUPERADMIN', clientId: 'SUPERADMIN' });
       return;
    }

    // Hotel login logic (Mock)
    if (clientId && username && password) {
       onLogin({ role: 'HOTEL_ADMIN', username, clientId });
       return;
    }

    setError('Authentication Failed. Please check your credentials.');
  };

  return (
    <div className={`min-h-screen flex flex-col lg:flex-row font-sans overflow-hidden transition-colors duration-700 ${isDark ? 'bg-[#020617]' : 'bg-[#F8FAFC]'}`}>
      
      {/* Absolute Header - Controls only, removed duplicate logo */}
      <div className="absolute top-0 right-0 p-8 flex justify-end items-center z-50">
        <button 
          onClick={toggleTheme}
          className={`flex items-center justify-center p-3 rounded-full transition-all duration-300 shadow-xl border ${
            isDark 
            ? 'bg-slate-900 border-white/10 text-amber-500 hover:bg-slate-800' 
            : 'bg-white border-slate-200 text-amber-600 hover:bg-slate-50'
          }`}
          aria-label="Toggle Night Mode"
        >
          {isDark ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="18.36" x2="5.64" y2="16.92"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          )}
        </button>
      </div>

      {/* Left Column: Form Section */}
      <div className={`flex-1 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-24 z-10 overflow-y-auto transition-colors duration-700 ${isDark ? 'bg-[#020617]' : 'bg-white'}`}>
        <div className="w-full max-w-[460px] py-12 lg:py-0">
          <div className="mb-14 text-center lg:text-left animate-fadeIn">
            {/* The single, balanced-size logo */}
            <Logo size="lg" className="inline-block" />
            
            <div className="mt-12">
              <h1 className={`text-5xl font-[1000] tracking-tighter mb-4 leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Gateway Access<span className="text-amber-500">.</span>
              </h1>
              <p className={`text-lg font-medium opacity-60 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Authenticated terminal for Adveda hospitality nodes.
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-8 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <div className="grid grid-cols-1 gap-8">
              <div className="group space-y-2.5">
                <label className={`text-[11px] font-black uppercase tracking-[0.5em] ml-1 transition-colors ${isDark ? 'text-slate-500 group-focus-within:text-amber-500' : 'text-slate-600 group-focus-within:text-indigo-600'}`}>Tenant Key</label>
                <input 
                  type="text" 
                  placeholder="AD-782-PMS"
                  className={`w-full border-b-2 bg-transparent py-4 px-1 transition-all outline-none font-bold text-xl ${
                    isDark 
                    ? 'border-white/10 text-white focus:border-amber-500 placeholder:text-slate-800' 
                    : 'border-slate-200 text-slate-900 focus:border-amber-600 placeholder:text-slate-300'
                  }`}
                  value={clientId}
                  onChange={e => setClientId(e.target.value)}
                  required
                />
              </div>

              <div className="group space-y-2.5">
                <label className={`text-[11px] font-black uppercase tracking-[0.5em] ml-1 transition-colors ${isDark ? 'text-slate-500 group-focus-within:text-amber-500' : 'text-slate-600 group-focus-within:text-indigo-600'}`}>Staff Identity</label>
                <input 
                  type="text" 
                  placeholder="Operator Handle"
                  className={`w-full border-b-2 bg-transparent py-4 px-1 transition-all outline-none font-bold text-xl ${
                    isDark 
                    ? 'border-white/10 text-white focus:border-amber-500 placeholder:text-slate-800' 
                    : 'border-slate-200 text-slate-900 focus:border-amber-600 placeholder:text-slate-300'
                  }`}
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="group space-y-2.5">
                <div className="flex justify-between items-center ml-1">
                  <label className={`text-[11px] font-black uppercase tracking-[0.5em] transition-colors ${isDark ? 'text-slate-500 group-focus-within:text-amber-500' : 'text-slate-600 group-focus-within:text-indigo-600'}`}>Security Key</label>
                  <button type="button" className="text-[10px] font-black uppercase tracking-widest text-amber-500 hover:text-amber-400 transition-colors">Reset</button>
                </div>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className={`w-full border-b-2 bg-transparent py-4 px-1 transition-all outline-none font-bold text-xl ${
                    isDark 
                    ? 'border-white/10 text-white focus:border-amber-500' 
                    : 'border-slate-200 text-slate-900 focus:border-amber-600'
                  }`}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-red-500 text-center text-[10px] font-black uppercase tracking-[0.2em] animate-shake">
                {error}
              </div>
            )}

            <button 
              type="submit"
              className={`w-full py-6 rounded-full font-black text-xs uppercase tracking-[0.5em] transition-all active:scale-[0.98] shadow-[0_20px_40px_-10px_rgba(245,158,11,0.3)] mt-6 ${
                isDark 
                ? 'bg-amber-500 hover:bg-amber-400 text-black' 
                : 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/20'
              }`}
            >
              Start Operation
            </button>
          </form>

          <div className="mt-20 pt-10 border-t border-slate-500/10 flex flex-col items-center lg:items-start opacity-30">
            <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.5em] mb-2">
              Proprietary Adveda Architecture
            </p>
            <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">
              &copy; {new Date().getFullYear()} Adveda Solutions. Ahmedabad Global Center.
            </p>
          </div>
        </div>
      </div>

      {/* Right Column: Visual Showcase Section */}
      <div className={`hidden lg:flex lg:w-[40%] xl:w-[45%] relative p-16 justify-center items-center overflow-hidden transition-colors duration-700 ${isDark ? 'bg-slate-900' : 'bg-[#1a1a2e]'}`}>
        <div className="absolute inset-0 opacity-5 pointer-events-none">
           <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
             <defs>
               <pattern id="dot-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                 <circle cx="2" cy="2" r="1" fill="white" />
               </pattern>
             </defs>
             <rect width="100%" height="100%" fill="url(#dot-grid)" />
           </svg>
        </div>
        
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-amber-500/10 rounded-full blur-[180px] -translate-y-1/2 translate-x-1/2 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[140px] translate-y-1/2 -translate-x-1/2 animate-pulse [animation-delay:2s]"></div>
        
        <div className="relative z-10 w-full max-w-[500px] text-left">
          <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[4rem] p-20 shadow-2xl space-y-16 animate-fadeIn">
            <div className="w-16 h-1 bg-amber-500/50 rounded-full"></div>
            
            <div className="space-y-10">
              <h2 className="text-6xl font-[1000] text-white tracking-tighter leading-[0.85] uppercase italic">
                A Unified <br/>Hospitality <br/><span className="text-amber-500">Universe.</span>
              </h2>
              <p className="text-slate-400 text-lg font-medium leading-relaxed opacity-60 max-w-sm">
                Advanced PMS infrastructure designed for world-class hotels. Real-time intelligence at your fingertips.
              </p>
            </div>

            <div className="flex items-center gap-12 border-t border-white/5 pt-10">
               <div className="space-y-1">
                 <p className="text-2xl font-black text-white">4.9k</p>
                 <p className="text-[8px] text-amber-500 font-black uppercase tracking-widest">Global Nodes</p>
               </div>
               <div className="w-px h-10 bg-white/10"></div>
               <div className="space-y-1">
                 <p className="text-2xl font-black text-white">2ms</p>
                 <p className="text-[8px] text-amber-500 font-black uppercase tracking-widest">Sync Latency</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
