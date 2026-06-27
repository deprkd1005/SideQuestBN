import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Shield, ArrowRight, Sparkles, Award } from 'lucide-react';
import PassportScanner from './tourist/PassportScanner';
import FaceSelfie from './tourist/FaceSelfie';
import BruneiIDAuth from './host/BruneiIDAuth';
import { useLanguage } from '../context/LanguageContext';

const LoginScreen = ({ onLoginSuccess }) => {
  const { language, setLanguage, t } = useLanguage();
  const [selectedFlow, setSelectedFlow] = useState(null); // 'tourist' or 'host'
  const [subStage, setSubStage] = useState('welcome'); // welcome, passport, face, host_auth
  const [passportData, setPassportData] = useState(null);

  const startTouristFlow = () => {
    setSelectedFlow('tourist');
    setSubStage('passport');
  };

  const startHostFlow = () => {
    setSelectedFlow('host');
    setSubStage('host_auth');
  };

  const handlePassportComplete = (data) => {
    setPassportData(data);
    setSubStage('face');
  };

  const handleFaceComplete = (faceImage) => {
    // Complete tourist login
    onLoginSuccess('tourist', {
      passport: passportData,
      faceImage: faceImage,
      name: passportData.fullName,
      nationality: passportData.nationality
    });
  };

  const handleHostAuthComplete = (profile) => {
    // Complete host login
    onLoginSuccess('host', {
      name: profile.name,
      businessName: profile.businessName,
      bruneiId: profile.bruneiId,
      halalStatus: profile.halalStatus
    });
  };

  const handleCancelFlow = () => {
    setSelectedFlow(null);
    setSubStage('welcome');
    setPassportData(null);
  };

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'ms', name: 'Bahasa Melayu' },
    { code: 'zh', name: '简体中文' },
    { code: 'ja', name: '日本語' },
    { code: 'ko', name: '한국어' },
    { code: 'ar', name: 'العربية' },
    { code: 'hi', name: 'हिन्दी' }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      background: 'radial-gradient(circle at top right, rgba(16, 185, 129, 0.08) 0%, rgba(0,0,0,0) 50%), radial-gradient(circle at bottom left, rgba(255, 215, 0, 0.05) 0%, rgba(0,0,0,0) 50%)',
      padding: '24px 20px',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Background visual element */}
      <div style={{
        position: 'absolute',
        width: '300px',
        height: '300px',
        top: '-150px',
        right: '-150px',
        background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)',
        filter: 'blur(40px)',
        zIndex: 0
      }} />

      {/* Language Selector Top Right */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10, position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Shield size={16} style={{ color: selectedFlow === 'host' ? 'var(--gold)' : 'var(--emerald)' }} />
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.5px' }}>
            SECURED END-TO-END
          </span>
        </div>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-glass)',
            borderRadius: '12px',
            padding: '6px 24px 6px 12px',
            fontSize: '0.75rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
            cursor: 'pointer',
            outline: 'none',
            appearance: 'none',
            WebkitAppearance: 'none'
          }}
        >
          {languages.map(lang => (
            <option key={lang.code} value={lang.code}>{lang.name}</option>
          ))}
        </select>
      </div>

      {/* Center login layout */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        zIndex: 5,
        margin: '20px 0'
      }}>
        <AnimatePresence mode="wait">
          {subStage === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{ textAlign: 'center' }}
            >
              <h1 style={{
                fontSize: '2.5rem',
                fontWeight: 900,
                letterSpacing: '-1.5px',
                color: 'var(--text-primary)',
                marginBottom: '8px',
                fontFamily: 'Outfit'
              }}>
                SideQuest<span style={{ color: 'var(--emerald)' }}>.Tourism</span>
              </h1>
              <p style={{ 
                color: 'var(--text-secondary)', 
                fontWeight: 600, 
                fontSize: '0.9rem', 
                maxWidth: '280px',
                margin: '0 auto 48px',
                lineHeight: 1.4
              }}>
                {t('discoverBrunei')}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '340px', width: '100%', margin: '0 auto' }}>
                <button
                  onClick={startTouristFlow}
                  className="btn-primary"
                  style={{
                    width: '100%',
                    height: '64px',
                    fontSize: '1rem',
                    fontWeight: 800,
                    borderRadius: '20px',
                    border: 'none',
                    background: 'linear-gradient(135deg, var(--emerald) 0%, var(--emerald-dark) 100%)',
                    boxShadow: '0 8px 30px rgba(16, 185, 129, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 24px',
                    color: '#ffffff',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '1.4rem' }}>🌏</span>
                    <span style={{ fontFamily: 'Outfit' }}>{t('enterTourist')}</span>
                  </div>
                  <ArrowRight size={20} />
                </button>

                <button
                  onClick={startHostFlow}
                  className="btn-primary"
                  style={{
                    width: '100%',
                    height: '64px',
                    fontSize: '1rem',
                    fontWeight: 800,
                    borderRadius: '20px',
                    border: 'none',
                    background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)',
                    boxShadow: '0 8px 30px rgba(255, 215, 0, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 24px',
                    color: '#000000',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '1.4rem' }}>🏛️</span>
                    <span style={{ fontFamily: 'Outfit' }}>{t('enterHost')}</span>
                  </div>
                  <ArrowRight size={20} />
                </button>
              </div>
            </motion.div>
          )}

          {subStage === 'passport' && (
            <motion.div
              key="passport"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <PassportScanner onComplete={handlePassportComplete} />
              <button 
                onClick={handleCancelFlow}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  display: 'block',
                  margin: '20px auto 0',
                  cursor: 'pointer',
                  fontFamily: 'Outfit'
                }}
              >
                ← Back to Portal Choose
              </button>
            </motion.div>
          )}

          {subStage === 'face' && (
            <motion.div
              key="face"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <FaceSelfie onComplete={handleFaceComplete} passportData={passportData} />
              <button 
                onClick={() => setSubStage('passport')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  display: 'block',
                  margin: '20px auto 0',
                  cursor: 'pointer',
                  fontFamily: 'Outfit'
                }}
              >
                ← Back to Passport Scanner
              </button>
            </motion.div>
          )}

          {subStage === 'host_auth' && (
            <motion.div
              key="host_auth"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <BruneiIDAuth onComplete={handleHostAuthComplete} onCancel={handleCancelFlow} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Branding */}
      <div style={{ textAlign: 'center', zIndex: 10 }}>
        <p style={{
          fontSize: '0.65rem',
          color: 'var(--text-muted)',
          fontWeight: 700,
          letterSpacing: '2px',
          opacity: 0.5,
          fontFamily: 'Outfit',
          margin: 0
        }}>
          SIDEQUEST.BN TOURISM PROTOTYPE v2.0
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
