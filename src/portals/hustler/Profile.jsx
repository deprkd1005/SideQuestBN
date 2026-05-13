import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Award, ChevronRight, Shield, Bell, HelpCircle, FileText, CreditCard, LogOut, Star } from 'lucide-react';
import { usePayment } from '../../context/PaymentContext';

const Profile = () => {
  const { user, logout } = usePayment();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { icon: User, label: 'Hustler Profile', color: 'var(--gold)' },
    { icon: Shield, label: 'Identity & KYC', color: 'var(--emerald)' },
    { icon: CreditCard, label: 'Payout Settings', color: 'var(--gold)' },
    { icon: Bell, label: 'Task Notifications', color: 'var(--emerald)' },
    { icon: FileText, label: 'Income Statements', color: 'var(--text-muted)' },
    { icon: HelpCircle, label: 'Help & Support', color: 'var(--text-muted)' },
  ];

  return (
    <div className="app-content no-scrollbar" style={{ paddingBottom: '100px' }}>
      {/* Header */}
      <div style={{ 
        height: '240px', 
        background: 'linear-gradient(180deg, var(--gold-dark) 0%, var(--bg-primary) 100%)', 
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
            border: '2px solid var(--gold)',
            overflow: 'hidden',
            marginBottom: '16px',
            boxShadow: '0 0 30px var(--gold-glow)'
          }}
        >
          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`} alt="profile" />
        </motion.div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 900, fontFamily: 'Outfit', color: 'white' }}>{user?.fullname}</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(0,0,0,0.3)', padding: '4px 12px', borderRadius: '20px', marginTop: '4px' }}>
          <Star size={14} fill="var(--gold)" color="var(--gold)" />
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'white' }}>4.9 • Top Provider</span>
        </div>
      </div>

      <div style={{ padding: '0 24px' }}>
        {/* Verification Status */}
        <div className="card-glass" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px', borderColor: 'var(--gold-glow)' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--gold-soft)', color: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Award size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--gold)' }}>Verified Hustler</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Bru-Verified Secure Profile</div>
          </div>
          <ChevronRight size={18} className="text-muted" />
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
          <LogOut size={20} /> Sign Out
        </button>

        <div style={{ textAlign: 'center', marginTop: '40px', paddingBottom: '20px' }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '2px' }}>SIDEQUEST.BN v1.0.0</p>
          <p style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '4px' }}>Secure Gig Economy Platform</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;