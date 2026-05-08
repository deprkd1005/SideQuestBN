import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Clock, ShieldCheck, MapPin, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

// ═══════════════════ AUTO-RELEASE TIMER ═══════════════════
export const AutoReleaseTimer = ({ jobId, proofTime, releaseFunds }) => {
  const [timeLeft, setTimeLeft] = useState(20 * 60);
  useEffect(() => {
    const elapsed = Math.floor((new Date() - new Date(proofTime)) / 1000);
    const remaining = Math.max(0, 1200 - elapsed);
    setTimeLeft(remaining);
    const timer = setInterval(() => setTimeLeft(prev => prev > 0 ? prev - 1 : 0), 1000);
    return () => clearInterval(timer);
  }, [proofTime]);
  const fmt = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
  const pct = ((1200 - timeLeft) / 1200) * 100;

  return (
    <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)', padding: '16px', borderRadius: '14px', marginTop: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Clock size={13} /> AUTO-RELEASE
        </span>
        <span style={{ fontFamily: 'monospace', fontWeight: 800, color: timeLeft < 120 ? '#ef4444' : '#f59e0b', fontSize: '1.1rem' }}>{fmt(timeLeft)}</span>
      </div>
      <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden', marginBottom: '12px' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #f59e0b, #10b981)', borderRadius: '2px', transition: 'width 1s linear' }} />
      </div>
      <button className="btn-outline" style={{ width: '100%', fontSize: '0.78rem', padding: '10px', borderColor: 'rgba(245,158,11,0.2)' }} onClick={() => releaseFunds(jobId)}>
        Release Funds Now
      </button>
    </div>
  );
};

// ═══════════════════ TOP-UP MODAL ═══════════════════
export const TopUpModal = ({ onClose, onTopUp }) => {
  const [amount, setAmount] = useState('');
  const [bank, setBank] = useState('BIBD');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const banks = [
    { name: 'BIBD', label: 'BIBD QuickPay', icon: '🏦' },
    { name: 'Baiduri', label: 'Baiduri Digital', icon: '🏛️' },
    { name: 'BruPay', label: 'BruPay Wallet', icon: '⚡' },
  ];

  const presets = [10, 25, 50, 100];

  const handleConfirm = async () => {
    if (!amount) return;
    setLoading(true);
    const res = await onTopUp(parseFloat(amount), bank);
    setLoading(false);
    if (res.success) { setSuccess(res.txHash); setTimeout(() => onClose(), 2200); }
    else alert('Payment Failed');
  };

  if (success) return (
    <div className="modal-overlay">
      <motion.div className="bottom-sheet" initial={{ y: '100%' }} animate={{ y: 0 }} style={{ textAlign: 'center', padding: '48px 24px' }}>
        <div style={{ width: '64px', height: '64px', background: 'var(--emerald-soft)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <CheckCircle size={32} color="#10b981" />
        </div>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981' }}>Top-up Successful</h3>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '0.85rem' }}>Funds added via {bank}</p>
        <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '16px', fontFamily: 'monospace' }}>Tx: {success.substring(0, 20)}...</p>
      </motion.div>
    </div>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div className="bottom-sheet" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} onClick={e => e.stopPropagation()}>
        <div className="bottom-sheet-handle" />
        <div className="flex-between" style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Top Up Wallet</h3>
          <button className="btn-ghost" onClick={onClose}><X size={20} /></button>
        </div>

        <label style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px', display: 'block' }}>Payment Method</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
          {banks.map(b => (
            <div key={b.name} onClick={() => setBank(b.name)} className="card" style={{ padding: '14px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', borderColor: bank === b.name ? 'var(--portal-color)' : undefined, background: bank === b.name ? 'var(--portal-soft)' : undefined }}>
              <span style={{ fontSize: '1.3rem' }}>{b.icon}</span>
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: bank === b.name ? 'var(--portal-color)' : 'var(--text-primary)' }}>{b.label}</span>
            </div>
          ))}
        </div>

        <label style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px', display: 'block' }}>Amount (BND)</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '12px' }}>
          {presets.map(p => (
            <button key={p} onClick={() => setAmount(String(p))} className="btn-outline" style={{ padding: '10px', fontSize: '0.85rem', fontWeight: 700, borderColor: amount === String(p) ? 'var(--portal-color)' : undefined, color: amount === String(p) ? 'var(--portal-color)' : undefined }}>
              ${p}
            </button>
          ))}
        </div>
        <div className="input-group" style={{ marginBottom: '24px' }}>
          <input type="number" placeholder="Custom amount" value={amount} onChange={e => setAmount(e.target.value)} style={{ textAlign: 'center', fontSize: '1.2rem', fontWeight: 700 }} />
        </div>

        <button className="btn-primary" style={{ width: '100%', padding: '16px', fontSize: '1rem', borderRadius: '14px' }} onClick={handleConfirm} disabled={loading || !amount}>
          {loading ? 'Processing...' : 'Confirm Top-Up'}
        </button>
      </motion.div>
    </div>
  );
};

// ═══════════════════ WITHDRAW MODAL ═══════════════════
export const WithdrawModal = ({ onClose, onWithdraw, balance }) => {
  const [amount, setAmount] = useState('');
  const [bank, setBank] = useState('BIBD');
  const [account, setAccount] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const handleConfirm = async () => {
    if (!amount || !account || !code) return;
    if (parseFloat(amount) > balance) { alert('Insufficient balance'); return; }
    setLoading(true);
    const res = await onWithdraw({ amount: parseFloat(amount), bank, account, twoFactorCode: code });
    setLoading(false);
    if (res.success) { setSuccess(res.txHash); setTimeout(() => onClose(), 2200); }
    else alert(res.error || 'Withdrawal failed');
  };

  if (success) return (
    <div className="modal-overlay">
      <motion.div className="bottom-sheet" initial={{ y: '100%' }} animate={{ y: 0 }} style={{ textAlign: 'center', padding: '48px 24px' }}>
        <div style={{ width: '64px', height: '64px', background: 'var(--emerald-soft)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <CheckCircle size={32} color="#10b981" />
        </div>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981' }}>Withdrawal Successful</h3>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '0.85rem' }}>Instant payout to {bank}</p>
      </motion.div>
    </div>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div className="bottom-sheet" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} onClick={e => e.stopPropagation()}>
        <div className="bottom-sheet-handle" />
        <div className="flex-between" style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Withdraw Funds</h3>
          <button className="btn-ghost" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="input-group">
          <label>Destination Bank</label>
          <select value={bank} onChange={e => setBank(e.target.value)}>
            <option>BIBD</option><option>Baiduri</option><option>Standard Chartered</option><option>Perbadanan TAIB</option>
          </select>
        </div>

        <div className="input-group">
          <label>Account Number</label>
          <input type="text" placeholder="00-001-01-1234567" value={account} onChange={e => setAccount(e.target.value)} />
        </div>

        <div className="input-group">
          <label>Amount (BND)</label>
          <input type="number" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} style={{ fontSize: '1.1rem', fontWeight: 700 }} />
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '6px' }}>Available: BND {balance.toFixed(2)}</p>
        </div>

        <div className="input-group">
          <label style={{ color: 'var(--emerald)', display: 'flex', alignItems: 'center', gap: '6px' }}><ShieldCheck size={13} /> 2FA Verification</label>
          <input type="password" placeholder="6-digit code" value={code} onChange={e => setCode(e.target.value)} maxLength={6} style={{ textAlign: 'center', letterSpacing: '6px', fontSize: '1.2rem' }} />
        </div>

        <button className="btn-primary" style={{ width: '100%', padding: '16px', fontSize: '1rem', borderRadius: '14px', background: 'var(--text-primary)', color: 'var(--bg-primary)' }} onClick={handleConfirm} disabled={loading}>
          {loading ? 'Processing...' : 'Confirm Withdrawal'}
        </button>
      </motion.div>
    </div>
  );
};

// ═══════════════════ POST JOB MODAL ═══════════════════
export const PostJobModal = ({ onClose, onPost, userLocation }) => {
  const [form, setForm] = useState({ title: '', category: 'General', district: 'Brunei-Muara', mukim: 'Gadong A', reward: '', duration: '', unit: 'Hours', description: '', isIndoor: true });
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const categories = ['General', 'Home Maintenance', 'Cleaning', 'Delivery', 'Event Setup', 'Professional Services', 'Digital Services', 'Daily Errands'];

  const handleSubmit = async () => {
    if (!form.title || !form.reward || !form.duration) return;
    setLoading(true);
    await onPost({ ...form, reward: parseFloat(form.reward), duration: `${form.duration} ${form.unit}`, coords: userLocation || [4.8903, 114.9401] });
    setLoading(false);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div className="bottom-sheet" style={{ maxHeight: '92vh', overflowY: 'auto' }} initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} onClick={e => e.stopPropagation()}>
        <div className="bottom-sheet-handle" />
        <div className="flex-between" style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Post a Job</h3>
          <button className="btn-ghost" onClick={onClose}><X size={20} /></button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', background: 'var(--emerald-soft)', borderRadius: '12px', marginBottom: '20px' }}>
          <MapPin size={16} color="#10b981" />
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#10b981' }}>Using your current location</span>
          <CheckCircle size={14} color="#10b981" style={{ marginLeft: 'auto' }} />
        </div>

        <div className="input-group"><label>Job Title</label><input type="text" placeholder="e.g. Grass Cutting" value={form.title} onChange={e => set('title', e.target.value)} /></div>

        <div className="input-group"><label>Description</label><textarea placeholder="Describe the job..." value={form.description} onChange={e => set('description', e.target.value)} rows={3} style={{ resize: 'none' }} /></div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="input-group"><label>Category</label>
            <select value={form.category} onChange={e => set('category', e.target.value)}>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="input-group"><label>Budget (BND)</label><input type="number" placeholder="0" value={form.reward} onChange={e => set('reward', e.target.value)} /></div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="input-group"><label>District</label>
            <select value={form.district} onChange={e => set('district', e.target.value)}>
              <option>Brunei-Muara</option><option>Tutong</option><option>Belait</option><option>Temburong</option>
            </select>
          </div>
          <div className="input-group"><label>Mukim</label><input type="text" placeholder="e.g. Gadong B" value={form.mukim} onChange={e => set('mukim', e.target.value)} /></div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
          <div className="input-group"><label>Duration</label><input type="number" placeholder="e.g. 2" value={form.duration} onChange={e => set('duration', e.target.value)} /></div>
          <div className="input-group"><label>Unit</label>
            <select value={form.unit} onChange={e => set('unit', e.target.value)}>
              <option>Hours</option><option>Days</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          {['Indoor', 'Outdoor'].map(t => (
            <button key={t} onClick={() => set('isIndoor', t === 'Indoor')} className="btn-outline" style={{ flex: 1, borderColor: (t === 'Indoor') === form.isIndoor ? 'var(--portal-color)' : undefined, color: (t === 'Indoor') === form.isIndoor ? 'var(--portal-color)' : undefined }}>
              {t === 'Indoor' ? '🏠' : '🌳'} {t}
            </button>
          ))}
        </div>

        <button className="btn-cta" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Posting...' : '+ Post Job'}
        </button>
      </motion.div>
    </div>
  );
};
