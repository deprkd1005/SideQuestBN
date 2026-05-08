import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Briefcase, MessageSquare, Wallet, User } from 'lucide-react';

const BottomNav = ({ portal }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = {
    hustler: [
      { icon: Home, label: 'Home', path: '/hustler' },
      { icon: Briefcase, label: 'Jobs', path: '/hustler/jobs' },
      { icon: MessageSquare, label: 'Messages', path: '/hustler/messages' },
      { icon: Wallet, label: 'Wallet', path: '/hustler/wallet' },
      { icon: User, label: 'Profile', path: '/hustler/profile' }
    ],
    poster: [
      { icon: Home, label: 'Home', path: '/poster' },
      { icon: Briefcase, label: 'Jobs', path: '/poster/active' },
      { icon: MessageSquare, label: 'Messages', path: '/poster/messages' },
      { icon: Wallet, label: 'Wallet', path: '/poster/wallet' },
      { icon: User, label: 'Profile', path: '/poster/profile' }
    ],
    admin: [
      { icon: Home, label: 'Dashboard', path: '/admin' },
      { icon: Briefcase, label: 'Escrow', path: '/admin/escrow' },
      { icon: MessageSquare, label: 'Reports', path: '/admin/reports' },
      { icon: Wallet, label: 'Wallet', path: '/admin/wallet' },
      { icon: User, label: 'Profile', path: '/admin/profile' }
    ]
  }[portal] || [
      { icon: Home, label: 'Home', path: `/${portal}` },
      { icon: Briefcase, label: 'Jobs', path: `/${portal}/jobs` },
      { icon: MessageSquare, label: 'Messages', path: `/${portal}/messages` },
      { icon: Wallet, label: 'Wallet', path: `/${portal}/wallet` },
      { icon: User, label: 'Profile', path: `/${portal}/profile` }
    ];

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      maxWidth: '480px',
      margin: '0 auto',
      background: 'var(--bg-primary)',
      borderTop: '1px solid var(--border-color)',
      padding: '8px 0',
      zIndex: 100
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center'
      }}>
        {navItems.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                padding: '8px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: isActive ? 'var(--emerald)' : 'var(--text-secondary)',
                transition: 'color 0.2s'
              }}
            >
              <item.icon size={20} />
              <span style={{
                fontSize: '0.7rem',
                fontWeight: 600
              }}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;