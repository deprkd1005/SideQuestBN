import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Briefcase, Users, CheckCircle, TrendingUp, ArrowRight, Bell, Shield, MapPin, Clock, ChevronRight } from 'lucide-react';
import { usePayment } from '../../context/PaymentContext';

const PosterDashboard = () => {
  const navigate = useNavigate();
  const { jobs } = usePayment();

  const activeJobs = jobs.filter(job => job.status !== 'completed');
  const completedJobs = jobs.filter(job => job.status === 'completed');

  const stats = [
    { label: 'Active', value: activeJobs.length, icon: Briefcase, color: 'var(--orange)' },
    { label: 'Spent', value: 'BND 450', icon: TrendingUp, color: 'var(--emerald)' },
    { label: 'Done', value: completedJobs.length, icon: CheckCircle, color: 'var(--emerald)' }
  ];

  return (
    <div style={{ flex: 1 }}>
      {/* Header Overlay */}
      <div style={{ padding: '32px 24px 12px' }}>
        <div className="flex-between">
          <div>
            <h1 className="section-title">Poster Hub</h1>
            <p className="section-subtitle">Find local help quickly</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="card-glass" style={{ width: '48px', height: '48px', borderRadius: '16px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bell size={20} className="text-muted" />
            </button>
            <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 24px 24px' }}>
        {/* Large Prominent CTA */}
        <motion.button 
          whileTap={{ scale: 0.97 }}
          className="btn-primary" 
          onClick={() => navigate('/poster/post')}
          style={{ 
            width: '100%', 
            height: '72px', 
            background: 'var(--orange)', 
            boxShadow: '0 8px 30px var(--orange-glow)',
            fontSize: '1.2rem',
            marginBottom: '32px',
            borderRadius: '24px'
          }}
        >
          <div style={{ background: 'rgba(255,255,255,0.2)', width: '36px', height: '36px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '8px' }}>
            <Plus size={24} strokeWidth={3} />
          </div>
          Post a New Task
        </motion.button>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
          {stats.map(stat => (
            <div key={stat.label} className="card" style={{ padding: '20px 12px', textAlign: 'center', borderColor: 'rgba(255,255,255,0.03)' }}>
              <div style={{ color: stat.color, marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>
                <stat.icon size={20} />
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: 900 }}>{stat.value}</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800, marginTop: '4px' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Active Tasks Section */}
        <div className="flex-between" style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Manage Tasks</h3>
          <button className="btn-ghost" onClick={() => navigate('/poster/active')} style={{ fontSize: '0.85rem', color: 'var(--orange)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
            View All <ArrowRight size={16} />
          </button>
        </div>

        {activeJobs.length === 0 ? (
          <div className="card" style={{ padding: '40px 24px', textAlign: 'center', borderStyle: 'dashed' }}>
            <div style={{ width: '64px', height: '64px', background: 'var(--bg-tertiary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', opacity: 0.5 }}>
              <Briefcase size={24} />
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>You haven't posted any tasks yet.</p>
            <button className="btn-outline" onClick={() => navigate('/poster/post')} style={{ width: '100%' }}>Create Task</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {activeJobs.slice(0, 3).map(job => (
              <div key={job.id} className="card" onClick={() => navigate(`/poster/applicants/${job.id}`)} style={{ padding: '20px' }}>
                <div className="flex-between" style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span className="badge badge-orange">BND {job.reward}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} /> {job.timestamp_human || 'Active'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--emerald)' }}>
                    <Shield size={14} /> Escrow
                  </div>
                </div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '4px' }}>{job.title}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '16px' }}>
                  <MapPin size={12} className="text-orange" />
                  <span>{job.location_name || 'Gadong Area'}</span>
                </div>
                
                <div className="flex-between" style={{ background: 'var(--bg-primary)', padding: '12px', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ display: 'flex', marginLeft: '4px' }}>
                      {[1,2,3].map(i => (
                        <div key={i} style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--bg-tertiary)', border: '2px solid var(--bg-card)', marginLeft: '-8px', overflow: 'hidden' }}>
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+10}`} alt="applicant" />
                        </div>
                      ))}
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>3 Applicants</span>
                  </div>
                  <ChevronRight size={18} className="text-muted" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PosterDashboard;