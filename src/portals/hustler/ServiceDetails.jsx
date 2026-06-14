import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, MapPin, Shield, Clock, ChevronRight, Zap } from 'lucide-react';
import { usePayment } from '../../context/PaymentContext';

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { placeOrder } = usePayment();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const baseUrl = '';
        const res = await fetch(`${baseUrl}/api/services/${id}`);
        const data = await res.json();
        setService(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id]);

  const handleBook = async () => {
    setBooking(true);
    const res = await placeOrder(id);
    if (res.success) {
      navigate('/hustler/orders');
    } else {
      alert(res.error || 'Failed to book service');
      setBooking(false);
    }
  };

  if (loading) return <div className="app-content flex-center"><div className="spinner-small" /></div>;
  if (!service) return <div className="app-content flex-center">Service not found</div>;

  return (
    <div className="app-content no-scrollbar" style={{ background: 'var(--bg-primary)' }}>
      <div style={{ position: 'relative', height: '240px', background: 'var(--bg-tertiary)' }}>
        <img 
          src={`https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&auto=format&fit=crop`} 
          alt="cover" 
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }}
        />
        <button 
          onClick={() => navigate(-1)}
          style={{ position: 'absolute', top: '40px', left: '20px', width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      <div style={{ padding: '0 24px 100px', marginTop: '-40px', position: 'relative' }}>
        <div className="card" style={{ padding: '24px', marginBottom: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
          <div className="flex-between" style={{ marginBottom: '12px' }}>
            <span className="badge badge-gold" style={{ padding: '6px 12px' }}>{service.category}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--gold)', fontWeight: 700 }}>
              <Star size={16} fill="var(--gold)" /> 4.9
            </div>
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '8px', fontFamily: 'Outfit' }}>{service.title}</h1>
          <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--gold)', marginBottom: '16px' }}>BND {service.price}</div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600 }}>
              <MapPin size={14} className="text-gold" /> {service.provider.profile?.location || 'Brunei Muara'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600 }}>
              <Shield size={14} className="text-gold" /> Escrow Protected
            </div>
          </div>
        </div>

        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '12px', fontFamily: 'Outfit' }}>Description</h3>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '32px', fontWeight: 500 }}>
          {service.description}
        </p>

        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px', fontFamily: 'Outfit' }}>About the Provider</h3>
        <div className="card-glass" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', overflow: 'hidden' }}>
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${service.providerId}`} alt="provider" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: '1rem' }}>{service.provider.fullname}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>{service.provider.profile?.bio || 'Professional freelancer'}</div>
          </div>
          <ChevronRight size={20} className="text-muted" />
        </div>
      </div>

      {/* Booking Bar */}
      <div style={{ 
        position: 'absolute', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        padding: '20px 24px 40px', 
        background: 'var(--bg-primary)', 
        borderTop: '1px solid var(--border-glass)',
        display: 'flex',
        alignItems: 'center',
        gap: '20px'
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Price</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)' }}>BND {service.price}</div>
        </div>
        <button 
          className="btn-primary" 
          onClick={handleBook}
          disabled={booking}
          style={{ flex: 2, height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
        >
          {booking ? <div className="spinner-small" style={{ borderTopColor: 'white' }} /> : <><Zap size={20} /> Accept Quest</>}
        </button>
      </div>
    </div>
  );
};

export default ServiceDetails;
