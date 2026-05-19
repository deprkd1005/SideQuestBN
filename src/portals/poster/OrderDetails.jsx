import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, MapPin, MessageSquare, Phone, Shield, Navigation } from 'lucide-react';
import { usePayment } from '../../context/PaymentContext';

import TrackingMap from '../../components/TrackingMap';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders, refresh } = usePayment();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    refresh();
    const found = orders.find(o => o.id === id);
    if (found) setOrder(found);
  }, [id, orders]);

  if (!order) return <div className="app-content flex-center"><div className="spinner-small" /></div>;

  return (
    <div className="app-content no-scrollbar" style={{ background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
      
      {/* Live Map Area */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#e2e8f0', zIndex: 1 }}>
        <div style={{ position: 'absolute', top: '24px', left: '20px', zIndex: 1000 }}>
          <button onClick={() => navigate(-1)} style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'white', border: 'none', boxShadow: 'var(--shadow-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <ArrowLeft size={20} />
          </button>
        </div>

        <TrackingMap providerId={order.providerId} customerId={order.customerId} />
      </div>

      {/* Tracking Info Bottom Sheet */}
      <div style={{ background: 'var(--bg-card)', borderRadius: '32px 32px 0 0', padding: '24px', position: 'relative', zIndex: 20, boxShadow: '0 -10px 40px rgba(0,0,0,0.1)', marginTop: '-20px' }}>
        <div style={{ width: '40px', height: '4px', background: 'var(--border-color)', borderRadius: '4px', margin: '0 auto 20px' }} />
        
        <div className="flex-between" style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 900, fontFamily: 'Outfit' }}>Tracking Order</h2>
          <div className="badge badge-emerald">On the way</div>
        </div>

        <div style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '24px' }}>{order.service.title}</div>

        <div className="card-glass" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', background: 'var(--bg-tertiary)' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', overflow: 'hidden' }}>
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${order.providerId}`} alt="provider" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: '1rem' }}>{order.provider.fullname}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Hustler • 4.9 ★</div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-ghost" onClick={() => window.location.href = 'tel:+6738888888'} style={{ padding: '10px', background: 'white', borderRadius: '12px' }}><Phone size={20} className="text-emerald" /></button>
            <button className="btn-ghost" onClick={() => navigate('/poster/messages')} style={{ padding: '10px', background: 'white', borderRadius: '12px' }}><MessageSquare size={20} className="text-emerald" /></button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--emerald-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Navigation size={16} className="text-emerald" />
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>ETA: 5 Minutes</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Hustler is approaching your location</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={16} style={{ color: '#3b82f6' }} />
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>Payment Secured</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>BND {order.service.price} is held in escrow until completion</div>
            </div>
          </div>
        </div>
        
        <button 
          className="btn-primary" 
          onClick={async () => {
            alert('Marking task as completed and releasing escrow payment...');
            navigate('/poster');
          }}
          style={{ width: '100%', height: '56px', marginTop: '24px' }}
        >
          Confirm Completion
        </button>
      </div>
    </div>
  );
};

export default OrderDetails;
