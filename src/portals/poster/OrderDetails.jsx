import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, MapPin, MessageSquare, Phone, Shield, Navigation } from 'lucide-react';
import { usePayment } from '../../context/PaymentContext';

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
      <div style={{ flex: 1, position: 'relative', background: '#e2e8f0', overflow: 'hidden' }}>
        {/* Mock Map Background */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg stroke=\'%23cbd5e1\' stroke-width=\'2\' fill=\'none\'%3E%3Cpath d=\'M0 20h100M0 40h100M0 60h100M0 80h100M20 0v100M40 0v100M60 0v100M80 0v100\'/%3E%3Cpath d=\'M0 0l100 100M100 0L0 100\' stroke-opacity=\'0.2\'/%3E%3C/g%3E%3C/svg%3E")', backgroundSize: '150px' }} />
        
        {/* Map UI Overlay */}
        <div style={{ position: 'absolute', top: '40px', left: '20px', zIndex: 10 }}>
          <button onClick={() => navigate(-1)} style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'white', border: 'none', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowLeft size={20} />
          </button>
        </div>

        {/* Live Tracking Path */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 5 }}>
          <path d="M 150 150 Q 200 300 350 400" fill="none" stroke="var(--emerald)" strokeWidth="4" strokeDasharray="8 8" />
        </svg>

        {/* Hustler Location Pin */}
        <motion.div 
          animate={{ x: [150, 160, 155], y: [150, 165, 160] }}
          transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse' }}
          style={{ position: 'absolute', top: 0, left: 0, zIndex: 6, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <div style={{ background: 'var(--text-primary)', color: 'white', padding: '4px 8px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 700, marginBottom: '4px', whiteSpace: 'nowrap' }}>
            5 mins away
          </div>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'white', border: '3px solid var(--emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-md)' }}>
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${order.providerId}`} alt="hustler" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
          </div>
        </motion.div>

        {/* Destination Pin */}
        <div style={{ position: 'absolute', top: '380px', left: '330px', zIndex: 5, width: '24px', height: '24px', borderRadius: '50%', background: 'var(--text-primary)', border: '4px solid white', boxShadow: 'var(--shadow-md)' }} />
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
            <button className="btn-ghost" style={{ padding: '10px', background: 'white', borderRadius: '12px' }}><Phone size={20} className="text-emerald" /></button>
            <button className="btn-ghost" style={{ padding: '10px', background: 'white', borderRadius: '12px' }}><MessageSquare size={20} className="text-emerald" /></button>
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
        
        <button className="btn-primary" style={{ width: '100%', height: '56px', marginTop: '24px' }}>Confirm Completion</button>
      </div>
    </div>
  );
};

export default OrderDetails;
