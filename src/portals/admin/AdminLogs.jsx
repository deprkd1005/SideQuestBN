import React, { useState } from 'react';
import { Terminal, Shield, AlertTriangle, CheckCircle, Clock, RefreshCw, ChevronDown, Activity, Lock, UserCheck, CreditCard, Database, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePayment } from '../../context/PaymentContext';

const AdminLogs = () => {
  const { token } = usePayment();
  const [activeFilter, setActiveFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedLog, setExpandedLog] = useState(null);

  // Simulated system logs (these would come from a real logging backend)
  const generateTimestamp = (minutesAgo) => {
    const d = new Date(Date.now() - minutesAgo * 60000);
    return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const logs = [
    { id: 1, type: 'security', severity: 'info', title: 'Admin Login Verified', message: 'Root admin session authenticated via JWT token. MFA status: active.', timestamp: generateTimestamp(2), icon: Lock, color: 'var(--emerald)' },
    { id: 2, type: 'transaction', severity: 'success', title: 'Escrow Payment Held', message: 'Transaction SHA-256 hash verified. BND 45.00 locked in escrow vault for order SQ-X291.', timestamp: generateTimestamp(5), icon: CreditCard, color: 'var(--emerald)' },
    { id: 3, type: 'auth', severity: 'warning', title: 'Failed Login Attempt', message: 'Invalid credentials detected for user test@example.com. IP: 203.0.113.42. Rate limiter engaged.', timestamp: generateTimestamp(12), icon: AlertTriangle, color: 'var(--gold)' },
    { id: 4, type: 'system', severity: 'info', title: 'Database Health Check', message: 'PostgreSQL connection pool: 12/100 active. Latency: 42ms. All migrations applied successfully.', timestamp: generateTimestamp(15), icon: Database, color: 'var(--blue)' },
    { id: 5, type: 'kyc', severity: 'success', title: 'KYC Verification Approved', message: 'User Ahmad_Zul verified by admin. Document validation: PASSED. Profile status updated to VERIFIED.', timestamp: generateTimestamp(20), icon: UserCheck, color: 'var(--emerald)' },
    { id: 6, type: 'transaction', severity: 'success', title: 'Escrow Released', message: 'Funds released to provider wallet. BND 120.00 transferred. Transaction ID: TXN-88A2C.', timestamp: generateTimestamp(30), icon: CreditCard, color: 'var(--emerald)' },
    { id: 7, type: 'security', severity: 'critical', title: 'Rate Limit Exceeded', message: 'API endpoint /api/auth/login hit rate limit. 50 requests in 60s from IP 192.168.1.105. Temporary block applied.', timestamp: generateTimestamp(45), icon: Shield, color: 'var(--red)' },
    { id: 8, type: 'system', severity: 'info', title: 'Server Restart Completed', message: 'Application server restarted successfully. Uptime: 0h 0m. All services operational. Memory: 256MB/512MB.', timestamp: generateTimestamp(60), icon: Zap, color: 'var(--blue)' },
    { id: 9, type: 'auth', severity: 'info', title: 'New User Registration', message: 'User liyana_88 registered as Provider (Hustler). Email verification sent. Auto-assigned to default service area.', timestamp: generateTimestamp(90), icon: UserCheck, color: 'var(--blue)' },
    { id: 10, type: 'transaction', severity: 'warning', title: 'Payment Timeout Warning', message: 'Escrow hold for order SQ-F4C1 approaching 72-hour limit. Auto-release in 4h 22m. Notify parties.', timestamp: generateTimestamp(120), icon: Clock, color: 'var(--gold)' },
  ];

  const filters = [
    { key: 'all', label: 'All Logs', count: logs.length },
    { key: 'security', label: 'Security', count: logs.filter(l => l.type === 'security').length },
    { key: 'transaction', label: 'Transactions', count: logs.filter(l => l.type === 'transaction').length },
    { key: 'auth', label: 'Auth', count: logs.filter(l => l.type === 'auth').length },
    { key: 'system', label: 'System', count: logs.filter(l => l.type === 'system').length },
    { key: 'kyc', label: 'KYC', count: logs.filter(l => l.type === 'kyc').length },
  ];

  const filteredLogs = activeFilter === 'all' ? logs : logs.filter(l => l.type === activeFilter);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const getSeverityStyle = (severity) => {
    switch (severity) {
      case 'critical': return { bg: 'rgba(239, 68, 68, 0.1)', color: 'var(--red)', border: 'var(--red)' };
      case 'warning': return { bg: 'var(--gold-soft)', color: 'var(--gold)', border: 'var(--gold)' };
      case 'success': return { bg: 'var(--emerald-soft)', color: 'var(--emerald)', border: 'var(--emerald)' };
      default: return { bg: 'rgba(59, 130, 246, 0.08)', color: 'var(--blue)', border: 'var(--blue)' };
    }
  };

  const logStats = {
    critical: logs.filter(l => l.severity === 'critical').length,
    warnings: logs.filter(l => l.severity === 'warning').length,
    success: logs.filter(l => l.severity === 'success').length,
  };

  return (
    <div className="app-content no-scrollbar" style={{ background: 'var(--bg-primary)' }}>
      <div style={{ padding: '40px 24px 24px' }}>
        <div className="flex-between" style={{ marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: 'Outfit', color: 'var(--text-primary)' }}>System <span style={{ color: 'var(--blue)' }}>Logs</span></h1>
            <p style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem' }}>Real-time activity & audit trail</p>
          </div>
          <button 
            className="card-glass flex-center" 
            onClick={handleRefresh}
            style={{ width: '48px', height: '48px', borderRadius: '16px', border: 'none', cursor: 'pointer' }}
          >
            <RefreshCw size={20} className="text-emerald" style={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} />
          </button>
        </div>

        {/* Log Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '24px' }}>
          <div className="card" style={{ padding: '14px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--red)' }}>{logStats.critical}</div>
            <div style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Critical</div>
          </div>
          <div className="card" style={{ padding: '14px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--gold)' }}>{logStats.warnings}</div>
            <div style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Warnings</div>
          </div>
          <div className="card" style={{ padding: '14px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--emerald)' }}>{logStats.success}</div>
            <div style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Success</div>
          </div>
        </div>

        {/* Filter Chips */}
        <div style={{ display: 'flex', gap: '8px', overflow: 'auto', marginBottom: '24px', paddingBottom: '4px' }} className="no-scrollbar">
          {filters.map(f => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              style={{
                padding: '8px 16px',
                borderRadius: '100px',
                border: activeFilter === f.key ? '1.5px solid var(--blue)' : '1.5px solid var(--border-color)',
                background: activeFilter === f.key ? 'rgba(59, 130, 246, 0.1)' : 'var(--bg-secondary)',
                color: activeFilter === f.key ? 'var(--blue)' : 'var(--text-secondary)',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              {f.label}
              <span style={{ 
                background: activeFilter === f.key ? 'var(--blue)' : 'var(--bg-tertiary)', 
                color: activeFilter === f.key ? 'white' : 'var(--text-muted)',
                padding: '2px 6px', borderRadius: '6px', fontSize: '0.65rem', fontWeight: 800 
              }}>{f.count}</span>
            </button>
          ))}
        </div>

        {/* Log Entries */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredLogs.map((log, idx) => {
            const severity = getSeverityStyle(log.severity);
            const isExpanded = expandedLog === log.id;
            return (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="card"
                onClick={() => setExpandedLog(isExpanded ? null : log.id)}
                style={{ 
                  padding: '16px', 
                  cursor: 'pointer',
                  borderLeft: `4px solid ${severity.border}`,
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ 
                    width: '36px', height: '36px', borderRadius: '10px', 
                    background: severity.bg, color: severity.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <log.icon size={18} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="flex-between" style={{ marginBottom: '4px' }}>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>{log.title}</h4>
                      <ChevronDown size={16} style={{ 
                        color: 'var(--text-muted)', 
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)',
                        transition: 'transform 0.2s'
                      }} />
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                        <Clock size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                        {log.timestamp}
                      </span>
                      <span style={{ 
                        fontSize: '0.6rem', fontWeight: 800, padding: '2px 8px', borderRadius: '4px',
                        background: severity.bg, color: severity.color, textTransform: 'uppercase'
                      }}>
                        {log.severity}
                      </span>
                    </div>
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          style={{ overflow: 'hidden' }}
                        >
                          <div style={{ 
                            marginTop: '12px', padding: '12px', 
                            background: 'var(--bg-primary)', borderRadius: '10px',
                            fontSize: '0.8rem', color: 'var(--text-secondary)', 
                            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                            lineHeight: 1.6, fontWeight: 500
                          }}>
                            {log.message}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Live Indicator */}
        <div style={{ textAlign: 'center', marginTop: '32px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <div style={{ 
              width: '8px', height: '8px', borderRadius: '50%', background: 'var(--emerald)',
              animation: 'pulse 2s infinite'
            }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Live • Auto-refreshing every 30s</span>
          </div>
          <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '8px', letterSpacing: '1px' }}>SIDEQUEST.BN AUDIT TRAIL v1.0</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogs;
