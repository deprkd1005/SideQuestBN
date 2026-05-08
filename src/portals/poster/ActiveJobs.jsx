import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePayment } from '../../context/PaymentContext';
import { Briefcase, Clock, DollarSign } from 'lucide-react';

const ActiveJobs = () => {
  const navigate = useNavigate();
  const { jobs } = usePayment();
  const activeJobs = jobs.filter(job => job.status !== 'completed');

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg-primary)'
    }}>
      <div style={{
        padding: '1rem',
        borderBottom: '1px solid var(--border-color)',
        background: 'var(--bg-primary)'
      }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)' }}>
          Active Jobs
        </h1>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
        {activeJobs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-secondary)' }}>
            <Briefcase size={40} color='var(--text-muted)' />
            <p style={{ marginTop: '1rem', fontSize: '1rem', fontWeight: 700 }}>No active jobs yet</p>
            <p style={{ color: 'var(--text-secondary)' }}>Post a job and it will appear here for review.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '14px' }}>
            {activeJobs.map(job => (
              <button
                key={job.id}
                onClick={() => navigate(`/poster/applicants/${job.id}`)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  background: 'var(--bg-card)',
                  borderRadius: '18px',
                  border: '1px solid var(--border-color)',
                  padding: '1.2rem',
                  display: 'grid',
                  gap: '10px',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                  <div>
                    <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{job.title}</h2>
                    <p style={{ margin: '6px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{job.category} • {job.mukim}</p>
                  </div>
                  <span style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--orange)' }}>BND {job.reward}</span>
                </div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <span style={{ padding: '6px 10px', borderRadius: '14px', background: 'var(--bg-secondary)', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Status: {job.status.replace('_', ' ')}</span>
                  <span style={{ padding: '6px 10px', borderRadius: '14px', background: 'var(--bg-secondary)', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>ETA: {job.duration || 'Flexible'}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveJobs;
