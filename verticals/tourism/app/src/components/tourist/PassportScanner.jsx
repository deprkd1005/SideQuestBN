import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Check, Shield, Scan } from 'lucide-react';

const PassportScanner = ({ onComplete }) => {
  const [stage, setStage] = useState('ready'); // ready, scanning, parsed, done
  const [scanProgress, setScanProgress] = useState(0);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const mockData = {
    name: 'SARAH ELIZABETH SMITH',
    nationality: 'AUSTRALIAN',
    passportNo: 'PA8829451',
    dateOfBirth: '15 MAR 1994',
    expiry: '20 SEP 2031',
    gender: 'F'
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  const startScan = async () => {
    setStage('scanning');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: 640, height: 480 } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (e) {
      console.warn('Camera not available, simulating scan');
    }
  };

  const simulateSuccess = () => {
    let prog = 0;
    const interval = setInterval(() => {
      prog += 20;
      setScanProgress(prog);
      if (prog >= 100) {
        clearInterval(interval);
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(t => t.stop());
        }
        setStage('parsed');
      }
    }, 100);
  };

  const simulateError = () => {
    alert("Invalid Document / Not a Passport detected! Please try again.");
    setStage('ready');
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
    }
  };

  const handleContinue = () => {
    setStage('done');
    setTimeout(() => onComplete(mockData), 600);
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
      {/* Background decoration */}
      <div style={{
        position: 'absolute', top: '-100px', right: '-100px',
        width: '300px', height: '300px',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)',
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
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                width: '100px', height: '100px', borderRadius: '28px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 32px',
                boxShadow: '0 20px 50px rgba(16,185,129,0.3)'
              }}
            >
              <Scan size={48} color="white" />
            </motion.div>

            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: 'Outfit', marginBottom: '8px', color: '#0f172a' }}>
              Passport Scan
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 500, marginBottom: '40px', lineHeight: 1.5 }}>
              Quick 2-second AI passport recognition. Position your passport within the camera frame.
            </p>

            <button
              onClick={startScan}
              style={{
                width: '100%', height: '60px', borderRadius: '16px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white', border: 'none', fontSize: '1rem', fontWeight: 800,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                boxShadow: '0 10px 30px rgba(16,185,129,0.3)',
                fontFamily: 'Outfit'
              }}
            >
              <Camera size={20} /> Start Passport Scan
            </button>
          </motion.div>
        )}

        {stage === 'scanning' && (
          <motion.div
            key="scanning"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{ textAlign: 'center', width: '100%', maxWidth: '340px' }}
          >
            {/* Camera Viewfinder */}
            <div style={{
              width: '100%', aspectRatio: '4/3', borderRadius: '24px',
              background: '#1e293b', overflow: 'hidden', position: 'relative',
              marginBottom: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.15)'
            }}>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              {/* Scan overlay frame */}
              <div style={{
                position: 'absolute', inset: '20px',
                border: '2px solid rgba(16, 185, 129, 0.6)',
                borderRadius: '16px'
              }}>
                {/* Animated scan line */}
                <motion.div
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    position: 'absolute', left: 0, right: 0, height: '3px',
                    background: 'linear-gradient(90deg, transparent, #10b981, transparent)',
                    boxShadow: '0 0 20px rgba(16,185,129,0.5)'
                  }}
                />
              </div>

              {/* Corner brackets */}
              {[['top','left'], ['top','right'], ['bottom','left'], ['bottom','right']].map(([v, h], i) => (
                <div key={i} style={{
                  position: 'absolute', [v]: '16px', [h]: '16px',
                  width: '24px', height: '24px',
                  borderTop: v === 'top' ? '3px solid #10b981' : 'none',
                  borderBottom: v === 'bottom' ? '3px solid #10b981' : 'none',
                  borderLeft: h === 'left' ? '3px solid #10b981' : 'none',
                  borderRight: h === 'right' ? '3px solid #10b981' : 'none',
                  borderRadius: '4px'
                }} />
              ))}
            </div>

            <p style={{ color: '#10b981', fontWeight: 800, fontSize: '0.85rem', marginBottom: '12px', fontFamily: 'Outfit', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Position Passport in Frame
            </p>

            {/* Progress bar */}
            {scanProgress > 0 && (
              <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden', marginBottom: '12px' }}>
                <motion.div
                  animate={{ width: `${scanProgress}%` }}
                  style={{ height: '100%', background: 'linear-gradient(90deg, #10b981, #059669)', borderRadius: '3px' }}
                />
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              <button
                onClick={simulateError}
                style={{
                  flex: 1, padding: '12px', borderRadius: '12px',
                  background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid #ef4444',
                  fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit'
                }}
              >
                Simulate Invalid
              </button>
              <button
                onClick={simulateSuccess}
                style={{
                  flex: 1, padding: '12px', borderRadius: '12px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', border: 'none',
                  fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit',
                  boxShadow: '0 4px 15px rgba(16,185,129,0.3)'
                }}
              >
                Simulate Scan
              </button>
            </div>
          </motion.div>
        )}

        {stage === 'parsed' && (
          <motion.div
            key="parsed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{ textAlign: 'center', width: '100%', maxWidth: '340px' }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 12 }}
              style={{
                width: '72px', height: '72px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px', boxShadow: '0 12px 30px rgba(16,185,129,0.3)'
              }}
            >
              <Check size={36} color="white" strokeWidth={3} />
            </motion.div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, fontFamily: 'Outfit', marginBottom: '4px', color: '#0f172a' }}>
              Passport Verified
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: '24px', fontWeight: 600 }}>
              Data extracted in 2.0 seconds
            </p>

            {/* Parsed Data Card */}
            <div style={{
              background: 'white', borderRadius: '20px', padding: '20px',
              border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
              textAlign: 'left', marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Shield size={16} color="#10b981" />
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Verified Document
                </span>
              </div>

              {[
                ['Full Name', mockData.name],
                ['Nationality', mockData.nationality],
                ['Passport No.', mockData.passportNo],
                ['Date of Birth', mockData.dateOfBirth],
                ['Expiry', mockData.expiry],
                ['Gender', mockData.gender]
              ].map(([label, value], idx) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '10px 0',
                    borderBottom: idx < 5 ? '1px solid #f1f5f9' : 'none'
                  }}
                >
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>{label}</span>
                  <span style={{ fontSize: '0.85rem', color: '#0f172a', fontWeight: 800, fontFamily: 'monospace' }}>{value}</span>
                </motion.div>
              ))}
            </div>

            <button
              onClick={handleContinue}
              style={{
                width: '100%', height: '56px', borderRadius: '16px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white', border: 'none', fontSize: '1rem', fontWeight: 800,
                cursor: 'pointer', boxShadow: '0 10px 30px rgba(16,185,129,0.3)',
                fontFamily: 'Outfit'
              }}
            >
              Continue to Face Verification →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PassportScanner;
