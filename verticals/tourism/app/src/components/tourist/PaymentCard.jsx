import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Check, Lock, Eye, EyeOff } from 'lucide-react';

const PaymentCard = ({ amount, onPaymentComplete, onCancel }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [stage, setStage] = useState('input'); // input, processing, success
  const [showCvv, setShowCvv] = useState(false);

  const formatCardNumber = (val) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 16);
    return cleaned.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (val) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 4);
    if (cleaned.length >= 3) return cleaned.slice(0, 2) + '/' + cleaned.slice(2);
    return cleaned;
  };

  const detectCardType = () => {
    const num = cardNumber.replace(/\s/g, '');
    if (num.startsWith('4')) return { brand: 'VISA', color: '#1a1f71', gradient: 'linear-gradient(135deg, #1a1f71 0%, #2d3bcf 100%)' };
    if (num.startsWith('5') || num.startsWith('2')) return { brand: 'MASTERCARD', color: '#eb001b', gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' };
    return { brand: 'CARD', color: '#475569', gradient: 'linear-gradient(135deg, #334155 0%, #1e293b 100%)' };
  };

  const cardType = detectCardType();

  const handlePay = () => {
    if (cardNumber.replace(/\s/g, '').length < 16 || expiry.length < 5 || cvv.length < 3) {
      return;
    }
    setStage('processing');
    setTimeout(() => {
      setStage('success');
      setTimeout(() => onPaymentComplete(), 1500);
    }, 2500);
  };

  return (
    <div style={{ padding: '0' }}>
      <AnimatePresence mode="wait">
        {stage === 'input' && (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {/* Live Card Preview */}
            <motion.div
              whileHover={{ y: -3 }}
              style={{
                width: '100%', aspectRatio: '1.6 / 1', borderRadius: '20px',
                background: cardType.gradient, padding: '20px',
                color: 'white', position: 'relative', overflow: 'hidden',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)', marginBottom: '20px'
              }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.06, background: 'radial-gradient(circle at 30% 20%, white 0%, transparent 50%)' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
                <Lock size={18} style={{ opacity: 0.6 }} />
                <span style={{ fontWeight: 900, fontSize: '0.9rem', letterSpacing: '2px', fontFamily: 'Outfit' }}>
                  {cardType.brand}
                </span>
              </div>

              <div style={{ position: 'relative' }}>
                <div style={{ fontSize: '1.3rem', fontWeight: 700, letterSpacing: '3px', fontFamily: 'monospace', marginBottom: '8px' }}>
                  {cardNumber || '•••• •••• •••• ••••'}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', position: 'relative' }}>
                <div>
                  <div style={{ fontSize: '0.55rem', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '1px' }}>Card Holder</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>
                    {cardHolder || 'YOUR NAME'}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.55rem', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '1px' }}>Expires</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>
                    {expiry || 'MM/YY'}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Card Input Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
                  Card Number
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    style={{
                      width: '100%', padding: '14px 14px 14px 42px', borderRadius: '12px',
                      background: '#f1f5f9', border: '1.5px solid #e2e8f0', fontSize: '1rem',
                      fontWeight: 700, fontFamily: 'monospace', color: '#0f172a', outline: 'none',
                      letterSpacing: '1px', boxSizing: 'border-box'
                    }}
                  />
                  <CreditCard size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
                  Card Holder Name
                </label>
                <input
                  type="text"
                  placeholder="SARAH SMITH"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  style={{
                    width: '100%', padding: '14px', borderRadius: '12px',
                    background: '#f1f5f9', border: '1.5px solid #e2e8f0', fontSize: '0.9rem',
                    fontWeight: 700, color: '#0f172a', outline: 'none', textTransform: 'uppercase',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
                    Expiry
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                    style={{
                      width: '100%', padding: '14px', borderRadius: '12px',
                      background: '#f1f5f9', border: '1.5px solid #e2e8f0', fontSize: '0.9rem',
                      fontWeight: 700, fontFamily: 'monospace', color: '#0f172a', outline: 'none',
                      textAlign: 'center', boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
                    CVV
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showCvv ? 'text' : 'password'}
                      placeholder="•••"
                      value={cvv}
                      maxLength={4}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                      style={{
                        width: '100%', padding: '14px', borderRadius: '12px',
                        background: '#f1f5f9', border: '1.5px solid #e2e8f0', fontSize: '0.9rem',
                        fontWeight: 700, fontFamily: 'monospace', color: '#0f172a', outline: 'none',
                        textAlign: 'center', boxSizing: 'border-box'
                      }}
                    />
                    <button
                      onClick={() => setShowCvv(!showCvv)}
                      style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px' }}
                    >
                      {showCvv ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Amount & Pay */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Total</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', fontFamily: 'Outfit' }}>BND {amount.toFixed(2)}</div>
              </div>
              <button
                onClick={handlePay}
                disabled={cardNumber.replace(/\s/g, '').length < 16}
                style={{
                  flex: 2, height: '54px', borderRadius: '14px',
                  background: cardNumber.replace(/\s/g, '').length >= 16
                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                    : '#cbd5e1',
                  color: 'white', border: 'none', fontSize: '0.95rem', fontWeight: 800,
                  cursor: cardNumber.replace(/\s/g, '').length >= 16 ? 'pointer' : 'not-allowed',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  boxShadow: cardNumber.replace(/\s/g, '').length >= 16 ? '0 8px 20px rgba(16,185,129,0.3)' : 'none',
                  fontFamily: 'Outfit'
                }}
              >
                <Lock size={16} /> Pay Now
              </button>
            </div>
          </motion.div>
        )}

        {stage === 'processing' && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            style={{ textAlign: 'center', padding: '40px 0' }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              style={{
                width: '60px', height: '60px', borderRadius: '50%',
                border: '4px solid #e2e8f0', borderTopColor: '#10b981',
                margin: '0 auto 24px'
              }}
            />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'Outfit', color: '#0f172a', marginBottom: '6px' }}>
              Processing Payment
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 }}>
              Authorizing with {cardType.brand}...
            </p>
          </motion.div>
        )}

        {stage === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            style={{ textAlign: 'center', padding: '40px 0' }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 10 }}
              style={{
                width: '72px', height: '72px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px', boxShadow: '0 12px 30px rgba(16,185,129,0.3)'
              }}
            >
              <Check size={36} color="white" strokeWidth={3} />
            </motion.div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 900, fontFamily: 'Outfit', color: '#10b981', marginBottom: '6px' }}>
              Payment Successful!
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
              BND {amount.toFixed(2)} charged to {cardType.brand} ****{cardNumber.slice(-4)}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PaymentCard;
