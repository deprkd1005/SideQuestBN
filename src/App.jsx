import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign } from 'lucide-react';
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
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                style={{ position: 'absolute', inset: 0, zIndex: 999999, pointerEvents: 'auto', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                {/* Coins falling using basic CSS animation */}
                <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
                  {[...Array(15)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ y: -100, x: Math.random() * 380 + 20, rotate: 0 }}
                      animate={{ y: 1000, rotate: 360 }}
                      transition={{ duration: 1.5 + Math.random(), repeat: Infinity, delay: Math.random() }}
                      style={{ position: 'absolute', top: 0, left: 0 }}
                    >
                      <div style={{ background: '#fbbf24', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px rgba(0,0,0,0.4)', border: '4px solid #f59e0b' }}>
                        <DollarSign size={24} fill="#f59e0b" stroke="#f59e0b" />
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <motion.div initial={{ scale: 0.5, y: 50 }} animate={{ scale: 1, y: 0 }} style={{ padding: '32px', background: 'white', borderRadius: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', textAlign: 'center', zIndex: 2, position: 'relative', width: '85%' }}>
                    <div className="spinner-small" style={{ margin: '0 auto 16px', borderColor: 'var(--emerald)', borderRightColor: 'transparent' }} />
                    <h2 style={{ fontWeight: 900, fontSize: '1.5rem', color: 'black' }}>Processing...</h2>
                    <p style={{ color: 'var(--text-muted)', fontWeight: 600, marginTop: '8px' }}>Securing BND Transfer</p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Router>
    </PaymentProvider>
  );
}

export default App;
