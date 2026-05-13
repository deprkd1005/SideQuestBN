import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserCog, Shield, BarChart3, Star, LogOut, ChevronRight, Activity, Terminal } from 'lucide-react';
import { usePayment } from '../../context/PaymentContext';

const AdminProfile = () => {
  const navigate = useNavigate();
  const { user, logout } = usePayment();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { icon: BarChart3, label: 'Platform Analytics', color: 'var(--emerald)' },
    { icon: Shield, label: 'Security Protocols', color: 'var(--gold)' },
    { icon: Terminal, label: 'System Logs', color: 'var(--text-muted)' },
    { icon: Star, label: 'Moderation Queue', color: 'var(--emerald)' },
  ];

  return (
    <div className="app-content no-scrollbar" style={{ paddingBottom: '100px' }}>
      {/* Header */}
      <div style={{ 
        height: '240px', 
        background: 'linear-gradient(180deg, #064e3b 0%, var(--bg-primary) 100%)', 
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}>
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{ 
            width: '100px', 
            height: '100px', 
            borderRadius: '30px', 
            background: 'var(--bg-card)', 
            border: '2px solid var(--emerald)',
            overflow: 'hidden',
            marginBottom: '16px',
            boxShadow: '0 0 30px var(--emerald-glow)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <UserCog size={48} className="text-emerald" />
        </motion.div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 900, fontFamily: 'Outfit', color: 'white' }}>System Admin</h1>
        <p style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>{user?.email} • Root Access</p>
      </div>

      <div style={{ padding: '0 24px' }}>
        {/* Quick Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
          <div className="card-glass" style={{ padding: '16px', textAlign: 'center' }}>
            <Activity size={20} className="text-emerald" style={{ margin: '0 auto 8px' }} />
            <div style={{ fontSize: '1.2rem', fontWeight: 900 }}>99.9%</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800 }}>UPTIME</div>
          </div>
          <div className="card-glass" style={{ padding: '16px', textAlign: 'center' }}>
            <Shield size={20} className="text-gold" style={{ margin: '0 auto 8px' }} />
            <div style={{ fontSize: '1.2rem', fontWeight: 900 }}>Lvl 4</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800 }}>SECURITY</div>
          </div>
        </div>

        {/* Menu */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
          {menuItems.map((item, idx) => (
            <div key={idx} className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}>
              <div style={{ color: item.color }}>
                <item.icon size={22} />
              </div>
              <span style={{ flex: 1, fontSize: '1rem', fontWeight: 600 }}>{item.label}</span>
              <ChevronRight size={18} className="text-muted" />
            </div>
          ))}
        </div>

        {/* Logout */}
        <button 
          className="btn-outline" 
          onClick={handleLogout}
          style={{ 
            width: '100%', 
            borderColor: 'var(--red)', 
            color: 'var(--red)', 
            background: 'rgba(239, 68, 68, 0.05)', 
            height: '60px',
            borderRadius: '16px',
            fontWeight: 800
          }}
        >
          <LogOut size={20} /> Terminate Session
        </button>

        <div style={{ textAlign: 'center', marginTop: '40px', paddingBottom: '20px' }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '2px' }}>SIDEQUEST.BN CORE v1.0</p>
          <p style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '4px' }}>Administrative Interface • Encrypted</p>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
