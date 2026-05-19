import React, { useState, useEffect } from 'react';
import { Activity, Cpu, Server, Database, CheckCircle, HardDrive, Wifi, Globe, RefreshCw, Shield, Zap, ToggleLeft, ToggleRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePayment } from '../../context/PaymentContext';

const AdminSystem = () => {
  const { token } = usePayment();
  const [systemHealth, setSystemHealth] = useState('checking');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // System Feature Toggles
  const [features, setFeatures] = useState({
    maintenance: false,
    rateLimit: true,
    autoBackup: true,
    emailNotifs: true,
    kycAutoVerify: false,
    debugMode: false,
  });

  useEffect(() => {
    // Simulate health check
    setTimeout(() => setSystemHealth('operational'), 1500);
  }, []);

  const toggleFeature = (key) => {
    setFeatures(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setSystemHealth('checking');
    setTimeout(() => {
      setSystemHealth('operational');
      setIsRefreshing(false);
    }, 1500);
  };

  const metrics = [
    { label: 'API Latency', value: '42ms', status: 'Stable', icon: Activity, color: 'var(--emerald)' },
    { label: 'CPU Usage', value: '12%', status: 'Low', icon: Cpu, color: 'var(--blue)' },
    { label: 'Server Load', value: '0.4', status: 'Optimal', icon: Server, color: 'var(--emerald)' },
    { label: 'DB Connections', value: '12/100', status: 'Healthy', icon: Database, color: 'var(--blue)' }
  ];

  const infraStatus = [
    { label: 'Frontend (Vercel)', status: 'online', latency: '18ms', icon: Globe },
    { label: 'Backend (Render)', status: 'online', latency: '42ms', icon: Server },
    { label: 'PostgreSQL', status: 'online', latency: '8ms', icon: Database },
    { label: 'CDN / Assets', status: 'online', latency: '12ms', icon: HardDrive },
    { label: 'WebSocket', status: 'standby', latency: '—', icon: Wifi },
  ];

  const featureToggles = [
    { key: 'maintenance', label: 'Maintenance Mode', desc: 'Redirects all users to a maintenance page', color: 'var(--red)' },
    { key: 'rateLimit', label: 'API Rate Limiting', desc: 'Limits requests to 100/min per IP', color: 'var(--gold)' },
    { key: 'autoBackup', label: 'Auto Database Backup', desc: 'Daily automatic PostgreSQL backups at 3:00 AM', color: 'var(--blue)' },
    { key: 'emailNotifs', label: 'Email Notifications', desc: 'Send email alerts for critical system events', color: 'var(--emerald)' },
    { key: 'kycAutoVerify', label: 'KYC Auto-Verify', desc: 'Automatically verify users with valid documents', color: 'var(--gold)' },
    { key: 'debugMode', label: 'Debug Mode', desc: 'Enable verbose logging and error stack traces', color: 'var(--red)' },
  ];

  return (
    <div className="app-content no-scrollbar" style={{ background: 'var(--bg-primary)' }}>
      <div style={{ padding: '40px 24px 24px' }}>
        {/* Header */}
        <div className="flex-between" style={{ marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: 'Outfit', color: 'var(--text-primary)' }}>System <span style={{ color: 'var(--blue)' }}>Admin</span></h1>
            <p style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem' }}>Infrastructure & configuration control</p>
          </div>
          <button 
            className="card-glass flex-center" 
            onClick={handleRefresh}
            style={{ width: '48px', height: '48px', borderRadius: '16px', border: 'none', cursor: 'pointer' }}
          >
            <RefreshCw size={20} style={{ color: 'var(--blue)', animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} />
          </button>
        </div>

        {/* Overall Health Status */}
        <div className="card" style={{ 
          padding: '24px', marginBottom: '24px',
          background: systemHealth === 'operational' 
            ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, var(--bg-card) 100%)'
            : 'linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, var(--bg-card) 100%)',
          borderLeft: `4px solid ${systemHealth === 'operational' ? 'var(--emerald)' : 'var(--gold)'}`
        }}>
          <div className="flex-between">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ 
                width: '52px', height: '52px', borderRadius: '16px',
                background: systemHealth === 'operational' ? 'var(--emerald-soft)' : 'var(--gold-soft)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {systemHealth === 'operational' 
                  ? <CheckCircle size={28} style={{ color: 'var(--emerald)' }} />
                  : <Activity size={28} style={{ color: 'var(--gold)', animation: 'pulse 1s infinite' }} />
                }
              </div>
              <div>
                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                  {systemHealth === 'operational' ? 'All Systems Operational' : 'Checking Systems...'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Last checked: {new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
            <div style={{ 
              width: '12px', height: '12px', borderRadius: '50%',
              background: systemHealth === 'operational' ? 'var(--emerald)' : 'var(--gold)',
              animation: 'pulse 2s infinite',
              boxShadow: systemHealth === 'operational' ? '0 0 10px var(--emerald-glow)' : '0 0 10px var(--gold-glow)'
            }} />
          </div>
        </div>

        {/* Performance Metrics */}
        <h3 style={{ fontSize: '1rem', fontWeight: 800, fontFamily: 'Outfit', marginBottom: '12px', color: 'var(--text-primary)' }}>Performance Metrics</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '28px' }}>
          {metrics.map((m, idx) => (
            <motion.div 
              key={m.label} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="card" 
              style={{ padding: '16px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${m.color}15`, color: m.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <m.icon size={18} />
                </div>
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-primary)' }}>{m.value}</div>
              <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{m.label}</div>
              <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--emerald)', fontSize: '0.7rem', fontWeight: 700 }}>
                <CheckCircle size={12} /> {m.status}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Infrastructure Status */}
        <h3 style={{ fontSize: '1rem', fontWeight: 800, fontFamily: 'Outfit', marginBottom: '12px', color: 'var(--text-primary)' }}>Infrastructure Status</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
          {infraStatus.map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="card" 
              style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '14px' }}
            >
              <div style={{ 
                width: '38px', height: '38px', borderRadius: '10px', 
                background: item.status === 'online' ? 'var(--emerald-soft)' : 'var(--gold-soft)',
                color: item.status === 'online' ? 'var(--emerald)' : 'var(--gold)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <item.icon size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>{item.label}</div>
                <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)' }}>Latency: {item.latency}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ 
                  width: '8px', height: '8px', borderRadius: '50%',
                  background: item.status === 'online' ? 'var(--emerald)' : 'var(--gold)',
                  animation: item.status === 'online' ? 'pulse 2s infinite' : 'none'
                }} />
                <span style={{ 
                  fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase',
                  color: item.status === 'online' ? 'var(--emerald)' : 'var(--gold)'
                }}>
                  {item.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Feature Toggles */}
        <h3 style={{ fontSize: '1rem', fontWeight: 800, fontFamily: 'Outfit', marginBottom: '12px', color: 'var(--text-primary)' }}>System Configuration</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '32px' }}>
          {featureToggles.map(ft => (
            <div key={ft.key} className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '2px' }}>{ft.label}</div>
                <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)' }}>{ft.desc}</div>
              </div>
              <button 
                onClick={() => toggleFeature(ft.key)}
                style={{ 
                  background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                  color: features[ft.key] ? ft.color : 'var(--text-muted)',
                  transition: 'color 0.2s'
                }}
              >
                {features[ft.key] 
                  ? <ToggleRight size={32} style={{ color: ft.color }} />
                  : <ToggleLeft size={32} style={{ color: 'var(--text-muted)' }} />
                }
              </button>
            </div>
          ))}
        </div>

        {/* Environment Info */}
        <div className="card" style={{ padding: '20px', background: 'var(--bg-secondary)', border: '1px dashed var(--border-color)' }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '12px', color: 'var(--text-primary)' }}>Environment Info</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { label: 'Node.js', value: 'v20.x LTS' },
              { label: 'Runtime', value: 'Express 4.x' },
              { label: 'ORM', value: 'Prisma 6.2.1' },
              { label: 'Database', value: 'PostgreSQL 15' },
              { label: 'Hosting', value: 'Render (Backend) + Vercel (Frontend)' },
              { label: 'Region', value: 'Singapore (SEA)' },
            ].map(env => (
              <div key={env.label} style={{ 
                fontSize: '0.75rem', fontFamily: "'JetBrains Mono', 'Fira Code', monospace", 
                color: 'var(--text-secondary)', padding: '8px 12px', 
                background: 'var(--bg-primary)', borderRadius: '8px', 
                border: '1px solid var(--border-color)',
                display: 'flex', justifyContent: 'space-between'
              }}>
                <span style={{ color: 'var(--blue)', fontWeight: 700 }}>{env.label}</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{env.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '32px', paddingBottom: '20px' }}>
          <p style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '2px' }}>SIDEQUEST.BN SYSTEM ADMIN v1.0</p>
          <p style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '4px' }}>Infrastructure Control • Root Access Required</p>
        </div>
      </div>
    </div>
  );
};

export default AdminSystem;
