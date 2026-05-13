import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Phone, ChevronRight, ShieldCheck, Briefcase, UserCircle } from 'lucide-react';
import { usePayment } from '../context/PaymentContext';

const Auth = () => {
  const navigate = useNavigate();
  const { login, signup } = usePayment();
  const [mode, setMode] = useState('login'); // login or register
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullname: '',
    phone_number: '',
    role: 'customer'
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      let result;
      if (mode === 'login') {
        result = await login({ email: formData.email, password: formData.password });
      } else {
        result = await signup(formData);
      }

      if (result.success) {
        // Redirect based on role
        const role = result.user.role;
        if (role === 'admin') navigate('/admin');
        else if (role === 'provider') navigate('/hustler');
        else navigate('/poster');
      } else {
        setError(result.error || 'Authentication failed');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="auth-view no-scrollbar">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: '40px' }}
        >
          <div className="flex-center" style={{ marginBottom: '16px' }}>
            <div style={{ width: '64px', height: '64px', background: 'var(--emerald-soft)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--emerald-glow)' }}>
              <ShieldCheck size={32} className="text-emerald" />
            </div>
          </div>
          <h1 className="auth-logo">SideQuest.BN</h1>
          <p style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem' }}>Trust. Security. Efficiency.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card-glass"
          style={{ padding: '32px 24px' }}
        >
          <div style={{ display: 'flex', gap: '24px', marginBottom: '32px', borderBottom: '1px solid var(--border-glass)' }}>
            <button 
              onClick={() => setMode('login')}
              style={{ 
                paddingBottom: '12px', 
                borderBottom: mode === 'login' ? '2px solid var(--emerald)' : 'none', 
                background: 'none', 
                border: 'none', 
                color: mode === 'login' ? 'var(--text-primary)' : 'var(--text-muted)', 
                fontWeight: 700, 
                fontSize: '1rem', 
                cursor: 'pointer' 
              }}
            >
              Sign In
            </button>
            <button 
              onClick={() => setMode('register')}
              style={{ 
                paddingBottom: '12px', 
                borderBottom: mode === 'register' ? '2px solid var(--emerald)' : 'none', 
                background: 'none', 
                border: 'none', 
                color: mode === 'register' ? 'var(--text-primary)' : 'var(--text-muted)', 
                fontWeight: 700, 
                fontSize: '1rem', 
                cursor: 'pointer' 
              }}
            >
              Join
            </button>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }}
              style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--red)', borderRadius: '12px', color: 'var(--red)', fontSize: '0.85rem', marginBottom: '20px', textAlign: 'center' }}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {mode === 'register' && (
              <>
                <div className="input-group">
                  <label>Full Name</label>
                  <div style={{ position: 'relative' }}>
                    <User size={18} className="text-muted" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input 
                      type="text" 
                      name="fullname"
                      placeholder="e.g. Awang Ali" 
                      value={formData.fullname}
                      onChange={handleInputChange}
                      style={{ paddingLeft: '48px' }}
                      required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label>Account Role</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, role: 'customer'})}
                      style={{
                        padding: '12px',
                        borderRadius: '12px',
                        border: '1.5px solid',
                        borderColor: formData.role === 'customer' ? 'var(--emerald)' : 'var(--border-glass)',
                        background: formData.role === 'customer' ? 'var(--emerald-soft)' : 'var(--bg-secondary)',
                        color: formData.role === 'customer' ? 'var(--emerald)' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                        transition: '0.2s'
                      }}
                    >
                      <UserCircle size={20} />
                      <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Customer</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, role: 'provider'})}
                      style={{
                        padding: '12px',
                        borderRadius: '12px',
                        border: '1.5px solid',
                        borderColor: formData.role === 'provider' ? 'var(--gold)' : 'var(--border-glass)',
                        background: formData.role === 'provider' ? 'var(--gold-soft)' : 'var(--bg-secondary)',
                        color: formData.role === 'provider' ? 'var(--gold)' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                        transition: '0.2s'
                      }}
                    >
                      <Briefcase size={20} />
                      <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Provider</span>
                    </button>
                  </div>
                </div>
              </>
            )}

            <div className="input-group">
              <label>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} className="text-muted" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="email" 
                  name="email"
                  placeholder="name@example.com" 
                  value={formData.email}
                  onChange={handleInputChange}
                  style={{ paddingLeft: '48px' }}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} className="text-muted" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="password" 
                  name="password"
                  placeholder="••••••••" 
                  value={formData.password}
                  onChange={handleInputChange}
                  style={{ paddingLeft: '48px' }}
                  required
                />
              </div>
            </div>

            {mode === 'register' && (
              <div className="input-group">
                <label>Phone Number</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={18} className="text-muted" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="tel" 
                    name="phone_number"
                    placeholder="+673 •••• ••••" 
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    style={{ paddingLeft: '48px' }}
                  />
                </div>
              </div>
            )}

            <button 
              type="submit" 
              className="btn-primary" 
              disabled={isLoading}
              style={{ width: '100%', height: '56px', marginTop: '16px' }}
            >
              {isLoading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Account'}
              {!isLoading && <ChevronRight size={20} />}
            </button>
          </form>
        </motion.div>

        <p style={{ marginTop: '32px', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', fontWeight: 600, lineHeight: 1.6 }}>
          SideQuest.BN ensures all payments are held in <br />
          <span className="text-emerald">secure escrow</span> until task completion.
        </p>
      </div>
    </div>
  );
};

export default Auth;
