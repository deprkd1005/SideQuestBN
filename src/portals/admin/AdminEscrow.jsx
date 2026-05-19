import React, { useState, useEffect } from 'react';
import { Shield, ArrowUpRight, CheckCircle, FileText, X, Activity, Lock, Unlock, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePayment } from '../../context/PaymentContext';

const AdminEscrow = () => {
  const { token } = usePayment();
  const [payments, setPayments] = useState([]);
  const [selectedContract, setSelectedContract] = useState(null);

  const fetchPayments = async () => {
    try {
      const baseUrl = import.meta.env.DEV ? '' : 'https://sidequest-backend-bivj.onrender.com';
      const res = await fetch(`${baseUrl}/api/admin/payments`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPayments(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) fetchPayments();
  }, [token]);

  const totalHeld = payments.reduce((acc, p) => acc + Number(p.amount || 0), 0);
  const getStatus = (item) => item.payment_status || item.status || 'held';
  const getPayerName = (item) => item.payer_name || item.order?.customer?.fullname || 'Poster';
  const getReceiverName = (item) => item.receiver_name || item.order?.provider?.fullname || 'Hustler';
  const getTaskTitle = (item) => item.task_title || item.order?.service?.title || 'SideQuest';

  return (
    <div className="app-content no-scrollbar" style={{ background: 'var(--bg-primary)' }}>
      <div style={{ padding: '40px 24px 24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: 'Outfit', color: 'var(--text-primary)' }}>Payment <span style={{ color: 'var(--emerald)' }}>Security</span></h1>
        <p style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem' }}>Financial custody & trust control</p>
      </div>

      <div style={{ padding: '0 24px 24px' }}>
        {/* Total Card */}
        <div className="card-glass" style={{ padding: '32px 24px', background: 'linear-gradient(135deg, var(--emerald-dark) 0%, var(--bg-card) 100%)', border: '1px solid var(--emerald-glow)', marginBottom: '32px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--emerald)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '1px' }}>Total Escrow Volume</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '24px', color: 'var(--text-primary)' }}>BND {totalHeld.toLocaleString()}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '12px', borderRadius: '16px', border: '1px solid var(--border-glass)' }}>
              <div style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--text-muted)' }}>ACTIVE QUESTS</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-primary)' }}>{payments.length}</div>
            </div>
            <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '12px', borderRadius: '16px', border: '1px solid var(--border-glass)' }}>
              <div style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--text-muted)' }}>SECURED FLOW</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--emerald)' }}>100%</div>
            </div>
          </div>
        </div>

        {/* Live Holdings */}
        <div className="flex-between" style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'Outfit', color: 'var(--text-primary)' }}>Live Smart Contracts</h3>
          <Activity size={18} className="text-emerald" />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {payments.map(item => (
            <div key={item.id} className="card" style={{ padding: '20px' }}>
              <div className="flex-between" style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'var(--emerald-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--emerald)' }}>
                    <Shield size={22} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>{getTaskTitle(item)}</h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>ID: SQ-{item.id?.slice(0,6)}X</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-primary)' }}>BND {item.amount}</div>
                  <div className={`badge ${getStatus(item) === 'released' ? 'badge-emerald' : 'badge-gold'}`} style={{ marginTop: '4px' }}>
                    {getStatus(item)}
                  </div>
                </div>
              </div>
              <button 
                className="btn-outline" 
                onClick={() => setSelectedContract(item)} 
                style={{ width: '100%', height: '48px', fontSize: '0.85rem', fontWeight: 800, borderColor: 'var(--emerald-glow)', color: 'var(--text-primary)' }}
              >
                Inspect Contract
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Contract Detail Modal */}
      <AnimatePresence>
        {selectedContract && (
          <div className="modal-overlay" onClick={() => setSelectedContract(null)}>
            <motion.div 
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 400 }}
              className="bottom-sheet" onClick={e => e.stopPropagation()}
              style={{ background: 'var(--bg-card)', border: '1px solid var(--emerald-glow)' }}
            >
              <div className="bottom-sheet-handle" />
              <div className="flex-between" style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 900, fontFamily: 'Outfit', color: 'var(--text-primary)' }}>Escrow Analysis</h3>
                <button className="btn-ghost" onClick={() => setSelectedContract(null)}><X size={24} /></button>
              </div>

              <div className="card-glass" style={{ padding: '20px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                  <FileText size={28} className="text-emerald" />
                  <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>{getTaskTitle(selectedContract)}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Smart Contract Instance</p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                  <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: '16px' }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>Locked Asset</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--emerald)' }}>BND {selectedContract.amount}</div>
                  </div>
                  <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: '16px' }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>Security</div>
                    <div style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--emerald)' }}>VERIFIED</div>
                  </div>
                </div>

                {/* Escrow Lock Visualization */}
                <div style={{ padding: '20px', background: 'var(--bg-primary)', borderRadius: '16px', border: '1px solid var(--border-glass)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0', marginBottom: '16px' }}>
                    {/* Payer Side */}
                    <div style={{ flex: 1, textAlign: 'center' }}>
                      <div style={{ 
                        width: '48px', height: '48px', borderRadius: '14px', 
                        background: 'var(--emerald-soft)', border: '2px solid var(--emerald)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 8px'
                      }}>
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedContract.order?.customer?.id || selectedContract.id}`} alt="" style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
                      </div>
                      <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        {getPayerName(selectedContract)}
                      </div>
                      <div style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--text-muted)' }}>Poster</div>
                    </div>

                    {/* Arrow to Escrow */}
                    <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-muted)', padding: '0 4px' }}>
                      <div style={{ width: '24px', height: '2px', background: 'var(--emerald)', opacity: 0.6 }} />
                      <ArrowRight size={14} style={{ color: 'var(--emerald)' }} />
                    </div>

                    {/* Escrow Lock Center */}
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ 
                        width: '56px', height: '56px', borderRadius: '16px', 
                        background: getStatus(selectedContract) === 'released' 
                          ? 'linear-gradient(135deg, var(--emerald) 0%, var(--emerald-dark) 100%)'
                          : 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 8px',
                        boxShadow: getStatus(selectedContract) === 'released'
                          ? '0 4px 20px var(--emerald-glow)'
                          : '0 4px 20px var(--gold-glow)'
                      }}>
                        {getStatus(selectedContract) === 'released' 
                          ? <Unlock size={24} style={{ color: 'white' }} />
                          : <Lock size={24} style={{ color: 'white' }} />
                        }
                      </div>
                      <div style={{ fontSize: '0.7rem', fontWeight: 900, color: getStatus(selectedContract) === 'released' ? 'var(--emerald)' : 'var(--gold)' }}>
                        {getStatus(selectedContract) === 'released' ? 'RELEASED' : 'LOCKED'}
                      </div>
                      <div style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--text-muted)' }}>Escrow</div>
                    </div>

                    {/* Arrow to Payee */}
                    <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-muted)', padding: '0 4px' }}>
                      <div style={{ width: '24px', height: '2px', background: getStatus(selectedContract) === 'released' ? 'var(--emerald)' : 'var(--text-muted)', opacity: 0.6 }} />
                      <ArrowRight size={14} style={{ color: getStatus(selectedContract) === 'released' ? 'var(--emerald)' : 'var(--text-muted)' }} />
                    </div>

                    {/* Payee Side */}
                    <div style={{ flex: 1, textAlign: 'center' }}>
                      <div style={{ 
                        width: '48px', height: '48px', borderRadius: '14px', 
                        background: getStatus(selectedContract) === 'released' ? 'var(--emerald-soft)' : 'var(--bg-tertiary)', 
                        border: `2px solid ${getStatus(selectedContract) === 'released' ? 'var(--emerald)' : 'var(--border-color)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 8px'
                      }}>
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedContract.order?.provider?.id || 'payee'}`} alt="" style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
                      </div>
                      <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        {getReceiverName(selectedContract)}
                      </div>
                      <div style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--text-muted)' }}>Hustler</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ marginTop: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                      <span>Deposit</span>
                      <span>{getStatus(selectedContract) === 'released' ? 'Completed' : 'In Progress'}</span>
                    </div>
                    <div style={{ height: '6px', background: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: getStatus(selectedContract) === 'released' ? '100%' : '50%' }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        style={{ height: '100%', background: getStatus(selectedContract) === 'released' ? 'var(--emerald)' : 'var(--gold)', borderRadius: '3px' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button className="btn-primary" onClick={() => setSelectedContract(null)} style={{ width: '100%', height: '60px', fontSize: '1.1rem' }}>
                System Secure <CheckCircle size={20} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminEscrow;
