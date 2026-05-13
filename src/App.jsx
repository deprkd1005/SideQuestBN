import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HustlerPortal from './portals/hustler/HustlerPortal';
import PosterPortal from './portals/poster/PosterPortal';
import AdminPortal from './portals/admin/AdminPortal';
import { PaymentProvider, usePayment } from './context/PaymentContext';
import SplashScreen from './shared/SplashScreen';
import Auth from './shared/Auth';
import './index.css';

const AppRoutes = () => {
  const { user, token, loading } = usePayment();

  if (loading) {
    return <div className="app-container flex-center" style={{ background: 'var(--bg-primary)' }}>
      <div className="spinner-small" />
    </div>;
  }

  return (
    <Routes>
      <Route path="/" element={token ? <Navigate to={user?.role === 'admin' ? '/admin' : user?.role === 'provider' ? '/hustler' : '/poster'} /> : <Auth />} />
      <Route path="/hustler/*" element={token && user?.role === 'provider' ? <HustlerPortal /> : <Navigate to="/" />} />
      <Route path="/poster/*" element={token && user?.role === 'customer' ? <PosterPortal /> : <Navigate to="/" />} />
      <Route path="/admin/*" element={token && user?.role === 'admin' ? <AdminPortal /> : <Navigate to="/" />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <PaymentProvider>
      <Router>
        <div className="app-container">
          <AppRoutes />
        </div>
      </Router>
    </PaymentProvider>
  );
}

export default App;
