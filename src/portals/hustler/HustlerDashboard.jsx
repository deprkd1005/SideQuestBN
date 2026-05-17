import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Briefcase, MapPin, Star, ChevronRight, Bell, Filter, Zap } from 'lucide-react';
import { usePayment } from '../../context/PaymentContext';

const HustlerDashboard = () => {
  const navigate = useNavigate();
  const { services, refresh, user } = usePayment();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    refresh();
  }, []);

  const categories = ['All', 'Delivery', 'Cleaning', 'Digital', 'Handyman', 'Education'];

  const filteredServices = services.filter(s => 
    (selectedCategory === 'All' || s.category === selectedCategory) &&
    (s.title.toLowerCase().includes(searchTerm.toLowerCase()) || s.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="app-content no-scrollbar" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div style={{ padding: '40px 24px 20px' }}>
        <div className="flex-between" style={{ marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: 'Outfit' }}>Hustler<span className="text-gold">.BN</span></h1>
            <p style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem' }}>Find local help in Brunei</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="card-glass flex-center" onClick={() => navigate('/hustler/notifications')} style={{ width: '48px', height: '48px', borderRadius: '16px' }}>
              <Bell size={20} className="text-muted" />
            </button>
            <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`} alt="avatar" />
            </div>
          </div>
        </div>

        {/* Search */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
          <div className="card-glass" style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '4px 16px', borderRadius: '20px' }}>
            <Search size={18} className="text-muted" />
            <input 
              type="text" 
              placeholder="What do you need help with?" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ flex: 1, padding: '16px', background: 'none', border: 'none', color: 'var(--text-primary)', fontWeight: 600, outline: 'none' }}
            />
          </div>
          <button className="card-glass flex-center" style={{ width: '56px', borderRadius: '20px' }}>
            <Filter size={20} className="text-gold" />
          </button>
        </div>

        {/* Categories */}
        <div className="no-scrollbar" style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px' }}>
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '10px 20px',
                borderRadius: '12px',
                background: selectedCategory === cat ? 'var(--gold)' : 'var(--bg-card)',
                color: selectedCategory === cat ? 'white' : 'var(--text-secondary)',
                border: '1px solid var(--border-glass)',
                fontWeight: 700,
                fontSize: '0.85rem',
                whiteSpace: 'nowrap',
                transition: 'all 0.3s'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 24px 24px' }}>
        <div className="flex-between" style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'Outfit' }}>Featured Services</h3>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>{filteredServices.length} found</span>
        </div>

        {filteredServices.length === 0 ? (
          <div className="card-glass" style={{ padding: '60px 24px', textAlign: 'center' }}>
            <Zap size={40} className="text-muted" style={{ marginBottom: '16px', opacity: 0.3 }} />
            <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>No services found in this category.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
            {filteredServices.map(service => (
              <motion.div 
                key={service.id} 
                whileTap={{ scale: 0.98 }}
                className="card" 
                onClick={() => navigate(`/hustler/service/${service.id}`)}
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glass)' }}
              >
                <div className="flex-between" style={{ marginBottom: '12px' }}>
                  <span className="badge badge-gold" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>BND {service.price}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--gold)' }}>
                    <Star size={14} fill="var(--gold)" /> 4.9 (24 reviews)
                  </div>
                </div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '6px', color: 'var(--text-primary)' }}>{service.title}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {service.description}
                </p>
                
                <div className="flex-between" style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${service.providerId}`} alt="provider" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>{service.provider.fullname}</div>
                      <div style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--gold)' }}>✓ Verified Pro</div>
                    </div>
                  </div>
                  <div style={{ color: 'var(--gold)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 800 }}>
                    Book Now <ChevronRight size={16} />
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

export default HustlerDashboard;