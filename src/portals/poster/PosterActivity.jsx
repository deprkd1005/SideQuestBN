import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, Clock, ChevronRight, CheckCircle, XCircle, Zap, MapPin, Users, Plus } from 'lucide-react';
import { usePayment } from '../../context/PaymentContext';

const PosterActivity = () => {
  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' or 'tasks'
  const { orders, jobs, refresh, user } = usePayment();
  const navigate = useNavigate();

  useEffect(() => {
    refresh();
  }, []);

  // Filter Bookings (services the poster booked)
  const myOrders = orders.filter(o => o.customerId === user?.id);

  // Filter Tasks (custom jobs the poster posted)
  const activeJobs = jobs.filter(job => job.status !== 'completed' && job.providerId === user?.id);

  const getOrderStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'var(--gold)';
      case 'accepted': return 'var(--emerald)';
      case 'in_progress': return '#3b82f6';
      case 'completed': return 'var(--emerald)';
      case 'cancelled': return '#ef4444';
      default: return 'var(--text-muted)';
    }
  };

  const handleJobClick = (job) => {
    if (job.status === 'open') {
      navigate(`/poster/applicants/${job.id}`);
    } else {
      navigate(`/poster/tracking/${job.id}`);
    }
  };

  return (
    <div className="app-content no-scrollbar" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div style={{ padding: '40px 24px 12px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: 'Outfit' }}>My <span className="text-emerald">Activity</span></h1>
        <p style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem' }}>Track your bookings and posted tasks</p>
      </div>

      {/* Segmented Control / Tabs */}
      <div style={{ padding: '0 24px 20px' }}>
        <div style={{ display: 'flex', background: 'var(--bg-card)', padding: '4px', borderRadius: '16px', border: '1px solid var(--border-glass)' }}>
          <button 
            onClick={() => setActiveTab('bookings')}
            style={{ 
              flex: 1, 
              padding: '12px', 
              borderRadius: '12px', 
              border: 'none', 
              background: activeTab === 'bookings' ? 'var(--emerald)' : 'transparent',
              color: activeTab === 'bookings' ? 'white' : 'var(--text-secondary)',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Bookings ({myOrders.length})
          </button>
          <button 
            onClick={() => setActiveTab('tasks')}
            style={{ 
              flex: 1, 
              padding: '12px', 
              borderRadius: '12px', 
              border: 'none', 
              background: activeTab === 'tasks' ? 'var(--emerald)' : 'transparent',
              color: activeTab === 'tasks' ? 'white' : 'var(--text-secondary)',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Posted Tasks ({activeJobs.length})
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div style={{ padding: '0 24px 100px' }}>
        {activeTab === 'bookings' ? (
          /* Bookings List */
          myOrders.length === 0 ? (
            <div className="card-glass" style={{ padding: '60px 24px', textAlign: 'center' }}>
              <Briefcase size={40} className="text-muted" style={{ marginBottom: '16px', opacity: 0.3 }} />
              <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>You haven't ordered any services yet.</p>
              <button onClick={() => navigate('/poster')} className="btn-primary" style={{ marginTop: '20px', width: '100%' }}>Explore Services</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {myOrders.map(order => (
                <motion.div 
                  key={order.id} 
                  whileTap={{ scale: 0.98 }}
                  className="card" 
                  onClick={() => navigate(`/poster/order/${order.id}`)}
                  style={{ background: 'var(--bg-card)', borderLeft: `4px solid ${getOrderStatusColor(order.status)}` }}
                >
                  <div className="flex-between" style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: getOrderStatusColor(order.status) }} />
                      <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: getOrderStatusColor(order.status) }}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.9rem', fontWeight: 900 }}>BND {order.service.price}</span>
                  </div>

                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '6px', color: 'var(--text-primary)' }}>{order.service.title}</h4>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600 }}>
                      <Clock size={14} />
                      <span>Ordered on {new Date(order.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex-between" style={{ padding: '12px', background: 'var(--bg-tertiary)', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '10px', overflow: 'hidden' }}>
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${order.providerId}`} alt="provider" />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>{order.provider.fullname}</div>
                        <div style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-muted)' }}>Provider</div>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-muted" />
                  </div>
                </motion.div>
              ))}
            </div>
          )
        ) : (
          /* Posted Tasks List */
          activeJobs.length === 0 ? (
            <div className="card-glass" style={{ padding: '60px 24px', textAlign: 'center' }}>
              <Briefcase size={40} className="text-muted" style={{ marginBottom: '16px', opacity: 0.3 }} />
              <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>No active tasks posted.</p>
              <button onClick={() => navigate('/poster/post-job')} className="btn-primary" style={{ marginTop: '20px', width: '100%' }}>Post First Task</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <button 
                className="card-glass flex-center" 
                onClick={() => navigate('/poster/post-job')}
                style={{ width: '100%', padding: '16px', borderRadius: '16px', border: '2px dashed var(--border-glass)', gap: '12px', color: 'var(--emerald)' }}
              >
                <Plus size={20} />
                <span style={{ fontWeight: 800 }}>Post Another Task</span>
              </button>

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
                    <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-primary)' }}>BND {job.reward}</div>
                  </div>

                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '6px', color: 'var(--text-primary)' }}>{job.title}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '16px' }}>
                    <MapPin size={12} className="text-orange" />
                    <span>{job.location_name || 'Gadong Area'}</span>
                  </div>

                  <div className="flex-between" style={{ background: 'var(--bg-tertiary)', padding: '12px', borderRadius: '12px' }}>
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
          )
        )}
      </div>
    </div>
  );
};

export default PosterActivity;
