import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet as WalletIcon, ArrowUpCircle, ArrowDownCircle, History, Shield, Clock, ChevronRight, Download, Plus, Info, CreditCard, ExternalLink } from 'lucide-react';
import { usePayment } from '../../context/PaymentContext';

const Wallet = ({ onAnimation }) => {
  const { balance, transactions, escrow, updateBalance, withdraw } = usePayment();
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [stage, setStage] = useState('idle'); // idle, transferring, success
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');

  const escrowAmount = Object.values(escrow || {}).reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const availableBalance = (balance || 0) - escrowAmount;
  const recentTransactions = Array.isArray(transactions) ? transactions.slice(0, 10) : [];

  return (
    <div className="app-content">
      {/* Balance Section */}
      <div style={{ padding: '32px 24px 24px', background: 'var(--bg-secondary)' }}>
        <div className="flex-between" style={{ marginBottom: '24px' }}>
          <div>
            <h1 className="section-title">My Wallet</h1>
            <p className="section-subtitle">Secure Digital Payments</p>
          </div>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)' }}>
            <Info size={18} className="text-muted" />
          </div>
        </div>

        {/* Digital Card - Premium Design */}
        <motion.div 
          whileHover={{ y: -5, rotateX: 5 }}
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
          {/* Card Texture */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.1, background: 'radial-gradient(circle at 20% 20%, white 0%, transparent 40%)' }} />
          
          <div className="flex-between" style={{ position: 'relative' }}>
            <div style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '1px' }}>SIDEQUEST<span style={{ opacity: 0.7 }}>BN</span></div>
            <Shield size={24} fill="rgba(255,255,255,0.3)" stroke="none" />
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{ fontSize: '0.75rem', opacity: 0.8, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>Current Balance</div>
            <div style={{ fontSize: '2.4rem', fontWeight: 900, display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '1.2rem', opacity: 0.7 }}>BND</span>
              {Number(balance || 0).toFixed(2)}
            </div>
          </div>

          <div className="flex-between" style={{ position: 'relative' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, letterSpacing: '2px' }}>**** **** **** 8842</div>
            <div style={{ width: '40px', height: '28px', background: 'rgba(255,255,255,0.2)', borderRadius: '6px' }} />
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button className="btn-primary" style={{ flex: 1, height: '52px', borderRadius: '16px', boxShadow: '0 10px 20px var(--gold-soft)' }} onClick={() => setShowWithdraw(true)}>
            <Download size={18} /> Withdraw
          </button>
        </div>
      </div>


      <div style={{ padding: '0 24px 24px' }}>
        {/* Secondary Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>Available</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 900 }}>{Number(availableBalance || 0).toFixed(2)}</div>
          </div>
          <div className="card" style={{ padding: '20px', borderColor: escrowAmount > 0 ? 'var(--orange-soft)' : 'var(--border-color)' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>Escrow</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: escrowAmount > 0 ? 'var(--orange)' : 'var(--text-primary)' }}>{Number(escrowAmount || 0).toFixed(2)}</div>
          </div>
        </div>

        {/* Escrow Visualization */}
        {escrowAmount > 0 && (
          <div className="card-glass" style={{ marginBottom: '32px', borderColor: 'var(--orange-soft)', padding: '20px' }}>
            <div className="flex-between" style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'var(--orange-soft)', color: 'var(--orange)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Shield size={18} />
                </div>
                <span style={{ fontSize: '0.95rem', fontWeight: 800 }}>Escrow Active</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--orange)' }}>
                <Clock size={14} /> 12:45:00
              </div>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '16px' }}>
              Funds from active quests are being held securely. They will release automatically upon completion.
            </p>
            <div style={{ width: '100%', height: '6px', background: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '70%' }}
                style={{ height: '100%', background: 'var(--orange)', boxShadow: '0 0 10px var(--orange-glow)' }}
              />
            </div>
          </div>
        )}

        {/* Transaction History */}
        <div className="flex-between" style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Recent History</h3>
          <button className="btn-ghost" onClick={() => alert('Opening monthly financial statement...')} style={{ fontSize: '0.85rem', color: 'var(--gold)', fontWeight: 700 }}>View Statements</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {recentTransactions.map(tx => (
            <div key={tx.id} className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ 
                width: '44px', 
                height: '44px', 
                borderRadius: '12px', 
                background: tx.type === 'credit' ? 'var(--emerald-soft)' : 'var(--red-soft)',
                color: tx.type === 'credit' ? 'var(--emerald)' : 'var(--red)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {tx.type === 'credit' ? <ArrowDownCircle size={20} /> : <ArrowUpCircle size={20} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>{tx.description}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{tx.date ? new Date(tx.date).toLocaleDateString('en-BN', { day: 'numeric', month: 'short' }) : 'Recent'} • {tx.type === 'credit' ? 'Credit' : 'Debit'}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1rem', fontWeight: 900, color: tx.type === 'credit' ? 'var(--emerald)' : 'white' }}>
                  {tx.type === 'credit' ? '+' : '-'} {Number(tx.amount || 0).toFixed(2)}
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700 }}>BND</div>
              </div>
            </div>
          ))}
          {recentTransactions.length === 0 && (
            <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
              No transactions yet.
            </div>
          )}
        </div>
      </div>

      {/* Withdraw Sheet */}
      <AnimatePresence>
        {showWithdraw && (
          <div className="modal-overlay" onClick={() => setShowWithdraw(false)}>
            <motion.div 
              key="withdraw-sheet"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bottom-sheet"
              onClick={e => e.stopPropagation()}
            >
              <div className="sheet-handle" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '24px', color: 'var(--text-primary)' }}>Withdraw to Bank</h3>
              
              <div style={{ marginBottom: '24px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '12px', display: 'block' }}>Select Method</label>
                <div className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', borderColor: 'var(--gold)', background: 'var(--bg-primary)' }}>
                  <div style={{ width: '40px', height: '24px', background: '#e0e0e0', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333', fontSize: '0.6rem', fontWeight: 900 }}>BIBD</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>BIBD Aspirasi</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>**** 8842</div>
                  </div>
                  <ChevronRight size={18} className="text-muted" />
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '12px', display: 'block' }}>Amount</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="number" 
                    placeholder="0.00" 
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    style={{ width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '16px 20px', color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: 900, textAlign: 'center' }}
                  />
                  {parseFloat(withdrawAmount) > 150 && (
                    <div style={{ color: 'var(--red)', fontSize: '0.75rem', fontWeight: 700, marginTop: '8px', textAlign: 'center' }}>
                      Maximum instant withdrawal per day is BND 150.00.
                    </div>
                  )}
                </div>
                <div className="flex-between" style={{ marginTop: '12px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Min: BND 10.00</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Fee: BND 0.50</span>
                </div>
              </div>

              <div style={{ marginBottom: '32px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '12px', display: 'block' }}>2FA Verification</label>
                <input 
                  type="password" 
                  placeholder="6-digit code" 
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  maxLength={6}
                  style={{ width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '16px', color: 'var(--text-primary)', fontSize: '1.2rem', fontWeight: 900, textAlign: 'center', letterSpacing: '4px' }}
                />
              </div>

              <button 
                className="btn-primary" 
                style={{ width: '100%', height: '60px', fontSize: '1.1rem', position: 'relative', opacity: (!withdrawAmount || parseFloat(withdrawAmount) <= 0 || parseFloat(withdrawAmount) > 150 || (twoFactorCode && twoFactorCode.length < 3)) ? 0.5 : 1 }}
                onClick={async () => {
                  const amt = parseFloat(withdrawAmount);
                  if (isNaN(amt) || amt <= 0 || amt > (balance || 0) || amt > 150) {
                    alert('Invalid amount or insufficient funds');
                    return;
                  }
                  
                  setStage('transferring');
                  onAnimation('transferring');
                  
                  // Actual Backend Call
                  let isSuccess = false;
                  try {
                    const result = await withdraw({
                        amount: amt,
                        bank: 'BIBD',
                        account: '8842',
                        twoFactorCode: twoFactorCode || '123456' 
                    });
                    
                    if (result && result.success) {
                      setStage('success');
                      isSuccess = true;
                      updateBalance((balance || 0) - amt);
                    } else {
                      alert(result?.error || 'Withdrawal failed. Please check your balance or 2FA code.');
                      setStage('idle');
                    }
                  } catch (err) {
                    console.error("Withdrawal failed", err);
                    alert('Network error. Please try again.');
                    setStage('idle');
                  } finally {
                    setTimeout(() => {
                      onAnimation(null);
                      if (isSuccess) {
                        setShowWithdraw(false);
                        setStage('idle');
                        setWithdrawAmount('');
                        setTwoFactorCode('');
                      }
                    }, 2000);
                  }
                }}
                disabled={stage !== 'idle'}
              >
                {stage === 'idle' && 'Confirm Withdrawal'}
                {stage === 'transferring' && 'Processing...'}
                {stage === 'success' && 'Transfer Complete! ✅'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Wallet;