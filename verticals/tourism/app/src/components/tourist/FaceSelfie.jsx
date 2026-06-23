import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Check, ShieldCheck } from 'lucide-react';

const FaceSelfie = ({ onComplete, passportData }) => {
  const [stage, setStage] = useState('ready'); // ready, capturing, verifying, verified
  const [progress, setProgress] = useState(0);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  const startCapture = async () => {
    setStage('capturing');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 480, height: 480 }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (e) {
      console.warn('Camera not available, simulating capture');
    }

    // Auto-capture after 2 seconds
    setTimeout(() => {
      setStage('verifying');
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }

      // Simulate verification progress
      let p = 0;
      const interval = setInterval(() => {
        p += 4;
        setProgress(p);
        if (p >= 100) {
          clearInterval(interval);
          setStage('verified');
        }
      }, 80);
    }, 2000);
  };

  const handleComplete = () => {
    onComplete();
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute', bottom: '-80px', left: '-80px',
        width: '250px', height: '250px',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.06) 0%, transparent 70%)',
        borderRadius: '50%'
      }} />

      <AnimatePresence mode="wait">
        {stage === 'ready' && (
          <motion.div
            key="ready"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{ textAlign: 'center', width: '100%', maxWidth: '340px' }}
          >
            <div style={{
              width: '160px', height: '160px', borderRadius: '50%',
              border: '4px dashed rgba(16,185,129,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 32px', position: 'relative'
            }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                style={{
                  position: 'absolute', inset: '-4px',
                  border: '4px solid transparent',
                  borderTopColor: '#10b981',
                  borderRadius: '50%'
                }}
              />
              <Camera size={48} color="#10b981" />
            </div>

            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: 'Outfit', marginBottom: '8px', color: '#0f172a' }}>
              Face Verification
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 500, marginBottom: '40px', lineHeight: 1.5 }}>
              Take a live selfie to verify your identity against your passport photo.
            </p>

            <button
              onClick={startCapture}
              style={{
                width: '100%', height: '60px', borderRadius: '16px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white', border: 'none', fontSize: '1rem', fontWeight: 800,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                boxShadow: '0 10px 30px rgba(16,185,129,0.3)', fontFamily: 'Outfit'
              }}
            >
              <Camera size={20} /> Start Face Capture
            </button>
          </motion.div>
        )}

        {stage === 'capturing' && (
          <motion.div
            key="capturing"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{ textAlign: 'center', width: '100%', maxWidth: '340px' }}
          >
            <div style={{
              width: '260px', height: '260px', borderRadius: '50%',
              overflow: 'hidden', margin: '0 auto 24px',
              position: 'relative',
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
            }}>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
              />

              {/* Pulsing ring overlay */}
              <motion.div
                animate={{
                  boxShadow: ['inset 0 0 0 4px rgba(16,185,129,0.4)', 'inset 0 0 0 8px rgba(16,185,129,0.1)', 'inset 0 0 0 4px rgba(16,185,129,0.4)']
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{
                  position: 'absolute', inset: 0, borderRadius: '50%',
                  border: '3px solid rgba(16, 185, 129, 0.6)'
                }}
              />

              {/* Face detection crosshair */}
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                <motion.div
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  style={{
                    width: '80px', height: '80px',
                    border: '2px solid rgba(16,185,129,0.5)',
                    borderRadius: '16px'
                  }}
                />
              </div>
            </div>

            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{ color: '#10b981', fontWeight: 800, fontSize: '0.85rem', fontFamily: 'Outfit', textTransform: 'uppercase', letterSpacing: '1px' }}
            >
              Hold still — Capturing...
            </motion.p>
          </motion.div>
        )}

        {stage === 'verifying' && (
          <motion.div
            key="verifying"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ textAlign: 'center', width: '100%', maxWidth: '340px' }}
          >
            {/* Circular progress */}
            <div style={{ width: '160px', height: '160px', margin: '0 auto 32px', position: 'relative' }}>
              <svg width="160" height="160" viewBox="0 0 160 160">
                <circle cx="80" cy="80" r="70" fill="none" stroke="#e2e8f0" strokeWidth="6" />
                <motion.circle
                  cx="80" cy="80" r="70" fill="none"
                  stroke="#10b981" strokeWidth="6" strokeLinecap="round"
                  strokeDasharray={440}
                  strokeDashoffset={440 - (440 * progress / 100)}
                  transform="rotate(-90, 80, 80)"
                  style={{ filter: 'drop-shadow(0 0 6px rgba(16,185,129,0.4))' }}
                />
              </svg>
              <div style={{
                position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center'
              }}>
                <span style={{ fontSize: '2rem', fontWeight: 900, fontFamily: 'Outfit', color: '#0f172a' }}>
                  {progress}%
                </span>
                <span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                  Matching
                </span>
              </div>
            </div>

            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px', fontFamily: 'Outfit' }}>
              Verifying Biometrics
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 500 }}>
              Comparing selfie against passport photo...
            </p>
          </motion.div>
        )}

        {stage === 'verified' && (
          <motion.div
            key="verified"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{ textAlign: 'center', width: '100%', maxWidth: '340px' }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 10, stiffness: 100 }}
              style={{
                width: '100px', height: '100px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 24px', boxShadow: '0 20px 50px rgba(16,185,129,0.3)'
              }}
            >
              <ShieldCheck size={50} color="white" />
            </motion.div>

            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: 'Outfit', marginBottom: '4px', color: '#10b981' }}>
              Identity Verified
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>
              Biometric match score: <strong style={{ color: '#10b981' }}>98.7%</strong>
            </p>
            <p style={{ color: '#94a3b8', fontSize: '0.78rem', fontWeight: 500, marginBottom: '32px' }}>
              Welcome, {passportData?.name || 'Traveler'}
            </p>

            {/* Success info card */}
            <div style={{
              background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)',
              borderRadius: '16px', padding: '16px', marginBottom: '24px',
              display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left'
            }}>
              <ShieldCheck size={24} color="#10b981" />
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#10b981' }}>BIOMETRIC LOCK ACTIVE</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 500 }}>
                  Your identity is secured with facial biometrics for this session.
                </div>
              </div>
            </div>

            <button
              onClick={handleComplete}
              style={{
                width: '100%', height: '60px', borderRadius: '16px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white', border: 'none', fontSize: '1rem', fontWeight: 800,
                cursor: 'pointer', boxShadow: '0 10px 30px rgba(16,185,129,0.3)',
                fontFamily: 'Outfit'
              }}
            >
              Enter Tourist Portal →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FaceSelfie;
