import React from 'react';
import { motion } from 'framer-motion';
import { Users, Briefcase, Shield, AlertTriangle, TrendingUp, CheckCircle, Search, Filter, MoreVertical, Check, X, Bell, Activity, Lock } from 'lucide-react';

const AdminDashboard = () => {
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
    <div className="app-content no-pad" style={{ background: 'var(--bg-primary)', minHeight: '100%' }}>
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
            <div key={stat.label} className="card" style={{ padding: '20px', background: 'white', borderColor: 'var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
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
          <button className="btn-ghost" onClick={() => alert('Opening review queue')} style={{ fontSize: '0.85rem', color: 'var(--blue)', fontWeight: 700 }}>Review All</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
          {pendingVerifications.map(user => (
            <div key={user.id} className="card" style={{ padding: '16px', background: 'white' }}>
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
                <button className="btn-primary" onClick={() => alert(`Approved ${user.name}`)} style={{ flex: 1, height: '40px', background: 'var(--emerald)', fontSize: '0.85rem' }}>
                  Approve
                </button>
                <button className="btn-outline" onClick={() => alert(`Rejected ${user.name}`)} style={{ flex: 1, height: '40px', fontSize: '0.85rem', color: 'var(--red)' }}>
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
            <div key={report.id} className="card" style={{ padding: '16px', borderLeft: '4px solid var(--red)', background: 'white' }}>
              <div className="flex-between" style={{ marginBottom: '8px' }}>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>{report.type}</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Reported by {report.user} • {report.reported}</p>
                </div>
                <div style={{ padding: '4px 8px', borderRadius: '6px', background: 'var(--bg-secondary)', fontSize: '0.7rem', fontWeight: 800, color: 'var(--red)' }}>
                  {report.status}
                </div>
              </div>
              <button className="btn-ghost" onClick={() => alert(`Investigating case ${report.id}`)} style={{ width: '100%', padding: '10px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--blue)', border: '1px solid var(--blue-soft)', borderRadius: '12px', marginTop: '8px' }}>
                Investigate Dispute
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;