import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet as WalletIcon, ArrowUpCircle, ArrowDownCircle, Shield, Clock, ChevronRight, Download, Info, CreditCard } from 'lucide-react';
import { useTourismPayment } from '../context/TourismPaymentContext';

const HostWallet = () => {
  const { dbState, host1Balance, host2Balance, setHost1Balance, setHost2Balance, fetchDb } = useTourismPayment();
  const [activeHostId, setActiveHostId] = useState(() => {
    return localStorage.getItem('tourism_active_host_id') || 'usr_host_001';
  });

  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [stage, setStage] = useState('idle'); // idle, transferring, success

  // Listen to profile changes in dashboard
  useEffect(() => {
    const handleStorageChange = () => {
      setActiveHostId(localStorage.getItem('tourism_active_host_id') || 'usr_host_001');
    };
    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(handleStorageChange, 500);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    fetchDb();
  }, []);

  // Resolve current active host
  const hostUser = dbState.users.find(u => u.id === activeHostId) || {
    id: activeHostId,
    legal_name: 'Haji Ahmad bin Haji Kahar',
    aml_flag: 'CLEAR'
  };

  const hostProfile = dbState.host_profiles.find(hp => hp.user_id === activeHostId) || {
    business_name: 'Heritage Crafts',
    payout_bank_name: 'BIBD',
    payout_account_number: '0015020349581',
    payout_account_name: 'Haji Ahmad bin Haji Kahar'
  };

  const currentBalance = activeHostId === 'usr_host_001' ? host1Balance : host2Balance;

  // Calculate active escrow amount for this host (bookings in FROZEN/DISPUTED state)
  const hostActivities = dbState.activities.filter(a => a.host_profile_id === hostProfile.id || a.host_profile_id === hostProfile.user_id);
  const hostBookings = dbState.bookings.filter(b => {
    return hostActivities.some(act => act.id === b.activity_id);
  });

  const escrowAmount = hostBookings
    .filter(b => b.escrow_status === 'FROZEN' || b.escrow_status === 'DISPUTED')
    .reduce((sum, b) => sum + parseFloat(b.host_payout_amount), 0);

  const availableBalance = currentBalance;
  const totalBalance = currentBalance + escrowAmount;

  // Synthesize transactions
  const transactions = [
    {
      id: 'tx_init',
      type: 'credit',
      description: 'Host Welcome Bonus',
      amount: activeHostId === 'usr_host_001' ? 150.00 : 80.00,
      date: new Date('2026-06-19T08:00:00Z').toISOString()
    },
    ...hostBookings
      .filter(b => b.escrow_status === 'RELEASED')
      .map(b => ({
        id: `tx_${b.id}`,
        type: 'credit',
        description: `Escrow Released: ${b.activity_id.replace('act_', '').replace('_', ' ').toUpperCase()}`,
        amount: parseFloat(b.host_payout_amount),
        date: b.escrow_released_at || b.created_at
      }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleWithdraw = () => {
    const amt = parseFloat(withdrawAmount);
    if (isNaN(amt) || amt <= 0 || amt > currentBalance) {
      alert("Invalid withdrawal amount or insufficient available funds.");
      return;
    }

    if (hostUser.aml_flag !== 'CLEAR') {
      alert("WITHDRAWAL BLOCKED: Your account has been suspended due to AML verification failure. Please resolve the name dispute first.");
      return;
    }

    setStage('transferring');
    setTimeout(() => {
      if (activeHostId === 'usr_host_001') {
        setHost1Balance(prev => prev - amt);
      } else {
        setHost2Balance(prev => prev - amt);
      }
      setStage('success');
      setTimeout(() => {
        setShowWithdraw(false);
        setStage('idle');
        setWithdrawAmount('');
      }, 1200);
    }, 1500);
  };

  return (
    <div className="app-content no-scrollbar" style={{ background: 'var(--bg-primary)' }}>
      
      {/* Balance Section */}
      <div style={{ padding: '40px 24px 24px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="flex-between" style={{ marginBottom: '24px' }}>
          <div>
            <h1 className="section-title" style={{ padding: 0 }}>My Wallet</h1>
            <p className="section-subtitle" style={{ padding: 0, marginTop: '4px' }}>Host Payout Ledger</p>
          </div>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Info size={18} className="text-muted" />
          </div>
        </div>

        {/* Digital Card - Premium Design (Host Theme = Gold) */}
        <motion.div 
          whileHover={{ y: -5 }}
          style={{ 
            padding: '24px', 
            background: 'linear-gradient(135deg, var(--gold) 0%, #b45309 100%)', 
            borderRadius: '24px',
            boxShadow: '0 20px 40px var(--gold-soft)',
            position: 'relative',
            overflow: 'hidden',
            color: 'white',
            aspectRatio: '1.6 / 1',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.1, background: 'radial-gradient(circle at 20% 20%, white 0%, transparent 40%)' }} />
          
          <div className="flex-between" style={{ position: 'relative' }}>
            <div style={{ fontWeight: 950, fontSize: '1.15rem', letterSpacing: '1px', fontFamily: 'Outfit' }}>SIDEQUEST<span style={{ opacity: 0.75 }}>.PROVIDER</span></div>
            <Shield size={24} fill="rgba(255,255,255,0.3)" stroke="none" />
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{ fontSize: '0.75rem', opacity: 0.8, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>Available Balance</div>
            <div style={{ fontSize: '2.4rem', fontWeight: 900, display: 'flex', alignItems: 'baseline', gap: '8px', fontFamily: 'Outfit' }}>
              <span style={{ fontSize: '1.2rem', opacity: 0.7 }}>BND</span>
              {availableBalance.toFixed(2)}
            </div>
          </div>

          <div className="flex-between" style={{ position: 'relative' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, letterSpacing: '2px', fontFamily: 'monospace' }}>
              **** **** **** {hostProfile.payout_account_number.slice(-4)}
            </div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, opacity: 0.9 }}>{hostProfile.payout_account_name.toUpperCase()}</div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button className="btn-primary" style={{ flex: 1, height: '52px', borderRadius: '16px', background: 'var(--gold)', boxShadow: '0 10px 20px var(--gold-soft)' }} onClick={() => setShowWithdraw(true)}>
            <Download size={18} /> Withdraw to bank
          </button>
        </div>
      </div>

      <div style={{ padding: '24px' }}>
        {/* Secondary Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div className="card" style={{ padding: '16px', background: 'white' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>Total Ledger</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, fontFamily: 'Outfit' }}>BND {totalBalance.toFixed(2)}</div>
          </div>
          <div className="card" style={{ padding: '16px', borderColor: escrowAmount > 0 ? 'var(--gold)' : 'var(--border-color)', background: 'white' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>Active Escrows</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: escrowAmount > 0 ? 'var(--gold)' : 'var(--text-primary)', fontFamily: 'Outfit' }}>
              BND {escrowAmount.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Escrow Locks held */}
        {escrowAmount > 0 && (
          <div className="card-glass" style={{ marginBottom: '32px', borderColor: 'var(--gold-soft)', padding: '20px' }}>
            <div className="flex-between" style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'var(--gold-soft)', color: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Shield size={18} />
                </div>
                <span style={{ fontSize: '0.95rem', fontWeight: 800 }}>Escrows Frozen</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--gold)' }}>
                <Clock size={14} className="animated-pulse" /> Pending Release
              </div>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '16px' }}>
              Escrow funds for active bookings are held securely in client-side vaults. Verify the booking and run bank name checks to trigger disbursement.
            </p>
            <div style={{ width: '100%', height: '6px', background: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                style={{ height: '100%', background: 'var(--gold)', boxShadow: '0 0 10px var(--gold-glow)' }}
              />
            </div>
          </div>
        )}

        {/* Ledger logs */}
        <div className="flex-between" style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'Outfit' }}>Ledger Activity</h3>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Verified Ledger</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {transactions.map(tx => (
            <div key={tx.id} className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', background: 'white' }}>
              <div style={{ 
                width: '44px', 
                height: '44px', 
                borderRadius: '12px', 
                background: 'var(--gold-soft)',
                color: 'var(--gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ArrowDownCircle size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>{tx.description}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {new Date(tx.date).toLocaleDateString('en-BN', { day: 'numeric', month: 'short' })} • Escrow Verified
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--gold)', fontFamily: 'Outfit' }}>
                  +BND {tx.amount.toFixed(2)}
                </div>
                <span className="badge badge-gold" style={{ fontSize: '0.55rem', padding: '2px 6px' }}>RELEASED</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Withdraw Modal */}
      <AnimatePresence>
        {showWithdraw && (
          <div className="modal-overlay" onClick={() => setShowWithdraw(false)}>
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bottom-sheet"
              onClick={e => e.stopPropagation()}
            >
              <div className="sheet-handle" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '24px', fontFamily: 'Outfit' }}>Withdraw to Local Bank Account</h3>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '12px', display: 'block' }}>Destination Bank Account</label>
                <div className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', borderColor: 'var(--gold)', background: 'var(--bg-tertiary)' }}>
                  <div style={{ width: '40px', height: '24px', background: '#ccc', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 900 }}>
                    {hostProfile.payout_bank_name}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800 }}>{hostProfile.payout_account_name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {hostProfile.payout_bank_name} ****{hostProfile.payout_account_number.slice(-4)}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '12px', display: 'block' }}>Amount (BND)</label>
                <input 
                  type="number" 
                  placeholder="0.00" 
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  style={{ width: '100%', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '16px', fontSize: '1.5rem', fontWeight: 900, textAlign: 'center', outline: 'none' }}
                />
              </div>

              <button 
                className="btn-primary" 
                style={{ width: '100%', height: '56px', background: 'var(--gold)' }}
                onClick={handleWithdraw}
                disabled={stage !== 'idle'}
              >
                {stage === 'idle' && 'Confirm Bank Withdrawal'}
                {stage === 'transferring' && 'Authorizing bank transfer...'}
                {stage === 'success' && 'Transfer Success! ✅'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default HostWallet;
