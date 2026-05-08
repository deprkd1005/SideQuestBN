import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PortalSelector from './shared/PortalSelector';
import HustlerPortal from './portals/hustler/HustlerPortal';
import PosterPortal from './portals/poster/PosterPortal';
import AdminPortal from './portals/admin/AdminPortal';
import { PaymentProvider } from './context/PaymentContext';
import './index.css';

import SplashScreen from './shared/SplashScreen';

function App() {
  const [showSplash, setShowSplash] = React.useState(true);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <PaymentProvider>
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<div className="app-content no-pad"><PortalSelector /></div>} />
            <Route path="/hustler/*" element={<HustlerPortal />} />
            <Route path="/poster/*" element={<PosterPortal />} />
            <Route path="/admin/*" element={<AdminPortal />} />
          </Routes>
        </div>
      </Router>
    </PaymentProvider>
  );
}

export default App;
