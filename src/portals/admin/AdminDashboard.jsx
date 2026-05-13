import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Briefcase, Shield, AlertTriangle, Activity, Bell, Lock, Search } from 'lucide-react';
import { usePayment } from '../../context/PaymentContext';

const AdminDashboard = () => {
  const { refresh, user, token } = usePayment();
  const [adminStats, setAdminStats] = useState({
    users: [],
    payments: [],
    loading: true
  });

  const fetchAdminData = async () => {
    try {
      const baseUrl = 'https://spotty-ways-pull.loca.lt';
      const headers = { 'Authorization': `Bearer ${token}` };
      const [resUsers, resPayments] = await Promise.all([
        fetch(`${baseUrl}/api/admin/users`, { headers }),
        fetch(`${baseUrl}/api/admin/payments`, { headers })
      ]);
      
      if (resUsers.ok && resPayments.ok) {
        const usersData = await resUsers.json();
        const paymentsData = await resPayments.json();
        setAdminStats({ users: usersData, payments: paymentsData, loading: false });
      }
    } catch (err) {
      console.error("Failed to fetch admin data", err);
    }
  };

  useEffect(() => {
    if (token) fetchAdminData();
  }, [token]);

  const stats = [
    { label: 'Total Users', value: adminStats.users.length, icon: Users, color: 'var(--emerald)' },
    { label: 'Active Jobs', value: adminStats.payments.filter(p => p.payment_status === 'held').length, icon: Briefcase, color: 'var(--gold)' },
    { label: 'Escrow Flow', value: `BND ${adminStats.payments.reduce((acc, p) => acc + Number(p.amount), 0)}`, icon: Shield, color: 'var(--emerald)' },
    { label: 'System Health', value: 'OPTIMAL', icon: Activity, color: 'var(--emerald)' }
  ];

  return (
    <div className="app-content no-scrollbar" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div style={{ padding: '40px 24px 24px' }}>
        <div className="flex-between" style={{ marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: 'Outfit' }}>Admin <span className="text-emerald">Portal</span></h1>
            <p style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem' }}>System Integrity Monitor</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="card-glass flex-center" style={{ width: '48px', height: '48px', borderRadius: '16px' }}>
              <Bell size={20} className="text-muted" />
            </button>
            <button className="card-glass flex-center" style={{ width: '48px', height: '48px', borderRadius: '16px' }}>
              <Lock size={20} className="text-emerald" />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '32px' }}>
          {stats.map(stat => (
            <div key={stat.label} className="card" style={{ padding: '20px' }}>
              <div className="flex-between" style={{ marginBottom: '12px' }}>
                <div style={{ color: stat.color }}>
                  <stat.icon size={20} />
                </div>
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900 }}>{stat.value}</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* User Management */}
        <div className="flex-between" style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'Outfit' }}>User Directory</h3>
          <button className="btn-ghost text-emerald" style={{ fontSize: '0.8rem', fontWeight: 700 }}>View All</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
          {adminStats.users.slice(0, 4).map(u => (
            <div key={u.id} className="card-glass" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--bg-card)', overflow: 'hidden' }}>
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.id}`} alt="avatar" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>{u.fullname}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>{u.email} • <span className={u.role === 'customer' ? 'text-emerald' : 'text-gold'}>{u.role}</span></div>
              </div>
              <div className={`badge ${u.verification_status ? 'badge-emerald' : 'badge-gold'}`}>
                {u.verification_status ? 'Verified' : 'Pending'}
              </div>
            </div>
          ))}
        </div>

        {/* Payment Activities */}
        <div className="flex-between" style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'Outfit' }}>Escrow Activity</h3>
          <span className="badge badge-emerald">Real-time</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {adminStats.payments.slice(0, 5).map(p => (
            <div key={p.id} className="card" style={{ padding: '16px', background: 'var(--bg-card)', borderLeft: '4px solid var(--emerald)' }}>
              <div className="flex-between" style={{ marginBottom: '8px' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>{p.task_title || 'General Task'}</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 900, color: 'var(--emerald)' }}>BND {p.amount}</div>
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                From: {p.payer_name} → To: {p.receiver_name}
              </div>
              <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                <span className={`badge ${p.payment_status === 'released' ? 'badge-emerald' : 'badge-gold'}`}>
                  {p.payment_status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;