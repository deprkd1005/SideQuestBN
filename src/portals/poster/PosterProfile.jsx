import React from 'react';
import { User, Briefcase, ShieldCheck, Trophy, MapPin } from 'lucide-react';
import { usePayment } from '../../context/PaymentContext';

const PosterProfile = () => {
  const { user } = usePayment();

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg-primary)'
    }}>
      <div style={{
        padding: '1rem',
        background: 'var(--bg-primary)',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: 900,
          color: 'var(--text-primary)'
        }}>
          Poster Profile
        </h1>
      </div>

      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '1rem'
      }}>
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: '18px',
          padding: '1.5rem',
          marginBottom: '1rem',
          border: '1px solid var(--border-color)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'var(--orange-soft)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem'
          }}>
            <User size={36} color='var(--orange)' />
          </div>
          <h2 style={{
            fontSize: '1.4rem',
            fontWeight: 900,
            color: 'var(--text-primary)',
            marginBottom: '0.5rem'
          }}>
            {user?.name || 'Nada Bakar'}
          </h2>
          <p style={{
            color: 'var(--text-secondary)',
            marginBottom: '1rem'
          }}>
            Trusted Poster with fast approvals and local jobs
          </p>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'var(--bg-secondary)',
            padding: '8px 12px',
            borderRadius: '999px'
          }}>
            <ShieldCheck size={16} color='var(--orange)' />
            <span style={{ color: 'var(--orange)', fontWeight: 700, fontSize: '0.85rem' }}>
              Verified Poster
            </span>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gap: '12px',
          marginBottom: '1rem'
        }}>
          {[
            { icon: Briefcase, label: 'Posted Jobs', value: '18' },
            { icon: Trophy, label: 'Repeat Bookings', value: '12' },
            { icon: ShieldCheck, label: 'Escrow Protected', value: '100%' }
          ].map(item => (
            <div key={item.label} style={{
              background: 'var(--bg-card)',
              borderRadius: '16px',
              padding: '1rem',
              border: '1px solid var(--border-color)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <item.icon size={24} color='var(--orange)' />
                  <div>
                    <p style={{
                      fontSize: '0.85rem',
                      color: 'var(--text-secondary)',
                      margin: 0
                    }}>
                      {item.label}
                    </p>
                    <p style={{
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      margin: 0
                    }}>
                      {item.value}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{
          background: 'var(--bg-card)',
          borderRadius: '18px',
          padding: '1.5rem',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '1rem'
          }}>
            <MapPin size={20} color='var(--text-secondary)' />
            <p style={{
              fontSize: '0.9rem',
              color: 'var(--text-secondary)',
              margin: 0
            }}>
              Bandar Seri Begawan, Brunei Darussalam
            </p>
          </div>
          <p style={{
            fontSize: '0.95rem',
            lineHeight: '1.6',
            color: 'var(--text-secondary)'
          }}>
            Manage your job postings, review applications, and keep escrow safe for every task. Your profile is the hub for trusted local gigs.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PosterProfile;
