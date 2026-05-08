import React from 'react';
import { usePayment } from '../../context/PaymentContext';
import { Wallet, DollarSign, ShieldCheck, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

const PosterWallet = () => {
  const { balance, transactions, escrow } = usePayment();
  const escrowAmount = escrow?.pending || 0;
  const available = Math.max(0, balance - escrowAmount);
  const recent = transactions.slice(0, 5);

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg-primary)'
    }}>
      <div style={{
        padding: '1rem',
        borderBottom: '1px solid var(--border-color)',
        background: 'var(--bg-primary)'
      }}>
        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: 900,
          color: 'var(--text-primary)'
        }}>
          Poster Wallet
        </h1>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: '20px',
          padding: '1.5rem',
          border: '1px solid var(--border-color)',
          marginBottom: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '16px',
              background: 'var(--orange-soft)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Wallet size={24} color='var(--orange)' />
            </div>
            <div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>
                Current Balance
              </p>
              <h2 style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
                BND {balance.toFixed(2)}
              </h2>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{
              background: 'var(--bg-secondary)',
              borderRadius: '16px',
              padding: '1rem',
              border: '1px solid var(--border-color)'
            }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Available</p>
              <p style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--emerald)', margin: 0 }}>
                BND {available.toFixed(2)}
              </p>
            </div>
            <div style={{
              background: 'var(--bg-secondary)',
              borderRadius: '16px',
              padding: '1rem',
              border: '1px solid var(--border-color)'
            }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Escrow Held</p>
              <p style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--orange)', margin: 0 }}>
                BND {escrowAmount.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div style={{
          background: 'var(--bg-card)',
          borderRadius: '20px',
          padding: '1.5rem',
          border: '1px solid var(--border-color)',
          marginBottom: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
            <ShieldCheck size={20} color='var(--orange)' />
            <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>Secure Escrow</h2>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
            Funds for your jobs are held safely until the task is completed and approved. This gives you extra trust with each booking.
          </p>
        </div>

        <div style={{
          background: 'var(--bg-card)',
          borderRadius: '20px',
          padding: '1.5rem',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
            <DollarSign size={20} color='var(--text-secondary)' />
            <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>Recent Activity</h2>
          </div>

          {recent.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No recent transactions yet.</p>
          ) : (
            <div style={{ display: 'grid', gap: '12px' }}>
              {recent.map(tx => (
                <div key={tx.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  background: 'var(--bg-secondary)',
                  borderRadius: '14px',
                  border: '1px solid var(--border-color)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '12px',
                      background: tx.type === 'credit' ? 'var(--emerald-soft)' : 'var(--red-soft)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {tx.type === 'credit' ? (
                        <ArrowDownCircle size={18} color='var(--emerald)' />
                      ) : (
                        <ArrowUpCircle size={18} color='var(--red)' />
                      )}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>{tx.description}</p>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{new Date(tx.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <p style={{ margin: 0, fontWeight: 700, color: tx.type === 'credit' ? 'var(--emerald)' : 'var(--red)' }}>
                    {tx.type === 'credit' ? '+' : '-'}BND {tx.amount.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PosterWallet;
