import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, AlertTriangle, DollarSign, CheckCircle, X, Info } from 'lucide-react';
import { useTourismPayment } from '../context/TourismPaymentContext';
import { useLanguage } from '../context/LanguageContext';

const NotificationsScreen = ({ portal = 'tourist' }) => {
  const { notifications, fetchDb } = useTourismPayment();
  const { t } = useLanguage();

  const getNotificationIcon = (text) => {
    if (text.includes('escrow locked') || text.includes('locked')) return { icon: Bell, color: 'var(--gold)', bg: 'rgba(212, 175, 55, 0.1)' };
    if (text.includes('released') || text.includes('success')) return { icon: CheckCircle, color: 'var(--emerald)', bg: 'rgba(16, 185, 129, 0.1)' };
    if (text.includes('ALERT') || text.includes('blocked') || text.includes('SUSPENDED')) return { icon: AlertTriangle, color: 'var(--red)', bg: 'rgba(239, 68, 68, 0.1)' };
    if (text.includes('Payout') || text.includes('BND')) return { icon: DollarSign, color: 'var(--emerald)', bg: 'rgba(16, 185, 129, 0.1)' };
    return { icon: Info, color: 'var(--text-muted)', bg: 'var(--bg-tertiary)' };
  };

  const formatTimestamp = (ts) => {
    const date = new Date(ts);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="app-content no-scrollbar" style={{ background: 'var(--bg-primary)', paddingBottom: '90px' }}>
      <div style={{ padding: '40px 24px 20px' }}>
        <h1 className="section-title" style={{ padding: 0 }}>{t('inbox')}</h1>
        <p className="section-subtitle" style={{ padding: 0, marginTop: '4px' }}>
          {notifications.length > 0 ? `${notifications.length} notification${notifications.length !== 1 ? 's' : ''}` : 'Stay updated'}
        </p>
      </div>

      <div style={{ padding: '0 24px 24px' }}>
        {notifications.length === 0 ? (
          <div className="card-glass" style={{
            padding: '60px 24px', textAlign: 'center', background: 'white',
            borderRadius: '24px', border: '1px solid var(--border-color)'
          }}>
            <Bell size={40} style={{ color: 'var(--text-muted)', marginBottom: '16px', opacity: 0.3 }} />
            <p style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.95rem' }}>No new notifications</p>
            <p style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.8rem', marginTop: '8px' }}>
              Notifications will appear here when you book activities, receive payouts, or when security events are triggered.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <AnimatePresence>
              {notifications.map((notif, idx) => {
                const { icon: Icon, color, bg } = getNotificationIcon(notif.text);
                return (
                  <motion.div
                    key={notif.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="card"
                    style={{
                      padding: '16px', display: 'flex', gap: '14px',
                      alignItems: 'flex-start', background: 'white',
                      borderRadius: '20px', border: '1px solid var(--border-color)'
                    }}
                  >
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '12px',
                      background: bg, display: 'flex', alignItems: 'center',
                      justifyContent: 'center', flexShrink: 0
                    }}>
                      <Icon size={18} style={{ color }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)',
                        lineHeight: 1.4, marginBottom: '4px', wordBreak: 'break-word'
                      }}>
                        {notif.text}
                      </p>
                      <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                        {formatTimestamp(notif.timestamp)}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsScreen;
