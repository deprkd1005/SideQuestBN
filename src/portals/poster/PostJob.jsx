import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MapPin, Check, ChevronRight, Shield, Info } from 'lucide-react';
import { usePayment } from '../../context/PaymentContext';

const PostJob = () => {
  const navigate = useNavigate();
  const { postTask } = usePayment();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [jobData, setJobData] = useState({
    title: '',
    description: '',
    category: '',
    budget: '',
    location: ''
  });

  const categories = [
    { id: 'cleaning', label: 'Cleaning', icon: '🧹' },
    { id: 'delivery', label: 'Delivery', icon: '📦' },
    { id: 'gardening', label: 'Gardening', icon: '🌿' },
    { id: 'moving', label: 'Moving', icon: '🚛' },
    { id: 'repair', label: 'Repair', icon: '🔧' },
    { id: 'creative', label: 'Creative', icon: '🎨' }
  ];

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => step > 1 ? setStep(s => s - 1) : navigate(-1);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const result = await postTask(jobData);
      if (result.success) {
        setIsSuccess(true);
        setTimeout(() => navigate('/poster'), 3000);
      } else {
        alert(result.error || 'Failed to post task');
      }
    } catch (err) {
      alert('Error connecting to server');
    } finally {
      setIsLoading(false);
    }
  };

  const progress = (step / 3) * 100;

  return (
    <div className="app-content no-scrollbar" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div style={{ padding: '24px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button className="btn-ghost" onClick={handleBack}>
          <ArrowLeft size={24} />
        </button>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 900, fontFamily: 'Outfit' }}>Post a SideQuest</h1>
      </div>

      {/* Progress */}
      <div style={{ padding: '0 24px 24px' }}>
        <div style={{ height: '6px', width: '100%', background: 'var(--bg-card)', borderRadius: '3px', overflow: 'hidden' }}>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            style={{ height: '100%', background: 'var(--emerald)', boxShadow: '0 0 15px var(--emerald-glow)' }}
          />
        </div>
      </div>

      <div style={{ flex: 1, padding: '0 24px 100px' }}>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '8px' }}>Task Details</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontWeight: 500 }}>What help do you need today?</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '32px' }}>
                {categories.map(cat => (
                  <button 
                    key={cat.id}
                    onClick={() => setJobData({...jobData, category: cat.label})}
                    style={{ 
                      padding: '20px 12px', 
                      borderRadius: '20px',
                      border: '1.5px solid',
                      borderColor: jobData.category === cat.label ? 'var(--emerald)' : 'var(--border-glass)',
                      background: jobData.category === cat.label ? 'var(--emerald-soft)' : 'var(--bg-card)',
                      transition: 'all 0.2s',
                      cursor: 'pointer',
                      color: 'var(--text-primary)'
                    }}
                  >
                    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{cat.icon}</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>{cat.label}</div>
                  </button>
                ))}
              </div>

              <div className="input-group">
                <label>Job Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Grass cutting for back garden" 
                  value={jobData.title}
                  onChange={(e) => setJobData({...jobData, title: e.target.value})}
                />
              </div>

              <div className="input-group">
                <label>Description</label>
                <textarea 
                  placeholder="Provide more details about the work..." 
                  value={jobData.description}
                  onChange={(e) => setJobData({...jobData, description: e.target.value})}
                  rows={4}
                  style={{ width: '100%', background: 'var(--bg-secondary)', border: '1.5px solid var(--border-glass)', borderRadius: '16px', padding: '16px', color: 'var(--text-primary)', resize: 'none' }}
                />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '8px' }}>Location</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontWeight: 500 }}>Where should the provider go?</p>

              <div className="input-group">
                <label>Address / District</label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={18} className="text-muted" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="text" 
                    placeholder="e.g. Gadong, Brunei-Muara" 
                    value={jobData.location}
                    onChange={(e) => setJobData({...jobData, location: e.target.value})}
                    style={{ paddingLeft: '48px' }}
                  />
                </div>
              </div>

              <div className="card-glass" style={{ display: 'flex', gap: '16px', marginTop: '40px' }}>
                <Info className="text-emerald" size={24} style={{ flexShrink: 0 }} />
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Ensure the location is accurate to help providers find you easily.
                </p>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '8px' }}>Budget & Trust</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontWeight: 500 }}>Secure payment via SideQuest Escrow</p>

              <div className="card-glass" style={{ textAlign: 'center', padding: '48px 24px', marginBottom: '32px', borderColor: 'var(--emerald-glow)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '16px' }}>Your Offer</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-muted)' }}>BND</span>
                  <input 
                    type="number" 
                    placeholder="0"
                    value={jobData.budget}
                    onChange={(e) => setJobData({...jobData, budget: e.target.value})}
                    style={{ background: 'none', border: 'none', fontSize: '5rem', fontWeight: 900, color: 'var(--emerald)', width: '180px', textAlign: 'center', outline: 'none' }}
                  />
                </div>
              </div>

              <div className="card" style={{ display: 'flex', gap: '16px', border: '1px solid var(--border-color)', padding: '24px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'var(--emerald-soft)', color: 'var(--emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Shield size={24} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '4px' }}>Escrow Protected</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                    Payment is held securely and only released when you confirm the job is complete.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div style={{ position: 'absolute', bottom: 'calc(var(--nav-height) + 20px)', left: '24px', right: '24px' }}>
        {step < 3 ? (
          <button 
            className="btn-primary" 
            onClick={handleNext}
            disabled={step === 1 && (!jobData.title || !jobData.category)}
            style={{ width: '100%', height: '64px', fontSize: '1.1rem' }}
          >
            Continue <ChevronRight size={22} strokeWidth={3} />
          </button>
        ) : (
          <button 
            className="btn-primary" 
            onClick={handleSubmit}
            disabled={!jobData.budget || isLoading}
            style={{ width: '100%', height: '64px', fontSize: '1.1rem' }}
          >
            {isLoading ? 'Posting...' : 'Confirm & Post Task'}
            {!isLoading && <Check size={22} strokeWidth={3} />}
          </button>
        )}
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ position: 'absolute', inset: 0, background: 'var(--bg-primary)', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px' }}
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 12 }}
              style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--emerald-soft)', color: 'var(--emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Check size={60} strokeWidth={3} />
            </motion.div>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '8px' }}>Task Posted!</h2>
              <p style={{ color: 'var(--text-muted)', fontWeight: 700 }}>Hustlers are being notified. 🚀</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PostJob;