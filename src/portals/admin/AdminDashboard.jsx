import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Briefcase, Shield, AlertTriangle, Activity, Bell, Lock, Search, Eye, X, CheckCircle, XCircle, Mail, Phone, Calendar, MapPin, FileCheck, UserCheck, Clock } from 'lucide-react';
import { usePayment } from '../../context/PaymentContext';

const AdminDashboard = () => {
  const { refresh, user, token } = usePayment();
  const [adminStats, setAdminStats] = useState({
    users: [],
    payments: [],
    loading: true
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [kycProcessing, setKycProcessing] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const fetchAdminData = async () => {
    try {
      const baseUrl = '';
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

  const handleKycAction = async (userId, action) => {
    setKycProcessing(userId);
    try {
      const baseUrl = '';
      const res = await fetch(`${baseUrl}/api/admin/users/${userId}/kyc`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action }) // 'approve' or 'reject'
      });
      
      if (res.ok) {
        await fetchAdminData();
        // Update selected user if open
        if (selectedUser?.id === userId) {
          const updatedUsers = adminStats.users.map(u => {
            if (u.id === userId) {
              return {
                ...u,
                verification_status: action === 'approve',
                profile: u.profile ? { ...u.profile, kyc_status: action === 'approve' ? 'verified' : 'rejected' } : u.profile
              };
            }
            return u;
          });
          setSelectedUser(updatedUsers.find(u => u.id === userId));
        }
      }
    } catch (err) {
      console.error("KYC action failed", err);
    } finally {
      setKycProcessing(null);
    }
  };

  const filteredUsers = adminStats.users.filter(u => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return u.fullname?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || u.role?.toLowerCase().includes(q);
  });

  const displayedUsers = showAllUsers ? filteredUsers : filteredUsers.slice(0, 4);

  const pendingKyc = adminStats.users.filter(u => u.profile?.kyc_status === 'pending' || !u.verification_status);

  const stats = [
    { label: 'Total Users', value: adminStats.users.length, icon: Users, color: 'var(--emerald)' },
    { label: 'Active Jobs', value: adminStats.payments.filter(p => p.payment_status === 'held' || p.status === 'held').length, icon: Briefcase, color: 'var(--gold)' },
    { label: 'Escrow Flow', value: `BND ${adminStats.payments.reduce((acc, p) => acc + Number(p.amount || 0), 0)}`, icon: Shield, color: 'var(--emerald)' },
    { label: 'Pending KYC', value: pendingKyc.length, icon: FileCheck, color: pendingKyc.length > 0 ? 'var(--gold)' : 'var(--emerald)' }
  ];

  const getRoleBadge = (role) => {
    switch(role) {
      case 'admin': return { class: 'badge-blue', label: 'Admin' };
      case 'provider': return { class: 'badge-gold', label: 'Hustler' };
      case 'customer': return { class: 'badge-emerald', label: 'Poster' };
      default: return { class: 'badge-gold', label: role };
    }
  };

  const getKycStatus = (user) => {
    if (user.verification_status) return 'verified';
    if (user.profile?.kyc_status === 'rejected') return 'rejected';
    return 'pending';
  };

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

        {/* KYC Moderation Queue */}
        {pendingKyc.length > 0 && (
          <>
            <div className="flex-between" style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'Outfit' }}>
                KYC Moderation <span style={{ color: 'var(--gold)', fontSize: '0.8rem' }}>({pendingKyc.length})</span>
              </h3>
              <span className="badge badge-gold" style={{ animation: 'pulse 2s infinite' }}>Action Required</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
              {pendingKyc.slice(0, 3).map(u => (
                <div key={`kyc-${u.id}`} className="card" style={{ padding: '16px', borderLeft: '4px solid var(--gold)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--gold-soft)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.id}`} alt="avatar" style={{ width: '100%', height: '100%' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>{u.fullname}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>{u.email}</div>
                    </div>
                    <span className="badge badge-gold">Pending</span>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      className="btn-primary" 
                      onClick={() => handleKycAction(u.id, 'approve')}
                      disabled={kycProcessing === u.id}
                      style={{ flex: 1, height: '40px', fontSize: '0.8rem', fontWeight: 800, background: 'linear-gradient(135deg, var(--emerald) 0%, var(--emerald-dark) 100%)' }}
                    >
                      <CheckCircle size={16} /> {kycProcessing === u.id ? 'Processing...' : 'Approve'}
                    </button>
                    <button 
                      className="btn-outline" 
                      onClick={() => handleKycAction(u.id, 'reject')}
                      disabled={kycProcessing === u.id}
                      style={{ flex: 1, height: '40px', fontSize: '0.8rem', fontWeight: 800, borderColor: 'var(--red)', color: 'var(--red)' }}
                    >
                      <XCircle size={16} /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* User Management */}
        <div className="flex-between" style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'Outfit' }}>User Directory</h3>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button 
              className="btn-ghost" 
              onClick={() => setShowSearch(!showSearch)}
              style={{ padding: '8px', borderRadius: '10px', background: showSearch ? 'var(--emerald-soft)' : 'transparent' }}
            >
              <Search size={18} className="text-emerald" />
            </button>
            <button className="btn-ghost text-emerald" onClick={() => setShowAllUsers(!showAllUsers)} style={{ fontSize: '0.8rem', fontWeight: 700 }}>
              {showAllUsers ? 'Show Less' : 'View All'}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {showSearch && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden', marginBottom: '16px' }}>
              <div style={{ position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search users by name, email, role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 16px 14px 44px',
                    background: 'var(--bg-secondary)',
                    border: '1.5px solid var(--border-glass)',
                    borderRadius: '16px',
                    fontSize: '0.9rem',
                    color: 'var(--text-primary)',
                    outline: 'none'
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
          {displayedUsers.map(u => {
            const kycStatus = getKycStatus(u);
            const roleBadge = getRoleBadge(u.role);
            return (
              <div key={u.id} className="card-glass" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--bg-card)', overflow: 'hidden' }}>
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.id}`} alt="avatar" style={{ width: '100%', height: '100%' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.fullname}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {u.email} • <span className={u.role === 'customer' ? 'text-emerald' : 'text-gold'}>{u.role}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <div className={`badge ${kycStatus === 'verified' ? 'badge-emerald' : kycStatus === 'rejected' ? 'badge-red' : 'badge-gold'}`}>
                    {kycStatus === 'verified' ? 'Verified' : kycStatus === 'rejected' ? 'Rejected' : 'Pending'}
                  </div>
                  <button 
                    onClick={() => setSelectedUser(u)}
                    className="btn-ghost flex-center"
                    style={{ 
                      width: '36px', height: '36px', borderRadius: '10px', 
                      background: 'var(--emerald-soft)', color: 'var(--emerald)',
                      border: '1px solid var(--emerald-glow)', padding: 0
                    }}
                  >
                    <Eye size={16} />
                  </button>
                </div>
              </div>
            );
          })}
          {filteredUsers.length === 0 && (
            <div className="card" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Search size={32} style={{ marginBottom: '12px', opacity: 0.5 }} />
              <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>No users found</p>
            </div>
          )}
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
                <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>{p.task_title || p.order?.service?.title || 'General Task'}</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 900, color: 'var(--emerald)' }}>BND {p.amount}</div>
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                From: {p.payer_name || p.order?.customer?.fullname || 'N/A'} → To: {p.receiver_name || p.order?.provider?.fullname || 'N/A'}
              </div>
              <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                <span className={`badge ${(p.payment_status || p.status) === 'released' ? 'badge-emerald' : 'badge-gold'}`}>
                  {p.payment_status || p.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Detail Modal */}
      <AnimatePresence>
        {selectedUser && (
          <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
            <motion.div 
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 400 }}
              className="bottom-sheet" onClick={e => e.stopPropagation()}
              style={{ background: 'var(--bg-card)', maxHeight: '85vh' }}
            >
              <div className="bottom-sheet-handle" />
              
              {/* User Header */}
              <div className="flex-between" style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 900, fontFamily: 'Outfit' }}>User Profile</h3>
                <button className="btn-ghost" onClick={() => setSelectedUser(null)}><X size={24} /></button>
              </div>

              {/* Avatar + Name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'var(--bg-tertiary)', overflow: 'hidden', border: '2px solid var(--emerald-glow)' }}>
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUser.id}`} alt="avatar" style={{ width: '100%', height: '100%' }} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 900 }}>{selectedUser.fullname}</h4>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                    <span className={`badge ${getRoleBadge(selectedUser.role).class}`}>
                      {getRoleBadge(selectedUser.role).label}
                    </span>
                    <span className={`badge ${getKycStatus(selectedUser) === 'verified' ? 'badge-emerald' : getKycStatus(selectedUser) === 'rejected' ? 'badge-red' : 'badge-gold'}`}>
                      {getKycStatus(selectedUser) === 'verified' ? '✓ Verified' : getKycStatus(selectedUser) === 'rejected' ? '✗ Rejected' : '⏳ Pending'}
                    </span>
                  </div>
                </div>
              </div>

              {/* User Details */}
              <div className="card-glass" style={{ padding: '20px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Mail size={18} style={{ color: 'var(--text-muted)' }} />
                    <div>
                      <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Email</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{selectedUser.email}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Phone size={18} style={{ color: 'var(--text-muted)' }} />
                    <div>
                      <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Phone</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{selectedUser.phone_number || 'Not provided'}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Calendar size={18} style={{ color: 'var(--text-muted)' }} />
                    <div>
                      <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Joined</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{new Date(selectedUser.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                    </div>
                  </div>
                  {selectedUser.profile?.location && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <MapPin size={18} style={{ color: 'var(--text-muted)' }} />
                      <div>
                        <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Location</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{selectedUser.profile.location}</div>
                      </div>
                    </div>
                  )}
                  {selectedUser.profile?.bio && (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <FileCheck size={18} style={{ color: 'var(--text-muted)', marginTop: '2px' }} />
                      <div>
                        <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Bio</div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{selectedUser.profile.bio}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* KYC Status Card */}
              <div className="card" style={{ 
                padding: '20px', marginBottom: '20px', 
                borderLeft: `4px solid ${getKycStatus(selectedUser) === 'verified' ? 'var(--emerald)' : getKycStatus(selectedUser) === 'rejected' ? 'var(--red)' : 'var(--gold)'}` 
              }}>
                <div className="flex-between" style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <UserCheck size={20} style={{ color: getKycStatus(selectedUser) === 'verified' ? 'var(--emerald)' : 'var(--gold)' }} />
                    <span style={{ fontSize: '0.9rem', fontWeight: 800 }}>KYC Verification</span>
                  </div>
                  <span className={`badge ${getKycStatus(selectedUser) === 'verified' ? 'badge-emerald' : getKycStatus(selectedUser) === 'rejected' ? 'badge-red' : 'badge-gold'}`}>
                    {selectedUser.profile?.kyc_status || 'pending'}
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.5 }}>
                  {getKycStatus(selectedUser) === 'verified' 
                    ? 'This user has been verified and has full access to the platform.'
                    : getKycStatus(selectedUser) === 'rejected'
                    ? 'This user\'s KYC was rejected. They may re-submit documents for review.'
                    : 'This user is awaiting KYC verification. Review their information and take action below.'}
                </div>
                {getKycStatus(selectedUser) !== 'verified' && (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      className="btn-primary" 
                      onClick={() => handleKycAction(selectedUser.id, 'approve')}
                      disabled={kycProcessing === selectedUser.id}
                      style={{ flex: 1, height: '44px', fontSize: '0.85rem', fontWeight: 800, background: 'linear-gradient(135deg, var(--emerald) 0%, var(--emerald-dark) 100%)' }}
                    >
                      <CheckCircle size={16} /> {kycProcessing === selectedUser.id ? '...' : 'Approve KYC'}
                    </button>
                    <button 
                      className="btn-outline" 
                      onClick={() => handleKycAction(selectedUser.id, 'reject')}
                      disabled={kycProcessing === selectedUser.id}
                      style={{ flex: 1, height: '44px', fontSize: '0.85rem', fontWeight: 800, borderColor: 'var(--red)', color: 'var(--red)' }}
                    >
                      <XCircle size={16} /> Reject
                    </button>
                  </div>
                )}
              </div>

              {/* Close */}
              <button className="btn-outline" onClick={() => setSelectedUser(null)} style={{ width: '100%', height: '50px', fontSize: '0.95rem', fontWeight: 800 }}>
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;