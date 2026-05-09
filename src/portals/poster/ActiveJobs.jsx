import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePayment } from '../../context/PaymentContext';
import { Briefcase, Clock, DollarSign, ChevronRight, MapPin, Users, Shield } from 'lucide-react';

const ActiveJobs = () => {
  const navigate = useNavigate();
  const { jobs } = usePayment();
  const activeJobs = jobs.filter(job => job.status !== 'completed');

  const handleJobClick = (job) => {
    if (job.status === 'open') {
      navigate(`/poster/applicants/${job.id}`);
    } else {
      navigate(`/poster/tracking/${job.id}`);
    }
  };

  return (
    <div className="app-content" style={{ background: 'var(--bg-primary)', height: '100%' }}>
      <div style={{ padding: '32px 24px 12px' }}>
        <h1 className="section-title">Your Tasks</h1>
        <p className="section-subtitle">Track progress and manage candidates</p>
      </div>

      <div style={{ padding: '0 24px 24px' }}>
        {activeJobs.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px 24px', borderStyle: 'dashed' }}>
            <Briefcase size={40} className="text-muted" style={{ marginBottom: '16px', opacity: 0.3 }} />
            <p style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '8px' }}>No active tasks</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '24px' }}>Post a job to find local help in Brunei.</p>
            <button className="btn-primary" onClick={() => navigate('/poster/post')} style={{ width: '100%' }}>Post First Task</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {activeJobs.map(job => (
              <div 
                key={job.id} 
                className="card" 
                onClick={() => handleJobClick(job)}
                style={{ padding: '20px' }}
              >
                <div className="flex-between" style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span className={`badge ${job.status === 'open' ? 'badge-orange' : 'badge-emerald'}`}>
                      {job.status === 'open' ? 'Hiring' : 'In Progress'}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} /> {job.timestamp_human || 'Active'}
                    </span>
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'white' }}>BND {job.reward}</div>
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '6px' }}>{job.title}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '16px' }}>
                  <MapPin size={12} className="text-orange" />
                  <span>{job.location_name || 'Gadong Area'}</span>
                </div>

                <div className="flex-between" style={{ background: 'var(--bg-primary)', padding: '12px', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {job.status === 'open' ? (
                      <>
                        <Users size={16} className="text-muted" />
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>3 Applicants</span>
                      </>
                    ) : (
                      <>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--bg-tertiary)', overflow: 'hidden' }}>
                          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Hafizah" alt="worker" />
                        </div>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Assigned to Hafizah</span>
                      </>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 800, color: job.status === 'open' ? 'var(--orange)' : 'var(--emerald)' }}>
                    {job.status === 'open' ? 'Review' : 'Track'} <ChevronRight size={16} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveJobs;
