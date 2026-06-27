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
import TouristProfile from './components/tourist/TouristProfile';
import TouristPassport from './components/tourist/TouristPassport';
import HostProfile from './components/host/HostProfile';
import NotificationsScreen from './components/NotificationsScreen';
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
                <Route path="/tourist/passport" element={<TouristPassport />} />
                <Route path="/tourist/notifications" element={<NotificationsScreen portal="tourist" />} />
                <Route path="/tourist/profile" element={<TouristProfile onLogout={() => handleSetPortal(null)} authUser={authUser} />} />
                <Route path="*" element={<Navigate to="/tourist" />} />
              </>
            ) : (
              <>
                <Route path="/host" element={<HostDashboard />} />
                <Route path="/host/requests" element={<HostRequests />} />
                <Route path="/host/wallet" element={<HostWallet />} />
                <Route path="/host/notifications" element={<NotificationsScreen portal="host" />} />
                <Route path="/host/profile" element={<HostProfile onLogout={() => handleSetPortal(null)} authUser={authUser} />} />
                <Route path="*" element={<Navigate to="/host" />} />
              </>
            )}
          </Routes>
        </div>
        <BottomNav portal={portal} />

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
