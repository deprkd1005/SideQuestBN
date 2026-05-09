import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserCheck, Users, Clock, DollarSign, ArrowLeft, Star, MapPin, MessageCircle, X, Check, Shield } from 'lucide-react';
import { usePayment } from '../../context/PaymentContext';

const Applicants = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { jobs } = usePayment();
  const job = jobs.find(item => item.id === jobId);

  const applicants = [
    { id: 'a1', name: 'Hafizah', rating: 4.9, distance: '1.2 km', skills: ['Gardening', 'Fast'], jobs: 42 },
    { id: 'a2', name: 'Farhan', rating: 4.7, distance: '0.8 km', skills: ['Heavy Lifting', 'Pro'], jobs: 18 },
    { id: 'a3', name: 'Aisyah', rating: 4.8, distance: '2.5 km', skills: ['Cleaning', 'Punctual'], jobs: 24 }
  ];

  return (
    <div className="app-content" style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div style={{ padding: '24px 20px', display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid var(--border-glass)' }}>
        <button className="card-glass" style={{ width: '40px', height: '40px', borderRadius: '12px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 900 }}>Applicants</h1>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>{job?.title || 'Job Selection'}</p>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px' }} className="no-scrollbar">
        {/* Job Summary Card */}
        <div className="card-glass" style={{ padding: '20px', marginBottom: '32px', borderColor: 'var(--orange-soft)' }}>
          <div className="flex-between" style={{ marginBottom: '12px' }}>
            <span className="badge badge-orange">Budget: BND {job?.reward}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--emerald)' }}>
              <Shield size={14} /> Escrow Protected
            </div>
          </div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '8px' }}>{job?.title}</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            Choose the best candidate for your task. Funds are already secured in escrow.
          </p>
        </div>

        <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '16px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Top Candidates ({applicants.length})</h3>

        <div style={{ display: 'grid', gap: '16px' }}>
          {applicants.map(applicant => (
            <motion.div 
              key={applicant.id} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card" 
              style={{ padding: '20px' }}
            >
              <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '18px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${applicant.name}`} alt="avatar" />
                </div>
                <div style={{ flex: 1 }}>
                  <div className="flex-between">
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{applicant.name}</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--orange-soft)', padding: '4px 8px', borderRadius: '8px', color: 'var(--orange)', fontSize: '0.8rem', fontWeight: 800 }}>
                      <Star size={14} fill="var(--orange)" /> {applicant.rating}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={14} /> {applicant.distance}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <UserCheck size={14} /> {applicant.jobs} Jobs
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                {applicant.skills.map(skill => (
                  <span key={skill} style={{ fontSize: '0.7rem', fontWeight: 700, padding: '4px 10px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-secondary)' }}>
                    {skill}
                  </span>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn-primary" onClick={() => { alert(`Accepted ${applicant.name}!`); navigate(-1); }} style={{ flex: 2, height: '48px', background: 'var(--emerald)', boxShadow: '0 4px 15px var(--emerald-glow)' }}>
                  <Check size={18} /> Accept
                </button>
                <button className="btn-outline" onClick={() => alert(`Opening chat with ${applicant.name}...`)} style={{ flex: 1, height: '48px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MessageCircle size={20} />
                </button>
                <button className="btn-ghost" onClick={() => alert(`Rejected ${applicant.name}`)} style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-secondary)', borderRadius: '14px' }}>
                  <X size={20} className="text-red" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Applicants;
