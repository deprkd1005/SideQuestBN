import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Briefcase, CheckCircle, TrendingUp, ArrowRight, Bell, Shield, MapPin, Clock, ChevronRight } from 'lucide-react';
import { usePayment } from '../../context/PaymentContext';

const PosterDashboard = () => {
  const navigate = useNavigate();
  const { jobs, refresh, user } = usePayment();

  useEffect(() => {
    refresh();
  }, []);

  const myTasks = jobs.filter(job => job.customer_id === user?.id);
  const activeTasks = myTasks.filter(job => job.task_status !== 'released' && job.task_status !== 'cancelled');
  const completedTasks = myTasks.filter(job => job.task_status === 'released');

  const stats = [
    { label: 'Active', value: activeTasks.length, icon: Briefcase, color: 'var(--emerald)' },
    { label: 'Spent', value: `BND ${myTasks.reduce((acc, j) => acc + Number(j.budget), 0)}`, icon: TrendingUp, color: 'var(--gold)' },
    { label: 'Done', value: completedTasks.length, icon: CheckCircle, color: 'var(--emerald)' }
  ];

  return (
    <div className="app-content no-scrollbar">
      {/* Header */}
      <div style={{ padding: '40px 24px 20px' }}>
        <div className="flex-between">
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: 'Outfit' }}>Customer <span className="text-emerald">Hub</span></h1>
            <p style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem' }}>Welcome back, {user?.fullname?.split(' ')[0]}</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="card-glass flex-center" style={{ width: '48px', height: '48px', borderRadius: '16px', padding: 0 }}>
              <Bell size={20} className="text-muted" />
            </button>
            <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`} alt="avatar" />
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 24px 24px' }}>
        {/* Main CTA */}
        <motion.button 
          whileTap={{ scale: 0.97 }}
          className="btn-primary" 
          onClick={() => navigate('/poster/post')}
          style={{ 
            width: '100%', 
            height: '80px', 
            fontSize: '1.2rem',
            marginBottom: '32px',
            borderRadius: '24px',
            justifyContent: 'flex-start',
            padding: '0 24px'
          }}
        >
          <div style={{ background: 'rgba(255,255,255,0.2)', width: '44px', height: '44px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '16px' }}>
            <Plus size={28} strokeWidth={3} />
          </div>
          Post a New SideQuest
        </motion.button>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '32px' }}>
          {stats.map(stat => (
            <div key={stat.label} className="card-glass" style={{ padding: '16px 8px', textAlign: 'center' }}>
              <div style={{ color: stat.color, marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>
                <stat.icon size={18} />
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{stat.value}</div>
              <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800, marginTop: '4px', letterSpacing: '0.5px' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Active Tasks */}
        <div className="flex-between" style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'Outfit' }}>My SideQuests</h3>
          <button className="btn-ghost" onClick={() => navigate('/poster/active')} style={{ fontSize: '0.85rem', color: 'var(--emerald)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
            View All <ArrowRight size={16} />
          </button>
        </div>

        {activeTasks.length === 0 ? (
          <div className="card-glass" style={{ padding: '48px 24px', textAlign: 'center', borderStyle: 'dashed' }}>
            <div style={{ width: '64px', height: '64px', background: 'var(--bg-tertiary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', opacity: 0.5 }}>
              <Briefcase size={24} className="text-emerald" />
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>No active quests yet.</p>
            <button className="btn-outline" onClick={() => navigate('/poster/post')} style={{ width: '100%' }}>Start First Quest</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {activeTasks.slice(0, 3).map(job => (
              <motion.div 
                key={job.id} 
                whileTap={{ scale: 0.98 }}
                className="card" 
                onClick={() => navigate(`/poster/tracking/${job.id}`)} 
                style={{ cursor: 'pointer' }}
              >
                <div className="flex-between" style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span className="badge badge-emerald">BND {job.budget}</span>
                    <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>{job.category}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--gold)' }}>
                    <Shield size={14} /> Escrow
                  </div>
                </div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '6px' }}>{job.title}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '16px' }}>
                  <MapPin size={12} className="text-emerald" />
                  <span>{job.location || 'Brunei-Muara'}</span>
                </div>
                
                <div className="flex-between" style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: job.task_status === 'assigned' ? 'var(--blue)' : 'var(--emerald)' }}></div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{job.task_status}</span>
                  </div>
                  <ChevronRight size={18} className="text-muted" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PosterDashboard;