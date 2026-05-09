import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Briefcase, Shield, AlertTriangle, TrendingUp, CheckCircle, Search, Filter, MoreVertical, Check, X, Bell, Activity, Lock, FileText } from 'lucide-react';
import { usePayment } from '../../context/PaymentContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { refresh } = usePayment();
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const stats = [
    { label: 'Total Users', value: '1,247', icon: Users, color: 'var(--blue)' },
    { label: 'Active Jobs', value: '89', icon: Briefcase, color: 'var(--emerald)' },
    { label: 'Escrow', value: 'BND 12,450', icon: Shield, color: 'var(--orange)' },
    { label: 'Reports', value: '12', icon: AlertTriangle, color: 'var(--red)' }
  ];

  const pendingVerifications = [
    { id: 1, name: 'Ahmad Rahman', role: 'Hustler', icColor: 'Blue', submitted: '2h ago' },
    { id: 2, name: 'Siti Aminah', role: 'Poster', icColor: 'Yellow', submitted: '5h ago' }
  ];

  const recentReports = [
    { id: 1, type: 'Job Dispute', status: 'Pending', reported: '1h ago', user: 'Zul' },
    { id: 2, type: 'Payment Issue', status: 'Investigating', reported: '6h ago', user: 'Liyana' }
  ];

  return (
    <div className="app-content" style={{ background: 'var(--bg-primary)', minHeight: '100%' }}>
      {/* Admin Header */}
      <div style={{ padding: '32px 24px 24px', background: 'linear-gradient(180deg, var(--bg-tertiary) 0%, var(--bg-primary) 100%)' }}>
        <div className="flex-between" style={{ marginBottom: '24px' }}>
          <div>
            <h1 className="section-title">Control Center</h1>
            <p className="section-subtitle">Platform health & security</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="card-glass" onClick={() => alert('Notifications coming soon!')} style={{ width: '48px', height: '48px', borderRadius: '16px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bell size={20} className="text-muted" />
            </button>
            <button className="card-glass" onClick={() => alert('Security settings opened')} style={{ width: '48px', height: '48px', borderRadius: '16px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Lock size={20} className="text-blue" />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          {stats.map(stat => (
            <div key={stat.label} className="card" style={{ padding: '20px', background: 'var(--bg-card)', borderColor: 'var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
              <div className="flex-between" style={{ marginBottom: '12px' }}>
                <div style={{ color: stat.color }}>
                  <stat.icon size={20} />
                </div>
                <Activity size={14} className="text-muted" />
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)' }}>{stat.value}</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 24px 24px' }}>
        {/* Verification Section */}
        <div className="flex-between" style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>KYC Moderation</h3>
          <button className="btn-ghost" onClick={() => navigate('/admin/reports')} style={{ fontSize: '0.85rem', color: 'var(--blue)', fontWeight: 700 }}>Review All</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
          {pendingVerifications.map(user => (
            <div key={user.id} className="card" style={{ padding: '16px', background: 'var(--bg-card)' }}>
              <div className="flex-between" style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="avatar" style={{ width: '100%' }} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>{user.name}</h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{user.role} • {user.icColor} IC</p>
                  </div>
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>{user.submitted}</span>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn-primary" onClick={() => setSelectedUser(user)} style={{ flex: 1, height: '40px', background: 'var(--emerald)', fontSize: '0.85rem' }}>
                  Review
                </button>
                <button className="btn-outline" onClick={() => setSelectedUser({...user, rejectMode: true})} style={{ flex: 1, height: '40px', fontSize: '0.85rem', color: 'var(--red)' }}>
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* System Alerts */}
        <div className="flex-between" style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>System Alerts</h3>
          <span className="badge badge-orange" style={{ fontSize: '0.65rem' }}>12 Critical</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {recentReports.map(report => (
            <div key={report.id} className="card" style={{ padding: '16px', borderLeft: '4px solid var(--red)', background: 'var(--bg-card)' }}>
              <div className="flex-between" style={{ marginBottom: '8px' }}>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>{report.type}</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Reported by {report.user} • {report.reported}</p>
                </div>
                <div style={{ padding: '4px 8px', borderRadius: '6px', background: 'var(--bg-secondary)', fontSize: '0.7rem', fontWeight: 800, color: 'var(--red)' }}>
                  {report.status}
                </div>
              </div>
              <button className="btn-ghost" onClick={() => setSelectedReport(report)} style={{ width: '100%', padding: '10px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--blue)', border: '1px solid var(--blue-soft)', borderRadius: '12px', marginTop: '8px' }}>
                Investigate Dispute
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* KYC Modal */}
      <AnimatePresence>
        {selectedUser && (
          <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
            <motion.div 
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              className="bottom-sheet" onClick={e => e.stopPropagation()}
            >
              <div className="bottom-sheet-handle" />
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUser.name}`} alt="avatar" style={{ width: '100%' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 900 }}>{selectedUser.name}</h3>
                  <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{selectedUser.role} • Submitted: {selectedUser.submitted}</p>
                </div>
              </div>
              
              <div className="card" style={{ padding: '16px', marginBottom: '24px', background: 'var(--bg-primary)' }}>
                <div className="flex-between" style={{ marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 700 }}>IC Number</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 800 }}>01-123456</span>
                </div>
                <div className="flex-between" style={{ marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 700 }}>IC Color</span>
                  <span className="badge badge-emerald">{selectedUser.icColor}</span>
                </div>
                <div style={{ marginTop: '16px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 700, display: 'block', marginBottom: '8px' }}>IC Photo Document</span>
                  <div style={{ width: '100%', height: '120px', background: 'var(--bg-tertiary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                    <FileText size={32} />
                  </div>
                </div>
              </div>

              {!selectedUser.rejectMode ? (
                <button className="btn-primary" onClick={() => { alert(`Success! ${selectedUser.name} approved.`); setSelectedUser(null); refresh(); }} style={{ width: '100%', background: 'var(--emerald)' }}>
                  Approve Bru-Verified Status
                </button>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <input type="text" placeholder="Reason for rejection (e.g. Blurry photo)" style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)' }} />
                  <button className="btn-primary" onClick={() => { alert(`Rejected! Notification sent to ${selectedUser.name}.`); setSelectedUser(null); }} style={{ width: '100%', background: 'var(--red)' }}>
                    Confirm Rejection
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Dispute Modal */}
      <AnimatePresence>
        {selectedReport && (
          <div className="modal-overlay" onClick={() => setSelectedReport(null)}>
            <motion.div 
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              className="bottom-sheet" onClick={e => e.stopPropagation()}
            >
              <div className="bottom-sheet-handle" />
              <div style={{ marginBottom: '24px' }}>
                <span className="badge badge-red" style={{ marginBottom: '12px' }}>{selectedReport.status}</span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 900 }}>{selectedReport.type}</h3>
                <p style={{ color: 'var(--text-muted)', fontWeight: 600, marginTop: '4px' }}>Reported {selectedReport.reported}</p>
              </div>

              <div className="card" style={{ padding: '16px', marginBottom: '24px', background: 'var(--bg-primary)' }}>
                <div className="flex-between" style={{ marginBottom: '16px' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>Reporter (Poster)</div>
                    <div style={{ fontSize: '1rem', fontWeight: 800 }}>{selectedReport.user}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>Reported (Hustler)</div>
                    <div style={{ fontSize: '1rem', fontWeight: 800 }}>Haziq_M</div>
                  </div>
                </div>
                <div style={{ padding: '12px', background: 'var(--bg-tertiary)', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                  "Hustler arrived 2 hours late and did not finish the job properly. Requesting full refund from escrow."
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn-primary" onClick={() => { alert('Refunding poster...'); setSelectedReport(null); }} style={{ flex: 1, background: 'var(--orange)' }}>
                  Refund Poster
                </button>
                <button className="btn-outline" onClick={() => { alert('Releasing to hustler...'); setSelectedReport(null); }} style={{ flex: 1 }}>
                  Release to Hustler
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default AdminDashboard;