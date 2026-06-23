import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Briefcase, Bell, Wallet, User } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const BottomNav = ({ portal }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  const navItems = {
    tourist: [
      { icon: Home, label: t('explore'), path: '/tourist' },
      { icon: Briefcase, label: t('bookings'), path: '/tourist/bookings' },
      { icon: Bell, label: t('inbox'), path: '/tourist/notifications' },
      { icon: Wallet, label: t('pocket'), path: '/tourist/wallet' },
      { icon: User, label: t('profile'), path: '/tourist/profile' }
    ],
    host: [
      { icon: Home, label: t('home'), path: '/host' },
      { icon: Briefcase, label: t('requests'), path: '/host/requests' },
      { icon: Bell, label: t('inbox'), path: '/host/notifications' },
      { icon: Wallet, label: t('wallet'), path: '/host/wallet' },
      { icon: User, label: t('profile'), path: '/host/profile' }
    ]
  }[portal] || [];

  const currentPath = location.pathname.replace(/\/$/, '');
  const isTabActive = navItems.some(item => {
    const cleanPath = item.path.replace(/\/$/, '');
    return currentPath === cleanPath;
  });

  if (!isTabActive) return null;

  return (
    <nav className="bottom-nav">
      {navItems.map(item => {
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`nav-item ${isActive ? 'active' : ''}`}
            style={{ position: 'relative' }}
          >
            {isActive && (
              <motion.div 
                layoutId="nav-indicator"
                style={{
                  position: 'absolute',
                  top: '-8px',
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  background: 'var(--portal-color)',
                  boxShadow: '0 0 10px var(--portal-color)'
                }}
              />
            )}
            <item.icon 
              size={22} 
              strokeWidth={isActive ? 2.5 : 2} 
              style={{ color: isActive ? 'var(--portal-color)' : 'var(--text-muted)' }}
            />
            <span style={{ 
              fontSize: '0.65rem', 
              fontWeight: isActive ? 800 : 600,
              color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
              marginTop: '4px'
            }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
