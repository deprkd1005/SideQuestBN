import React from 'react';
import { motion } from 'framer-motion';
import { Users, Briefcase, Shield, AlertTriangle, TrendingUp, CheckCircle } from 'lucide-react';

const AdminDashboard = () => {
  // Mock admin data
  const stats = [
    { label: 'Total Users', value: '1,247', icon: Users, color: '#3b82f6' },
    { label: 'Active Jobs', value: '89', icon: Briefcase, color: '#10b981' },
    { label: 'Escrow Total', value: 'BND 12,450', icon: Shield, color: '#f59e0b' },
    { label: 'Reports', value: '12', icon: AlertTriangle, color: '#ef4444' }
  ];

  const pendingVerifications = [
    { id: 1, name: 'Ahmad Rahman', role: 'Hustler', icColor: 'Blue', submitted: '2 hours ago' },
    { id: 2, name: 'Siti Aminah', role: 'Poster', icColor: 'Yellow', submitted: '5 hours ago' },
    { id: 3, name: 'John Smith', role: 'Hustler', icColor: 'Green', submitted: '1 day ago' }
  ];

  const recentReports = [
    { id: 1, type: 'Job Dispute', status: 'Pending', reported: '1 hour ago' },
    { id: 2, type: 'User Complaint', status: 'Resolved', reported: '3 hours ago' },
    { id: 3, type: 'Payment Issue', status: 'Investigating', reported: '6 hours ago' }
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
          color: 'var(--text-primary)'
        }}>
          Admin Panel
        </h1>
      </div>

      {/* Stats */}
      <div style={{ padding: '1rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          marginBottom: '2rem'
        }}>
          {stats.map(stat => (
            <div key={stat.label} style={{
              background: 'var(--bg-card)',
              borderRadius: '12px',
              padding: '1rem',
              border: '1px solid var(--border-color)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: `${stat.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <stat.icon size={16} style={{ color: stat.color }} />
                </div>
                <span style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                  fontWeight: 600
                }}>
                  {stat.label}
                </span>
              </div>
              <p style={{
                fontSize: '1.5rem',
                fontWeight: 900,
                color: 'var(--text-primary)',
                margin: 0
              }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Pending Verifications */}
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
              Identity Verifications
            </h3>
            <span style={{
              background: 'var(--orange-soft)',
              color: 'var(--orange)',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '0.8rem',
              fontWeight: 600
            }}>
              {pendingVerifications.length} pending
            </span>
          </div>

          <div style={{ display: 'grid', gap: '12px' }}>
            {pendingVerifications.map(user => (
              <div key={user.id} style={{
                background: 'var(--bg-secondary)',
                borderRadius: '12px',
                padding: '1rem',
                border: '1px solid var(--border-color)'
              }}>
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
                      {user.name}
                    </h4>
                    <p style={{
                      fontSize: '0.8rem',
                      color: 'var(--text-secondary)'
                    }}>
                      {user.role} • IC {user.icColor}
                    </p>
                  </div>
                  <span style={{
                    fontSize: '0.7rem',
                    color: 'var(--text-muted)',
                    background: 'var(--bg-tertiary)',
                    padding: '4px 8px',
                    borderRadius: '8px'
                  }}>
                    {user.submitted}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    style={{
                      flex: 1,
                      background: 'var(--emerald)',
                      color: 'white',
                      border: 'none',
                      padding: '8px',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Approve
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    style={{
                      flex: 1,
                      background: 'var(--red-soft)',
                      color: 'var(--red)',
                      border: '1px solid var(--red)',
                      padding: '8px',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Reject
                  </motion.button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reports */}
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: '16px',
          padding: '1.5rem',
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
              Recent Reports
            </h3>
            <span style={{
              background: 'var(--red-soft)',
              color: 'var(--red)',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '0.8rem',
              fontWeight: 600
            }}>
              {recentReports.filter(r => r.status === 'Pending').length} pending
            </span>
          </div>

          <div style={{ display: 'grid', gap: '12px' }}>
            {recentReports.map(report => (
              <div key={report.id} style={{
                background: 'var(--bg-secondary)',
                borderRadius: '12px',
                padding: '1rem',
                border: '1px solid var(--border-color)'
              }}>
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
                      {report.type}
                    </h4>
                    <p style={{
                      fontSize: '0.8rem',
                      color: 'var(--text-secondary)'
                    }}>
                      Reported {report.reported}
                    </p>
                  </div>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: report.status === 'Resolved' ? 'var(--emerald)' :
                           report.status === 'Investigating' ? 'var(--orange)' : 'var(--red)',
                    background: report.status === 'Resolved' ? 'var(--emerald-soft)' :
                               report.status === 'Investigating' ? 'var(--orange-soft)' : 'var(--red-soft)',
                    padding: '4px 8px',
                    borderRadius: '8px'
                  }}>
                    {report.status}
                  </span>
                </div>
                {report.status !== 'Resolved' && (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    style={{
                      width: '100%',
                      background: 'var(--blue)',
                      color: 'white',
                      border: 'none',
                      padding: '8px',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Review Report
                  </motion.button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;