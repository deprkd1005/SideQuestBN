import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import TouristDashboard from './components/TouristDashboard';
import TouristWallet from './components/TouristWallet';
import TouristBookings from './components/TouristBookings';
import HostDashboard from './components/HostDashboard';
import HostWallet from './components/HostWallet';
import HostRequests from './components/HostRequests';
import SplashScreen from './components/SplashScreen';
import LoginScreen from './components/LoginScreen';
import { TourismPaymentProvider } from './context/TourismPaymentContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import './index.css';

const AppContent = () => {
  const [showSplash, setSplash] = useState(true);
  const { t } = useLanguage();
  
  // Smart preservation of selected portal on route reloads
  const [portal, setPortal] = useState(() => {
    if (window.location.pathname.startsWith('/tourist')) return 'tourist';
    if (window.location.pathname.startsWith('/host')) return 'host';
    return localStorage.getItem('tourism_active_portal') || null;
  });

  const handleSetPortal = (val) => {
    setPortal(val);
    if (val) {
      localStorage.setItem('tourism_active_portal', val);
    } else {
      localStorage.removeItem('tourism_active_portal');
    }
  };

  if (showSplash) {
    return <SplashScreen onComplete={() => setSplash(false)} />;
  }

  if (!portal) {
    return (
      <LoginScreen 
        onLoginSuccess={(selectedPortal, userData) => {
          localStorage.setItem('tourism_auth_user', JSON.stringify(userData));
          handleSetPortal(selectedPortal);
        }}
      />
    );
  }

  const authUser = JSON.parse(localStorage.getItem('tourism_auth_user') || '{}');

  return (
    <Router>
      <div className={`app-container ${portal === 'tourist' ? 'theme-customer' : 'theme-provider'}`}>
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <Routes>
            {portal === 'tourist' ? (
              <>
                <Route path="/tourist" element={<TouristDashboard />} />
                <Route path="/tourist/bookings" element={<TouristBookings />} />
                <Route path="/tourist/wallet" element={<TouristWallet />} />
                <Route path="/tourist/notifications" element={
                  <div className="app-content" style={{padding:'40px 24px'}}>
                    <h1 className="section-title" style={{padding:0}}>{t('inbox')}</h1>
                    <p className="section-subtitle" style={{padding:0, marginTop: '8px'}}>No new notifications</p>
                  </div>
                } />
                <Route path="/tourist/profile" element={
                  <div className="app-content" style={{padding:'40px 24px'}}>
                    <h1 className="section-title" style={{padding:0}}>{t('profile')}</h1>
                    <p className="section-subtitle" style={{padding:0, marginTop: '8px'}}>{authUser.name || 'Sarah Smith'} · {authUser.nationality || 'Singapore'}</p>
                    <button className="btn-outline" style={{marginTop:'24px', width:'100%', border: '1px solid var(--border-glass)'}} onClick={() => handleSetPortal(null)}>{t('logout')}</button>
                  </div>
                } />
                <Route path="*" element={<Navigate to="/tourist" />} />
              </>
            ) : (
              <>
                <Route path="/host" element={<HostDashboard />} />
                <Route path="/host/requests" element={<HostRequests />} />
                <Route path="/host/wallet" element={<HostWallet />} />
                <Route path="/host/notifications" element={
                  <div className="app-content" style={{padding:'40px 24px'}}>
                    <h1 className="section-title" style={{padding:0}}>{t('inbox')}</h1>
                    <p className="section-subtitle" style={{padding:0, marginTop: '8px'}}>No new notifications</p>
                  </div>
                } />
                <Route path="/host/profile" element={
                  <div className="app-content" style={{padding:'40px 24px'}}>
                    <h1 className="section-title" style={{padding:0}}>{t('profile')}</h1>
                    <p className="section-subtitle" style={{padding:0, marginTop: '8px'}}>{authUser.businessName || 'Kempas Heritage Tours & Crafts'}</p>
                    <p className="section-subtitle" style={{padding:0, marginTop: '4px', fontSize: '0.8rem', color: 'var(--gold)'}}>BruneiID Verified Host: {authUser.name || 'Haji Ahmad bin Ibrahim'}</p>
                    <button className="btn-outline" style={{marginTop:'24px', width:'100%', border: '1px solid var(--border-glass)'}} onClick={() => handleSetPortal(null)}>{t('logout')}</button>
                  </div>
                } />
                <Route path="*" element={<Navigate to="/host" />} />
              </>
            )}
          </Routes>
        </div>
        <BottomNav portal={portal} />
        
        {/* Portal Switcher for Pitch Demo */}
        <div style={{
          position: 'absolute', top: '12px', right: '12px', zIndex: 9999,
          background: 'rgba(0,0,0,0.85)', borderRadius: '20px', padding: '3px',
          display: 'flex', gap: '3px', backdropFilter: 'blur(10px)'
        }}>
          <button onClick={() => { handleSetPortal('tourist'); window.location.href = '/tourist'; }}
            style={{ background: portal === 'tourist' ? 'var(--emerald)' : 'transparent', color: 'white', border: 'none', borderRadius: '16px', padding: '5px 10px', fontSize: '9px', fontWeight: 800, cursor: 'pointer', letterSpacing: '0.5px' }}>
            TOURIST
          </button>
          <button onClick={() => { handleSetPortal('host'); window.location.href = '/host'; }}
            style={{ background: portal === 'host' ? 'var(--gold)' : 'transparent', color: 'white', border: 'none', borderRadius: '16px', padding: '5px 10px', fontSize: '9px', fontWeight: 800, cursor: 'pointer', letterSpacing: '0.5px' }}>
            HOST
          </button>
        </div>
      </div>
    </Router>
  );
};

const App = () => {
  return (
    <LanguageProvider>
      <TourismPaymentProvider>
        <AppContent />
      </TourismPaymentProvider>
    </LanguageProvider>
  );
};

export default App;
