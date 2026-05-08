import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet as WalletIcon, ArrowUpCircle, ArrowDownCircle, History, Shield, Clock, ChevronRight, Download, Plus, Info, CreditCard, ExternalLink } from 'lucide-react';
import { usePayment } from '../../context/PaymentContext';

const Wallet = () => {
  const { balance, transactions, escrow } = usePayment();
  const [showWithdraw, setShowWithdraw] = useState(false);

  const escrowAmount = escrow?.pending || 0;
  const availableBalance = balance - escrowAmount;
  const recentTransactions = transactions.slice(0, 10);

  return (
    <div className="app-content no-pad">
      {/* Balance Section */}
      <div style={{ padding: '32px 24px 24px', background: 'linear-gradient(180deg, var(--bg-tertiary) 0%, var(--bg-primary) 100%)' }}>
        <div className="flex-between" style={{ marginBottom: '24px' }}>
          <div>
            <h1 className="section-title">Earnings</h1>
            <p className="section-subtitle">Manage your Secure Wallet</p>
          </div>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Info size={18} className="text-muted" />
          </div>
        </div>

        {/* Main Card */}
        <div className="card-glass" style={{ 
          padding: '24px', 
          background: 'var(--bg-glass-strong)', 
          borderColor: 'var(--border-glass)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: 'var(--emerald)', opacity: 0.1, filter: 'blur(40px)', borderRadius: '50%' }} />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Total Balance</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--emerald)' }}>BND</span>
                <span style={{ fontSize: '2.8rem', fontWeight: 900 }}>{balance.toFixed(2)}</span>
              </div>
            </div>
            <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'var(--emerald-soft)', color: 'var(--emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CreditCard size={24} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-primary" style={{ flex: 1, height: '52px', borderRadius: '16px' }} onClick={() => setShowWithdraw(true)}>
              <Download size={18} /> Withdraw
            </button>
            <button className="btn-outline" style={{ width: '52px', height: '52px', padding: 0, borderRadius: '16px' }}>
              <Plus size={20} />
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 24px 24px' }}>
        {/* Secondary Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>Available</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 900 }}>{availableBalance.toFixed(2)}</div>
          </div>
          <div className="card" style={{ padding: '20px', borderColor: escrowAmount > 0 ? 'var(--orange-soft)' : 'var(--border-color)' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>Escrow</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: escrowAmount > 0 ? 'var(--orange)' : 'white' }}>{escrowAmount.toFixed(2)}</div>
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
              Funds from <span style={{ color: 'white', fontWeight: 700 }}>"Express Grocery Delivery"</span> are being held securely. They will release automatically upon completion.
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
          <button className="btn-ghost" style={{ fontSize: '0.85rem', color: 'var(--emerald)', fontWeight: 700 }}>View Statements</button>
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
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(tx.date).toLocaleDateString('en-BN', { day: 'numeric', month: 'short' })} • {tx.type === 'credit' ? 'Payment' : 'Transfer'}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1rem', fontWeight: 900, color: tx.type === 'credit' ? 'var(--emerald)' : 'white' }}>
                  {tx.type === 'credit' ? '+' : '-'} {tx.amount.toFixed(2)}
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700 }}>BND</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Withdraw Sheet */}
      <AnimatePresence>
        {showWithdraw && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1200 }}
              onClick={() => setShowWithdraw(false)}
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bottom-sheet"
              style={{ zIndex: 1300, paddingBottom: '40px' }}
            >
              <div className="sheet-handle" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '24px' }}>Withdraw to Bank</h3>
              
              <div style={{ marginBottom: '24px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '12px', display: 'block' }}>Select Method</label>
                <div className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', borderColor: 'var(--emerald)' }}>
                  <div style={{ width: '40px', height: '24px', background: '#e0e0e0', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333', fontSize: '0.6rem', fontWeight: 900 }}>BIBD</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>BIBD Aspirasi</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>**** 8842</div>
                  </div>
                  <ChevronRight size={18} className="text-muted" />
                </div>
              </div>

              <div style={{ marginBottom: '32px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '12px', display: 'block' }}>Amount</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="number" 
                    placeholder="0.00" 
                    style={{ width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '16px 20px', color: 'white', fontSize: '1.5rem', fontWeight: 900, textAlign: 'center' }}
                  />
                </div>
                <div className="flex-between" style={{ marginTop: '12px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Min: BND 10.00</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Fee: BND 0.50</span>
                </div>
              </div>

              <button className="btn-primary" style={{ width: '100%', height: '60px', fontSize: '1.1rem' }}>Confirm Withdrawal</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Wallet;