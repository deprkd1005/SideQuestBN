import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Clock, ChevronRight, CheckCircle, XCircle, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePayment } from '../../context/PaymentContext';

const ActiveOrders = () => {
  const { orders, refresh, user } = usePayment();
  const navigate = useNavigate();

  useEffect(() => {
    refresh();
  }, []);

  const myOrders = orders.filter(o => o.customerId === user?.id);

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'var(--gold)';
      case 'accepted': return 'var(--gold)';
      case 'in_progress': return '#3b82f6';
      case 'completed': return 'var(--gold)';
      case 'cancelled': return '#ef4444';
      default: return 'var(--text-muted)';
    }
  };

  return (
    <div className="app-content no-scrollbar" style={{ background: 'var(--bg-primary)' }}>
      <div style={{ padding: '40px 24px 20px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: 'Outfit' }}>My <span className="text-gold">Orders</span></h1>
        <p style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem' }}>Track your service requests</p>
      </div>

      <div style={{ padding: '0 24px 24px' }}>
        {myOrders.length === 0 ? (
          <div className="card-glass" style={{ padding: '60px 24px', textAlign: 'center' }}>
            <Briefcase size={40} className="text-muted" style={{ marginBottom: '16px', opacity: 0.3 }} />
            <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>You haven't ordered any services yet.</p>
            <button onClick={() => navigate('/poster')} className="btn-primary" style={{ marginTop: '20px' }}>Explore Services</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {myOrders.map(order => (
              <motion.div 
                key={order.id} 
                whileTap={{ scale: 0.98 }}
                className="card" 
                onClick={() => navigate(`/hustler/order/${order.id}`)}
                style={{ background: 'var(--bg-card)', borderLeft: `4px solid ${getStatusColor(order.status)}` }}
              >
                <div className="flex-between" style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: getStatusColor(order.status) }} />
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: getStatusColor(order.status) }}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.9rem', fontWeight: 900 }}>BND {order.service.price}</span>
                </div>

                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '6px' }}>{order.service.title}</h4>
                
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
        )}
      </div>
    </div>
  );
};

export default ActiveOrders;
