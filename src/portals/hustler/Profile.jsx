import React from 'react';
import { motion } from 'framer-motion';
import { User, Star, MapPin, Briefcase, Award, Settings, LogOut, ChevronRight, Shield, Bell, HelpCircle, FileText } from 'lucide-react';
import { usePayment } from '../../context/PaymentContext';

const Profile = () => {
  const { user } = usePayment();

  const profileData = {
    name: user?.name || 'John Doe',
    rating: 4.8,
    completedJobs: 24,
    skills: ['Cleaning', 'Delivery', 'Gardening'],
    location: 'Bandar Seri Begawan',
    memberSince: 'January 2024',
    verificationStatus: 'Verified Hustler'
  };

  const menuItems = [
    { icon: User, label: 'Edit Profile', color: 'var(--blue)' },
    { icon: Shield, label: 'Security & Verification', color: 'var(--emerald)' },
    { icon: Bell, label: 'Notifications', color: 'var(--orange)' },
    { icon: FileText, label: 'Tax Documents', color: 'var(--text-muted)' },
    { icon: HelpCircle, label: 'Support Center', color: 'var(--text-muted)' },
  ];

  return (
    <div className="app-content no-pad">
      {/* Profile Header with Cover */}
      <div style={{ position: 'relative', height: '180px', background: 'linear-gradient(135deg, var(--emerald-soft) 0%, var(--emerald) 100%)', marginBottom: '60px' }}>
        <div style={{ position: 'absolute', bottom: '-40px', left: '20px', display: 'flex', alignItems: 'flex-end', gap: '16px' }}>
          <div style={{ 
            width: '100px', 
            height: '100px', 
            borderRadius: '30px', 
            background: 'var(--bg-primary)', 
            padding: '4px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
          }}>
            <div style={{ 
              width: '100%', 
              height: '100%', 
              borderRadius: '26px', 
              background: 'var(--bg-tertiary)',
              overflow: 'hidden'
            }}>
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profileData.name}`} alt="profile" />
            </div>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>{profileData.name}</h1>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem', fontWeight: 600 }}>
              <MapPin size={14} /> {profileData.location}
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 20px 24px' }}>
        {/* Verification Status */}
        <div className="card-glass" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', borderColor: 'var(--emerald-soft)' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--emerald-soft)', color: 'var(--emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Award size={22} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--emerald)' }}>{profileData.verificationStatus}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Bru-Verified Level 2 • Trusted Member</div>
          </div>
          <ChevronRight size={18} className="text-muted" />
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '24px' }}>
          <div className="card" style={{ textAlign: 'center', padding: '16px 8px' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '2px' }}>{profileData.completedJobs}</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Quests</div>
          </div>
          <div className="card" style={{ textAlign: 'center', padding: '16px 8px' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '2px', color: 'var(--orange)' }}>{profileData.rating}★</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Rating</div>
          </div>
          <div className="card" style={{ textAlign: 'center', padding: '16px 8px' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '2px', color: 'var(--emerald)' }}>98%</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Success</div>
          </div>
        </div>

        {/* Settings Menu */}
        <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '16px', color: 'var(--text-primary)' }}>Account Settings</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
          {menuItems.map((item, idx) => (
            <div key={idx} className="card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}>
              <div style={{ color: item.color }}>
                <item.icon size={20} />
              </div>
              <span style={{ flex: 1, fontSize: '0.95rem', fontWeight: 600 }}>{item.label}</span>
              <ChevronRight size={18} className="text-muted" />
            </div>
          ))}
        </div>

        {/* Log Out */}
        <button className="btn-outline" style={{ width: '100%', borderColor: 'var(--red)', color: 'var(--red)', background: 'var(--red-soft)', display: 'flex', gap: '10px', height: '56px' }}>
          <LogOut size={20} /> Sign Out
        </button>

        <div style={{ textAlign: 'center', marginTop: '32px', opacity: 0.3 }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 700 }}>SIDEQUEST.BN V3.0.4 PROTOTYPE</p>
          <p style={{ fontSize: '0.6rem' }}>© 2026 TechBrunei Solutions</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;