import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Clock, Calendar, CheckCircle, ShieldAlert, ShieldCheck, Lock, AlertTriangle, ArrowRightCircle, Sparkles, X } from 'lucide-react';
import { useTourismPayment } from '../context/TourismPaymentContext';

const HostRequests = () => {
  const { dbState, initializePayout, fetchDb } = useTourismPayment();
  const [activeHostId, setActiveHostId] = useState(() => {
    return localStorage.getItem('tourism_active_host_id') || 'usr_host_001';
  });

  // State to track if whitelisting overlay is open
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [payoutRoute, setPayoutRoute] = useState('POCKET'); // POCKET or DING
  const [payoutInProgress, setPayoutInProgress] = useState(false);
  const [payoutResult, setPayoutResult] = useState(null); // null, success, mismatch, error

  // Sync activeHostId changes
  useEffect(() => {
    const handleStorageChange = () => {
      setActiveHostId(localStorage.getItem('tourism_active_host_id') || 'usr_host_001');
    };
    window.addEventListener('storage', handleStorageChange);
    // Interval check in case of internal transitions
    const interval = setInterval(handleStorageChange, 500);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    fetchDb();
  }, []);

  const hostUser = dbState.users.find(u => u.id === activeHostId) || {
    id: activeHostId,
    legal_name: 'Haji Ahmad bin Haji Kahar',
    aml_flag: 'CLEAR'
  };

  const hostProfile = dbState.host_profiles.find(hp => hp.user_id === activeHostId) || {
    business_name: 'Heritage Crafts',
    payout_bank_name: 'BIBD',
    payout_account_number: '0000000000000',
    payout_account_name: 'Haji Ahmad bin Haji Kahar'
  };

  const hostActivities = dbState.activities.filter(a => a.host_profile_id === hostProfile.id || a.host_profile_id === hostProfile.user_id);
  const hostBookings = dbState.bookings.filter(b => {
    return hostActivities.some(act => act.id === b.activity_id);
  });

  const handleOpenPayout = (booking) => {
    setSelectedBooking(booking);
    setPayoutResult(null);
  };

  const handleDisburse = async () => {
    if (!selectedBooking) return;
    setPayoutInProgress(true);
    setPayoutResult(null);

    // Call context to initialize payout via backend firewall
    const res = await initializePayout(
      selectedBooking.id,
      activeHostId,
      payoutRoute
    );

    setPayoutInProgress(false);
    if (res.success) {
      setPayoutResult({
        type: 'success',
        token: res.data.payout_auth_token,
        receipt: res.data.partner_receipt,
        message: res.data.message
      });
      await fetchDb();
    } else {
      setPayoutResult({
        type: 'mismatch',
        error: res.error,
        aml_status: res.aml_status
      });
      await fetchDb();
    }
  };

  const getStatusDetails = (status) => {
    switch (status?.toUpperCase()) {
      case 'FROZEN':
        return {
          color: 'var(--gold)',
          label: 'FROZEN ESCROW',
          icon: Lock
        };
      case 'DISPUTED':
        return {
          color: 'var(--red)',
          label: 'DISPUTED / FROZEN',
          icon: ShieldAlert
        };
      case 'RELEASED':
        return {
          color: 'var(--emerald)',
          label: 'RELEASED POCKET',
          icon: ShieldCheck
        };
      default:
        return {
          color: 'var(--text-muted)',
          label: 'PENDING',
          icon: Clock
        };
    }
  };

  return (
    <div className="app-content no-scrollbar" style={{ background: 'var(--bg-primary)' }}>
      {/* Title */}
      <div style={{ padding: '40px 24px 20px' }}>
        <h1 className="section-title" style={{ padding: 0 }}>Bookings & Payouts</h1>
        <p className="section-subtitle" style={{ padding: 0, marginTop: '4px' }}>Disbursement Control Center</p>
      </div>

      {/* Bookings received list */}
      <div style={{ padding: '0 24px 24px' }}>
        {hostBookings.length === 0 ? (
          <div className="card-glass" style={{ padding: '60px 24px', textAlign: 'center', background: 'white' }}>
            <Briefcase size={40} className="text-muted" style={{ marginBottom: '16px', opacity: 0.3 }} />
            <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>No bookings received yet from tourists.</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              Switch to the Tourist portal at the top and book Kampong Ayer Wooden Boat Building!
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {hostBookings.map(booking => {
              const activity = dbState.activities.find(a => a.id === booking.activity_id) || { title: 'Heritage Experience' };
              const statusDetails = getStatusDetails(booking.escrow_status);
              const StatusIcon = statusDetails.icon;

              return (
                <div 
                  key={booking.id} 
                  className="card" 
                  style={{ background: 'white', borderLeft: `5px solid ${statusDetails.color}` }}
                >
                  <div className="flex-between" style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: statusDetails.color, fontSize: '0.7rem', fontWeight: 800 }}>
                      <StatusIcon size={14} />
                      {statusDetails.label}
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>ID: {booking.id}</span>
                  </div>

                  <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '6px', color: 'var(--text-primary)' }}>{activity.title}</h4>
                  
                  {/* Logistics */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={13} />
                      <span>{booking.booking_date}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={13} />
                      <span>{booking.booking_time_slot}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span>Guests: {booking.participant_count}</span>
                    </div>
                  </div>

                  {/* Financial breakdown */}
                  <div style={{ background: 'var(--bg-tertiary)', padding: '12px', borderRadius: '12px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Tourist Paid:</span>
                      <span style={{ fontWeight: 700 }}>BND {booking.gross_amount.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Platform Fee (8%):</span>
                      <span style={{ color: 'var(--red)', fontWeight: 700 }}>-BND {booking.platform_fee_amount.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', paddingTop: '4px', borderTop: '1px dashed var(--border-color)', fontWeight: 800 }}>
                      <span>My Net Payout:</span>
                      <span style={{ color: 'var(--gold)' }}>BND {booking.host_payout_amount.toFixed(2)}</span>
                    </div>
                  </div>

                  {booking.escrow_status === 'FROZEN' && (
                    <button 
                      onClick={() => handleOpenPayout(booking)}
                      className="btn-primary" 
                      style={{ width: '100%', height: '48px', fontSize: '0.85rem', background: 'var(--gold)', boxShadow: '0 8px 16px var(--gold-glow)' }}
                    >
                      <ArrowRightCircle size={16} /> Initialize Payout verification
                    </button>
                  )}

                  {booking.escrow_status === 'DISPUTED' && (
                    <div style={{ padding: '10px 14px', background: 'rgba(239, 68, 68, 0.08)', borderRadius: '10px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <AlertTriangle size={16} color="var(--red)" />
                      <span style={{ fontSize: '0.75rem', color: 'var(--red)', fontWeight: 700 }}>Payout Blocked: AML Mismatch Triggered.</span>
                    </div>
                  )}

                  {booking.escrow_status === 'RELEASED' && (
                    <div style={{ padding: '10px 14px', background: 'var(--emerald-soft)', borderRadius: '10px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <CheckCircle size={16} color="var(--emerald)" />
                      <span style={{ fontSize: '0.75rem', color: 'var(--emerald)', fontWeight: 700 }}>Funds Released via {booking.wallet_provider}.</span>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Payout Whitelisting Verification Modal */}
      <AnimatePresence>
        {selectedBooking && (
          <div className="modal-overlay" onClick={() => setSelectedBooking(null)}>
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bottom-sheet"
              style={{ maxHeight: '90vh' }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, fontFamily: 'Outfit' }}>Bank Whitelist Verification</h3>
                <button onClick={() => setSelectedBooking(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>

              {/* Step 1: Matching status */}
              <div style={{ background: 'var(--bg-tertiary)', padding: '16px', borderRadius: '16px', marginBottom: '20px' }}>
                <h4 style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Security Audit Data</h4>
                <div style={{ fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Host Legal Name (E-KYC):</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{hostUser.legal_name}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Bank Account Holder:</span>
                    <strong style={{ color: activeHostId === 'usr_host_002' ? 'var(--red)' : 'var(--text-primary)' }}>{hostProfile.payout_account_name}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Net Payout Amount:</span>
                    <strong style={{ color: 'var(--gold)' }}>BND {selectedBooking.host_payout_amount.toFixed(2)}</strong>
                  </div>
                </div>
              </div>

              {/* Show results if processed */}
              {payoutResult ? (
                <div>
                  {payoutResult.type === 'success' ? (
                    <div style={{ textAlign: 'center', padding: '12px 0' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--emerald-soft)', color: 'var(--emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                        <ShieldCheck size={28} />
                      </div>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--emerald)', fontFamily: 'Outfit' }}>Identity Verified Passed</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '8px 0 16px' }}>
                        Names match exactly. Payout authorized via API to partner wallet.
                      </p>

                      {/* Cryptographic Signature Release token */}
                      <div style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '12px', textAlign: 'left', marginBottom: '24px' }}>
                        <span style={{ display: 'block', fontSize: '0.62rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>Cryptographic Release Signature (Base64)</span>
                        <div style={{ fontSize: '0.7rem', color: '#334155', fontFamily: 'monospace', wordBreak: 'break-all', maxHeight: '60px', overflowY: 'auto' }} className="no-scrollbar">
                          {payoutResult.token}
                        </div>
                      </div>

                      <button onClick={() => setSelectedBooking(null)} className="btn-primary" style={{ width: '100%', height: '52px', background: 'var(--emerald)' }}>
                        Close Control
                      </button>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '12px 0' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--red)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                        <ShieldAlert size={28} />
                      </div>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--red)', fontFamily: 'Outfit' }}>AML FREEZE TRIGGERED</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '8px 0 16px', lineHeight: 1.4 }}>
                        Name mismatch detected: <strong style={{ color: 'var(--text-primary)' }}>{hostUser.legal_name}</strong> vs <strong style={{ color: 'var(--red)' }}>{hostProfile.payout_account_name}</strong>. The Payout Whitelisting Firewall has frozen this transaction. Host account flag suspended.
                      </p>

                      <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.05)', border: '1px dashed var(--red)', borderRadius: '12px', display: 'flex', gap: '8px', alignItems: 'center', textAlign: 'left', marginBottom: '24px' }}>
                        <AlertTriangle size={18} color="var(--red)" style={{ flexShrink: 0 }} />
                        <span style={{ fontSize: '0.72rem', color: 'var(--red)', fontWeight: 600 }}>
                          Audit log created. Bookings locked in DISPUTED status.
                        </span>
                      </div>

                      <button onClick={() => setSelectedBooking(null)} className="btn-primary" style={{ width: '100%', height: '52px', background: 'var(--red)' }}>
                        Close Control
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>Select Partner Wallet API Route</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <button 
                        onClick={() => setPayoutRoute('POCKET')}
                        style={{
                          padding: '14px', borderRadius: '12px', cursor: 'pointer', fontWeight: 800, fontSize: '0.8rem',
                          border: payoutRoute === 'POCKET' ? '2.5px solid var(--gold)' : '1px solid var(--border-color)',
                          background: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px'
                        }}
                      >
                        <Sparkles size={16} color={payoutRoute === 'POCKET' ? 'var(--gold)' : '#64748b'} />
                        Pocket Wallet
                      </button>
                      <button 
                        onClick={() => setPayoutRoute('DING')}
                        style={{
                          padding: '14px', borderRadius: '12px', cursor: 'pointer', fontWeight: 800, fontSize: '0.8rem',
                          border: payoutRoute === 'DING' ? '2.5px solid var(--gold)' : '1px solid var(--border-color)',
                          background: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px'
                        }}
                      >
                        <Sparkles size={16} color={payoutRoute === 'DING' ? 'var(--gold)' : '#64748b'} />
                        Ding Wallet
                      </button>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: '24px' }}>
                    Clicking disburse will run an automated whitelist matching check between the verified E-KYC Legal identity and the target bank account destination holder name.
                  </p>

                  <button 
                    onClick={handleDisburse}
                    className="btn-primary" 
                    style={{ width: '100%', height: '56px', background: 'var(--gold)' }}
                    disabled={payoutInProgress}
                  >
                    {payoutInProgress ? 'Validating Bank Whitelist...' : 'Verify & Disburse Funds'}
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default HostRequests;
