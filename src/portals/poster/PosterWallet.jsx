import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet as WalletIcon, ArrowUpCircle, ArrowDownCircle, History, Shield, Clock, ChevronRight, Plus, Info, CreditCard } from 'lucide-react';
import { usePayment } from '../../context/PaymentContext';

const PosterWallet = () => {
  const { balance, transactions, escrow } = usePayment();
  const [showAddFunds, setShowAddFunds] = useState(false);

  const escrowAmount = escrow?.pending || 0;
  const availableBalance = balance - escrowAmount;
  const recentTransactions = transactions.slice(0, 10);

  return (
    <div className="app-content">
      <div style={{ padding: '24px 20px 12px' }}>
        <h1 className="section-title">Billing & Funds</h1>
        <p className="section-subtitle">Manage your task budget and payments</p>
      </div>

      <div style={{ padding: '0 20px 24px' }}>
        {/* Premium Balance Card */}
        <div className="card-elevated" style={{ 
          background: 'linear-gradient(135deg, var(--orange) 0%, #92400e 100%)',
          padding: '24px',
          borderRadius: '24px',
          marginBottom: '24px',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '140px', height: '140px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
          
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '0.8rem', opacity: 0.8, marginBottom: '4px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Current Balance</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 700, opacity: 0.8 }}>BND</span>
              <span style={{ fontSize: '2.5rem', fontWeight: 900 }}>{balance.toFixed(2)}</span>
            </div>
          </div>

          <button className="btn-primary" onClick={() => setShowAddFunds(true)} style={{ width: '100%', background: 'white', color: 'var(--orange)' }}>
            <Plus size={18} /> Add Funds
          </button>
        </div>

        {/* Secondary Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
          <div className="card" style={{ padding: '16px' }}>
            <div className="flex-between" style={{ marginBottom: '8px' }}>
              <div style={{ color: 'var(--emerald)', background: 'var(--emerald-soft)', padding: '6px', borderRadius: '8px' }}>
                <CreditCard size={18} />
              </div>
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>BND {availableBalance.toFixed(2)}</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Spendable</div>
          </div>
          <div className="card" style={{ padding: '16px' }}>
            <div className="flex-between" style={{ marginBottom: '8px' }}>
              <div style={{ color: 'var(--orange)', background: 'var(--orange-soft)', padding: '6px', borderRadius: '8px' }}>
                <Shield size={18} />
              </div>
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>BND {escrowAmount.toFixed(2)}</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Committed</div>
          </div>
        </div>

        {/* Escrow Shield Info */}
        <div className="card" style={{ display: 'flex', gap: '12px', background: 'var(--bg-secondary)', border: 'none', marginBottom: '24px' }}>
          <div style={{ color: 'var(--orange)' }}>
            <Info size={20} />
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Funds committed to active tasks are held in escrow for your security and only released after approval.
          </p>
        </div>

        {/* Transaction History */}
        <div className="flex-between" style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Recent Activity</h3>
          <button className="btn-ghost" style={{ fontSize: '0.85rem', color: 'var(--orange)' }}>See All</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {recentTransactions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', background: 'var(--bg-card)', borderRadius: '16px' }}>
              <History size={32} className="text-muted" style={{ marginBottom: '12px', opacity: 0.3 }} />
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>No transactions yet</p>
            </div>
          ) : (
            recentTransactions.map(tx => (
              <div key={tx.id} className="card" style={{ padding: '12px' }}>
                <div className="flex-between">
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '12px', 
                      background: tx.type === 'credit' ? 'var(--emerald-soft)' : 'var(--red-soft)',
                      color: tx.type === 'credit' ? 'var(--emerald)' : 'var(--red)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {tx.type === 'credit' ? <ArrowDownCircle size={20} /> : <ArrowUpCircle size={20} />}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{tx.description}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{new Date(tx.date).toLocaleDateString()} • {tx.type === 'credit' ? 'Deposit' : 'Payment'}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: tx.type === 'credit' ? 'var(--emerald)' : 'var(--red)' }}>
                      {tx.type === 'credit' ? '+' : '-'} {tx.amount.toFixed(2)}
                    </div>
                    <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>BND</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Funds Modal */}
      <AnimatePresence>
        {showAddFunds && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={() => setShowAddFunds(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="modal-content"
              onClick={e => e.stopPropagation()}
              style={{ padding: '24px 20px 40px' }}
            >
              <div style={{ width: '40px', height: '4px', background: 'var(--border-color)', borderRadius: '2px', margin: '0 auto 24px' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px' }}>Add Funds</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>Top up your wallet to post more tasks.</p>
              
              <div className="input-group" style={{ marginBottom: '24px' }}>
                <label>Amount (BND)</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700 }}>$</span>
                  <input type="number" placeholder="0.00" style={{ paddingLeft: '32px', fontSize: '1.2rem', fontWeight: 700 }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button className="btn-outline" onClick={() => setShowAddFunds(false)}>Cancel</button>
                <button className="btn-primary" style={{ background: 'var(--orange)' }}>Continue</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PosterWallet;
