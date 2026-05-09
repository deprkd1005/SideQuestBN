import React, { useState } from 'react';
import { Shield, Lock, ArrowUpRight, TrendingUp, CheckCircle, FileText, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminEscrow = () => {
  const [selectedContract, setSelectedContract] = useState(null);
  const holdings = [
    { id: 1, job: 'Design Logo', amount: '250.00', status: 'Secured', time: '12h remaining' },
    { id: 2, job: 'Food Delivery', amount: '15.00', status: 'Pending Release', time: 'Awaiting Poster' },
    { id: 3, job: 'Mobile App Fix', amount: '1,200.00', status: 'Secured', time: '2 days remaining' }
  ];

  return (
    <div className="app-content" style={{ background: 'var(--bg-primary)', minHeight: '100%' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 className="section-title">Payment Security</h1>
        <p className="section-subtitle">Financial custody & trust control</p>
      </div>

      <div className="card" style={{ padding: '24px', background: 'linear-gradient(135deg, var(--blue) 0%, #1e40af 100%)', color: 'white', border: 'none', marginBottom: '32px' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 700, opacity: 0.8, textTransform: 'uppercase', marginBottom: '8px' }}>Total Escrow Held</div>
        <div style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '24px' }}>BND 12,450.00</div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '16px' }}>
            <div style={{ fontSize: '0.6rem', fontWeight: 800 }}>ACTIVE CONTRACTS</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 900 }}>89</div>
          </div>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '16px' }}>
            <div style={{ fontSize: '0.6rem', fontWeight: 800 }}>DISPUTED</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 900 }}>4</div>
          </div>
        </div>
      </div>

      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px' }}>Live Holdings</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {holdings.map(item => (
          <div key={item.id} className="card" style={{ padding: '16px' }}>
            <div className="flex-between" style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--blue)' }}>
                  <Shield size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 800 }}>{item.job}</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{item.time}</p>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1rem', fontWeight: 900 }}>BND {item.amount}</div>
                <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--emerald)' }}>{item.status}</div>
              </div>
            </div>
            <button className="btn-outline" onClick={() => setSelectedContract(item)} style={{ width: '100%', height: '40px', fontSize: '0.8rem', fontWeight: 700 }}>View Contract</button>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedContract && (
          <div className="modal-overlay" onClick={() => setSelectedContract(null)}>
            <motion.div 
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              className="bottom-sheet" onClick={e => e.stopPropagation()}
            >
              <div className="bottom-sheet-handle" />
              <div className="flex-between" style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900 }}>Smart Contract</h3>
                <button className="btn-ghost" onClick={() => setSelectedContract(null)}><X size={20} /></button>
              </div>

              <div className="card" style={{ padding: '16px', background: 'var(--bg-tertiary)', marginBottom: '24px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <FileText size={24} className="text-blue" />
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 800 }}>{selectedContract.job}</h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Contract ID: SQ-{selectedContract.id}X99A</p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>Locked Amount</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--emerald)' }}>BND {selectedContract.amount}</div>
                  </div>
                  <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>Status</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>{selectedContract.status}</div>
                  </div>
                </div>

                <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '8px', fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.5', fontFamily: 'monospace' }}>
                  <div style={{ fontWeight: 800, marginBottom: '4px', color: 'var(--text-primary)' }}>Blockchain Hash:</div>
                  <div style={{ wordBreak: 'break-all' }}>0x8fB32C19c...d4A9e72B10</div>
                  <div style={{ marginTop: '8px', color: 'var(--emerald)', fontWeight: 700 }}>✓ Verified by BDCB Standards</div>
                </div>
              </div>

              <button className="btn-primary" onClick={() => setSelectedContract(null)} style={{ width: '100%', height: '56px', background: 'var(--blue)' }}>
                Close Contract View
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminEscrow;
