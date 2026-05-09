import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, Lock, ChevronRight, UserPlus, LogIn, ShieldCheck } from 'lucide-react';
import { usePayment } from '../context/PaymentContext';

const Auth = () => {
  const navigate = useNavigate();
  const { login } = usePayment();
  const [mode, setMode] = useState('login'); // login or register
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [name, setName] = useState('');
  const [icNumber, setIcNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Prototype: Just wait 1s and redirect to Portal Selector
    setTimeout(() => {
      setIsLoading(false);
      navigate('/select');
    }, 1500);
  };

  return (
    <div className="app-container" style={{ background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="app-content flex-center" style={{ padding: '40px 24px', width: '100%', maxWidth: '400px' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: '48px' }}
        >
          <div style={{ width: '80px', height: '80px', background: 'var(--orange-soft)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <ShieldCheck size={48} className="text-orange" />
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '8px', color: 'var(--text-primary)' }}>SideQuest.BN</h1>
          <p style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Brunei's Premier Escrow-Backed Gig Economy</p>
        </motion.div>

        <div className="card" style={{ width: '100%', padding: '32px 24px' }}>
          <div style={{ display: 'flex', gap: '24px', marginBottom: '32px', borderBottom: '1px solid var(--border-color)' }}>
            <button 
              onClick={() => setMode('login')}
              style={{ paddingBottom: '12px', borderBottom: mode === 'login' ? '2px solid var(--orange)' : 'none', background: 'none', border: 'none', color: mode === 'login' ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: 800, fontSize: '1rem', cursor: 'pointer' }}
            >
              Login
            </button>
            <button 
              onClick={() => setMode('register')}
              style={{ paddingBottom: '12px', borderBottom: mode === 'register' ? '2px solid var(--orange)' : 'none', background: 'none', border: 'none', color: mode === 'register' ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: 800, fontSize: '1rem', cursor: 'pointer' }}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="input-group">
              <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Phone Number</label>
              <div style={{ position: 'relative' }}>
                <Phone size={18} className="text-muted" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="tel" 
                  placeholder="+673 •••• ••••" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ paddingLeft: '48px', height: '56px' }}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>PIN Code</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} className="text-muted" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  style={{ paddingLeft: '48px', height: '56px' }}
                  required
                />
              </div>
            </div>

            {mode === 'register' && (
              <>
                <div className="input-group">
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Full Name (As per IC)</label>
                  <div style={{ position: 'relative' }}>
                    <UserPlus size={18} className="text-muted" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input 
                      type="text" 
                      placeholder="e.g. Awang Abu Bakar" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{ paddingLeft: '48px', height: '56px' }}
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>IC Number (Yellow/Purple)</label>
                  <div style={{ position: 'relative' }}>
                    <ShieldCheck size={18} className="text-muted" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input 
                      type="text" 
                      placeholder="01-XXXXXX" 
                      value={icNumber}
                      onChange={(e) => setIcNumber(e.target.value)}
                      style={{ paddingLeft: '48px', height: '56px' }}
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Upload IC Photo (Front)</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    style={{ padding: '14px', height: '56px', background: 'var(--bg-tertiary)', borderRadius: '12px', border: '1px dashed var(--border-color)', width: '100%' }}
                    required
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'var(--bg-tertiary)', borderRadius: '12px', marginBottom: '10px' }}>
                  <ShieldCheck size={20} className="text-emerald" />
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Automatic Bru-Verified KYC with IC Submission</p>
                </div>
              </>
            )}

            <button 
              type="submit" 
              className="btn-primary" 
              disabled={isLoading}
              style={{ height: '60px', marginTop: '10px' }}
            >
              {isLoading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Account'}
              {!isLoading && <ChevronRight size={20} style={{ marginLeft: '8px' }} />}
            </button>
          </form>
        </div>

        <p style={{ marginTop: '32px', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', fontWeight: 600 }}>
          By continuing, you agree to SideQuest.BN's <br />
          <span style={{ color: 'var(--orange)' }}>Terms of Service</span> and <span style={{ color: 'var(--orange)' }}>Privacy Policy</span>
        </p>
      </div>
    </div>
  );
};

export default Auth;
