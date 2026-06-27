import React from 'react';
import { Settings, Shield, Star, LogOut, ChevronRight, Briefcase, Award, Bell, Globe } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import HostProfileStudio from './HostProfileStudio';

const HostProfile = ({ onLogout, authUser }) => {
  const { t } = useLanguage();

  return (
    <div className="app-content no-scrollbar watermark-bg" style={{ background: 'var(--bg-primary)', paddingBottom: '100px' }}>
      
      {/* Header Profile Section */}
      <div style={{ padding: 'max(env(safe-area-inset-top), 40px) 24px 24px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ position: 'relative' }}>
          <div style={{ 
            width: '80px', height: '80px', borderRadius: '24px', 
            background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 10px 20px rgba(212, 175, 55, 0.3)',
            color: 'black'
          }}>
            <Briefcase size={36} />
          </div>
          <div style={{
            position: 'absolute', bottom: '-5px', right: '-5px',
            background: 'white', borderRadius: '50%', padding: '4px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
          }}>
            <Shield size={16} color="var(--gold-dark)" fill="var(--gold-soft)" />
          </div>
        </div>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 900, fontFamily: 'Outfit', color: 'var(--text-primary)', marginBottom: '4px' }}>
            {authUser.name || 'Ahmad Haji Ali'}
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            {authUser.nationality || 'Brunei'} • Verified Host
          </p>
          <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
            <span className="badge badge-gold" style={{ color: 'black' }}>Superhost</span>
            <span className="badge" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-muted)' }}>Level 5</span>
          </div>
        </div>
      </div>

      <div style={{ padding: '24px' }}>
        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '32px' }}>
          <div className="card" style={{ padding: '16px 12px', textAlign: 'center', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
            <Award size={24} color="var(--gold)" style={{ margin: '0 auto 8px' }} />
            <div style={{ fontSize: '1.2rem', fontWeight: 900, fontFamily: 'Outfit' }}>156</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginTop: '4px' }}>Bookings</div>
          </div>
          <div className="card" style={{ padding: '16px 12px', textAlign: 'center', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
            <Star size={24} color="var(--gold)" style={{ margin: '0 auto 8px' }} />
            <div style={{ fontSize: '1.2rem', fontWeight: 900, fontFamily: 'Outfit' }}>4.98</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginTop: '4px' }}>Rating</div>
          </div>
          <div className="card" style={{ padding: '16px 12px', textAlign: 'center', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
            <Briefcase size={24} color="var(--emerald)" style={{ margin: '0 auto 8px' }} />
            <div style={{ fontSize: '1.2rem', fontWeight: 900, fontFamily: 'Outfit' }}>3</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginTop: '4px' }}>Active Listings</div>
          </div>
        </div>

        {/* Business Studio Manager */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
            Host Profile Studio
          </h3>
          <HostProfileStudio onSave={(data) => console.log('Saved host profile', data)} />
        </div>

        {/* Settings List */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
            Account Settings
          </h3>
          
          <div className="card" style={{ padding: 0, overflow: 'hidden', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
            {[
              { icon: Shield, label: 'Identity & Payout Verification' },
              { icon: Globe, label: 'Language & Region' },
              { icon: Bell, label: 'Notification Preferences' },
              { icon: Settings, label: 'App Settings' }
            ].map((item, idx) => (
              <div 
                key={idx}
                style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                  padding: '16px', borderBottom: idx < 3 ? '1px solid var(--border-color)' : 'none',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <item.icon size={20} color="var(--text-secondary)" />
                  <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>{item.label}</span>
                </div>
                <ChevronRight size={18} color="var(--text-muted)" />
              </div>
            ))}
          </div>
        </div>

        {/* Logout */}
        <button 
          onClick={onLogout}
          style={{ 
            width: '100%', height: '56px', borderRadius: '16px', 
            background: 'var(--bg-secondary)', border: '1px solid rgba(239, 68, 68, 0.2)',
            color: 'var(--red)', fontSize: '1rem', fontWeight: 800, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            fontFamily: 'Outfit'
          }}
        >
          <LogOut size={20} />
          {t('logout')}
        </button>
      </div>

    </div>
  );
};

export default HostProfile;
