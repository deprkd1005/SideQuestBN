import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, Clock, CheckCircle, AlertCircle, DollarSign } from 'lucide-react';
import { usePayment } from '../../context/PaymentContext';

const MyJobs = () => {
  const navigate = useNavigate();
  const { jobs, balance } = usePayment();
  const [activeTab, setActiveTab] = useState('applied');

  // Mock data - in real app, filter user's jobs
  const appliedJobs = jobs.filter(job => job.status === 'applied' || job.status === 'accepted');
  const activeJobs = jobs.filter(job => job.status === 'in_progress');
  const completedJobs = jobs.filter(job => job.status === 'completed');

  const tabs = [
    { id: 'applied', label: 'Applied', count: appliedJobs.length },
    { id: 'active', label: 'Active', count: activeJobs.length },
    { id: 'completed', label: 'Completed', count: completedJobs.length }
  ];

  const getCurrentJobs = () => {
    switch (activeTab) {
      case 'applied': return appliedJobs;
      case 'active': return activeJobs;
      case 'completed': return completedJobs;
      default: return appliedJobs;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'applied': return '#f59e0b';
      case 'accepted': return '#10b981';
      case 'in_progress': return '#3b82f6';
      case 'completed': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'applied': return <Clock size={16} />;
      case 'accepted': return <CheckCircle size={16} />;
      case 'in_progress': return <Briefcase size={16} />;
      case 'completed': return <CheckCircle size={16} />;
      default: return <AlertCircle size={16} />;
    }
  };

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
          My Jobs
        </h1>

        {/* Balance Card */}
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: '12px',
          padding: '1rem',
          marginBottom: '1rem',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <p style={{
                fontSize: '0.9rem',
                color: 'var(--text-secondary)',
                marginBottom: '4px'
              }}>
                Available Balance
              </p>
              <p style={{
                fontSize: '1.5rem',
                fontWeight: 900,
                color: 'var(--emerald)'
              }}>
                BND {balance.toFixed(2)}
              </p>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'var(--emerald-soft)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <DollarSign size={24} color="var(--emerald)" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          background: 'var(--bg-secondary)',
          borderRadius: '12px',
          padding: '4px',
          marginBottom: '1rem'
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '10px',
                background: activeTab === tab.id ? 'var(--bg-primary)' : 'transparent',
                border: 'none',
                borderRadius: '8px',
                color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: activeTab === tab.id ? 700 : 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                position: 'relative'
              }}
            >
              {tab.label}
              {tab.count > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  background: 'var(--emerald)',
                  color: 'white',
                  borderRadius: '10px',
                  padding: '2px 6px',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  minWidth: '18px',
                  textAlign: 'center'
                }}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs List */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '1rem'
      }}>
        {getCurrentJobs().length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem 1rem',
            color: 'var(--text-muted)'
          }}>
            <Briefcase size={48} color="var(--text-muted)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <p style={{
              fontSize: '1.1rem',
              fontWeight: 600,
              marginBottom: '0.5rem'
            }}>
              No {activeTab} jobs
            </p>
            <p style={{
              fontSize: '0.9rem',
              color: 'var(--text-secondary)'
            }}>
              {activeTab === 'applied' && 'Apply for jobs to get started'}
              {activeTab === 'active' && 'Your active jobs will appear here'}
              {activeTab === 'completed' && 'Completed jobs will show your history'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '12px' }}>
            {getCurrentJobs().map(job => (
              <motion.div
                key={job.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/hustler/job/${job.id}`)}
                style={{
                  background: 'var(--bg-card)',
                  borderRadius: '16px',
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
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      marginBottom: '4px'
                    }}>
                      {job.title}
                    </h3>
                    <p style={{
                      fontSize: '0.9rem',
                      color: 'var(--text-secondary)'
                    }}>
                      {job.category} • {job.mukim}
                    </p>
                  </div>
                  <div style={{
                    fontSize: '1.2rem',
                    fontWeight: 900,
                    color: 'var(--emerald)'
                  }}>
                    BND {job.reward}
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: getStatusColor(job.status),
                    fontSize: '0.9rem',
                    fontWeight: 600
                  }}>
                    {getStatusIcon(job.status)}
                    {job.status.replace('_', ' ').toUpperCase()}
                  </div>
                  <span style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)'
                  }}>
                    {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {job.status === 'in_progress' && (
                  <div style={{
                    marginTop: '12px',
                    padding: '8px',
                    background: 'var(--emerald-soft)',
                    borderRadius: '8px'
                  }}>
                    <p style={{
                      fontSize: '0.8rem',
                      color: 'var(--emerald)',
                      fontWeight: 600,
                      textAlign: 'center'
                    }}>
                      Job in progress - Complete when done
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyJobs;