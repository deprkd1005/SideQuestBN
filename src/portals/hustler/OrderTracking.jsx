import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Shield, Clock, MapPin, MessageSquare, Star, Zap } from 'lucide-react';
import { usePayment } from '../../context/PaymentContext';

const OrderTracking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders, updateOrderStatus, refresh } = usePayment();
  const [order, setOrder] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');

  useEffect(() => {
    const found = orders.find(o => o.id === id);
    if (found) setOrder(found);
  }, [id, orders]);

  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true);
    const res = await updateOrderStatus(id, newStatus);
    if (res.success) {
      if (newStatus === 'completed') setReviewMode(true);
      refresh();
    } else {
      alert(res.error || 'Failed to update order');
    }
    setUpdating(false);
  };

  const submitReview = async () => {
    try {
      const baseUrl = import.meta.env.DEV ? '' : 'https://sidequest-backend-bivj.onrender.com';
      await fetch(`${baseUrl}/api/reviews`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ orderId: id, rating, review_text: reviewText })
      });
      navigate('/hustler/orders');
    } catch (err) {
      console.error(err);
    }
  };

  if (!order) return <div className="app-content flex-center"><div className="spinner-small" /></div>;

  return (
    <div className="app-content no-scrollbar" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div style={{ padding: '40px 24px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button onClick={() => navigate(-1)} className="btn-ghost" style={{ padding: '8px' }}>
          <ArrowLeft size={24} />
        </button>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 900, fontFamily: 'Outfit' }}>Track Order</h1>
      </div>

      <div style={{ padding: '0 24px 24px' }}>
        {/* Status Card */}
        <div className="card" style={{ padding: '24px', marginBottom: '24px', textAlign: 'center' }}>
          <div style={{ 
            width: '64px', 
            height: '64px', 
            borderRadius: '20px', 
            background: 'var(--gold-soft)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 16px',
            color: 'var(--gold)'
          }}>
            <Shield size={32} />
          </div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '4px' }}>
            {order.status === 'pending' ? 'Waiting for Provider' : 
             order.status === 'accepted' ? 'Order Accepted' :
             order.status === 'in_progress' ? 'Work in Progress' :
             order.status === 'completed' ? 'Order Completed' : 'Order Cancelled'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>
            {order.transaction.status === 'held' ? 'Payment is securely held in escrow.' : 'Payment has been released.'}
          </p>
        </div>

        {/* Timeline */}
        <div className="card-glass" style={{ padding: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {[
              { label: 'Order Placed', time: order.created_at, done: true },
              { label: 'Provider Accepted', time: order.updated_at, done: order.status !== 'pending' },
              { label: 'Work Completed', time: null, done: order.status === 'completed' }
            ].map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: '16px', position: 'relative' }}>
                <div style={{ 
                  width: '24px', 
                  height: '24px', 
                  borderRadius: '50%', 
                  background: step.done ? 'var(--gold)' : 'var(--bg-tertiary)',
                  border: '4px solid var(--bg-card)',
                  zIndex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {step.done && <CheckCircle size={12} color="white" />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: step.done ? 'var(--text-primary)' : 'var(--text-muted)' }}>{step.label}</div>
                  {step.time && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{new Date(step.time).toLocaleString()}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        {order.status === 'in_progress' && (
          <button 
            className="btn-primary" 
            onClick={() => handleStatusUpdate('completed')}
            disabled={updating}
            style={{ width: '100%', height: '56px' }}
          >
            {updating ? <div className="spinner-small" style={{ borderTopColor: 'white' }} /> : 'Confirm Completion & Release Payment'}
          </button>
        )}

        {/* Review Modal Simulation */}
        {reviewMode && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card" 
            style={{ padding: '24px', background: 'var(--bg-card)', border: '2px solid var(--gold)' }}
          >
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '16px' }}>Rate your experience</h3>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
              {[1,2,3,4,5].map(star => (
                <button 
                  key={star} 
                  onClick={() => setRating(star)}
                  style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                >
                  <Star size={32} fill={rating >= star ? 'var(--gold)' : 'none'} color={rating >= star ? 'var(--gold)' : 'var(--text-muted)'} />
                </button>
              ))}
            </div>
            <textarea 
              placeholder="Tell others about the service..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              style={{ width: '100%', height: '100px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-glass)', borderRadius: '12px', padding: '12px', color: 'var(--text-primary)', marginBottom: '20px' }}
            />
            <button onClick={submitReview} className="btn-primary" style={{ width: '100%' }}>Submit Review</button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;
