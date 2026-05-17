import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Shield, Clock, MapPin, MessageSquare, Star, Zap, XCircle } from 'lucide-react';
import { usePayment } from '../../context/PaymentContext';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders, updateOrderStatus, refresh } = usePayment();
  const [order, setOrder] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const found = orders.find(o => o.id === id);
    if (found) setOrder(found);
  }, [id, orders]);

  const handleAction = async (newStatus) => {
    setUpdating(true);
    const res = await updateOrderStatus(id, newStatus);
    if (res.success) {
      refresh();
    } else {
      alert(res.error || 'Failed to update order');
    }
    setUpdating(false);
  };

  if (!order) return <div className="app-content flex-center"><div className="spinner-small" /></div>;

  return (
    <div className="app-content no-scrollbar" style={{ background: 'var(--bg-primary)' }}>
      <div style={{ padding: '40px 24px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button onClick={() => navigate(-1)} className="btn-ghost" style={{ padding: '8px' }}>
          <ArrowLeft size={24} />
        </button>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 900, fontFamily: 'Outfit' }}>Service Request</h1>
      </div>

      <div style={{ padding: '0 24px 100px' }}>
        {/* Customer Card */}
        <div className="card-glass" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', overflow: 'hidden' }}>
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${order.customerId}`} alt="customer" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800 }}>{order.customer.fullname}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>CUSTOMER</div>
          </div>
          <button className="btn-ghost" style={{ padding: '10px' }}><MessageSquare size={20} className="text-emerald" /></button>
        </div>

        <div className="card" style={{ padding: '24px', marginBottom: '32px' }}>
          <div className="badge badge-emerald" style={{ marginBottom: '12px' }}>{order.service.category}</div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 900, marginBottom: '8px' }}>{order.service.title}</h2>
          <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--emerald)', marginBottom: '20px' }}>BND {order.service.price}</div>
          
          <div style={{ padding: '16px', background: 'var(--bg-tertiary)', borderRadius: '12px', border: '1px solid var(--border-glass)', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>
              <Shield size={16} className="text-emerald" />
              <span>Funds securely held in escrow</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 700 }}>
              <Clock size={14} /> Requested on {new Date(order.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Actions based on status */}
        {order.status === 'pending' && (
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              className="btn-ghost" 
              onClick={() => handleAction('cancelled')}
              style={{ flex: 1, height: '56px', border: '1px solid #ef4444', color: '#ef4444' }}
            >
              Decline
            </button>
            <button 
              className="btn-primary" 
              onClick={() => handleAction('accepted')}
              style={{ flex: 2, height: '56px' }}
            >
              Accept Order
            </button>
          </div>
        )}

        {order.status === 'accepted' && (
          <button 
            className="btn-primary" 
            onClick={() => handleAction('in_progress')}
            style={{ width: '100%', height: '56px' }}
          >
            Start Working
          </button>
        )}

        {order.status === 'in_progress' && (
          <div className="card-glass" style={{ padding: '24px', textAlign: 'center' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--emerald-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--emerald)' }}>
              <Clock size={24} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '8px' }}>Working on it!</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '20px' }}>
              Once you finish, the client will confirm and release the payment from escrow.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
