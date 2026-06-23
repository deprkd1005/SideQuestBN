import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, MapPin, Plane, Star } from 'lucide-react';

/* ── Floating particles for ambiance ── */
const FloatingParticle = ({ delay, x, y, size, icon: Icon }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.5 }}
    animate={{
      opacity: [0, 0.6, 0],
      y: [20, -60, -120],
      scale: [0.5, 1, 0.3],
    }}
    transition={{ duration: 4, delay, repeat: Infinity, ease: 'easeInOut' }}
    style={{
      position: 'absolute',
      left: `${x}%`,
      top: `${y}%`,
      color: 'var(--emerald)',
      filter: 'blur(0.5px)',
    }}
  >
    <Icon size={size} />
  </motion.div>
);

const SplashScreen = ({ onComplete }) => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 600);
    const t2 = setTimeout(() => setStage(2), 1200);
    const t3 = setTimeout(() => setStage(3), 1800);
    const t4 = setTimeout(() => onComplete(), 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [onComplete]);

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'var(--bg-primary, #f8fafc)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, overflow: 'hidden',
      fontFamily: 'Outfit, Inter, sans-serif',
    }}>

      {/* ── Background orbs ── */}
      <motion.div
        animate={{ scale: [1, 1.4, 1], opacity: [0.12, 0.25, 0.12] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', width: 500, height: 500,
          background: 'radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%)',
          filter: 'blur(80px)', borderRadius: '50%',
          top: '20%', left: '30%',
        }}
      />
      <motion.div
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.08, 0.18, 0.08] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        style={{
          position: 'absolute', width: 400, height: 400,
          background: 'radial-gradient(circle, rgba(250,204,21,0.12) 0%, transparent 70%)',
          filter: 'blur(70px)', borderRadius: '50%',
          bottom: '15%', right: '20%',
        }}
      />

      {/* ── Floating travel icons ── */}
      <FloatingParticle delay={0} x={15} y={25} size={14} icon={MapPin} />
      <FloatingParticle delay={1.5} x={80} y={35} size={12} icon={Plane} />
      <FloatingParticle delay={0.8} x={70} y={65} size={10} icon={Star} />
      <FloatingParticle delay={2} x={25} y={70} size={16} icon={MapPin} />
      <FloatingParticle delay={1.2} x={55} y={20} size={11} icon={Plane} />

      {/* ── Main content ── */}
      <div style={{ position: 'relative', textAlign: 'center', zIndex: 2 }}>

        {/* Compass Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 14, stiffness: 100, duration: 0.8 }}
          style={{
            width: 110, height: 110,
            background: 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(250,204,21,0.08) 100%)',
            borderRadius: 34,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 36px',
            border: '1px solid rgba(16,185,129,0.2)',
            boxShadow: '0 0 60px rgba(16,185,129,0.15), inset 0 1px 0 rgba(0,0,0,0.05)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <motion.div
            animate={{ rotate: [0, 15, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Compass size={54} strokeWidth={1.5} style={{
              color: '#10b981',
              filter: 'drop-shadow(0 0 12px rgba(16,185,129,0.4))',
            }} />
          </motion.div>
        </motion.div>

        {/* Title */}
        <AnimatePresence>
          {stage >= 0 && (
            <motion.div initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15, duration: 0.6 }}>
              <h1 style={{
                fontSize: '2.8rem', fontWeight: 900,
                letterSpacing: '-2px', marginBottom: 4,
                color: 'var(--text-primary, #0f172a)', lineHeight: 1.1,
              }}>
                SideQuest<span style={{
                  background: 'linear-gradient(135deg, #10b981, #34d399)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>.Tourism</span>
              </h1>
            </motion.div>
          )}

          {/* Tagline */}
          {stage >= 1 && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                color: '#9ca3af', fontSize: '0.85rem',
                fontWeight: 700, letterSpacing: 3,
                textTransform: 'uppercase', marginTop: 10,
              }}
            >
              Discover Brunei's Heritage
            </motion.p>
          )}

          {/* Feature chips */}
          {stage >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                display: 'flex', gap: 8, justifyContent: 'center',
                marginTop: 24, flexWrap: 'wrap',
              }}
            >
              {['Instant Passport Scan', 'Smart Booking', 'QR Tickets'].map((label, i) => (
                <motion.span
                  key={label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.15, duration: 0.3 }}
                  style={{
                    background: 'rgba(16,185,129,0.1)',
                    border: '1px solid rgba(16,185,129,0.2)',
                    borderRadius: 20, padding: '5px 14px',
                    fontSize: '0.65rem', fontWeight: 700,
                    color: '#10b981', letterSpacing: 0.5,
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  {label}
                </motion.span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress bar */}
        <div style={{
          position: 'absolute', bottom: -70,
          left: '50%', transform: 'translateX(-50%)',
          width: 140, height: 3,
          background: 'rgba(0,0,0,0.06)',
          borderRadius: 2, overflow: 'hidden',
        }}>
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2.8, ease: 'easeInOut' }}
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, #10b981, #34d399, #facc15)',
              borderRadius: 2,
              boxShadow: '0 0 12px rgba(16,185,129,0.5)',
            }}
          />
        </div>
      </div>

      {/* ── Version badge ── */}
      <AnimatePresence>
        {stage >= 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            style={{
              position: 'absolute', bottom: 36,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 6,
            }}
          >
            <span style={{
              fontSize: '0.6rem', fontWeight: 800,
              letterSpacing: 3, color: '#6b7280',
              textTransform: 'uppercase',
            }}>
              SideQuest.BN · Tourism Vertical
            </span>
            <span style={{
              fontSize: '0.5rem', fontWeight: 600,
              letterSpacing: 2, color: '#4b5563',
            }}>
              v1.0 Prototype
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SplashScreen;
