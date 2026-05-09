import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Star, Clock, Shield, MapPin, CheckCircle, AlertCircle, MessageCircle, Phone } from 'lucide-react';
import { usePayment } from '../../context/PaymentContext';

const JobTracking = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { jobs } = usePayment();
  const job = jobs.find(j => j.id === jobId) || jobs[0]; // Fallback for demo

  const [timeLeft, setTimeLeft] = React.useState(30);

  React.useEffect(() => {
    if (timeLeft <= 0) {
      alert('Time expired! Funds automatically released from Escrow.');
      navigate('/poster');
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, navigate]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Mock worker data
  const worker = {
    name: 'Hafizah',
    rating: 4.9,
    status: 'In Transit',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hafizah'
  };

  return (
    <div className="app-content" style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div style={{ padding: '24px 20px', display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid var(--border-glass)' }}>
        <button className="card-glass" style={{ width: '40px', height: '40px', borderRadius: '12px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 900 }}>Tracking Task</h1>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>{job.title}</p>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px' }} className="no-scrollbar">
        {/* Worker Info Card */}
        <div className="card" style={{ padding: '20px', marginBottom: '24px', background: 'var(--bg-secondary)' }}>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
              <img src={worker.avatar} alt="avatar" />
            </div>
            <div style={{ flex: 1 }}>
              <div className="flex-between">
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{worker.name}</h3>
                <span className="badge badge-orange" style={{ fontSize: '0.65rem' }}>{worker.status}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--orange)', fontSize: '0.85rem', fontWeight: 800, marginTop: '4px' }}>
                <Star size={14} fill="var(--orange)" /> {worker.rating} • Top Rated
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-primary" onClick={() => alert('Opening chat...')} style={{ flex: 1, height: '48px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
              <MessageCircle size={18} /> Chat
            </button>
            <button className="btn-primary" onClick={() => alert('Calling...')} style={{ flex: 1, height: '48px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
              <Phone size={18} /> Call
            </button>
          </div>
        </div>

        {/* Progress & Escrow */}
        <div className="card-glass" style={{ padding: '24px', marginBottom: '24px', borderColor: 'var(--emerald-soft)' }}>
          <div className="flex-between" style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--emerald-soft)', color: 'var(--emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Shield size={20} />
              </div>
              <span style={{ fontSize: '1rem', fontWeight: 800 }}>Escrow Locked</span>
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--emerald)' }}>BND {job.reward}</div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <div className="flex-between" style={{ marginBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Task Progress</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--emerald)' }}>100%</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                style={{ height: '100%', background: 'var(--emerald)', boxShadow: '0 0 10px var(--emerald-glow)' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', background: 'var(--bg-primary)', borderRadius: '12px' }}>
            <Clock size={16} className="text-muted" />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Auto-releases in <span style={{ color: 'var(--text-primary)', fontWeight: 800 }}>{formatTime(timeLeft)}</span> if no action taken
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button className="btn-primary" onClick={() => { alert('Task marked as completed! Funds will be released from escrow.'); navigate('/poster'); }} style={{ height: '64px', background: 'var(--orange)', boxShadow: '0 8px 30px var(--orange-glow)', fontSize: '1.1rem' }}>
            <CheckCircle size={22} /> Mark as Completed
          </button>
          <button className="btn-outline" style={{ height: '56px', borderColor: 'var(--red-soft)', color: 'var(--red)' }}>
            <AlertCircle size={20} /> Report an Issue
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobTracking;
