import React, { useState, useEffect } from 'react';
import { Shield, ArrowUpRight, CheckCircle, FileText, X, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePayment } from '../../context/PaymentContext';

const AdminEscrow = () => {
  const { token } = usePayment();
  const [payments, setPayments] = useState([]);
  const [selectedContract, setSelectedContract] = useState(null);

  const fetchPayments = async () => {
    try {
      const baseUrl = 'https://spotty-ways-pull.loca.lt';
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

  const totalHeld = payments.reduce((acc, p) => acc + Number(p.amount), 0);

  return (
    <div className="app-content no-scrollbar" style={{ background: 'var(--bg-primary)' }}>
      <div style={{ padding: '40px 24px 24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: 'Outfit' }}>Payment <span className="text-emerald">Security</span></h1>
        <p style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem' }}>Financial custody & trust control</p>
      </div>

      <div style={{ padding: '0 24px 24px' }}>
        {/* Total Card */}
        <div className="card-glass" style={{ padding: '32px 24px', background: 'linear-gradient(135deg, var(--emerald-dark) 0%, var(--bg-card) 100%)', border: '1px solid var(--emerald-glow)', marginBottom: '32px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--emerald)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '1px' }}>Total Escrow Volume</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '24px', color: 'white' }}>BND {totalHeld.toLocaleString()}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '16px', border: '1px solid var(--border-glass)' }}>
              <div style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--text-muted)' }}>ACTIVE QUESTS</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 900 }}>{payments.length}</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '16px', border: '1px solid var(--border-glass)' }}>
              <div style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--text-muted)' }}>SECURED FLOW</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--emerald)' }}>100%</div>
            </div>
          </div>
        </div>

        {/* Live Holdings */}
        <div className="flex-between" style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'Outfit' }}>Live Smart Contracts</h3>
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
                    <h4 style={{ fontSize: '1rem', fontWeight: 800 }}>{item.task_title || 'SideQuest'}</h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>ID: SQ-{item.id}X</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 900 }}>BND {item.amount}</div>
                  <div className={`badge ${item.payment_status === 'released' ? 'badge-emerald' : 'badge-gold'}`} style={{ marginTop: '4px' }}>
                    {item.payment_status}
                  </div>
                </div>
              </div>
              <button 
                className="btn-outline" 
                onClick={() => setSelectedContract(item)} 
                style={{ width: '100%', height: '48px', fontSize: '0.85rem', fontWeight: 800, borderColor: 'var(--emerald-glow)' }}
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
              className="bottom-sheet" onClick={e => e.stopPropagation()}
              style={{ background: 'var(--bg-card)', border: '1px solid var(--emerald-glow)' }}
            >
              <div className="bottom-sheet-handle" />
              <div className="flex-between" style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 900, fontFamily: 'Outfit' }}>Escrow Analysis</h3>
                <button className="btn-ghost" onClick={() => setSelectedContract(null)}><X size={24} /></button>
              </div>

              <div className="card-glass" style={{ padding: '20px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                  <FileText size={28} className="text-emerald" />
                  <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{selectedContract.task_title}</h4>
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

                <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: '16px', border: '1px solid var(--border-glass)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                    <span>Payer: {selectedContract.payer_name}</span>
                    <span>→</span>
                    <span>Payee: {selectedContract.receiver_name || 'TBD'}</span>
                  </div>
                  <div style={{ height: '4px', background: 'var(--bg-tertiary)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: selectedContract.payment_status === 'released' ? '100%' : '50%', height: '100%', background: 'var(--emerald)' }}></div>
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
