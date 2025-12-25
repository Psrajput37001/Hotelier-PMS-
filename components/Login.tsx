
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
  const [isFocused, setIsFocused] = useState(false);

  const isDark = theme === 'dark';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (clientId.toUpperCase() === 'SUPERADMIN' && username.toUpperCase() === 'SUPERADMIN' && password === 'Reset@852') {
       onLogin({ role: 'SUPERADMIN', username: 'SUPERADMIN', clientId: 'SUPERADMIN' });
       return;
    }

    if (clientId && username && password) {
       onLogin({ role: 'HOTEL_ADMIN', username, clientId });
       return;
    }

    setError('Access Denied. Check credentials.');
  };

  return (
    <div className={`min-h-screen flex flex-col lg:flex-row font-sans overflow-hidden transition-colors duration-700 ${isDark ? 'bg-[#020617]' : 'bg-[#F8FAFC]'}`}>
      
      {/* Mobile-First Floating Theme Toggle */}
      <div className="fixed top-5 right-5 z-[100] lg:top-8 lg:right-8">
        <button 
          onClick={toggleTheme}
          className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 shadow-2xl border ${
            isDark 
            ? 'bg-slate-900 border-white/10 text-amber-500' 
            : 'bg-white border-slate-200 text-amber-600'
          }`}
          aria-label="Toggle Night Mode"
        >
          {isDark ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="18.36" x2="5.64" y2="16.92"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          )}
        </button>
      </div>

      {/* Main Login Area */}
      <div className={`flex-1 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-24 z-10 transition-all duration-500 ${isDark ? 'bg-[#020617]' : 'bg-white'}`}>
        <div className={`w-full max-w-[460px] transition-all duration-500 ${isFocused ? 'lg:translate-y-0 -translate-y-16' : ''}`}>
          
          <div className="mb-14 text-center lg:text-left">
            {/* Optimized Rectangular Logo */}
            <Logo 
              size="lg" 
              className={`inline-block mb-10 transition-all duration-500 ${isFocused ? 'scale-[0.7] -translate-y-4' : ''}`} 
              shrunk={isFocused && window.innerWidth < 1024}
            />
            
            <div className={`transition-all duration-500 ${isFocused && window.innerWidth < 1024 ? 'opacity-0 h-0 scale-95' : 'opacity-100 h-auto'}`}>
              <h1 className={`text-4xl lg:text-5xl font-[1000] tracking-tighter mb-4 leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Operational Terminal<span className="text-amber-500">.</span>
              </h1>
              <p className={`text-base font-medium opacity-60 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Identify your Adveda node to sync services.
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className={`space-y-6 lg:space-y-10 animate-fadeIn ${isFocused ? 'mt-4' : ''}`}>
            <div className="grid grid-cols-1 gap-6 lg:gap-10">
              <div className="group space-y-2">
                <label className={`text-[10px] font-black uppercase tracking-[0.5em] ml-1 transition-colors ${isDark ? 'text-slate-500 group-focus-within:text-amber-500' : 'text-slate-600 group-focus-within:text-indigo-600'}`}>Tenant Scope</label>
                <input 
                  type="text" 
                  placeholder="EX: AD-99-PMS"
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className={`w-full border-b-2 bg-transparent py-3 px-1 transition-all outline-none font-bold text-xl ${
                    isDark 
                    ? 'border-white/10 text-white focus:border-amber-500 placeholder:text-slate-800' 
                    : 'border-slate-200 text-slate-900 focus:border-amber-600 placeholder:text-slate-300'
                  }`}
                  value={clientId}
                  onChange={e => setClientId(e.target.value)}
                  required
                />
              </div>

              <div className="group space-y-2">
                <label className={`text-[10px] font-black uppercase tracking-[0.5em] ml-1 transition-colors ${isDark ? 'text-slate-500 group-focus-within:text-amber-500' : 'text-slate-600 group-focus-within:text-indigo-600'}`}>Staff Identity</label>
                <input 
                  type="text" 
                  placeholder="Operator Handle"
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className={`w-full border-b-2 bg-transparent py-3 px-1 transition-all outline-none font-bold text-xl ${
                    isDark 
                    ? 'border-white/10 text-white focus:border-amber-500 placeholder:text-slate-800' 
                    : 'border-slate-200 text-slate-900 focus:border-amber-600 placeholder:text-slate-300'
                  }`}
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="group space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className={`text-[10px] font-black uppercase tracking-[0.5em] transition-colors ${isDark ? 'text-slate-500 group-focus-within:text-amber-500' : 'text-slate-600 group-focus-within:text-indigo-600'}`}>Access Key</label>
                  <button type="button" className="text-[9px] font-black uppercase tracking-widest text-amber-500">Emergency Reset</button>
                </div>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className={`w-full border-b-2 bg-transparent py-3 px-1 transition-all outline-none font-bold text-xl ${
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
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-500 text-center text-[11px] font-black uppercase tracking-widest animate-shake">
                {error}
              </div>
            )}

            <button 
              type="submit"
              className={`w-full py-6 rounded-full font-black text-xs uppercase tracking-[0.5em] transition-all active:scale-[0.98] shadow-2xl ${
                isDark 
                ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/20' 
                : 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/20'
              }`}
            >
              Initialize Node
            </button>
          </form>

          <div className={`mt-14 lg:mt-20 transition-all duration-500 ${isFocused && window.innerWidth < 1024 ? 'opacity-0 translate-y-4' : 'opacity-30'}`}>
            <p className="text-[9px] text-center lg:text-left text-slate-500 font-black uppercase tracking-[0.6em]">
              &copy; {new Date().getFullYear()} Adveda Solutions Group • Ahmedabad Hub
            </p>
          </div>
        </div>
      </div>

      {/* Showcase Column - Desktop Only */}
      <div className={`hidden lg:flex lg:w-[40%] xl:w-[45%] relative p-16 justify-center items-center overflow-hidden transition-colors duration-700 ${isDark ? 'bg-slate-950' : 'bg-[#1a1a2e]'}`}>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10 w-full max-w-[480px]">
          <div className="bg-white/5 border border-white/10 rounded-[4rem] p-16 shadow-2xl space-y-12 animate-fadeIn">
            <div className="h-1 w-12 bg-amber-500/50 rounded-full mb-10"></div>
            <h2 className="text-5xl font-[1000] text-white tracking-tighter leading-[0.85] uppercase italic">
              Empowering <br/>The Modern <br/><span className="text-amber-500">Hotelier.</span>
            </h2>
            <p className="text-slate-400 text-lg font-medium leading-relaxed opacity-60">
              Integrated property management architecture, designed for reliability and world-class guest intelligence.
            </p>
            <div className="pt-8 flex items-center gap-10 opacity-50">
               <div className="space-y-1">
                 <p className="text-xl font-black text-white">Cloud</p>
                 <p className="text-[8px] text-amber-500 font-black uppercase tracking-[0.2em]">Deployment</p>
               </div>
               <div className="w-px h-8 bg-white/10"></div>
               <div className="space-y-1">
                 <p className="text-xl font-black text-white">Global</p>
                 <p className="text-[8px] text-amber-500 font-black uppercase tracking-[0.2em]">Architecture</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
