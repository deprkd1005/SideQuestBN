import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';

const SplashScreen = ({ onComplete }) => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setStage(1), 800);
    const timer2 = setTimeout(() => onComplete(), 3000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#f8fafc',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      overflow: 'hidden'
    }}>
      {/* Background Glow */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 4, repeat: Infinity }}
        style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
          borderRadius: '50%'
        }}
      />

      <div style={{ position: 'relative', textAlign: 'center' }}>
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 12, stiffness: 100 }}
          style={{
            width: '100px',
            height: '100px',
            background: 'var(--bg-tertiary)',
            borderRadius: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 32px',
            border: '1px solid var(--border-glass)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            color: 'var(--emerald)'
          }}
        >
          <Zap size={50} fill="currentColor" />
        </motion.div>

        <AnimatePresence>
          {stage >= 0 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h1 style={{
                fontSize: '2.5rem',
                fontWeight: 900,
                letterSpacing: '-1.5px',
                color: 'var(--text-primary)',
                marginBottom: '8px'
              }}>
                SideQuest<span style={{ color: 'var(--emerald)' }}>.BN</span>
              </h1>
            </motion.div>
          )}
          
          {stage >= 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.9rem',
                fontWeight: 600,
                letterSpacing: '1px'
              }}
            >
              WELCOME TO THE FUTURE OF WORK
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{
          position: 'absolute',
          bottom: '-80px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '120px',
          height: '4px',
          background: 'var(--bg-tertiary)',
          borderRadius: '2px',
          overflow: 'hidden'
        }}>
          <motion.div 
            initial={{ left: '-100%' }}
            animate={{ left: '100%' }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              width: '60%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, var(--emerald), transparent)'
            }}
          />
        </div>
      </div>
      
      <p style={{
        position: 'absolute',
        bottom: '40px',
        fontSize: '0.7rem',
        color: 'var(--text-muted)',
        fontWeight: 700,
        letterSpacing: '2px',
        opacity: 0.5
      }}>
        SIDEQUEST.BN V3 PROTOTYPE
      </p>
    </div>
  );
};

export default SplashScreen;
