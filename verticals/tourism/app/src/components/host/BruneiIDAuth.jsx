import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Fingerprint, RefreshCw, Key, HelpCircle, Check, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const BruneiIDAuth = ({ onComplete, onCancel }) => {
  const { t } = useLanguage();
  const [step, setStep] = useState('welcome'); // welcome, scanning, verified, error
  const [progress, setProgress] = useState(0);
  const [verifiedProfile, setVerifiedProfile] = useState(null);

  useEffect(() => {
    let interval;
    if (step === 'scanning') {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setVerifiedProfile({
                name: "Haji Ahmad bin Ibrahim",
                businessName: "Kempas Heritage Tours & Crafts",
                bruneiId: "01-087654",
                verifiedAt: new Date().toLocaleString(),
                halalStatus: "Certified",
                type: "MSME Host"
              });
              setStep('verified');
            }, 800);
            return 100;
          }
          return prev + 12;
        });
      }, 300);
    }
    return () => clearInterval(interval);
  }, [step]);

  const handleStartScan = () => {
    setProgress(0);
    setStep('scanning');
  };

  const handleFinalize = () => {
    if (verifiedProfile) {
      onComplete(verifiedProfile);
    }
  };

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      backdropFilter: 'blur(20px)',
      borderRadius: '24px',
      border: '1px solid rgba(255, 215, 0, 0.15)',
      padding: '32px 24px',
      maxWidth: '400px',
      width: '100%',
      margin: '0 auto',
      color: 'var(--text-primary)',
      fontFamily: 'Outfit',
      boxShadow: '0 24px 48px rgba(0, 0, 0, 0.2)'
    }}>
      <AnimatePresence mode="wait">
        {step === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            style={{ textAlign: 'center' }}
          >
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '24px',
              background: 'radial-gradient(circle, rgba(255, 215, 0, 0.15) 0%, rgba(255, 215, 0, 0.05) 100%)',
              border: '2px dashed var(--gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              color: 'var(--gold)',
              boxShadow: '0 0 20px rgba(255, 215, 0, 0.1)'
            }}>
              <Fingerprint size={40} className="pulse-animation" />
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px', letterSpacing: '-0.5px' }}>
              BruneiID Biometric OAuth
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '28px' }}>
              Secure host identity verification synchronized with national registry database for instant MSME credential matching.
            </p>

            <div style={{ 
              background: 'rgba(255, 255, 255, 0.02)', 
              borderRadius: '16px', 
              padding: '16px', 
              marginBottom: '24px', 
              border: '1px solid var(--border-glass)',
              textAlign: 'left'
            }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
                <ShieldCheck size={18} style={{ color: 'var(--gold)' }} />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--gold)' }}>Government-grade Encryption</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                Your data is cryptographically signed and stored on the local secure enclave.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={handleStartScan}
                className="btn-primary" 
                style={{ 
                  flex: 1, 
                  background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)', 
                  color: 'black', 
                  fontWeight: 800,
                  boxShadow: '0 8px 24px rgba(255, 215, 0, 0.25)',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Authenticate via BruneiID
              </button>
              <button 
                onClick={onCancel}
                className="btn-outline" 
                style={{ border: '1px solid var(--border-glass)', cursor: 'pointer' }}
              >
                {t('cancel')}
              </button>
            </div>
          </motion.div>
        )}

        {step === 'scanning' && (
          <motion.div
            key="scanning"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            style={{ textAlign: 'center' }}
          >
            <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 28px' }}>
              {/* Spinning border */}
              <div style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                border: '4px solid rgba(255, 215, 0, 0.1)',
                borderTopColor: 'var(--gold)',
                animation: 'spin 1.5s linear infinite'
              }} />
              <div style={{
                position: 'absolute',
                inset: '12px',
                borderRadius: '50%',
                background: 'rgba(255, 215, 0, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--gold)'
              }}>
                <Fingerprint size={50} style={{ opacity: 0.8 }} />
              </div>
              <div style={{
                position: 'absolute',
                top: `${progress}%`,
                left: 0,
                width: '100%',
                height: '2px',
                background: 'var(--gold)',
                boxShadow: '0 0 10px var(--gold)',
                transition: 'top 0.3s ease-out'
              }} />
            </div>

            <h4 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '6px' }}>
              Scanning Biometrics...
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Confirming BruneiID fingerprint & face vector...
            </p>

            <div style={{ 
              width: '100%', 
              height: '8px', 
              background: 'rgba(255, 255, 255, 0.05)', 
              borderRadius: '4px',
              overflow: 'hidden',
              marginBottom: '12px'
            }}>
              <div style={{ 
                width: `${progress}%`, 
                height: '100%', 
                background: 'var(--gold)', 
                borderRadius: '4px',
                transition: 'width 0.2s ease-out'
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span>Security level: 5/5</span>
              <span>{progress}% Completed</span>
            </div>
          </motion.div>
        )}

        {step === 'verified' && verifiedProfile && (
          <motion.div
            key="verified"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{ textAlign: 'center' }}
          >
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(74, 222, 128, 0.1)',
              border: '2px solid #4ade80',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              color: '#4ade80'
            }}>
              <Check size={32} />
            </div>

            <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#4ade80', marginBottom: '4px' }}>
              Authentication Success
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              OAuth BruneiID successfully synchronized & verified
            </p>

            {/* Profile Card */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: '16px',
              border: '1px solid var(--border-glass)',
              padding: '16px',
              textAlign: 'left',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Host Provider</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--gold)', fontWeight: 700 }}>BruneiID ACTIVE</span>
              </div>
              <h5 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 4px 0' }}>{verifiedProfile.name}</h5>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0 0 12px 0' }}>{verifiedProfile.businessName}</p>
              
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>BruneiID No.</span>
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, margin: '2px 0 0 0' }}>{verifiedProfile.bruneiId}</p>
                </div>
                <div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Halal Status</span>
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--gold)', margin: '2px 0 0 0' }}>{verifiedProfile.halalStatus}</p>
                </div>
              </div>
            </div>

            <button 
              onClick={handleFinalize}
              className="btn-primary" 
              style={{ 
                width: '100%', 
                background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)', 
                color: 'black', 
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Enter Host Dashboard
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BruneiIDAuth;
