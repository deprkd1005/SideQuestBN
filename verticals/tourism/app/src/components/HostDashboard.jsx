import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ShieldAlert, Award, Star, Compass, User, Wallet, Bell, RefreshCw, Landmark, AlertTriangle, Edit3, PlusCircle, Calendar, FileText, QrCode, X } from 'lucide-react';
import { useTourismPayment } from '../context/TourismPaymentContext';
import { useLanguage } from '../context/LanguageContext';

// Import Host Portal Sub-Components
import HostProfileStudio from './host/HostProfileStudio';
import ActivityCreator from './host/ActivityCreator';
import AvailabilityCalendar from './host/AvailabilityCalendar';
import ComplianceUpload from './host/ComplianceUpload';
import QRScanner from './host/QRScanner';

const HostDashboard = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { dbState, host1Balance, host2Balance, resetDb, fetchDb, initializePayout } = useTourismPayment();
  const [activeHostId, setActiveHostId] = useState(() => {
    return localStorage.getItem('tourism_active_host_id') || 'usr_host_001';
  });

  // Modal active overlay state
  const [activeModal, setActiveModal] = useState(null); // profile_studio, create_activity, calendar, compliance, qr_scanner

  useEffect(() => {
    localStorage.setItem('tourism_active_host_id', activeHostId);
  }, [activeHostId]);

  useEffect(() => {
    fetchDb();
  }, [activeModal]); // refresh when modal opens/closes to reflect updates

  // Resolve current active host
  const hostUser = dbState.users.find(u => u.id === activeHostId) || {
    id: activeHostId,
    legal_name: 'Haji Ahmad bin Haji Kahar',
    aml_flag: 'CLEAR'
  };

  const hostProfile = dbState.host_profiles.find(hp => hp.user_id === activeHostId) || {
    business_name: 'Kempas Heritage Tours',
    payout_bank_name: 'BIBD',
    payout_account_number: '0015020349581',
    payout_account_name: 'Haji Ahmad bin Haji Kahar'
  };

  const hostActivities = dbState.activities.filter(a => a.host_profile_id === hostProfile.id || a.host_profile_id === hostProfile.user_id);
  const hostBookings = dbState.bookings.filter(b => {
    return hostActivities.some(act => act.id === b.activity_id);
  });

  const activeBookingsCount = hostBookings.filter(b => b.escrow_status === 'FROZEN' || b.escrow_status === 'locked' || b.escrow_status === 'Locked').length;
  const currentBalance = activeHostId === 'usr_host_001' ? host1Balance : host2Balance;

  const handleReset = async () => {
    if (window.confirm("Reset mock database and balances back to prototype default values?")) {
      await resetDb();
      fetchDb();
      alert("Mock database successfully reset!");
    }
  };

  // Called when host scans a tourist's QR ticket successfully
  const handleQRScanVerify = async (bookingId) => {
    // Invoke escrow release backend & Whitelisting Firewall checks
    const res = await initializePayout(bookingId, activeHostId, 'POCKET');
    if (res.success) {
      alert(`ESCROW RELEASED SUCCESSFULLY!\nBND ${res.data.payout_amount.toFixed(2)} payout sent to your ${hostProfile.payout_bank_name} whitelisted account.`);
      fetchDb();
    } else {
      if (res.aml_status === 'SUSPENDED_AML_FLAG') {
        alert(`SECURITY AUDIT FLAG TRIGGERED!\nWhitelisting Firewall Mismatch: Certified legal name [${hostUser.legal_name}] does not match payout bank destination name [${hostProfile.payout_account_name}]. Account has been flagged and suspended.`);
      } else {
        alert(`Payout failed: ${res.error}`);
      }
      fetchDb();
    }
  };

  return (
    <div className="app-content no-scrollbar" style={{ background: 'var(--bg-primary)', paddingBottom: '90px' }}>
      
      {/* Demo Profile Switcher */}
      <div style={{
        background: 'linear-gradient(to right, #1e293b, #0f172a)',
        padding: '16px 20px',
        color: '#94a3b8',
        fontSize: '0.78rem',
        fontWeight: 700,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>DEMO HOST SWITCHER:</span>
          <button onClick={handleReset} style={{ background: 'none', border: 'none', color: '#f87171', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}>
            <RefreshCw size={12} /> RESET DATA
          </button>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => { setActiveHostId('usr_host_001'); fetchDb(); }}
            style={{
              flex: 1, padding: '8px 12px', borderRadius: '10px',
              background: activeHostId === 'usr_host_001' ? 'var(--gold)' : '#334155',
              color: activeHostId === 'usr_host_001' ? 'black' : 'white', border: 'none', fontWeight: 800, fontSize: '0.7rem', cursor: 'pointer'
            }}
          >
            Ahmad (Whitelist Match Pass)
          </button>
          <button 
            onClick={() => { setActiveHostId('usr_host_002'); fetchDb(); }}
            style={{
              flex: 1, padding: '8px 12px', borderRadius: '10px',
              background: activeHostId === 'usr_host_002' ? '#ef4444' : '#334155',
              color: 'white', border: 'none', fontWeight: 800, fontSize: '0.7rem', cursor: 'pointer'
            }}
          >
            Sufian (Whitelist Mismatch Fail)
          </button>
        </div>
      </div>

      {/* Header */}
      <div style={{ padding: '24px 24px 20px' }}>
        <div className="flex-between" style={{ marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: 'Outfit' }}>
              Host <span style={{ color: 'var(--gold)' }}>Portal</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.88rem', marginTop: '2px' }}>
              Welcome back, {hostUser.legal_name.split(' ')[0]}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${hostUser.id}`} alt="avatar" />
            </div>
          </div>
        </div>

        {/* Security / AML Status banner */}
        <div style={{
          background: hostUser.aml_flag === 'CLEAR' ? 'rgba(74, 222, 128, 0.08)' : 'rgba(239, 68, 68, 0.1)',
          border: `1px solid ${hostUser.aml_flag === 'CLEAR' ? 'rgba(74, 222, 128, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
          padding: '14px 18px',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '24px'
        }}>
          {hostUser.aml_flag === 'CLEAR' ? (
            <>
              <ShieldCheck size={26} color="#4ade80" />
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#4ade80' }}>AML IDENTITY: ACTIVE / CLEAR</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>BruneiID e-KYC matches registered bank account.</div>
              </div>
            </>
          ) : (
            <>
              <ShieldAlert size={26} color="#f87171" />
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#f87171' }}>AML IDENTITY: BLOCKED / SUSPENDED</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500, lineHeight: 1.3 }}>
                  Flagged by Whitelisting Firewall. Declared payout account name mismatch.
                </div>
              </div>
            </>
          )}
        </div>

        {/* Earnings Card & Active Bookings */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px' }}>
          <div className="card" style={{ padding: '20px', background: 'white' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Net Earnings</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--gold)', fontFamily: 'Outfit' }}>
              BND {currentBalance.toFixed(2)}
            </div>
          </div>
          
          <div className="card" style={{ padding: '20px', background: 'white' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Active Escrows</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'Outfit' }}>
              {activeBookingsCount}
            </div>
          </div>
        </div>

        {/* Quick Tools Action Center Grid */}
        <h3 style={{ fontSize: '1rem', fontWeight: 900, fontFamily: 'Outfit', marginBottom: '14px' }}>MSME Host Action Center</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '28px' }}>
          {/* Profile Studio */}
          <button 
            onClick={() => setActiveModal('profile_studio')}
            style={{
              background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)',
              borderRadius: '20px', padding: '16px', color: 'white', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-start', textAlign: 'left'
            }}
          >
            <div style={{ background: 'rgba(255, 215, 0, 0.1)', color: 'var(--gold)', padding: '8px', borderRadius: '12px' }}>
              <Edit3 size={20} />
            </div>
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, display: 'block' }}>Profile Studio</span>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Customize cover & tags</span>
            </div>
          </button>

          {/* Activity Creator */}
          <button 
            onClick={() => setActiveModal('create_activity')}
            style={{
              background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)',
              borderRadius: '20px', padding: '16px', color: 'white', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-start', textAlign: 'left'
            }}
          >
            <div style={{ background: 'rgba(255, 215, 0, 0.1)', color: 'var(--gold)', padding: '8px', borderRadius: '12px' }}>
              <PlusCircle size={20} />
            </div>
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, display: 'block' }}>Create Listing</span>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Launch heritage quests</span>
            </div>
          </button>

          {/* Availability Calendar */}
          <button 
            onClick={() => setActiveModal('calendar')}
            style={{
              background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)',
              borderRadius: '20px', padding: '16px', color: 'white', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-start', textAlign: 'left'
            }}
          >
            <div style={{ background: 'rgba(255, 215, 0, 0.1)', color: 'var(--gold)', padding: '8px', borderRadius: '12px' }}>
              <Calendar size={20} />
            </div>
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, display: 'block' }}>Availability Horizon</span>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Block dates & view slots</span>
            </div>
          </button>

          {/* Compliance Docs */}
          <button 
            onClick={() => setActiveModal('compliance')}
            style={{
              background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)',
              borderRadius: '20px', padding: '16px', color: 'white', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-start', textAlign: 'left'
            }}
          >
            <div style={{ background: 'rgba(255, 215, 0, 0.1)', color: 'var(--gold)', padding: '8px', borderRadius: '12px' }}>
              <FileText size={20} />
            </div>
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, display: 'block' }}>Compliance DOCS</span>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Verify ROC / Halal license</span>
            </div>
          </button>

          {/* QR Ticket Scanner */}
          <button 
            onClick={() => setActiveModal('qr_scanner')}
            style={{
              gridColumn: 'span 2',
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,215,0,0.3)',
              borderRadius: '20px', padding: '18px 24px', color: 'white', cursor: 'pointer',
              display: 'flex', gap: '16px', alignItems: 'center', textAlign: 'left',
              boxShadow: '0 8px 24px rgba(255,215,0,0.05)'
            }}
          >
            <div style={{ background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)', color: 'black', padding: '12px', borderRadius: '14px' }}>
              <QrCode size={24} />
            </div>
            <div>
              <span style={{ fontSize: '0.95rem', fontWeight: 900, display: 'block', color: 'var(--gold)' }}>Scan Tourist Ticket QR</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Instantly release escrow funds upon matching signature</span>
            </div>
          </button>
        </div>

        {/* Payout Details */}
        <div className="flex-between" style={{ marginBottom: '14px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 900, fontFamily: 'Outfit' }}>Payout Account Registration</h3>
        </div>

        <div className="card" style={{ padding: '20px', background: 'white', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--gold-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Landmark size={20} color="var(--gold)" />
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>{hostProfile.payout_bank_name} Savings</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Account: ****{hostProfile.payout_account_number.slice(-4)}</div>
            </div>
          </div>
          
          <div style={{ background: 'var(--bg-tertiary)', padding: '12px 14px', borderRadius: '14px', border: '1px solid var(--border-glass)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: '4px' }}>
              <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>E-KYC Verified Legal Name:</span>
              <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{hostUser.legal_name}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem' }}>
              <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>Declared Bank Account Name:</span>
              <span style={{ fontWeight: 800, color: hostUser.id === 'usr_host_002' ? 'var(--red)' : 'var(--text-primary)' }}>
                {hostProfile.payout_account_name}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Overlays / Modals */}
      <AnimatePresence>
        {activeModal && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ width: '100%', maxWidth: '440px', position: 'relative' }}>
              
              {/* Close Button */}
              <button 
                onClick={() => setActiveModal(null)}
                style={{
                  position: 'absolute',
                  top: '-45px',
                  right: '10px',
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  color: 'white',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={20} />
              </button>

              {activeModal === 'profile_studio' && (
                <HostProfileStudio onSave={(updated) => {
                  setActiveModal(null);
                }} />
              )}

              {activeModal === 'create_activity' && (
                <ActivityCreator 
                  onCreate={(newAct) => {
                    // Inject newly created activity locally
                    dbState.activities.push(newAct);
                    setActiveModal(null);
                    alert("Experience offering successfully published!");
                  }} 
                  onCancel={() => setActiveModal(null)} 
                />
              )}

              {activeModal === 'calendar' && (
                <AvailabilityCalendar />
              )}

              {activeModal === 'compliance' && (
                <ComplianceUpload />
              )}

              {activeModal === 'qr_scanner' && (
                <QRScanner 
                  bookings={hostBookings}
                  onScanSuccess={handleQRScanVerify} 
                  onCancel={() => setActiveModal(null)} 
                />
              )}

            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default HostDashboard;
