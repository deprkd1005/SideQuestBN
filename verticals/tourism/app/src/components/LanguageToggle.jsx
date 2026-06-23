import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const LanguageToggle = ({ style = {} }) => {
  const { currentLanguage, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en', name: 'English (EN)' },
    { code: 'ms', name: 'Melayu (MS)' },
    { code: 'zh', name: '中文 (ZH)' }
  ];

  const currentLangLabel = languages.find(l => l.code === currentLanguage)?.name || 'English (EN)';

  return (
    <div style={{ position: 'relative', fontFamily: 'Outfit', zIndex: 999, ...style }}>
      <button
        onClick={() => setIsOpen(prev => !isOpen)}
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-glass)',
          borderRadius: '16px',
          padding: '8px 12px',
          color: 'var(--text-primary)',
          fontSize: '0.75rem',
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          cursor: 'pointer',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.2s ease'
        }}
      >
        <Globe size={14} style={{ color: 'var(--emerald)' }} />
        <span>{currentLangLabel.split(' ')[0]}</span>
        <ChevronDown size={12} style={{
          transform: isOpen ? 'rotate(180deg)' : 'none',
          transition: 'transform 0.2s'
        }} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            style={{
              position: 'absolute',
              right: 0,
              top: '40px',
              background: 'rgba(20, 20, 22, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid var(--border-glass)',
              borderRadius: '16px',
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.4)',
              padding: '6px',
              width: '130px',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px'
            }}
          >
            {languages.map(lang => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                style={{
                  background: currentLanguage === lang.code ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                  color: currentLanguage === lang.code ? 'var(--emerald)' : 'var(--text-secondary)',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '8px 10px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (currentLanguage !== lang.code) e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                }}
                onMouseLeave={(e) => {
                  if (currentLanguage !== lang.code) e.currentTarget.style.background = 'transparent';
                }}
              >
                {lang.name}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageToggle;
