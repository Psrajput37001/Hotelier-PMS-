
import React, { useState, useEffect } from 'react';
import { AppTab, UserSession, PropertySetupData } from './types';
import { Icons } from './constants';
import Dashboard from './components/Dashboard';
import Rooms from './components/Rooms';
import Bookings from './components/Bookings';
import SuperadminPanel from './components/SuperadminPanel';
import Login from './components/Login';
import Logo from './components/Logo';
import PropertySetup from './components/PropertySetup';

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

  const handleOnboardingComplete = (data: PropertySetupData) => {
    if (session) {
      setSession({ ...session, isSetupComplete: true, setupData: data });
    }
  };

  if (!session) {
    return <Login onLogin={setSession} theme={theme} toggleTheme={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')} />;
  }

  // If Hotel Owner but setup is not complete, force onboarding
  if (session.role === 'HOTEL_ADMIN' && !session.isSetupComplete) {
    return <PropertySetup onComplete={handleOnboardingComplete} theme={theme} />;
  }

  const isSuper = session.role === 'SUPERADMIN';

  const navItems = isSuper 
    ? [
        { id: 'dashboard' as AppTab, label: 'Analytics', icon: <Icons.Dashboard /> },
        { id: 'tenants' as AppTab, label: 'Manage Hotels', icon: <Icons.Tenants /> },
      ]
    : [
        { id: 'dashboard' as AppTab, label: 'Dashboard', icon: <Icons.Dashboard /> },
        { id: 'rooms' as AppTab, label: 'Room Inventory', icon: <Icons.Rooms /> },
        { id: 'bookings' as AppTab, label: 'Reservations', icon: <Icons.Bookings /> },
        { id: 'staff' as AppTab, label: 'Personnel', icon: <Icons.Staff /> },
        { id: 'accounting' as AppTab, label: 'Accounting', icon: <Icons.Accounting /> },
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
                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20 translate-x-2'
                    : (theme === 'dark' ? 'text-slate-500 hover:bg-white/5 hover:text-slate-200' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900')
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
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs shadow-inner ${theme === 'dark' ? 'bg-white text-black' : 'bg-slate-900 text-white'}`}>
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
            Terminal Shutdown
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
                    theme === 'dark' ? 'bg-white/5 text-amber-500 border-white/10' : 'bg-slate-50 text-slate-900 border-slate-200'
                 }`}>
                    SCOPE: {session.clientId}
                 </span>
              </div>
              <h2 className={`text-lg lg:text-2xl font-black capitalize tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                {activeTab.replace('-', ' ')}
              </h2>
            </div>
          </div>
          
          <div className="flex items-center gap-3 md:gap-4">
            <button 
              onClick={toggleTheme}
              className={`flex items-center justify-center p-2.5 rounded-xl transition-all duration-300 shadow-sm border ${
                theme === 'dark' 
                ? 'bg-slate-800 border-slate-700 text-amber-400' 
                : 'bg-slate-100 border-slate-200 text-slate-600'
              }`}
            >
              {theme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="18.36" x2="5.64" y2="16.92"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              )}
            </button>

            <button className="lg:hidden p-2.5 bg-amber-500 text-black rounded-xl" onClick={() => setIsMobileMenuOpen(true)}>
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
              </>
            ) : (
              <>
                {activeTab === 'dashboard' && <Dashboard role="HOTEL_ADMIN" theme={theme} setupData={session.setupData} />}
                {activeTab === 'rooms' && <Rooms theme={theme} setupData={session.setupData} />}
                {activeTab === 'bookings' && <Bookings theme={theme} />}
              </>
            )}
          </div>
        </div>

        {/* Mobile App Dock */}
        <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[440px] z-50">
          <div className={`p-2.5 rounded-[2.5rem] flex items-center justify-around shadow-2xl transition-all duration-500 backdrop-blur-2xl border
            ${theme === 'dark' ? 'bg-slate-900/80 border-white/10' : 'bg-white/80 border-slate-200'}`}>
            {navItems.slice(0, 4).map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
                  activeTab === item.id 
                    ? 'bg-amber-500 text-black scale-110 shadow-lg' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {item.icon}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
