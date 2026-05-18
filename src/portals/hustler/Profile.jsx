import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Shield, Camera, LogOut, ChevronRight, CheckCircle, Clock, Settings, Info, Mail, FileText, X, Bell, Moon, Volume2, CreditCard } from 'lucide-react';
import { usePayment } from '../../context/PaymentContext';

const Profile = () => {
  const { user, logout, token } = usePayment();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState('');
  
  // Modal Sheet state
  const [activeSheet, setActiveSheet] = useState(null); // null | 'settings' | 'about' | 'contact' | 'terms'

  // Settings State simulation
  const [settings, setSettings] = useState({
    pushNotify: true,
    soundEffects: true,
    mapDarkMode: false,
    autoCashout: false
  });

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

  const toggleSetting = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (!user) return null;

  return (
    <div className="app-content no-scrollbar" style={{ background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      <div style={{ padding: '40px 24px 20px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: 'Outfit' }}>My <span style={{ color: 'var(--portal-color)' }}>Profile</span></h1>
      </div>

      <div style={{ padding: '0 24px 100px', flex: 1, overflowY: 'auto' }} className="no-scrollbar">
        {/* Profile Card */}
        <div className="card" style={{ padding: '32px 24px', textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 20px' }}>
            <div style={{ width: '100%', height: '100%', borderRadius: '35px', overflow: 'hidden', border: '2.5px solid var(--portal-color)' }}>
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} alt="profile" />
            </div>
            <button style={{ position: 'absolute', bottom: '-5px', right: '-5px', width: '32px', height: '32px', borderRadius: '10px', background: 'var(--portal-color)', border: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Camera size={16} />
            </button>
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 900 }}>{user.fullname}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' }}>{user.role}</p>
        </div>

        {/* KYC Verification Card */}
        <div className="card-glass" style={{ padding: '20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'var(--portal-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--portal-color)' }}>
            <Shield size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>Identity Verification</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Status: <span style={{ color: 'var(--portal-color)' }}>PENDING</span></div>
          </div>
          <button className="btn-ghost" style={{ padding: '8px 16px', fontSize: '0.8rem', fontWeight: 800 }}>Review</button>
        </div>

        {/* Bio Editor Card */}
        <div className="card-glass" style={{ padding: '20px', marginBottom: '24px' }}>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Hustler Bio</label>
            {editing ? (
              <textarea 
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                style={{ width: '100%', height: '80px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-glass)', borderRadius: '12px', padding: '12px', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.9rem', outline: 'none' }}
              />
            ) : (
              <p style={{ fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.5 }}>{bio || 'No bio written yet. Introduce your skills!'}</p>
            )}
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            {editing ? (
              <>
                <button onClick={() => setEditing(false)} className="btn-ghost" style={{ flex: 1, padding: '10px' }}>Cancel</button>
                <button onClick={handleUpdate} className="btn-primary" style={{ flex: 1, padding: '10px' }}>Save</button>
              </>
            ) : (
              <button onClick={() => setEditing(true)} className="btn-ghost" style={{ width: '100%', border: '1px solid var(--border-glass)', padding: '12px', fontSize: '0.85rem', fontWeight: 700 }}>Edit Biography</button>
            )}
          </div>
        </div>

        {/* PROFILE OPTIONS SECTION (Settings, About, Contact, Terms) */}
        <h4 style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px', paddingLeft: '4px' }}>Hustler Preferences</h4>
        
        <div className="card" style={{ padding: '8px', marginBottom: '32px' }}>
          {[
            { id: 'settings', label: 'App Settings', icon: Settings, desc: 'Manage your notifications and radar theme' },
            { id: 'about', label: 'About SideQuest.BN', icon: Info, desc: 'Decentralized escrow micro-gigs in Brunei' },
            { id: 'contact', label: 'Contact Support', icon: Mail, desc: 'Get in touch with 24/7 help desk' },
            { id: 'terms', label: 'Terms & Dispute Policies', icon: FileText, desc: 'Learn about escrow and platform safety' }
          ].map((item, i, arr) => (
            <button 
              key={item.id}
              onClick={() => setActiveSheet(item.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px 12px',
                background: 'none',
                border: 'none',
                borderBottom: i < arr.length - 1 ? '1px solid var(--border-glass)' : 'none',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)' }}>
                <item.icon size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)' }}>{item.label}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, marginTop: '2px' }}>{item.desc}</div>
              </div>
              <ChevronRight size={16} className="text-muted" />
            </button>
          ))}
        </div>

        {/* Logout Button */}
        <button 
          onClick={logout}
          style={{ width: '100%', padding: '16px', borderRadius: '16px', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.15)', color: '#ef4444', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer', outline: 'none' }}
        >
          <LogOut size={20} /> Logout Account
        </button>
      </div>

      {/* DYNAMIC RENDER MODAL: OPTIONS SLIDE-UP BOTTOM SHEET */}
      <AnimatePresence>
        {activeSheet && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(5px)',
            zIndex: 1001,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center'
          }}>
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              style={{
                width: '100%',
                background: 'var(--bg-secondary)',
                borderRadius: '32px 32px 0 0',
                maxHeight: '80vh',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 -15px 40px rgba(0,0,0,0.25)',
                overflow: 'hidden'
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--border-glass)' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, fontFamily: 'Outfit', color: 'var(--text-primary)' }}>
                  {activeSheet === 'settings' && 'App Settings'}
                  {activeSheet === 'about' && 'About SideQuest.BN'}
                  {activeSheet === 'contact' && 'Contact Support'}
                  {activeSheet === 'terms' && 'Terms & Escrow Regulations'}
                </h3>
                <button 
                  onClick={() => setActiveSheet(null)} 
                  style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-tertiary)', border: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Scrollable Modal Content */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '24px 24px 40px 24px' }} className="no-scrollbar">
                
                {/* 1. App Settings content */}
                {activeSheet === 'settings' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {[
                      { key: 'pushNotify', label: 'Push Notifications', desc: 'Notify me when quests are accepted or paid', icon: Bell },
                      { key: 'soundEffects', label: 'In-app Sound Effects', desc: 'Play sounds for successful balances and radar', icon: Volume2 },
                      { key: 'mapDarkMode', label: 'Radar Dark Theme', desc: 'Use dark maps for night time questing', icon: Moon },
                      { key: 'autoCashout', label: 'Automatic Cashout', desc: 'Directly send completed quest payments to bank', icon: CreditCard }
                    ].map((s) => (
                      <div key={s.key} style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', gap: '16px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--portal-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--portal-color)', flexShrink: 0 }}>
                          <s.icon size={18} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)' }}>{s.label}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>{s.desc}</div>
                        </div>
                        
                        {/* Custom Switch Toggle */}
                        <button 
                          onClick={() => toggleSetting(s.key)}
                          style={{
                            width: '46px',
                            height: '24px',
                            borderRadius: '12px',
                            background: settings[s.key] ? 'var(--portal-color)' : 'var(--border-color)',
                            border: 'none',
                            position: 'relative',
                            cursor: 'pointer',
                            transition: 'background 0.2s',
                            padding: 0
                          }}
                        >
                          <motion.div 
                            layout
                            style={{
                              width: '18px',
                              height: '18px',
                              borderRadius: '50%',
                              background: 'white',
                              position: 'absolute',
                              top: '3px',
                              left: settings[s.key] ? '25px' : '3px',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* 2. About Us content */}
                {activeSheet === 'about' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyCenter: 'center', padding: '16px 0' }} className="flex-center">
                      <div style={{ fontFamily: 'Outfit', fontSize: '2rem', fontWeight: 900, background: 'linear-gradient(135deg, var(--gold) 0%, var(--emerald) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        SideQuest.BN
                      </div>
                    </div>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, fontWeight: 500 }}>
                      SideQuest.BN is Brunei's leading community-focused gig economy marketplace, custom-built to support micro-jobs, quick errands, and freelance services in high trust neighborhoods.
                    </p>
                    <h5 style={{ fontWeight: 800, fontSize: '0.92rem', marginTop: '8px' }}>Escrow-Backed Safety</h5>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, fontWeight: 500 }}>
                      Every transaction is held in a protected cryptographic escrow environment. Once the task poster funds the quest, the provider can confidently complete the task, knowing their hard-earned payout is secured and waiting.
                    </p>
                    <h5 style={{ fontWeight: 800, fontSize: '0.92rem', marginTop: '8px' }}>Wawasan 2035 Support</h5>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, fontWeight: 500 }}>
                      Built as a premium showcase application for Nathack 2026, driving digitalization, economic diversification, and financial independence for youth in the Sultanate.
                    </p>
                  </div>
                )}

                {/* 3. Contact Us content */}
                {activeSheet === 'contact' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, fontWeight: 500 }}>
                      Have questions or facing an escrow dispute? Reach out to our 24/7 Brunei-based support desk for lightning fast resolutions.
                    </p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
                      <a href="mailto:support@sidequest.bn" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '14px', padding: '16px', borderRadius: '16px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-glass)' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(212, 175, 55, 0.12)', color: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Mail size={18} />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)' }}>Email Helpdesk</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>support@sidequest.bn</div>
                        </div>
                      </a>

                      <a href="https://wa.me/6738881234" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '14px', padding: '16px', borderRadius: '16px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-glass)' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.12)', color: 'var(--emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontSize: '18px', fontWeight: 900 }}>💬</span>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)' }}>WhatsApp Support</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>+673 888 1234</div>
                        </div>
                      </a>
                    </div>

                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '20px', fontWeight: 600 }}>
                      Typical response time: Under 10 minutes
                    </div>
                  </div>
                )}

                {/* 4. Terms and Privacy content */}
                {activeSheet === 'terms' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h5 style={{ fontWeight: 800, fontSize: '0.92rem' }}>1. Platform Safety Escrow</h5>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, fontWeight: 500 }}>
                      Payouts are securely stored in escrow. Once a Hustler finishes a Quest and the Poster confirms, the funds are immediately credited. SideQuest never releases escrowed funds without double authorization, ensuring full fraud protection.
                    </p>
                    <h5 style={{ fontWeight: 800, fontSize: '0.92rem', marginTop: '8px' }}>2. Fair Dispute Resolution</h5>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, fontWeight: 500 }}>
                      If a Quest poster denies completion, the dispute is escalated to the SideQuest.BN Admin team. Our operators verify details, inspect photos, and resolve the payout within 24 hours.
                    </p>
                    <h5 style={{ fontWeight: 800, fontSize: '0.92rem', marginTop: '8px' }}>3. Gig Compliance</h5>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, fontWeight: 500 }}>
                      Providers must carry out their services in accordance with Brunei Darussalam local guidelines and regulations. SideQuest maintains zero-tolerance for illegal or fraudulent activities.
                    </p>
                  </div>
                )}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Profile;