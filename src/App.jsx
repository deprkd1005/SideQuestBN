import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';
import PortalSelector from './shared/PortalSelector';
import HustlerPortal from './portals/hustler/HustlerPortal';
import PosterPortal from './portals/poster/PosterPortal';
import AdminPortal from './portals/admin/AdminPortal';
import { PaymentProvider } from './context/PaymentContext';
import './index.css';

import SplashScreen from './shared/SplashScreen';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [globalAnimation, setGlobalAnimation] = useState(null); // 'transferring' or null

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <PaymentProvider>
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<div className="app-content no-pad"><PortalSelector /></div>} />
            <Route path="/hustler/*" element={<HustlerPortal onAnimation={setGlobalAnimation} />} />
            <Route path="/poster/*" element={<PosterPortal onAnimation={setGlobalAnimation} />} />
            <Route path="/admin/*" element={<AdminPortal />} />
          </Routes>
          {/* GLOBAL MONEY RAIN - Fixed at Root */}
          <AnimatePresence>
            {globalAnimation === 'transferring' && (
              <div style={{ position: 'absolute', inset: 0, zIndex: 99999, pointerEvents: 'none', overflow: 'hidden' }}>
                {[...Array(15)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ y: -100, x: Math.random() * 380 + 20, opacity: 0 }}
                    animate={{ y: 1000, opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                    style={{ position: 'absolute', top: 0, left: 0 }}
                  >
                    <div style={{ background: '#fbbf24', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px rgba(0,0,0,0.2)', border: '2px solid white' }}>
                      <Zap size={20} fill="white" stroke="none" />
                    </div>
                  </motion.div>
                ))}
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'auto', width: '80%' }}>
                   <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} style={{ padding: '32px', background: 'white', borderRadius: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', textAlign: 'center' }}>
                      <div className="spinner-small" style={{ margin: '0 auto 16px' }} />
                      <h2 style={{ fontWeight: 900 }}>Processing...</h2>
                      <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Securing BND Transfer</p>
                   </motion.div>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </Router>
    </PaymentProvider>
  );
}

export default App;
