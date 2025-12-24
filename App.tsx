
import React, { useState, useEffect } from 'react';
import { AppTab, UserSession } from './types';
import { Icons } from './constants';
import Dashboard from './components/Dashboard';
import Rooms from './components/Rooms';
import Bookings from './components/Bookings';
import SuperadminPanel from './components/SuperadminPanel';
import Login from './components/Login';
import Logo from './components/Logo';
import ChatInterface from './components/ChatInterface';
import ImageGen from './components/ImageGen';
import LiveSession from './components/LiveSession';

const App: React.FC = () => {
  const [session, setSession] = useState<UserSession | null>(null);
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme]);

  if (!session) {
    return <Login onLogin={setSession} theme={theme} toggleTheme={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')} />;
  }

  const isSuper = session.role === 'SUPERADMIN';

  const navItems = isSuper 
    ? [
        { id: 'dashboard' as AppTab, label: 'Analytics', icon: <Icons.Dashboard /> },
        { id: 'tenants' as AppTab, label: 'Hotels', icon: <Icons.Tenants /> },
        { id: 'chat' as AppTab, label: 'AI Chat', icon: <Icons.Chat /> },
      ]
    : [
        { id: 'dashboard' as AppTab, label: 'Board', icon: <Icons.Dashboard /> },
        { id: 'rooms' as AppTab, label: 'Rooms', icon: <Icons.Rooms /> },
        { id: 'bookings' as AppTab, label: 'Reservations', icon: <Icons.Bookings /> },
        { id: 'chat' as AppTab, label: 'AI Hub', icon: <Icons.Chat /> },
        { id: 'image-gen' as AppTab, label: 'Creative', icon: <Icons.Image /> },
        { id: 'live' as AppTab, label: 'Live AI', icon: <Icons.Audio /> },
      ];

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  return (
    <div className={`flex h-screen overflow-hidden font-sans transition-colors duration-500 ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex w-[280px] flex-col shadow-2xl z-30 border-r transition-all duration-500 
        ${theme === 'dark' 
          ? 'bg-obsidian border-white/5' 
          : 'bg-white border-slate-200'}`}>
        <div className="p-8">
          <Logo size="md" className="mb-12" />

          <nav className="space-y-1.5">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 group ${
                  activeTab === item.id 
                    ? (theme === 'dark' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 translate-x-2' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 translate-x-2')
                    : (theme === 'dark' ? 'text-slate-500 hover:bg-white/5 hover:text-slate-200' : 'text-slate-500 hover:bg-slate-100 hover:text-indigo-600')
                }`}
              >
                <div className={activeTab === item.id ? 'text-current' : 'text-slate-500 group-hover:text-current transition-colors'}>
                  {item.icon}
                </div>
                <span className="font-bold text-[10px] uppercase tracking-[0.2em]">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
        
        <div className="mt-auto p-8 space-y-4">
          <div className={`p-5 rounded-[2rem] border backdrop-blur-md ${theme === 'dark' ? 'bg-white/[0.03] border-white/5' : 'bg-slate-50 border-slate-200'}`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs shadow-inner ${theme === 'dark' ? 'bg-white text-black' : 'bg-indigo-600 text-white'}`}>
                {session.username.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className={`text-xs font-black truncate leading-none mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{session.username}</p>
                <p className="text-[9px] text-amber-500 font-black uppercase tracking-widest opacity-80">{session.clientId}</p>
              </div>
            </div>
          </div>
          <button 
            onClick={() => setSession(null)}
            className="w-full flex items-center justify-center gap-3 py-2 text-[9px] font-black text-slate-500 hover:text-red-500 transition-all uppercase tracking-[0.3em]"
          >
            Shutdown
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 relative overflow-hidden h-full">
        {/* Header */}
        <header className={`h-20 lg:h-24 flex items-center justify-between px-6 sm:px-10 border-b z-20 transition-all duration-500 
          ${theme === 'dark' ? 'bg-obsidian/95 border-white/5 backdrop-blur-xl' : 'bg-white/95 border-slate-100 backdrop-blur-xl'}`}>
          <div className="flex items-center gap-4">
            <div className="lg:hidden">
              <Logo size="sm" />
            </div>
            <div className="hidden lg:block h-8 w-px bg-slate-200/50 mx-2"></div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-0.5">
                 <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${
                    theme === 'dark' ? 'bg-indigo-900/20 text-indigo-400 border-indigo-500/20' : 'bg-indigo-50 text-indigo-600 border-indigo-100'
                 }`}>
                    ID: {session.clientId}
                 </span>
                 <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
              </div>
              <h2 className={`text-lg lg:text-2xl font-black capitalize tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                {activeTab.replace('-', ' ')}
              </h2>
            </div>
          </div>
          
          <div className="flex items-center gap-3 md:gap-4">
            {/* Day/Night Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className={`flex items-center justify-center p-2.5 rounded-xl transition-all duration-300 shadow-sm border ${
                theme === 'dark' 
                ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700 hover:border-amber-500/50' 
                : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-white hover:border-indigo-600/50'
              }`}
              title={theme === 'dark' ? "Switch to Day Mode" : "Switch to Night Mode"}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="18.36" x2="5.64" y2="16.92"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              )}
            </button>

            <button className="lg:hidden p-2.5 bg-slate-100 text-slate-900 rounded-xl" onClick={() => setIsMobileMenuOpen(true)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
          </div>
        </header>

        {/* Scrollable Container */}
        <div className="flex-1 overflow-auto hide-scrollbar content-container">
          <div className="page-enter h-full">
            {isSuper ? (
              <>
                {activeTab === 'dashboard' && <Dashboard role="SUPERADMIN" theme={theme} />}
                {activeTab === 'tenants' && <SuperadminPanel theme={theme} />}
                {activeTab === 'chat' && <ChatInterface theme={theme} />}
              </>
            ) : (
              <>
                {activeTab === 'dashboard' && <Dashboard role="HOTEL_ADMIN" theme={theme} />}
                {activeTab === 'rooms' && <Rooms theme={theme} />}
                {activeTab === 'bookings' && <Bookings theme={theme} />}
                {activeTab === 'chat' && <ChatInterface theme={theme} />}
                {activeTab === 'image-gen' && <ImageGen theme={theme} />}
                {activeTab === 'live' && <LiveSession theme={theme} />}
              </>
            )}
          </div>
        </div>

        {/* Mobile App Dock - Improved Responsiveness */}
        <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[440px] z-50">
          <div className={`p-2.5 rounded-[2.5rem] flex items-center justify-around shadow-2xl transition-all duration-500 backdrop-blur-2xl border
            ${theme === 'dark' ? 'bg-slate-900/80 border-white/10' : 'bg-white/80 border-slate-200'}`}>
            {navItems.slice(0, 4).map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
                  activeTab === item.id 
                    ? (theme === 'dark' ? 'bg-indigo-600 text-white scale-110 shadow-lg shadow-indigo-600/20' : 'bg-indigo-600 text-white scale-110 shadow-lg shadow-indigo-600/20') 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {item.icon}
                {activeTab === item.id && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-current"></span>
                  </span>
                )}
              </button>
            ))}
            <div className={`w-px h-6 mx-1 ${theme === 'dark' ? 'bg-white/10' : 'bg-slate-200'}`}></div>
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${theme === 'dark' ? 'text-slate-500 hover:text-white' : 'text-slate-500 hover:text-indigo-600'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
            </button>
          </div>
        </div>
      </main>

      {/* Slide-over Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[60] bg-black/60 backdrop-blur-md transition-all duration-300" onClick={() => setIsMobileMenuOpen(false)}>
           <div className={`absolute right-0 top-0 bottom-0 w-[85%] max-w-[320px] p-8 shadow-2xl transition-transform duration-500 ease-out
              ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`} 
              onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-10">
                <Logo size="sm" />
                <button onClick={() => setIsMobileMenuOpen(false)} className={`p-2 rounded-xl ${theme === 'dark' ? 'hover:bg-white/5 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
              
              <div className="space-y-6">
                <div className={`flex items-center gap-4 p-5 rounded-[2rem] border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                   <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg ${theme === 'dark' ? 'bg-indigo-600 text-white' : 'bg-indigo-600 text-white'}`}>
                     {session.username.charAt(0).toUpperCase()}
                   </div>
                   <div className="min-w-0">
                     <p className={`font-black text-lg leading-tight truncate ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{session.username}</p>
                     <p className="text-amber-500 text-[10px] font-black uppercase tracking-widest">{session.clientId}</p>
                   </div>
                </div>

                <div className="pt-4 space-y-4">
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1 opacity-60">Operations</p>
                   <div className="grid grid-cols-1 gap-2">
                     {navItems.map(item => (
                       <button 
                        key={item.id}
                        onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
                        className={`flex items-center gap-4 p-4 rounded-2xl font-bold text-sm transition-all ${
                          activeTab === item.id 
                            ? (theme === 'dark' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20')
                            : (theme === 'dark' ? 'text-slate-400 hover:bg-white/5' : 'text-slate-600 hover:bg-slate-100')
                        }`}
                       >
                         {item.icon} <span className="uppercase tracking-widest text-xs font-black">{item.label}</span>
                       </button>
                     ))}
                   </div>
                </div>

                <div className="pt-10 border-t border-slate-500/10">
                   <button 
                    onClick={toggleTheme}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold text-sm mb-2 transition-all ${theme === 'dark' ? 'text-indigo-400 bg-white/5' : 'text-indigo-600 bg-indigo-50'}`}
                   >
                     {theme === 'dark' ? (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="18.36" x2="5.64" y2="16.92"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                          <span className="uppercase tracking-widest text-[10px] font-black">Day Vision</span>
                        </>
                     ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                          <span className="uppercase tracking-widest text-[10px] font-black">Night Vision</span>
                        </>
                     )}
                   </button>
                   
                   <button 
                    className="w-full text-center text-red-500 font-black text-[10px] py-4 rounded-2xl hover:bg-red-500/10 transition-colors uppercase tracking-[0.3em]" 
                    onClick={() => setSession(null)}
                  >
                    Terminate Session
                  </button>
                </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default App;
