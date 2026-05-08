import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapPin, PlusCircle, ShieldCheck, Zap } from 'lucide-react';

const PortalSelector = () => {
  const navigate = useNavigate();

  const portals = [
    {
      id: 'hustler',
      title: 'Hustler',
      desc: 'Find nearby jobs and earn side income quickly.',
      icon: <MapPin size={24} />,
      color: '#10b981',
      path: '/hustler'
    },
    {
      id: 'poster',
      title: 'Poster',
      desc: 'Post tasks and quickly find trusted local help.',
      icon: <PlusCircle size={24} />,
      color: '#f59e0b',
      path: '/poster'
    },
    {
      id: 'admin',
      title: 'Admin',
      desc: 'Platform moderation and safety.',
      icon: <ShieldCheck size={24} />,
      color: '#6b7280',
      path: '/admin'
    }
  ];

  return (
    <div className="login-view">
      {/* Brand Section */}
      <div className="login-brand" style={{
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: '2rem'
      }}>
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          style={{ textAlign: 'center' }}
        >
          <div style={{
            width: '100px',
            height: '100px',
            background: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)',
            borderRadius: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 2rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
          }}>
            <Zap size={50} color="white" />
          </div>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 900,
            letterSpacing: '-2px',
            color: 'white'
          }}>
            SideQuest.BN
          </h1>
          <p style={{
            fontSize: '1.1rem',
            fontWeight: 600,
            opacity: 0.9,
            marginTop: '10px',
            color: 'white'
          }}>
            Brunei's Premier Gig Marketplace
          </p>
          <div style={{
            marginTop: '20px',
            background: 'rgba(255,255,255,0.15)',
            padding: '8px 20px',
            borderRadius: '14px',
            fontSize: '0.8rem',
            fontWeight: 800,
            color: 'white'
          }}>
            REDESIGNED V3.0
          </div>
        </motion.div>
      </div>

      {/* Auth Section */}
      <div className="login-form-container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <div
          style={{
            background: 'white',
            borderRadius: '24px',
            padding: '2rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            maxWidth: '400px',
            width: '100%'
          }}
        >
          <h2 style={{
            fontSize: '1.8rem',
            fontWeight: 900,
            marginBottom: '0.5rem',
            letterSpacing: '-0.5px',
            textAlign: 'center'
          }}>
            Choose Your Portal
          </h2>
          <p style={{
            color: '#6b7280',
            fontWeight: 500,
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            Select your role to get started.
          </p>

          {/* Portal Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '16px'
          }}>
            {portals.map(portal => (
              <motion.button
                key={portal.id}
                whileHover={{ y: -2, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(portal.path)}
                style={{
                  background: 'white',
                  border: '2px solid #e5e7eb',
                  padding: '1.5rem',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'left'
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: `${portal.color}15`,
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: portal.color
                }}>
                  {portal.icon}
                </div>
                <div>
                  <div style={{
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: '#111827',
                    marginBottom: '4px'
                  }}>
                    {portal.title}
                  </div>
                  <div style={{
                    fontSize: '0.9rem',
                    color: '#6b7280',
                    lineHeight: '1.4'
                  }}>
                    {portal.desc}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortalSelector;