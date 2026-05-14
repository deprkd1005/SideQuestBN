import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckCircle, Info, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePayment } from '../../context/PaymentContext';

const Notifications = () => {
  const { notifications, refresh, token } = usePayment();
  const navigate = useNavigate();

  useEffect(() => {
    refresh();
  }, []);

  const getIcon = (title) => {
    if (title.toLowerCase().includes('success') || title.toLowerCase().includes('released')) return <CheckCircle size={20} className="text-emerald" />;
    if (title.toLowerCase().includes('request') || title.toLowerCase().includes('new')) return <Info size={20} className="text-gold" />;
    return <AlertTriangle size={20} className="text-gold" />;
  };

  return (
    <div className="app-content no-scrollbar" style={{ background: 'var(--bg-primary)' }}>
      <div style={{ padding: '40px 24px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button onClick={() => navigate(-1)} className="btn-ghost" style={{ padding: '8px' }}>
          <ArrowLeft size={24} />
        </button>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 900, fontFamily: 'Outfit' }}>Notifications</h1>
      </div>

      <div style={{ padding: '0 24px 24px' }}>
        {notifications.length === 0 ? (
          <div className="card-glass" style={{ padding: '60px 24px', textAlign: 'center' }}>
            <Bell size={40} className="text-muted" style={{ marginBottom: '16px', opacity: 0.3 }} />
            <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>All caught up! No new notifications.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {notifications.map(n => (
              <motion.div 
                key={n.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="card-glass"
                style={{ 
                  display: 'flex', 
                  gap: '16px', 
                  padding: '20px',
                  background: n.is_read ? 'var(--bg-card)' : 'rgba(16, 185, 129, 0.05)',
                  borderLeft: n.is_read ? '1px solid var(--border-glass)' : '4px solid var(--emerald)'
                }}
              >
                <div style={{ marginTop: '4px' }}>
                  {getIcon(n.title)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '4px' }}>{n.title}</div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, lineHeight: 1.5 }}>
                    {n.message}
                  </p>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, marginTop: '8px' }}>
                    {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
