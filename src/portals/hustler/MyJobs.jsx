import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Clock, CheckCircle, AlertCircle, DollarSign, MapPin, ChevronRight, Shield, Timer } from 'lucide-react';
import { usePayment } from '../../context/PaymentContext';

const MyJobs = () => {
  const navigate = useNavigate();
  const { jobs } = usePayment();
  const [activeTab, setActiveTab] = useState('applied');

  // Mock data for demo
  const appliedJobs = jobs.filter(job => job.status === 'open').slice(0, 2);
  const activeJobs = jobs.filter(job => job.status === 'in_progress' || job.id === 'j1');
  const completedJobs = jobs.filter(job => job.status === 'completed' || job.id === 'j3');

  const tabs = [
    { id: 'applied', label: 'APPLIED', count: appliedJobs.length },
    { id: 'active', label: 'ACTIVE', count: activeJobs.length },
    { id: 'completed', label: 'DONE', count: completedJobs.length }
  ];

  const getCurrentJobs = () => {
    switch (activeTab) {
      case 'applied': return appliedJobs;
      case 'active': return activeJobs;
      case 'completed': return completedJobs;
      default: return appliedJobs;
    }
  };

  return (
    <div className="app-content" style={{ background: 'var(--bg-primary)', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '32px 24px 24px' }}>
        <h1 className="section-title" style={{ fontSize: '1.6rem' }}>My Quests</h1>
        <p className="section-subtitle">Track your earnings and progress</p>
      </div>

      {/* Premium Tabs */}
      <div style={{ padding: '0 24px 20px' }}>
        <div style={{ display: 'flex', background: 'var(--bg-secondary)', borderRadius: '16px', padding: '6px', position: 'relative', border: '1px solid var(--border-glass)' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '12px 0',
                border: 'none',
                background: 'transparent',
                color: activeTab === tab.id ? '#ffffff' : '#94a3b8',
                textShadow: activeTab === tab.id ? '0 0 10px rgba(255,255,255,0.3)' : 'none',
                fontSize: '0.85rem',
                fontWeight: 800,
                zIndex: 2,
                cursor: 'pointer',
                position: 'relative',
                transition: 'color 0.3s'
              }}
            >
              {tab.label}
              {tab.count > 0 && (
                <span style={{ marginLeft: '6px', fontSize: '0.7rem', opacity: 0.6 }}>{tab.count}</span>
              )}
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="activeTab"
                  style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'var(--bg-tertiary)', borderRadius: '12px', zIndex: -1, border: '1px solid var(--border-glass)' }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 24px' }} className="no-scrollbar">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            {getCurrentJobs().length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 24px', opacity: 0.5 }}>
                <Briefcase size={48} className="text-muted" style={{ marginBottom: '16px' }} />
                <p style={{ fontWeight: 800 }}>No quests found here</p>
              </div>
            ) : (
              getCurrentJobs().map(job => (
                <div 
                  key={job.id} 
                  className="card" 
                  style={{ padding: '20px' }}
                  onClick={() => navigate(`/hustler/job/${job.id}`)}
                >
                  <div className="flex-between" style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--orange)' }}>
                        <Briefcase size={16} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 800 }}>{job.title}</h4>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>{job.category} • {job.location_name || 'Brunei-Muara'}</p>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--emerald)' }}>BND {job.reward}</div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700 }}>REWARD</div>
                    </div>
                  </div>

                  <div className="flex-between" style={{ background: 'var(--bg-primary)', padding: '12px', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Shield size={14} className="text-emerald" />
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Escrow Protected</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--orange)' }}>
                      {activeTab === 'active' ? (
                        <>
                          <Timer size={14} /> 24h left
                        </>
                      ) : (
                        <>
                          Details <ChevronRight size={14} />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MyJobs;