import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Plus, Trash2, Edit2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePayment } from '../../context/PaymentContext';

const MyServices = () => {
  const { services, user, refresh } = usePayment();
  const navigate = useNavigate();

  useEffect(() => {
    refresh();
  }, []);

  const myServices = services.filter(s => s.providerId === user?.id);

  return (
    <div className="app-content no-scrollbar" style={{ background: 'var(--bg-primary)' }}>
      <div style={{ padding: '40px 24px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button onClick={() => navigate(-1)} className="btn-ghost" style={{ padding: '8px' }}>
          <ArrowLeft size={24} />
        </button>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 900, fontFamily: 'Outfit' }}>My Services</h1>
      </div>

      <div style={{ padding: '0 24px 24px' }}>
        <button 
          className="card-glass flex-center" 
          onClick={() => navigate('/hustler/post-service')}
          style={{ width: '100%', padding: '20px', borderRadius: '16px', border: '2px dashed var(--border-glass)', gap: '12px', marginBottom: '24px', color: 'var(--gold)' }}
        >
          <Plus size={20} />
          <span style={{ fontWeight: 800 }}>Add New Service</span>
        </button>

        {myServices.length === 0 ? (
          <div className="card-glass" style={{ padding: '60px 24px', textAlign: 'center' }}>
            <Zap size={40} className="text-muted" style={{ marginBottom: '16px', opacity: 0.3 }} />
            <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>You haven't posted any services yet.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {myServices.map(service => (
              <div 
                key={service.id} 
                className="card" 
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glass)' }}
              >
                <div className="flex-between" style={{ marginBottom: '12px' }}>
                  <span className="badge badge-gold" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>BND {service.price}</span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn-ghost" style={{ padding: '8px' }}><Edit2 size={16} /></button>
                    <button className="btn-ghost" style={{ padding: '8px', color: '#ef4444' }}><Trash2 size={16} /></button>
                  </div>
                </div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '6px' }}>{service.title}</h4>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>{service.category}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyServices;
