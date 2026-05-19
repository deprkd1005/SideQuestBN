import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCog, Shield, BarChart3, Star, LogOut, ChevronRight, Activity, Terminal, X, Users, Briefcase, CreditCard, TrendingUp, Lock, AlertTriangle, Eye, Clock, CheckCircle, FileText, Globe } from 'lucide-react';
import { usePayment } from '../../context/PaymentContext';

const AdminProfile = () => {
  const navigate = useNavigate();
  const { user, logout } = usePayment();
  const [activeSheet, setActiveSheet] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { 
      icon: BarChart3, label: 'Platform Analytics', color: 'var(--emerald)', 
      action: 'analytics',
      desc: 'Revenue, user growth & engagement metrics'
    },
    { 
      icon: Shield, label: 'Security Protocols', color: 'var(--gold)', 
      action: 'security',
      desc: 'Encryption, authentication & access control'
    },
    { 
      icon: Terminal, label: 'System Logs', color: 'var(--blue)', 
      action: 'navigate', path: '/admin/logs',
      desc: 'Audit trail, errors & activity history'
    },
    { 
      icon: Star, label: 'Moderation Queue', color: 'var(--emerald)', 
      action: 'navigate', path: '/admin/reports',
      desc: 'Content moderation & safety reports'
    },
  ];

  const handleMenuClick = (item) => {
    if (item.action === 'navigate') {
      navigate(item.path);
    } else {
      setActiveSheet(item.action);
    }
  };

  // Analytics Sheet Content
  const AnalyticsSheet = () => (
    <>
      <div className="flex-between" style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 900, fontFamily: 'Outfit' }}>Platform Analytics</h3>
        <button className="btn-ghost" onClick={() => setActiveSheet(null)}><X size={24} /></button>
      </div>

      {/* Key Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
        {[
          { label: 'Total Revenue', value: 'BND 2,450', icon: TrendingUp, color: 'var(--emerald)', change: '+18%' },
          { label: 'Active Users', value: '324', icon: Users, color: 'var(--blue)', change: '+12%' },
          { label: 'Total Orders', value: '89', icon: Briefcase, color: 'var(--gold)', change: '+24%' },
          { label: 'Conversion', value: '68%', icon: CreditCard, color: 'var(--emerald)', change: '+5%' },
        ].map(metric => (
          <div key={metric.label} className="card" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <metric.icon size={16} style={{ color: metric.color }} />
              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{metric.label}</span>
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-primary)' }}>{metric.value}</div>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--emerald)' }}>{metric.change} this month</span>
          </div>
        ))}
      </div>

      {/* User Growth Chart (Visual Bar) */}
      <div className="card-glass" style={{ padding: '20px', marginBottom: '20px' }}>
        <h4 style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '16px', color: 'var(--text-primary)' }}>Weekly User Growth</h4>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '100px' }}>
          {[35, 52, 45, 68, 74, 82, 90].map((val, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${val}%` }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              style={{ 
                flex: 1, background: `linear-gradient(180deg, var(--emerald) 0%, var(--emerald-dark) 100%)`,
                borderRadius: '6px 6px 0 0', opacity: 0.6 + (i * 0.05),
                position: 'relative'
              }}
            >
              <span style={{ position: 'absolute', top: '-18px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.6rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                {['M','T','W','T','F','S','S'][i]}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Top Categories */}
      <div className="card-glass" style={{ padding: '20px' }}>
        <h4 style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '12px', color: 'var(--text-primary)' }}>Top Service Categories</h4>
        {[
          { name: 'Delivery & Errands', pct: 38 },
          { name: 'Home Services', pct: 28 },
          { name: 'Tech Support', pct: 18 },
          { name: 'Tutoring', pct: 16 },
        ].map(cat => (
          <div key={cat.name} style={{ marginBottom: '12px' }}>
            <div className="flex-between" style={{ marginBottom: '4px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>{cat.name}</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--emerald)' }}>{cat.pct}%</span>
            </div>
            <div style={{ height: '6px', background: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${cat.pct}%` }}
                transition={{ duration: 0.8, delay: 0.2 }}
                style={{ height: '100%', background: 'linear-gradient(90deg, var(--emerald), var(--emerald-dark))', borderRadius: '3px' }}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );

  // Security Sheet Content
  const SecuritySheet = () => (
    <>
      <div className="flex-between" style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 900, fontFamily: 'Outfit' }}>Security Protocols</h3>
        <button className="btn-ghost" onClick={() => setActiveSheet(null)}><X size={24} /></button>
      </div>

      {/* Security Score */}
      <div className="card" style={{ padding: '24px', marginBottom: '24px', borderLeft: '4px solid var(--emerald)', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.06) 0%, var(--bg-card) 100%)' }}>
        <div className="flex-between">
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Security Score</div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--emerald)' }}>92/100</div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Last audit: Today</div>
          </div>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', border: '4px solid var(--emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={28} style={{ color: 'var(--emerald)' }} />
          </div>
        </div>
      </div>

      {/* Security Features */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {[
          { label: 'JWT Authentication', status: 'Active', icon: Lock, desc: '7-day token expiration, bcrypt hashing', color: 'var(--emerald)' },
          { label: 'HTTPS / TLS 1.3', status: 'Enforced', icon: Shield, desc: 'All traffic encrypted end-to-end', color: 'var(--emerald)' },
          { label: 'CORS Policy', status: 'Configured', icon: Globe, desc: 'Origin-restricted API access', color: 'var(--emerald)' },
          { label: 'SQL Injection Guard', status: 'Active', icon: Eye, desc: 'Prisma ORM parameterized queries', color: 'var(--emerald)' },
          { label: 'Rate Limiting', status: 'Active', icon: Clock, desc: '100 req/min per IP address', color: 'var(--gold)' },
          { label: 'Input Sanitization', status: 'Active', icon: FileText, desc: 'XSS protection on all endpoints', color: 'var(--emerald)' },
          { label: 'Admin Role Guard', status: 'Active', icon: UserCog, desc: 'Role-based access control (RBAC)', color: 'var(--emerald)' },
        ].map(item => (
          <div key={item.label} className="card" style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${item.color}15`, color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <item.icon size={18} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>{item.label}</div>
              <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)' }}>{item.desc}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle size={14} style={{ color: item.color }} />
              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: item.color }}>{item.status}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );

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
            <motion.div 
              key={idx} 
              className="card" 
              onClick={() => handleMenuClick(item)}
              whileTap={{ scale: 0.98 }}
              style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}
            >
              <div style={{ 
                width: '42px', height: '42px', borderRadius: '12px',
                background: `${item.color}15`, color: item.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <item.icon size={22} />
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>{item.label}</span>
                <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)' }}>{item.desc}</div>
              </div>
              <ChevronRight size={18} className="text-muted" />
            </motion.div>
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

      {/* Bottom Sheets */}
      <AnimatePresence>
        {activeSheet && (
          <div className="modal-overlay" onClick={() => setActiveSheet(null)}>
            <motion.div 
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 400 }}
              className="bottom-sheet" onClick={e => e.stopPropagation()}
              style={{ background: 'var(--bg-card)', maxHeight: '85vh' }}
            >
              <div className="bottom-sheet-handle" />
              {activeSheet === 'analytics' && <AnalyticsSheet />}
              {activeSheet === 'security' && <SecuritySheet />}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminProfile;
