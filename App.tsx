
import React, { useState, useEffect } from 'react';
import { AppTab, UserSession, PropertySetupData, HotelTenant } from './types';
import { Icons } from './constants';
import Dashboard from './components/Dashboard';
import Rooms from './components/Rooms';
import Bookings from './components/Bookings';
import SuperadminPanel from './components/SuperadminPanel';
import Login from './components/Login';
import Logo from './components/Logo';
import PropertySetup from './components/PropertySetup';

const App: React.FC = () => {
  // Persistence Layer
  const [session, setSession] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem('hotelier_session');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [tenants, setTenants] = useState<HotelTenant[]>(() => {
    const saved = localStorage.getItem('hotelier_tenants');
    return saved ? JSON.parse(saved) : [
      { 
        id: '1', 
        clientId: 'GRAND-01', 
        name: 'Grand Plaza NYC', 
        ownerName: 'Robert De Niro',
        username: 'grand_admin',
        location: 'New York', 
        onboardedAt: '2023-12-01', 
        status: 'Active',
        modules: { inventory: true, reservations: true, personnel: true, accounting: false, concierge: true },
        isSetupComplete: true
      }
    ];
  });

  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('hotelier_theme');
    return (saved as 'light' | 'dark') || 'dark';
  });

  // Sync states to storage
  useEffect(() => {
    localStorage.setItem('hotelier_session', JSON.stringify(session));
  }, [session]);

  useEffect(() => {
    localStorage.setItem('hotelier_tenants', JSON.stringify(tenants));
  }, [tenants]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.className = theme;
    localStorage.setItem('hotelier_theme', theme);
  }, [theme]);

  const handleSignOut = () => {
    setSession(null);
    setIsMobileMenuOpen(false);
    setActiveTab('dashboard');
  };

  const handleLogin = (newSession: UserSession) => {
    // If it's a hotel admin, sync their status from global tenants list
    if (newSession.role === 'HOTEL_ADMIN') {
      const tenant = tenants.find(t => t.clientId.toUpperCase() === newSession.clientId.toUpperCase() && t.username === newSession.username);
      if (tenant) {
        newSession.isSetupComplete = tenant.isSetupComplete;
        newSession.setupData = tenant.setupData;
      } else {
        const knownClient = tenants.some(t => t.clientId.toUpperCase() === newSession.clientId.toUpperCase());
        if (!knownClient) {
            alert("Terminal Access Denied: Unrecognized Tenant Scope.");
            return;
        }
      }
    }
    setSession(newSession);
  };

  const handleOnboardingComplete = (data: PropertySetupData) => {
    if (session) {
      const updatedSession = { ...session, isSetupComplete: true, setupData: data };
      setSession(updatedSession);
      
      // Update persistent tenant list
      setTenants(prev => prev.map(t => 
        t.clientId.toUpperCase() === session.clientId.toUpperCase() ? { ...t, isSetupComplete: true, setupData: data } : t
      ));
    }
  };

  if (!session) {
    return <Login onLogin={handleLogin} theme={theme} toggleTheme={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')} />;
  }

  // Force Onboarding Flow for new Hotel Admins
  if (session.role === 'HOTEL_ADMIN' && !session.isSetupComplete) {
    return (
      <div className="relative h-screen overflow-y-auto bg-slate-950">
        <PropertySetup onComplete={handleOnboardingComplete} theme={theme} />
        <button 
          onClick={handleSignOut}
          className="fixed top-6 right-6 z-[300] bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all active:scale-95"
        >
          Abort & Exit
        </button>
      </div>
    );
  }

  const isSuper = session.role === 'SUPERADMIN';

  const navItems = isSuper 
    ? [
        { id: 'dashboard' as AppTab, label: 'Analytics', icon: <Icons.Dashboard /> },
        { id: 'tenants' as AppTab, label: 'Hotel Nodes', icon: <Icons.Tenants /> },
      ]
    : [
        { id: 'dashboard' as AppTab, label: 'Terminal', icon: <Icons.Dashboard /> },
        { id: 'rooms' as AppTab, label: 'Inventory', icon: <Icons.Rooms /> },
        { id: 'bookings' as AppTab, label: 'Manifest', icon: <Icons.Bookings /> },
        { id: 'staff' as AppTab, label: 'Personnel', icon: <Icons.Staff /> },
        { id: 'accounting' as AppTab, label: 'Ledger', icon: <Icons.Accounting /> },
      ];

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  return (
    <div className={`flex h-screen overflow-hidden transition-colors duration-500 ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Desktop Navigation (Sidebar) */}
      <aside className={`hidden lg:flex w-[280px] flex-col shadow-2xl z-30 border-r transition-all duration-500 
        ${theme === 'dark' ? 'bg-[#020617] border-white/5' : 'bg-white border-slate-200'}`}>
        <div className="p-8">
          <Logo size="md" className="mb-12" />
          <nav className="space-y-1.5">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 group ${
                  activeTab === item.id 
                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20 translate-x-1'
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
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs shadow-inner shrink-0 ${theme === 'dark' ? 'bg-white text-black' : 'bg-slate-900 text-white'}`}>
                {session.username.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className={`text-xs font-black truncate leading-none mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{session.username}</p>
                <p className="text-[9px] text-amber-500 font-black uppercase tracking-widest opacity-80">{session.clientId}</p>
              </div>
            </div>
          </div>
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-2xl border border-red-500/20 text-[9px] font-black text-red-500 hover:bg-red-500 hover:text-white transition-all uppercase tracking-[0.3em]"
          >
            Terminal Shutdown
          </button>
        </div>
      </aside>

      {/* Main Execution Content */}
      <main className="flex-1 flex flex-col min-w-0 relative h-full">
        {/* Global Header */}
        <header className={`h-20 lg:h-24 flex items-center justify-between px-6 sm:px-10 border-b z-20 transition-all duration-500 
          ${theme === 'dark' ? 'bg-[#020617]/95 border-white/5 backdrop-blur-xl' : 'bg-white/95 border-slate-100 backdrop-blur-xl'}`}>
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
                    {session.role === 'SUPERADMIN' ? 'SUPER' : `NODE: ${session.clientId}`}
                 </span>
              </div>
              <h2 className={`text-lg lg:text-2xl font-black capitalize tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                {activeTab.replace('-', ' ')}
              </h2>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleTheme}
              className={`hidden sm:flex items-center justify-center p-2.5 rounded-xl transition-all duration-300 border ${
                theme === 'dark' ? 'bg-slate-800 border-slate-700 text-amber-400' : 'bg-slate-100 border-slate-200 text-slate-600'
              }`}
            >
              {theme === 'dark' ? <Icons.Dashboard /> : <Icons.Dashboard />}
            </button>

            <button 
              className="lg:hidden p-2.5 bg-amber-500 text-black rounded-xl shadow-lg shadow-amber-500/20" 
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
          </div>
        </header>

        {/* Dynamic Content View - Scrollable */}
        <div className="flex-1 overflow-y-auto pb-24 lg:pb-0">
          <div className="page-enter h-full">
            {isSuper ? (
              <>
                {activeTab === 'dashboard' && <Dashboard role="SUPERADMIN" theme={theme} />}
                {activeTab === 'tenants' && <SuperadminPanel tenants={tenants} setTenants={setTenants} theme={theme} />}
              </>
            ) : (
              <>
                {activeTab === 'dashboard' && <Dashboard role="HOTEL_ADMIN" theme={theme} setupData={session.setupData} />}
                {activeTab === 'rooms' && <Rooms theme={theme} setupData={session.setupData} />}
                {activeTab === 'bookings' && <Bookings theme={theme} session={session} />}
                {['staff', 'accounting'].includes(activeTab) && (
                  <div className="flex items-center justify-center min-h-[400px] p-10">
                     <div className="text-center space-y-4">
                        <div className="text-5xl opacity-20">🚧</div>
                        <p className="text-xs font-black uppercase tracking-[0.4em] text-slate-500">{activeTab} module is under deployment</p>
                     </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation (Bottom Bar) */}
        <div className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-[440px] z-40">
          <div className={`p-2 rounded-[2.5rem] flex items-center justify-around shadow-2xl backdrop-blur-3xl border
            ${theme === 'dark' ? 'bg-slate-900/80 border-white/10' : 'bg-white/80 border-slate-200'}`}>
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
                  activeTab === item.id 
                    ? 'bg-amber-500 text-black scale-110 shadow-lg' 
                    : 'text-slate-500'
                }`}
              >
                {item.icon}
              </button>
            ))}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="w-12 h-12 flex items-center justify-center text-slate-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
            </button>
          </div>
        </div>
      </main>

      {/* Mobile Sidebar Overlay (Sign Out & Profile) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm animate-fadeIn" onClick={() => setIsMobileMenuOpen(false)}>
          <div className={`absolute right-0 top-0 bottom-0 w-[80%] max-w-[320px] p-8 flex flex-col shadow-2xl transition-transform duration-300 ${theme === 'dark' ? 'bg-slate-950' : 'bg-white'}`} onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-10">
              <Logo size="sm" />
              <button onClick={() => setIsMobileMenuOpen(false)} className={`p-2 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            
            <div className="space-y-6 flex-1 overflow-y-auto">
              <div className={`p-6 rounded-[2rem] border ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">Authenticated Identity</p>
                <p className="font-black text-xl truncate">{session.username}</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest opacity-60">{session.clientId}</p>
              </div>
              
              <div className="space-y-2">
                <button onClick={toggleTheme} className={`w-full text-left px-5 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border ${theme === 'dark' ? 'border-white/5 text-slate-400' : 'border-slate-100 text-slate-600'}`}>
                   Switch Interface Mode
                </button>
              </div>
            </div>

            <button 
              onClick={handleSignOut}
              className="w-full py-5 rounded-3xl bg-red-500 text-white font-black text-[10px] uppercase tracking-[0.4em] shadow-xl shadow-red-500/20 mt-6 transition-transform active:scale-95"
            >
              System Logoff
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
