import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Shield, Camera, LogOut, ChevronRight, CheckCircle, Clock } from 'lucide-react';
import { usePayment } from '../../context/PaymentContext';

const Profile = () => {
  const { user, logout, token } = usePayment();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const baseUrl = import.meta.env.DEV ? '' : 'https://sidequest-backend-bivj.onrender.com';
        const res = await fetch(`${baseUrl}/api/users/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setProfile(data);
        setBio(data.bio || '');
      } catch (err) {
        console.error(err);
      }
    };
    if (token) fetchProfile();
  }, [token]);

  const handleUpdate = async () => {
    try {
      const baseUrl = import.meta.env.DEV ? '' : 'https://sidequest-backend-bivj.onrender.com';
      await fetch(`${baseUrl}/api/users/profile`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ bio })
      });
      setEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return null;

  return (
    <div className="app-content no-scrollbar" style={{ background: 'var(--bg-primary)' }}>
      <div style={{ padding: '40px 24px 20px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: 'Outfit' }}>My <span className="text-gold">Profile</span></h1>
      </div>

      <div style={{ padding: '0 24px 40px' }}>
        {/* Profile Card */}
        <div className="card" style={{ padding: '32px 24px', textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 20px' }}>
            <div style={{ width: '100%', height: '100%', borderRadius: '35px', overflow: 'hidden', border: '2px solid var(--gold)' }}>
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} alt="profile" />
            </div>
            <button style={{ position: 'absolute', bottom: '-5px', right: '-5px', width: '32px', height: '32px', borderRadius: '10px', background: 'var(--gold)', border: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Camera size={16} />
            </button>
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 900 }}>{user.fullname}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>{user.role}</p>
        </div>

        {/* KYC Simulation */}
        <div className="card-glass" style={{ padding: '20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'var(--gold-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)' }}>
            <Shield size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>Identity Verification</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Status: <span style={{ color: 'var(--gold)' }}>PENDING</span></div>
          </div>
          <button className="btn-ghost" style={{ padding: '8px 16px', fontSize: '0.8rem', fontWeight: 800 }}>Review</button>
        </div>

        {/* Info List */}
        <div className="card-glass" style={{ padding: '8px', marginBottom: '32px' }}>
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Bio</label>
              {editing ? (
                <textarea 
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  style={{ width: '100%', height: '80px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-glass)', borderRadius: '12px', padding: '12px', color: 'var(--text-primary)', fontWeight: 600 }}
                />
              ) : (
                <p style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{bio || 'No bio yet.'}</p>
              )}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              {editing ? (
                <>
                  <button onClick={() => setEditing(false)} className="btn-ghost" style={{ flex: 1 }}>Cancel</button>
                  <button onClick={handleUpdate} className="btn-primary" style={{ flex: 1 }}>Save</button>
                </>
              ) : (
                <button onClick={() => setEditing(true)} className="btn-ghost" style={{ width: '100%', border: '1px solid var(--border-glass)' }}>Edit Profile</button>
              )}
            </div>
          </div>
        </div>

        {/* Logout */}
        <button 
          onClick={logout}
          style={{ width: '100%', padding: '16px', borderRadius: '16px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
        >
          <LogOut size={20} /> Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;