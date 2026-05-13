import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Briefcase, MapPin, Clock, Shield, Star, ChevronRight, TrendingUp, Bell } from 'lucide-react';
import { usePayment } from '../../context/PaymentContext';

const HustlerHome = () => {
  const navigate = useNavigate();
  const { jobs, refresh, user } = usePayment();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    refresh();
  }, []);

  const openTasks = jobs.filter(job => job.task_status === 'open' && (job.title.toLowerCase().includes(searchTerm.toLowerCase()) || job.category.toLowerCase().includes(searchTerm.toLowerCase())));

  return (
    <div className="app-content no-scrollbar" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div style={{ padding: '40px 24px 20px' }}>
        <div className="flex-between" style={{ marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: 'Outfit' }}>Hustler <span className="text-gold">Hub</span></h1>
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

        {/* Search */}
        <div className="card-glass" style={{ display: 'flex', alignItems: 'center', padding: '4px 16px', borderRadius: '20px' }}>
          <Search size={18} className="text-muted" />
          <input 
            type="text" 
            placeholder="Search tasks..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: 1, padding: '16px', background: 'none', border: 'none', color: 'var(--text-primary)', fontWeight: 600, outline: 'none' }}
          />
        </div>
      </div>

      <div style={{ padding: '0 24px 24px' }}>
        {/* Quick Stats */}
        <div className="card-glass" style={{ padding: '20px', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-tertiary) 100%)' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Earned this month</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--gold)' }}>BND 1,240</div>
          </div>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'var(--gold-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={28} className="text-gold" />
          </div>
        </div>

        {/* Task List */}
        <div className="flex-between" style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'Outfit' }}>Available Quests</h3>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>{openTasks.length} found</span>
        </div>

        {openTasks.length === 0 ? (
          <div className="card-glass" style={{ padding: '60px 24px', textAlign: 'center' }}>
            <Briefcase size={40} className="text-muted" style={{ marginBottom: '16px', opacity: 0.3 }} />
            <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>No quests available right now. Check back later!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {openTasks.map(job => (
              <motion.div 
                key={job.id} 
                whileTap={{ scale: 0.98 }}
                className="card" 
                onClick={() => navigate(`/hustler/job/${job.id}`)}
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glass)' }}
              >
                <div className="flex-between" style={{ marginBottom: '12px' }}>
                  <span className="badge badge-gold" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>BND {job.budget}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--emerald)' }}>
                    <Shield size={14} /> Escrow Verified
                  </div>
                </div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '6px', color: 'var(--text-primary)' }}>{job.title}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600 }}>
                    <MapPin size={12} className="text-gold" />
                    <span>{job.location}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600 }}>
                    <Clock size={12} className="text-gold" />
                    <span>Just now</span>
                  </div>
                </div>
                
                <div className="flex-between" style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${job.customer_id}`} alt="customer" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>{job.customer_name || 'Verified Customer'}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                        {[1,2,3,4,5].map(i => <Star key={i} size={8} fill="var(--gold)" color="var(--gold)" />)}
                      </div>
                    </div>
                  </div>
                  <div style={{ color: 'var(--gold)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 800 }}>
                    Details <ChevronRight size={16} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HustlerHome;