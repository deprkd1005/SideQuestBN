import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Briefcase, MessageSquare, Wallet, User, Bell } from 'lucide-react';

const BottomNav = ({ portal }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = {
    hustler: [
      { icon: Home, label: 'Home', path: '/hustler' },
      { icon: Briefcase, label: 'Services', path: '/hustler/my-services' },
      { icon: Bell, label: 'Inbox', path: '/hustler/notifications' },
      { icon: Wallet, label: 'Wallet', path: '/hustler/wallet' },
      { icon: User, label: 'Profile', path: '/hustler/profile' }
    ],
    poster: [
      { icon: Home, label: 'Explore', path: '/poster' },
      { icon: Briefcase, label: 'Orders', path: '/poster/orders' },
      { icon: Bell, label: 'Inbox', path: '/poster/notifications' },
      { icon: Wallet, label: 'Wallet', path: '/poster/wallet' },
      { icon: User, label: 'Profile', path: '/poster/profile' }
    ],
    admin: [
      { icon: Home, label: 'Home', path: '/admin' },
      { icon: Briefcase, label: 'Escrow', path: '/admin/escrow' },
      { icon: Bell, label: 'Logs', path: '/admin/notifications' },
      { icon: Wallet, label: 'System', path: '/admin/wallet' },
      { icon: User, label: 'Admin', path: '/admin/profile' }
    ]
  }[portal] || [];

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