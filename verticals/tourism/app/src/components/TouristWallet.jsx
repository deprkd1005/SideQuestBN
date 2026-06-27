import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Shield, Clock, Plus, Info, ArrowUpRight, ArrowDownRight, MoreHorizontal, CheckCircle2 } from 'lucide-react';
import { useTourismPayment } from '../context/TourismPaymentContext';

const TouristWallet = () => {
  const { dbState } = useTourismPayment();
  const [showAddCard, setShowAddCard] = useState(false);
  
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  
  const [stage, setStage] = useState('idle'); // idle, processing, success

  // Calculate active escrow amount for tourist (bookings in FROZEN/DISPUTED state)
  const travelerBookings = dbState.bookings.filter(b => b.tourist_user_id === 'usr_traveler_001');
  const escrowAmount = travelerBookings
    .filter(b => b.escrow_status === 'FROZEN' || b.escrow_status === 'DISPUTED')
    .reduce((sum, b) => sum + parseFloat(b.gross_amount), 0);

  // Payments transactions
  const transactions = travelerBookings.map(b => ({
    id: `tx_${b.id}`,
    type: 'payment',
    description: `Booking: ${b.activity_id.replace('act_', '').replace('_', ' ').toUpperCase()}`,
    amount: parseFloat(b.gross_amount),
    date: b.created_at,
    status: b.escrow_status
  })).sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleAddCard = () => {
    if (cardNumber.length < 15 || expiry.length < 5 || cvv.length < 3) {
      alert("Please enter valid card details.");
      return;
    }
    setStage('processing');
    setTimeout(() => {
      setStage('success');
      setTimeout(() => {
        setShowAddCard(false);
        setStage('idle');
        setCardNumber('');
        setExpiry('');
        setCvv('');
      }, 1200);
    }, 1500);
  };

  const formatCardNumber = (val) => {
    return val.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
  };

  const formatExpiry = (val) => {
    return val.replace(/\D/g, '').replace(/^(\d{2})(\d)/, '$1/$2').substr(0, 5);
  };

  return (
    <div className="app-content no-scrollbar" style={{ background: 'var(--bg-primary)' }}>
      
      {/* Header Section */}
      <div style={{ padding: '40px 24px 24px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="flex-between" style={{ marginBottom: '24px' }}>
          <div>
            <h1 className="section-title" style={{ padding: 0 }}>Payment Methods</h1>
            <p className="section-subtitle" style={{ padding: 0, marginTop: '4px' }}>Manage cards and transactions</p>
          </div>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={18} className="text-emerald" />
          </div>
        </div>

        {/* Visa Card Mock */}
        <motion.div 
          whileHover={{ y: -5 }}
          style={{ 
            padding: '24px', 
            background: 'linear-gradient(135deg, #1a1f36 0%, #0d1124 100%)', 
            borderRadius: '20px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            position: 'relative',
            overflow: 'hidden',
            color: 'white',
            aspectRatio: '1.58 / 1',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          {/* Card texture overlay */}
          <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '60%', background: 'radial-gradient(ellipse at right, rgba(255,255,255,0.08) 0%, transparent 60%)', transform: 'skewX(-15deg)' }} />
          
          <div className="flex-between" style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '40px', height: '26px', background: 'linear-gradient(135deg, #e0e0e0 0%, #9e9e9e 100%)', borderRadius: '4px' }}></div>
              <Shield size={16} fill="rgba(255,255,255,0.2)" stroke="none" />
            </div>
            <div style={{ fontWeight: 900, fontSize: '1.4rem', fontStyle: 'italic', color: '#ffffff', letterSpacing: '-1px' }}>VISA</div>
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 600, letterSpacing: '4px', fontFamily: 'monospace', textShadow: '0 2px 4px rgba(0,0,0,0.5)', marginBottom: '16px' }}>**** **** **** 5001</div>
            <div className="flex-between">
              <div>
                <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', opacity: 0.7, marginBottom: '2px' }}>Card Holder</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, letterSpacing: '1px' }}>SARAH SMITH</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', opacity: 0.7, marginBottom: '2px' }}>Expires</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, letterSpacing: '1px' }}>09/28</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button className="btn-primary" style={{ flex: 1, height: '52px', borderRadius: '16px', background: 'var(--emerald)' }} onClick={() => setShowAddCard(true)}>
            <Plus size={18} /> Add New Card
          </button>
        </div>
      </div>

      <div style={{ padding: '24px' }}>
        {/* Escrow Visualizer (Tourist's active bookings) */}
        {escrowAmount > 0 && (
          <div className="card-glass" style={{ marginBottom: '32px', borderColor: 'var(--border-color)', padding: '20px' }}>
            <div className="flex-between" style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'var(--emerald-soft)', color: 'var(--emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Shield size={18} />
                </div>
                <span style={{ fontSize: '0.95rem', fontWeight: 800 }}>Escrow Protection</span>
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, fontFamily: 'Outfit' }}>
                BND {escrowAmount.toFixed(2)}
              </div>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '16px' }}>
              Payments for upcoming bookings are secured by SideQuest Escrow. Funds are only released to hosts upon successful check-in.
            </p>
          </div>
        )}

        {/* History */}
        <div className="flex-between" style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'Outfit' }}>Recent Payments</h3>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>See All</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {transactions.map(tx => (
            <div key={tx.id} className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', background: 'white' }}>
              <div style={{ 
                width: '44px', 
                height: '44px', 
                borderRadius: '12px', 
                background: 'var(--bg-tertiary)',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <CreditCard size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>{tx.description}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {new Date(tx.date).toLocaleDateString('en-BN', { day: 'numeric', month: 'short' })} • VISA **** 5001
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'Outfit' }}>
                  BND {tx.amount.toFixed(2)}
                </div>
                <span className={`badge ${tx.status === 'FROZEN' ? 'badge-emerald' : 'badge-blue'}`} style={{ fontSize: '0.55rem', padding: '2px 6px' }}>
                  {tx.status === 'FROZEN' ? 'ESCROW' : tx.status}
                </span>
              </div>
            </div>
          ))}
          {transactions.length === 0 && (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>No recent transactions.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Card Bottom Sheet Modal */}
      <AnimatePresence>
        {showAddCard && (
          <div className="modal-overlay" onClick={() => setShowAddCard(false)}>
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bottom-sheet"
              onClick={e => e.stopPropagation()}
            >
              <div className="sheet-handle" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '24px', fontFamily: 'Outfit' }}>Add Credit / Debit Card</h3>
              
              <div style={{ marginBottom: '16px' }}>
                <label className="input-group label" style={{ fontWeight: 800, fontSize: '0.7rem' }}>Card Number</label>
                <input 
                  type="text" 
                  placeholder="0000 0000 0000 0000" 
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  maxLength={19}
                  style={{ width: '100%', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '16px', fontSize: '1.1rem', fontWeight: 700, outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
                <div style={{ flex: 1 }}>
                  <label className="input-group label" style={{ fontWeight: 800, fontSize: '0.7rem' }}>Expiry (MM/YY)</label>
                  <input 
                    type="text" 
                    placeholder="MM/YY" 
                    value={expiry}
                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                    maxLength={5}
                    style={{ width: '100%', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '16px', fontSize: '1.1rem', fontWeight: 700, outline: 'none' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="input-group label" style={{ fontWeight: 800, fontSize: '0.7rem' }}>CVV</label>
                  <input 
                    type="password" 
                    placeholder="123" 
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substr(0, 4))}
                    maxLength={4}
                    style={{ width: '100%', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '16px', fontSize: '1.1rem', fontWeight: 700, outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                <Shield size={16} className="text-emerald" />
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Your card details are securely encrypted.</span>
              </div>

              <button 
                className="btn-primary" 
                style={{ width: '100%', height: '56px', background: 'var(--emerald)' }}
                onClick={handleAddCard}
                disabled={stage !== 'idle'}
              >
                {stage === 'idle' && 'Save Card'}
                {stage === 'processing' && 'Verifying...'}
                {stage === 'success' && 'Card Added! ✅'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default TouristWallet;
