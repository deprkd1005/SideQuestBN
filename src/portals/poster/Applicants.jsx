import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePayment } from '../../context/PaymentContext';
import { UserCheck, Users, Clock, DollarSign } from 'lucide-react';

const Applicants = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { jobs } = usePayment();
  const job = jobs.find(item => item.id === jobId);

  const applicants = [
    { id: 'a1', name: 'Hafizah', rating: 4.9, eta: '30 min', bid: 'BND 25' },
    { id: 'a2', name: 'Farhan', rating: 4.7, eta: '45 min', bid: 'BND 30' },
    { id: 'a3', name: 'Aisyah', rating: 4.8, eta: '35 min', bid: 'BND 28' }
  ];

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
        background: 'var(--bg-primary)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            border: 'none',
            background: 'var(--bg-secondary)',
            borderRadius: '12px',
            padding: '10px',
            cursor: 'pointer',
            color: 'var(--text-secondary)'
          }}>
          ←
        </button>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)' }}>
          Applicants
        </h1>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: '18px',
          padding: '1.25rem',
          border: '1px solid var(--border-color)',
          marginBottom: '1rem'
        }}>
          <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {job?.title || 'Job Applicants'}
          </h2>
          <p style={{ margin: '8px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Review the best local candidates and accept the right hustler.
          </p>
        </div>

        <div style={{ display: 'grid', gap: '12px' }}>
          {applicants.map(applicant => (
            <div key={applicant.id} style={{
              background: 'var(--bg-card)',
              borderRadius: '18px',
              padding: '1rem',
              border: '1px solid var(--border-color)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{applicant.name}</h3>
                  <p style={{ margin: '6px 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Rating {applicant.rating} • ETA {applicant.eta}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: 0, fontSize: '1rem', fontWeight: 900, color: 'var(--emerald)' }}>{applicant.bid}</p>
                  <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '0.8rem' }}>Bid</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                <button style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '14px',
                  border: 'none',
                  background: 'var(--emerald)',
                  color: 'white',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}>
                  Accept
                </button>
                <button style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '14px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  cursor: 'pointer'
                }}>
                  Message
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Applicants;
