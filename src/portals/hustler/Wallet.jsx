import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet as WalletIcon, ArrowUpCircle, ArrowDownCircle, History, Shield, Clock } from 'lucide-react';
import { usePayment } from '../../context/PaymentContext';

const Wallet = () => {
  const { balance, transactions, escrow } = usePayment();
  const [showWithdraw, setShowWithdraw] = useState(false);

  // Mock escrow data
  const escrowAmount = escrow?.pending || 0;
  const availableBalance = balance - escrowAmount;

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg-primary)'
    }}>
      {/* Header */}
      <div style={{
        padding: '1rem',
        background: 'var(--bg-primary)',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: 900,
          color: 'var(--text-primary)'
        }}>
          Wallet
        </h1>
      </div>

      {/* Balance Cards */}
      <div style={{ padding: '1rem' }}>
        {/* Main Balance */}
        <div style={{
          background: 'linear-gradient(135deg, var(--emerald) 0%, #059669 100%)',
          borderRadius: '16px',
          padding: '1.5rem',
          marginBottom: '1rem',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-20%',
            right: '-20%',
            width: '120px',
            height: '120px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%'
          }} />
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '1rem'
          }}>
            <div>
              <p style={{
                fontSize: '0.9rem',
                opacity: 0.9,
                marginBottom: '4px'
              }}>
                Total Balance
              </p>
              <h2 style={{
                fontSize: '2rem',
                fontWeight: 900,
                margin: 0
              }}>
                BND {balance.toFixed(2)}
              </h2>
            </div>
            <WalletIcon size={24} />
          </div>
          <div style={{
            display: 'flex',
            gap: '8px'
          }}>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowWithdraw(true)}
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.2)',
                border: '1px solid rgba(255,255,255,0.3)',
                color: 'white',
                padding: '10px',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: 'pointer',
                backdropFilter: 'blur(10px)'
              }}
            >
              Withdraw
            </motion.button>
          </div>
        </div>

        {/* Available & Escrow */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          marginBottom: '2rem'
        }}>
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: '12px',
            padding: '1rem',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '8px'
            }}>
              <ArrowUpCircle size={20} color="var(--emerald)" />
              <span style={{
                fontSize: '0.9rem',
                fontWeight: 600,
                color: 'var(--text-secondary)'
              }}>
                Available
              </span>
            </div>
            <p style={{
              fontSize: '1.5rem',
              fontWeight: 900,
              color: 'var(--emerald)',
              margin: 0
            }}>
              BND {availableBalance.toFixed(2)}
            </p>
          </div>

          <div style={{
            background: 'var(--bg-card)',
            borderRadius: '12px',
            padding: '1rem',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '8px'
            }}>
              <Shield size={20} color="var(--orange)" />
              <span style={{
                fontSize: '0.9rem',
                fontWeight: 600,
                color: 'var(--text-secondary)'
              }}>
                In Escrow
              </span>
            </div>
            <p style={{
              fontSize: '1.5rem',
              fontWeight: 900,
              color: 'var(--orange)',
              margin: 0
            }}>
              BND {escrowAmount.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Escrow Info */}
        {escrowAmount > 0 && (
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: '12px',
            padding: '1rem',
            marginBottom: '2rem',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '8px'
            }}>
              <Clock size={16} color="var(--text-muted)" />
              <span style={{
                fontSize: '0.9rem',
                fontWeight: 600,
                color: 'var(--text-primary)'
              }}>
                Escrow Protection Active
              </span>
            </div>
            <p style={{
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
              lineHeight: '1.4',
              marginBottom: '12px'
            }}>
              Funds are securely held until job completion is confirmed by the poster.
              Auto-release in 20 minutes if no action is taken.
            </p>
            <div style={{
              background: 'var(--emerald-soft)',
              padding: '8px 12px',
              borderRadius: '8px'
            }}>
              <p style={{
                fontSize: '0.8rem',
                color: 'var(--emerald)',
                fontWeight: 600,
                textAlign: 'center',
                margin: 0
              }}>
                Auto-release timer: 18:45 remaining
              </p>
            </div>
          </div>
        )}

        {/* Transaction History */}
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: '12px',
          padding: '1rem',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '1rem'
          }}>
            <History size={20} color="var(--text-secondary)" />
            <h3 style={{
              fontSize: '1.1rem',
              fontWeight: 700,
              color: 'var(--text-primary)'
            }}>
              Recent Transactions
            </h3>
          </div>

          {recentTransactions.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '2rem 1rem',
              color: 'var(--text-muted)'
            }}>
              <History size={32} color="var(--text-muted)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <p style={{ fontSize: '0.9rem' }}>No transactions yet</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '12px' }}>
              {recentTransactions.map(tx => (
                <div key={tx.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px',
                  background: 'var(--bg-secondary)',
                  borderRadius: '8px'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: tx.type === 'credit' ? 'var(--emerald-soft)' : 'var(--red-soft)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {tx.type === 'credit' ? (
                        <ArrowDownCircle size={16} color="var(--emerald)" />
                      ) : (
                        <ArrowUpCircle size={16} color="var(--red)" />
                      )}
                    </div>
                    <div>
                      <p style={{
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        margin: 0
                      }}>
                        {tx.description}
                      </p>
                      <p style={{
                        fontSize: '0.8rem',
                        color: 'var(--text-muted)',
                        margin: 0
                      }}>
                        {new Date(tx.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span style={{
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: tx.type === 'credit' ? 'var(--emerald)' : 'var(--red)'
                  }}>
                    {tx.type === 'credit' ? '+' : '-'}BND {tx.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Withdraw Modal */}
      {showWithdraw && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'flex-end',
            zIndex: 1000
          }}
          onClick={() => setShowWithdraw(false)}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            style={{
              background: 'var(--bg-primary)',
              borderRadius: '16px 16px 0 0',
              padding: '1.5rem',
              width: '100%'
            }}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{
              fontSize: '1.2rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: '1rem'
            }}>
              Withdraw Funds
            </h3>
            <p style={{
              fontSize: '0.9rem',
              color: 'var(--text-secondary)',
              marginBottom: '1.5rem'
            }}>
              Available: BND {availableBalance.toFixed(2)}
            </p>
            <input
              type="number"
              placeholder="Amount to withdraw"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                fontSize: '1rem',
                marginBottom: '1rem'
              }}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setShowWithdraw(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'var(--emerald)',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                Withdraw
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Wallet;