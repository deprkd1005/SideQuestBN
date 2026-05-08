import React from 'react';
import { UserCog, Shield, BarChart3, Star } from 'lucide-react';

const AdminProfile = () => {
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
          Admin Profile
        </h1>
      </div>

      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '1rem'
      }}>
        <div style={{
          display: 'grid',
          gap: '12px',
          marginBottom: '1rem'
        }}>
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: '18px',
            padding: '1.5rem',
            border: '1px solid var(--border-color)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'var(--blue-soft)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              <UserCog size={36} color='var(--blue)' />
            </div>
            <h2 style={{
              fontSize: '1.4rem',
              fontWeight: 900,
              color: 'var(--text-primary)',
              marginBottom: '0.5rem'
            }}>
              Platform Admin
            </h2>
            <p style={{
              color: 'var(--text-secondary)',
              marginBottom: '1rem'
            }}>
              Manage safety, monitor escrow, and keep SideQuest.BN running smoothly.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gap: '12px'
          }}>
            {[
              { icon: BarChart3, title: 'Daily insights', detail: 'Track volume and trending jobs' },
              { icon: Shield, title: 'Security mode', detail: 'Manage trust and verification' },
              { icon: Star, title: 'Support rating', detail: 'Monitor system reliability' }
            ].map(item => (
              <div key={item.title} style={{
                background: 'var(--bg-card)',
                borderRadius: '16px',
                padding: '1.2rem',
                border: '1px solid var(--border-color)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '10px'
                }}>
                  <item.icon size={22} color='var(--blue)' />
                  <h3 style={{
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    margin: 0
                  }}>
                    {item.title}
                  </h3>
                </div>
                <p style={{
                  fontSize: '0.9rem',
                  color: 'var(--text-secondary)',
                  margin: 0
                }}>
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          background: 'var(--bg-card)',
          borderRadius: '18px',
          padding: '1.5rem',
          border: '1px solid var(--border-color)'
        }}>
          <h3 style={{
            fontSize: '1.1rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: '1rem'
          }}>
            Quick Actions
          </h3>
          <div style={{ display: 'grid', gap: '10px' }}>
            <button style={{
              width: '100%',
              padding: '14px',
              borderRadius: '14px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              fontWeight: 700,
              cursor: 'pointer'
            }}>
              Review Escrow Cases
            </button>
            <button style={{
              width: '100%',
              padding: '14px',
              borderRadius: '14px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              fontWeight: 700,
              cursor: 'pointer'
            }}>
              Verify New Users
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
