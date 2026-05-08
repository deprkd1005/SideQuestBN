import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MapPin, Calendar, Clock, DollarSign, ChevronRight, Check, Info, Home, Sun } from 'lucide-react';
import { usePayment } from '../../context/PaymentContext';
import MapView from '../../components/MapView';

const PostJob = () => {
  const navigate = useNavigate();
  const { postJob, userLocation } = usePayment();
  const [step, setStep] = useState(1);

  const [jobData, setJobData] = useState({
    title: '',
    description: '',
    category: '',
    budget: '',
    location: { lat: userLocation?.lat || 4.897, lng: userLocation?.lng || 114.948, address: '' },
    date: '',
    time: '',
    indoor: true
  });

  const categories = [
    { id: 'cleaning', label: 'Cleaning', icon: '🧹' },
    { id: 'delivery', label: 'Delivery', icon: '📦' },
    { id: 'gardening', label: 'Gardening', icon: '🌿' },
    { id: 'moving', label: 'Moving', icon: '🚛' },
    { id: 'repair', label: 'Repair', icon: '🔧' },
    { id: 'event', label: 'Event Help', icon: '🎉' }
  ];

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => step > 1 ? setStep(s => s - 1) : navigate(-1);

  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async () => {
    await postJob(jobData);
    setIsSuccess(true);
    setTimeout(() => navigate('/poster'), 2500);
  };

  if (isSuccess) {
    return (
      <div className="app-content no-pad flex-center" style={{ height: '100%', background: 'var(--bg-primary)', flexDirection: 'column', gap: '24px' }}>
        <motion.div 
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 12, stiffness: 200 }}
          style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--emerald-soft)', color: 'var(--emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Check size={60} strokeWidth={3} />
        </motion.div>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '8px' }}>Task Posted!</h2>
          <p style={{ color: 'var(--text-muted)', fontWeight: 700 }}>Funds secured in escrow. 🛡️</p>
        </div>
      </div>
    );
  }

  const progress = (step / 3) * 100;

  return (
    <div className="app-content no-pad" style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-primary)' }}>
      {/* Header Overlay */}
      <div style={{ padding: '24px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button className="card-glass" style={{ width: '40px', height: '40px', borderRadius: '12px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={handleBack}>
          <ArrowLeft size={20} />
        </button>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 900 }}>Post a Task</h1>
      </div>

      {/* Progress Indicator */}
      <div style={{ padding: '0 20px 24px' }}>
        <div style={{ height: '6px', width: '100%', background: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            style={{ height: '100%', background: 'var(--orange)', boxShadow: '0 0 15px var(--orange-glow)' }}
          />
        </div>
      </div>

      {/* Form Content */}
      <div style={{ flex: 1, padding: '0 20px 24px', overflowY: 'auto' }} className="no-scrollbar">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="section-title" style={{ fontSize: '1.4rem' }}>Task Details</h2>
              <p className="section-subtitle">What help do you need today?</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '32px' }}>
                {categories.map(cat => (
                  <div 
                    key={cat.id}
                    onClick={() => setJobData({...jobData, category: cat.label})}
                    className="card"
                    style={{ 
                      padding: '20px 12px', 
                      textAlign: 'center',
                      borderColor: jobData.category === cat.label ? 'var(--orange)' : 'var(--border-color)',
                      background: jobData.category === cat.label ? 'var(--orange-soft)' : 'var(--bg-secondary)',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>{cat.icon}</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800 }}>{cat.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Job Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Grass cutting for back garden" 
                  value={jobData.title}
                  onChange={(e) => setJobData({...jobData, title: e.target.value})}
                  style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '16px', color: 'white', fontWeight: 600 }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Description</label>
                <textarea 
                  placeholder="Provide more details about the work..." 
                  value={jobData.description}
                  onChange={(e) => setJobData({...jobData, description: e.target.value})}
                  rows={4}
                  style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '16px', color: 'white', fontWeight: 600, resize: 'none' }}
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
              <h2 className="section-title" style={{ fontSize: '1.4rem' }}>Location & Time</h2>
              <p className="section-subtitle">Where and when should they arrive?</p>

              <div className="card" style={{ padding: '0', overflow: 'hidden', height: '220px', marginBottom: '24px', position: 'relative', border: '1px solid var(--border-glass)' }}>
                <MapView 
                  jobs={[]} 
                  userLocation={jobData.location}
                  interactive={true}
                />
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -100%)', pointerEvents: 'none', zIndex: 1000 }}>
                  <MapPin size={36} color="var(--orange)" fill="var(--orange-soft)" strokeWidth={2.5} />
                </div>
                <div style={{ position: 'absolute', bottom: '12px', left: '12px', right: '12px', zIndex: 1000 }}>
                  <div className="card-glass" style={{ padding: '10px 16px', borderRadius: '12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Navigation size={14} className="text-orange" />
                    <span style={{ fontWeight: 600 }}>Drag map to pin location</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div 
                  onClick={() => setJobData({...jobData, indoor: true})}
                  className="card"
                  style={{ 
                    padding: '16px', 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    borderColor: jobData.indoor ? 'var(--orange)' : 'var(--border-color)',
                    background: jobData.indoor ? 'var(--orange-soft)' : 'var(--bg-secondary)'
                  }}
                >
                  <Home size={24} color={jobData.indoor ? 'var(--orange)' : 'var(--text-muted)'} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>Indoor</span>
                </div>
                <div 
                  onClick={() => setJobData({...jobData, indoor: false})}
                  className="card"
                  style={{ 
                    padding: '16px', 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    borderColor: !jobData.indoor ? 'var(--orange)' : 'var(--border-color)',
                    background: !jobData.indoor ? 'var(--orange-soft)' : 'var(--bg-secondary)'
                  }}
                >
                  <Sun size={24} color={!jobData.indoor ? 'var(--orange)' : 'var(--text-muted)'} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>Outdoor</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Date</label>
                  <input 
                    type="date" 
                    value={jobData.date}
                    onChange={(e) => setJobData({...jobData, date: e.target.value})}
                    style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '16px', color: 'white', fontWeight: 600 }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Time</label>
                  <input 
                    type="time" 
                    value={jobData.time}
                    onChange={(e) => setJobData({...jobData, time: e.target.value})}
                    style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '16px', color: 'white', fontWeight: 600 }}
                  />
                </div>
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
              <h2 className="section-title" style={{ fontSize: '1.4rem' }}>Budget & Trust</h2>
              <p className="section-subtitle">Secure payment via SideQuest Escrow</p>

              <div className="card-glass" style={{ textAlign: 'center', padding: '40px 24px', marginBottom: '32px', borderColor: 'var(--orange-soft)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '16px' }}>Your Offer</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-secondary)' }}>BND</span>
                  <input 
                    type="number" 
                    placeholder="0"
                    value={jobData.budget}
                    onChange={(e) => setJobData({...jobData, budget: e.target.value})}
                    style={{ background: 'none', border: 'none', fontSize: '4.5rem', fontWeight: 900, color: 'var(--orange)', width: '160px', textAlign: 'center', outline: 'none' }}
                  />
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px' }}>Average for {jobData.category}: BND 25.00</div>
              </div>

              <div className="card" style={{ display: 'flex', gap: '16px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '20px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--emerald-soft)', color: 'var(--emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Shield size={24} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '4px' }}>Escrow Protected</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    Payment is held securely and only released when the job is marked complete. If they don't finish, you get a refund.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Actions */}
      <div style={{ padding: '20px 24px 40px', background: 'var(--bg-glass-strong)', borderTop: '1px solid var(--border-glass)' }}>
        {step < 3 ? (
          <button 
            className="btn-primary" 
            onClick={handleNext}
            disabled={step === 1 && (!jobData.title || !jobData.category)}
            style={{ width: '100%', height: '60px', background: 'var(--orange)', boxShadow: '0 8px 30px var(--orange-glow)', fontSize: '1.1rem' }}
          >
            Continue <ChevronRight size={22} strokeWidth={3} />
          </button>
        ) : (
          <button 
            className="btn-primary" 
            onClick={handleSubmit}
            disabled={!jobData.budget}
            style={{ width: '100%', height: '60px', background: 'var(--orange)', boxShadow: '0 8px 30px var(--orange-glow)', fontSize: '1.1rem' }}
          >
            Confirm & Post Task <Check size={22} strokeWidth={3} />
          </button>
        )}
      </div>
    </div>
  );
};

export default PostJob;