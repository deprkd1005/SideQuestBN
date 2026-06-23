import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet as WalletIcon, ArrowUpCircle, ArrowDownCircle, Shield, Clock, ChevronRight, Download, Plus, Info, CreditCard } from 'lucide-react';
import { useTourismPayment } from '../context/TourismPaymentContext';

const TouristWallet = () => {
  const { travelerBalance, dbState, setTravelerBalance, resetDb } = useTourismPayment();
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showTopUp, setShowTopUp] = useState(false);
  
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [topUpAmount, setTopUpAmount] = useState('');
  const [bankName, setBankName] = useState('BIBD');
  
  const [stage, setStage] = useState('idle'); // idle, transferring, success

  // Calculate active escrow amount for tourist (bookings in FROZEN/DISPUTED state)
  const travelerBookings = dbState.bookings.filter(b => b.tourist_user_id === 'usr_traveler_001');
  const escrowAmount = travelerBookings
    .filter(b => b.escrow_status === 'FROZEN' || b.escrow_status === 'DISPUTED')
    .reduce((sum, b) => sum + parseFloat(b.gross_amount), 0);

  const availableBalance = travelerBalance;
  const totalBalance = travelerBalance + escrowAmount;

  // Synthesize transactions from balance top-ups & bookings
  const transactions = [
    {
      id: 'tx_init',
      type: 'credit',
      description: 'Welcome Bonus Credit',
      amount: 250.00,
      date: new Date('2026-06-19T08:00:00Z').toISOString()
    },
    ...travelerBookings.map(b => ({
      id: `tx_${b.id}`,
      type: 'debit',
      description: `Held in Escrow: ${b.activity_id.replace('act_', '').replace('_', ' ').toUpperCase()}`,
      amount: parseFloat(b.gross_amount),
      date: b.created_at
    }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleWithdraw = () => {
    const amt = parseFloat(withdrawAmount);
    if (isNaN(amt) || amt <= 0 || amt > travelerBalance) {
      alert("Invalid withdrawal amount or insufficient available funds.");
      return;
    }
    setStage('transferring');
    setTimeout(() => {
      setTravelerBalance(prev => prev - amt);
      setStage('success');
      setTimeout(() => {
        setShowWithdraw(false);
        setStage('idle');
        setWithdrawAmount('');
      }, 1200);
    }, 1500);
  };

  const handleTopUp = () => {
    const amt = parseFloat(topUpAmount);
    if (isNaN(amt) || amt <= 0) {
      alert("Please enter a valid deposit amount.");
      return;
    }
    setStage('transferring');
    setTimeout(() => {
      setTravelerBalance(prev => prev + amt);
      setStage('success');
      setTimeout(() => {
        setShowTopUp(false);
        setStage('idle');
        setTopUpAmount('');
      }, 1200);
    }, 1500);
  };

  return (
    <div className="app-content no-scrollbar" style={{ background: 'var(--bg-primary)' }}>
      
      {/* Balance Section */}
      <div style={{ padding: '40px 24px 24px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="flex-between" style={{ marginBottom: '24px' }}>
          <div>
            <h1 className="section-title" style={{ padding: 0 }}>My Pocket</h1>
            <p className="section-subtitle" style={{ padding: 0, marginTop: '4px' }}>Traveler Payment Dashboard</p>
          </div>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Info size={18} className="text-muted" />
          </div>
        </div>

        {/* Digital Card - Premium Design */}
        <motion.div 
          whileHover={{ y: -5 }}
          style={{ 
            padding: '24px', 
            background: 'linear-gradient(135deg, var(--emerald) 0%, #065f46 100%)', 
            borderRadius: '24px',
            boxShadow: '0 20px 40px var(--emerald-glow)',
            position: 'relative',
            overflow: 'hidden',
            color: 'white',
            aspectRatio: '1.6 / 1',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          {/* Card texture overlay */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.1, background: 'radial-gradient(circle at 20% 20%, white 0%, transparent 40%)' }} />
          
          <div className="flex-between" style={{ position: 'relative' }}>
            <div style={{ fontWeight: 900, fontSize: '1.15rem', letterSpacing: '1px', fontFamily: 'Outfit' }}>SIDEQUEST<span style={{ opacity: 0.7 }}>.TOURISM</span></div>
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
            <div style={{ fontSize: '0.9rem', fontWeight: 600, letterSpacing: '2px', fontFamily: 'monospace' }}>**** **** **** 5001</div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, opacity: 0.9 }}>SARAH SMITH</div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button className="btn-primary" style={{ flex: 1, height: '52px', borderRadius: '16px', background: 'var(--emerald)', boxShadow: '0 10px 20px var(--emerald-glow)' }} onClick={() => setShowTopUp(true)}>
            <Plus size={18} /> Top Up
          </button>
          <button className="btn-outline" style={{ flex: 1, height: '52px', borderRadius: '16px', borderColor: 'var(--border-color)' }} onClick={() => setShowWithdraw(true)}>
            <Download size={18} /> Withdraw
          </button>
        </div>
      </div>

      <div style={{ padding: '24px' }}>
        {/* Secondary Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div className="card" style={{ padding: '16px', background: 'white' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>Total Funds</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, fontFamily: 'Outfit' }}>BND {totalBalance.toFixed(2)}</div>
          </div>
          <div className="card" style={{ padding: '16px', borderColor: escrowAmount > 0 ? 'var(--emerald)' : 'var(--border-color)', background: 'white' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>Escrow Locked</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: escrowAmount > 0 ? 'var(--emerald)' : 'var(--text-primary)', fontFamily: 'Outfit' }}>
              BND {escrowAmount.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Escrow Progress Visualization */}
        {escrowAmount > 0 && (
          <div className="card-glass" style={{ marginBottom: '32px', borderColor: 'var(--emerald-soft)', padding: '20px' }}>
            <div className="flex-between" style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'var(--emerald-soft)', color: 'var(--emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Shield size={18} />
                </div>
                <span style={{ fontSize: '0.95rem', fontWeight: 800 }}>Escrow Firewall Active</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--emerald)' }}>
                <Clock size={14} className="animated-pulse" /> Cryptographic Lock
              </div>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '16px' }}>
              Your funds are securely frozen in the SideQuest Escrow Firewall. Funds will automatically dispatch to local hosts upon booking verification.
            </p>
            <div style={{ width: '100%', height: '6px', background: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                style={{ height: '100%', background: 'var(--emerald)', boxShadow: '0 0 10px var(--emerald-glow)' }}
              />
            </div>
          </div>
        )}

        {/* History */}
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
                background: tx.type === 'credit' ? 'var(--emerald-soft)' : 'rgba(239,68,68,0.1)',
                color: tx.type === 'credit' ? 'var(--emerald)' : 'var(--red)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {tx.type === 'credit' ? <ArrowDownCircle size={20} /> : <ArrowUpCircle size={20} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>{tx.description}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {new Date(tx.date).toLocaleDateString('en-BN', { day: 'numeric', month: 'short' })} • {tx.type === 'credit' ? 'Pocket Load' : 'Escrow Hold'}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1rem', fontWeight: 900, color: tx.type === 'credit' ? 'var(--emerald)' : 'var(--red)', fontFamily: 'Outfit' }}>
                  {tx.type === 'credit' ? '+' : '-'} BND {tx.amount.toFixed(2)}
                </div>
                <span className="badge badge-emerald" style={{ fontSize: '0.55rem', padding: '2px 6px' }}>SECURE</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Up Bottom Sheet Modal */}
      <AnimatePresence>
        {showTopUp && (
          <div className="modal-overlay" onClick={() => setShowTopUp(false)}>
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bottom-sheet"
              onClick={e => e.stopPropagation()}
            >
              <div className="sheet-handle" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '24px', fontFamily: 'Outfit' }}>Top Up via bank transfer</h3>
              
              <div style={{ marginBottom: '20px' }}>
                <label className="input-group label" style={{ fontWeight: 800, fontSize: '0.7rem' }}>Select Bank</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <button 
                    onClick={() => setBankName('BIBD')}
                    style={{ padding: '12px', borderRadius: '12px', border: bankName === 'BIBD' ? '2px solid var(--emerald)' : '1px solid var(--border-color)', background: 'white', fontWeight: 800, cursor: 'pointer' }}
                  >
                    BIBD QuickPay
                  </button>
                  <button 
                    onClick={() => setBankName('Baiduri')}
                    style={{ padding: '12px', borderRadius: '12px', border: bankName === 'Baiduri' ? '2px solid var(--emerald)' : '1px solid var(--border-color)', background: 'white', fontWeight: 800, cursor: 'pointer' }}
                  >
                    Baiduri Transfer
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label className="input-group label" style={{ fontWeight: 800, fontSize: '0.7rem' }}>Amount (BND)</label>
                <input 
                  type="number" 
                  placeholder="0.00" 
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  style={{ width: '100%', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '16px', fontSize: '1.5rem', fontWeight: 900, textAlign: 'center', outline: 'none' }}
                />
              </div>

              <button 
                className="btn-primary" 
                style={{ width: '100%', height: '56px', background: 'var(--emerald)' }}
                onClick={handleTopUp}
                disabled={stage !== 'idle'}
              >
                {stage === 'idle' && 'Load Pocket Balance'}
                {stage === 'transferring' && 'Authorizing Transfer...'}
                {stage === 'success' && 'Deposit Success! ✅'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Withdraw Bottom Sheet Modal */}
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
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '24px', fontFamily: 'Outfit' }}>Withdraw to Local Bank</h3>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '12px', display: 'block' }}>Destination Account</label>
                <div className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', borderColor: 'var(--emerald)', background: 'var(--bg-tertiary)' }}>
                  <div style={{ width: '40px', height: '24px', background: '#ccc', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 900 }}>BIBD</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800 }}>Sarah Smith savings</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>BIBD **** 4958</div>
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
                style={{ width: '100%', height: '56px', background: 'var(--emerald)' }}
                onClick={handleWithdraw}
                disabled={stage !== 'idle'}
              >
                {stage === 'idle' && 'Confirm Withdrawal'}
                {stage === 'transferring' && 'Processing Withdrawal...'}
                {stage === 'success' && 'Transfer Sent! ✅'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default TouristWallet;
