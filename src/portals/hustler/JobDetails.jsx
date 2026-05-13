import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MapPin, Clock, Shield, Calendar, ChevronRight, Check, Star } from 'lucide-react';
import { usePayment } from '../../context/PaymentContext';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { jobs, acceptTask, user } = usePayment();

  const job = jobs.find(j => String(j.id) === String(id));
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!job) {
    return (
      <div className="flex-center" style={{ height: '100vh', flexDirection: 'column', gap: '16px', background: 'var(--bg-primary)' }}>
        <p className="text-muted">Quest not found</p>
        <button className="btn-outline" onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  const handleAccept = async () => {
    setIsLoading(true);
    try {
      const result = await acceptTask(job.id);
      if (result.success) {
        setIsSuccess(true);
        setTimeout(() => navigate('/hustler'), 3000);
      } else {
        alert(result.error || 'Failed to accept quest');
      }
    } catch (err) {
      alert('Error connecting to server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-content no-scrollbar" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div style={{ padding: '24px 20px', display: 'flex', alignItems: 'center', gap: '16px', position: 'relative', zIndex: 10 }}>
        <button className="btn-ghost" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </button>
        <h1 style={{ fontSize: '1.2rem', fontWeight: 900, fontFamily: 'Outfit' }}>Quest Details</h1>
      </div>

      {/* Hero Section */}
      <div style={{ padding: '0 24px 32px' }}>
        <div className="card-glass" style={{ padding: '24px', background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-tertiary) 100%)', border: '1px solid var(--gold-glow)' }}>
          <div className="flex-between" style={{ marginBottom: '16px' }}>
            <span className="badge badge-gold">{job.category}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--emerald)', fontSize: '0.75rem', fontWeight: 800 }}>
              <Shield size={16} /> Escrow Protected
            </div>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '8px', fontFamily: 'Outfit' }}>{job.title}</h2>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--gold)' }}>BND {job.budget}</div>
        </div>
      </div>

      <div style={{ padding: '0 24px 120px' }}>
        {/* Info Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '32px' }}>
          <div className="card" style={{ padding: '16px' }}>
            <Calendar size={18} className="text-gold" style={{ marginBottom: '8px' }} />
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Posted</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{new Date(job.created_at).toLocaleDateString()}</div>
          </div>
          <div className="card" style={{ padding: '16px' }}>
            <MapPin size={18} className="text-gold" style={{ marginBottom: '8px' }} />
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Location</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{job.location}</div>
          </div>
        </div>

        {/* Description */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '12px', fontFamily: 'Outfit' }}>Description</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem' }}>
            {job.description || 'No additional details provided.'}
          </p>
        </div>

        {/* Customer Info */}
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '12px', fontFamily: 'Outfit' }}>The Customer</h3>
        <div className="card-glass" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${job.customer_id}`} alt="customer" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '1rem', fontWeight: 800 }}>{job.customer_name || 'Verified Customer'}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
              <Star size={12} fill="var(--gold)" color="var(--gold)" />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>4.9 • 15 Quests Completed</span>
            </div>
          </div>
          <ChevronRight size={20} className="text-muted" />
        </div>
      </div>

      {/* Action Footer */}
      {job.task_status === 'open' && (
        <div style={{ position: 'absolute', bottom: 'calc(var(--nav-height) + 20px)', left: '24px', right: '24px' }}>
          <button 
            className="btn-primary" 
            onClick={handleAccept}
            disabled={isLoading}
            style={{ width: '100%', height: '64px', fontSize: '1.1rem', background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)' }}
          >
            {isLoading ? 'Processing...' : 'Accept this Quest'}
            {!isLoading && <Check size={22} />}
          </button>
        </div>
      )}

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
              style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--gold-soft)', color: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Check size={60} strokeWidth={3} />
            </motion.div>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '8px' }}>Quest Accepted!</h2>
              <p style={{ color: 'var(--text-muted)', fontWeight: 700 }}>You can now chat with the customer. 📱</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JobDetails;