
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

    // Superadmin Credentials
    if (clientId.toUpperCase() === 'SUPERADMIN' && username.toUpperCase() === 'SUPERADMIN' && password === 'Reset@852') {
       onLogin({ role: 'SUPERADMIN', username: 'SUPERADMIN', clientId: 'SUPERADMIN' });
       return;
    }

    // Default Hotel User Logic (Validates against tenants in App.tsx)
    if (clientId && username && password) {
       onLogin({ role: 'HOTEL_ADMIN', username, clientId: clientId.toUpperCase() });
       return;
    }

    setError('Access Denied. Check credentials.');
  };

  return (
    <div className={`min-h-screen w-full flex flex-col lg:flex-row font-sans overflow-y-auto transition-colors duration-700 ${isDark ? 'bg-[#020617]' : 'bg-[#F8FAFC]'}`}>
      
      {/* Theme Toggle Button */}
      <button 
        onClick={toggleTheme}
        type="button"
        className={`fixed top-6 right-6 z-[100] w-12 h-12 flex items-center justify-center rounded-2xl shadow-xl transition-all active:scale-90 border backdrop-blur-md ${
          isDark ? 'bg-slate-900/80 border-white/10 text-amber-500' : 'bg-white/80 border-slate-200 text-slate-600'
        }`}
      >
        {isDark ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="18.36" x2="5.64" y2="16.92"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        )}
      </button>

      {/* Main Login Area */}
      <div className={`flex-1 flex flex-col justify-center items-center p-8 sm:p-12 lg:p-24 z-10 transition-all duration-500`}>
        <div className={`w-full max-w-[440px] transition-all duration-500`}>
          
          <div className={`transition-all duration-500 ease-in-out ${isFocused ? 'mb-4' : 'mb-8 lg:mb-14'} text-center lg:text-left`}>
            <Logo size="lg" className="inline-block transition-transform duration-500 origin-center lg:origin-left" shrunk={isFocused} />
            
            <div className={`transition-all duration-500 ease-in-out transform overflow-hidden ${isFocused ? 'opacity-0 max-h-0 scale-90 pointer-events-none mt-0' : 'opacity-100 max-h-40 scale-100 mt-6 lg:mt-10'}`}>
              <h1 className={`text-3xl lg:text-5xl font-black tracking-tighter mb-3 lg:mb-4 leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Operational Terminal<span className="text-amber-500">.</span>
              </h1>
              <p className={`text-xs lg:text-sm font-medium opacity-60 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Sync with your property's PMS node.
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className={`space-y-6 lg:space-y-8 animate-fadeIn transition-all duration-500 ${isFocused ? 'translate-y-0' : 'translate-y-0'}`}>
            <div className="space-y-5 lg:space-y-6">
              <div className="group space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] ml-1 text-slate-500">Tenant Scope</label>
                <input 
                  type="text" 
                  placeholder="EX: AD-99-PMS"
                  autoComplete="off"
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className={`w-full border-b-2 bg-transparent py-3 px-1 transition-all outline-none font-bold text-lg lg:text-xl ${
                    isDark ? 'border-white/10 text-white focus:border-amber-500 placeholder:text-slate-800' : 'border-slate-200 text-slate-900 focus:border-slate-900 placeholder:text-slate-300'
                  }`}
                  value={clientId}
                  onChange={e => setClientId(e.target.value)}
                  required
                />
              </div>

              <div className="group space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] ml-1 text-slate-500">Staff Handle</label>
                <input 
                  type="text" 
                  placeholder="Operator Identity"
                  autoComplete="username"
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className={`w-full border-b-2 bg-transparent py-3 px-1 transition-all outline-none font-bold text-lg lg:text-xl ${
                    isDark ? 'border-white/10 text-white focus:border-amber-500 placeholder:text-slate-800' : 'border-slate-200 text-slate-900 focus:border-slate-900 placeholder:text-slate-300'
                  }`}
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="group space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] ml-1 text-slate-500">Access Key</label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  autoComplete="current-password"
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className={`w-full border-b-2 bg-transparent py-3 px-1 transition-all outline-none font-bold text-lg lg:text-xl ${
                    isDark ? 'border-white/10 text-white focus:border-amber-500' : 'border-slate-200 text-slate-900 focus:border-slate-900'
                  }`}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-center text-[10px] font-black uppercase tracking-widest animate-shake">
                {error}
              </div>
            )}

            <button 
              type="submit"
              className={`w-full py-5 lg:py-6 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.4em] transition-all active:scale-[0.98] shadow-2xl ${
                isDark ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/20' : 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/20'
              }`}
            >
              Authorize Sync
            </button>
          </form>

          <p className={`transition-all duration-500 ${isFocused ? 'mt-6' : 'mt-12'} mb-8 text-[9px] text-center lg:text-left text-slate-500 font-black uppercase tracking-[0.6em] opacity-30`}>
            &copy; {new Date().getFullYear()} Adveda Solutions • PMS Core v4.0
          </p>
        </div>
      </div>

      {/* Showcase Column - Desktop Only */}
      <div className={`hidden lg:flex lg:w-[45%] sticky top-0 h-screen p-16 justify-center items-center overflow-hidden transition-all duration-700 ${isDark ? 'bg-slate-950' : 'bg-slate-900'}`}>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[120px]"></div>
        <div className="relative z-10 w-full max-w-[480px]">
          <div className="bg-white/5 border border-white/10 rounded-[3rem] p-12 lg:p-16 shadow-2xl space-y-12">
            <h2 className="text-5xl font-black text-white tracking-tighter leading-[0.85] uppercase italic">
              Integrated <br/>Hospitality <br/><span className="text-amber-500 text-6xl">Intelligence.</span>
            </h2>
            <p className="text-slate-400 text-lg font-medium leading-relaxed opacity-70">
              A high-performance architecture built for modern property operations, revenue tracking, and global node management.
            </p>
            <div className="pt-8 flex items-center gap-10 opacity-60">
               <div className="space-y-1">
                 <p className="text-xl font-black text-white">Adveda</p>
                 <p className="text-[8px] text-amber-500 font-black uppercase tracking-widest">Global Hub</p>
               </div>
               <div className="w-px h-8 bg-white/10"></div>
               <div className="space-y-1">
                 <p className="text-xl font-black text-white">99.9%</p>
                 <p className="text-[8px] text-amber-500 font-black uppercase tracking-widest">Uptime Rate</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
