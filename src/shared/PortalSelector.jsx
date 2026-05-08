import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapPin, PlusCircle, ShieldCheck, Zap, ChevronRight } from 'lucide-react';

const PortalSelector = () => {
  const navigate = useNavigate();

  const portals = [
    {
      id: 'hustler',
      title: 'Hustler',
      desc: 'Find nearby jobs and earn side income quickly.',
      icon: <MapPin size={24} />,
      color: 'var(--emerald)',
      path: '/hustler'
    },
    {
      id: 'poster',
      title: 'Poster',
      desc: 'Post tasks and quickly find trusted local help.',
      icon: <PlusCircle size={24} />,
      color: 'var(--orange)',
      path: '/poster'
    },
    {
      id: 'admin',
      title: 'Admin',
      desc: 'Platform moderation and safety.',
      icon: <ShieldCheck size={24} />,
      color: 'var(--blue)',
      path: '/admin'
    }
  ];

  return (
    <div className="login-view" style={{ 
      flexDirection: 'column', 
      overflowY: 'auto', 
      background: 'var(--bg-primary)',
      display: 'flex',
      height: '100dvh'
    }}>
      {/* Brand Section */}
      <div style={{
        padding: '60px 24px 40px',
        textAlign: 'center',
        background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.1) 0%, transparent 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Abstract Glows */}
        <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '300px', height: '300px', background: 'var(--emerald-glow)', filter: 'blur(100px)', opacity: 0.3 }} />
        
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div style={{
            width: '80px',
            height: '80px',
            background: 'var(--bg-tertiary)',
            borderRadius: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            border: '1px solid var(--border-glass)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            color: 'var(--emerald)'
          }}>
            <Zap size={40} fill="currentColor" />
          </div>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 900,
            letterSpacing: '-1.5px',
            color: 'white',
            lineHeight: 1
          }}>
            SideQuest<span style={{ color: 'var(--emerald)' }}>.BN</span>
          </h1>
          <p style={{
            fontSize: '0.9rem',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            marginTop: '12px'
          }}>
            Brunei's Premier Gig Marketplace
          </p>
          <div style={{
            marginTop: '20px',
            display: 'inline-flex',
            background: 'var(--emerald-soft)',
            padding: '6px 16px',
            borderRadius: '100px',
            fontSize: '0.65rem',
            fontWeight: 800,
            color: 'var(--emerald)',
            letterSpacing: '1px'
          }}>
            REDESIGNED V3.0
          </div>
        </motion.div>
      </div>

      {/* Role Selection Section */}
      <div style={{
        padding: '0 24px 60px',
        flex: 1
      }}>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="card-glass"
          style={{
            padding: '32px 24px',
            background: 'var(--bg-glass-strong)'
          }}
        >
          <h2 style={{
            fontSize: '1.4rem',
            fontWeight: 800,
            marginBottom: '8px',
            textAlign: 'center'
          }}>
            Choose Your Portal
          </h2>
          <p style={{
            color: 'var(--text-muted)',
            fontWeight: 600,
            fontSize: '0.85rem',
            marginBottom: '32px',
            textAlign: 'center'
          }}>
            Select a role to start your journey
          </p>

          <div style={{ display: 'grid', gap: '16px' }}>
            {portals.map((portal, idx) => (
              <motion.button
                key={portal.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 + (idx * 0.1) }}
                whileHover={{ x: 4, background: 'var(--bg-tertiary)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(portal.path)}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-glass)',
                  padding: '20px',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%'
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: `${portal.color}15`,
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: portal.color,
                  flexShrink: 0
                }}>
                  {portal.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '1.05rem',
                    fontWeight: 800,
                    color: 'white',
                    marginBottom: '2px'
                  }}>
                    {portal.title}
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    fontWeight: 600,
                    lineHeight: '1.3'
                  }}>
                    {portal.desc}
                  </div>
                </div>
                <ChevronRight size={18} className="text-muted" />
              </motion.button>
            ))}
          </div>
        </motion.div>
        
        <p style={{ 
          textAlign: 'center', 
          marginTop: '32px', 
          fontSize: '0.7rem', 
          color: 'var(--text-muted)', 
          fontWeight: 600,
          opacity: 0.5
        }}>
          &copy; 2026 SIDEQUEST.BN • BRU-VERIFIED
        </p>
      </div>
    </div>
  );
};

export default PortalSelector;