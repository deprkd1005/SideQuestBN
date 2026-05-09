import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Clock, DollarSign, User, CheckCircle, Shield, Calendar, Tag, ChevronRight } from 'lucide-react';
import { usePayment } from '../../context/PaymentContext';
import MapView from '../../components/MapView';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { jobs, acceptJob, userLocation } = usePayment();

  const job = jobs.find(j => String(j.id) === String(id));

  if (!job) {
    return (
      <div className="flex-center" style={{ height: '100vh', flexDirection: 'column', gap: '16px' }}>
        <p className="text-muted">Job not found</p>
        <button className="btn-outline" onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  const [isApplied, setIsApplied] = React.useState(false);

  const handleAccept = async () => {
    try {
      await acceptJob(job.id);
    } catch (error) {
      console.warn("Backend accept failed, proceeding for prototype");
    }
    setIsApplied(true);
    setTimeout(() => navigate('/hustler/jobs'), 2500);
  };

  if (isApplied) {
    return (
      <div className="app-content no-pad flex-center" style={{ height: '100vh', background: 'var(--bg-primary)', flexDirection: 'column', gap: '24px' }}>
        <motion.div 
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 12, stiffness: 200 }}
          style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--emerald-soft)', color: 'var(--emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <CheckCircle size={60} strokeWidth={3} />
        </motion.div>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '8px' }}>Quest Applied!</h2>
          <p style={{ color: 'var(--text-muted)', fontWeight: 700 }}>Waiting for poster approval. ⏳</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-content no-pad">
      {/* Hero Header */}
      <div style={{ position: 'relative', height: '240px', background: 'var(--bg-tertiary)' }}>
        <div style={{ height: '100%', width: '100%', opacity: 0.6 }}>
          <MapView 
            jobs={[job]} 
            userLocation={userLocation} 
            interactive={false}
          />
        </div>
        <div className="glass-overlay" style={{ position: 'absolute', top: '16px', left: '16px', borderRadius: '12px' }}>
          <button className="btn-ghost" onClick={() => navigate(-1)} style={{ color: 'white' }}>
            <ArrowLeft size={20} />
          </button>
        </div>
        <div style={{ 
          position: 'absolute', 
          bottom: '-24px', 
          left: '20px', 
          right: '20px',
          zIndex: 5
        }}>
          <div className="card-elevated" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span className="badge badge-emerald" style={{ marginBottom: '8px' }}>{job.category}</span>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{job.title}</h1>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--emerald)' }}>BND {job.reward}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Fixed Budget</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '48px 20px 100px' }}>
        {/* Quick Info */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
          <div className="card" style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Calendar size={18} className="text-emerald" />
            <div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Date</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{new Date(job.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
          <div className="card" style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MapPin size={18} className="text-emerald" />
            <div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Location</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{job.mukim}</div>
            </div>
          </div>
        </div>

        {/* Escrow Shield */}
        <div className="card-glass" style={{ marginBottom: '24px', background: 'var(--emerald-soft)', borderColor: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Shield size={20} className="text-emerald" />
          <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--emerald)' }}>Funds secured in SideQuest Escrow</p>
        </div>

        {/* Description */}
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px' }}>Task Description</h3>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '24px' }}>
          {job.description}
        </p>

        {/* Poster Profile */}
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px' }}>About the Poster</h3>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${job.payer}`} alt="avatar" />
          </div>
          <div style={{ flex: 1 }}>
            <div className="flex-between">
              <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{job.payer}</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle size={14} className="text-emerald" />
                <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Verified</span>
              </div>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Joined Jan 2024 • 12 Tasks Posted</p>
          </div>
          <ChevronRight size={20} className="text-muted" />
        </div>
      </div>

      {/* Floating Apply Button */}
      {job.status === 'open' && (
        <div style={{ 
          position: 'fixed', 
          bottom: '100px', 
          left: '20px', 
          right: '20px',
          zIndex: 100 
        }}>
          <button className="btn-cta" onClick={handleAccept} style={{ boxShadow: 'var(--shadow-lg)' }}>
            Apply for this Quest
          </button>
        </div>
      )}
    </div>
  );
};

export default JobDetails;