import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Briefcase, Users, CheckCircle, TrendingUp } from 'lucide-react';
import { usePayment } from '../../context/PaymentContext';

const PosterDashboard = () => {
  const navigate = useNavigate();
  const { jobs } = usePayment();

  // Mock data for poster
  const activeJobs = jobs.filter(job => job.status !== 'completed');
  const completedJobs = jobs.filter(job => job.status === 'completed');

  const stats = [
    { label: 'Active Jobs', value: activeJobs.length, icon: Briefcase, color: 'var(--orange)' },
    { label: 'Total Spent', value: 'BND 450', icon: TrendingUp, color: 'var(--emerald)' },
    { label: 'Completed', value: completedJobs.length, icon: CheckCircle, color: 'var(--emerald)' }
  ];

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg-primary)'
    }}>
      {/* Header */}
      <div style={{
        padding: '1rem',
        background: 'var(--bg-primary)',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: 900,
          color: 'var(--text-primary)',
          marginBottom: '1rem'
        }}>
          Dashboard
        </h1>

        {/* Post Job Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/poster/post')}
          style={{
            width: '100%',
            background: 'var(--orange)',
            color: 'white',
            border: 'none',
            padding: '16px',
            borderRadius: '12px',
            fontSize: '1.1rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: 'var(--shadow-glow-orange)'
          }}
        >
          <Plus size={20} />
          Post a New Job
        </motion.button>
      </div>

      {/* Stats */}
      <div style={{ padding: '1rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '12px',
          marginBottom: '2rem'
        }}>
          {stats.map(stat => (
            <div key={stat.label} style={{
              background: 'var(--bg-card)',
              borderRadius: '12px',
              padding: '1rem',
              textAlign: 'center',
              border: '1px solid var(--border-color)'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: `${stat.color}20`,
                margin: '0 auto 8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <stat.icon size={20} style={{ color: stat.color }} />
              </div>
              <p style={{
                fontSize: '1.5rem',
                fontWeight: 900,
                color: 'var(--text-primary)',
                margin: '0 0 4px 0'
              }}>
                {stat.value}
              </p>
              <p style={{
                fontSize: '0.8rem',
                color: 'var(--text-secondary)',
                margin: 0
              }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Active Jobs */}
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: '16px',
          padding: '1.5rem',
          marginBottom: '1rem',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <h3 style={{
              fontSize: '1.2rem',
              fontWeight: 700,
              color: 'var(--text-primary)'
            }}>
              Active Jobs
            </h3>
            <button
              onClick={() => navigate('/poster/active')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--orange)',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              View All
            </button>
          </div>

          {activeJobs.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '2rem 1rem',
              color: 'var(--text-muted)'
            }}>
              <Briefcase size={32} color="var(--text-muted)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <p style={{ fontSize: '0.9rem' }}>No active jobs</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Post a job to get started
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '12px' }}>
              {activeJobs.slice(0, 3).map(job => (
                <motion.div
                  key={job.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/poster/applicants/${job.id}`)}
                  style={{
                    background: 'var(--bg-secondary)',
                    borderRadius: '12px',
                    padding: '1rem',
                    cursor: 'pointer',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '8px'
                  }}>
                    <div>
                      <h4 style={{
                        fontSize: '1rem',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        marginBottom: '4px'
                      }}>
                        {job.title}
                      </h4>
                      <p style={{
                        fontSize: '0.8rem',
                        color: 'var(--text-secondary)'
                      }}>
                        {job.category} • {job.mukim}
                      </p>
                    </div>
                    <div style={{
                      fontSize: '1.1rem',
                      fontWeight: 900,
                      color: 'var(--orange)'
                    }}>
                      BND {job.reward}
                    </div>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{
                      fontSize: '0.8rem',
                      color: 'var(--text-muted)',
                      background: 'var(--bg-tertiary)',
                      padding: '4px 8px',
                      borderRadius: '12px'
                    }}>
                      {job.status.replace('_', ' ')}
                    </span>
                    <span style={{
                      fontSize: '0.8rem',
                      color: 'var(--text-secondary)'
                    }}>
                      {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: '16px',
          padding: '1.5rem',
          border: '1px solid var(--border-color)'
        }}>
          <h3 style={{
            fontSize: '1.2rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: '1rem'
          }}>
            Recent Activity
          </h3>

          <div style={{ display: 'grid', gap: '12px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              background: 'var(--bg-secondary)',
              borderRadius: '8px'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'var(--emerald-soft)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Users size={16} color="var(--emerald)" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  margin: 0
                }}>
                  New applicant for "House Cleaning"
                </p>
                <p style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                  margin: 0
                }}>
                  2 minutes ago
                </p>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              background: 'var(--bg-secondary)',
              borderRadius: '8px'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'var(--orange-soft)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <CheckCircle size={16} color="var(--orange)" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  margin: 0
                }}>
                  Job "Garden Maintenance" completed
                </p>
                <p style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                  margin: 0
                }}>
                  1 hour ago
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PosterDashboard;