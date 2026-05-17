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

        {/* Geofencing Radar Map */}
        <div className="card-glass" style={{ marginBottom: '24px', overflow: 'hidden', position: 'relative', height: '220px', borderRadius: '24px', background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)' }}>
          {/* Map Background Pattern */}
          <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M54.627 0l.83.83v58.34h-58.34v-.83l.83-.83h56.68v-56.68zM53.797 2.49v55.02h-55.02v-.83l.83-.83h53.36v-53.36z\' fill=\'%23d4af37\' fill-opacity=\'1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")' }} />
          
          {/* Radar Sweep Animation */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            style={{ position: 'absolute', top: '50%', left: '50%', width: '300px', height: '300px', margin: '-150px 0 0 -150px', borderRadius: '50%', background: 'conic-gradient(from 0deg, transparent 70%, rgba(212, 175, 55, 0.4) 100%)', zIndex: 1 }}
          />
          <div style={{ position: 'absolute', top: '50%', left: '50%', width: '12px', height: '12px', margin: '-6px 0 0 -6px', borderRadius: '50%', background: 'var(--gold)', boxShadow: '0 0 20px 4px var(--gold-glow)', zIndex: 2 }} />
          
          {/* Geofence Rings */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', width: '100px', height: '100px', margin: '-50px 0 0 -50px', borderRadius: '50%', border: '1px dashed var(--gold)', opacity: 0.5 }} />
          <div style={{ position: 'absolute', top: '50%', left: '50%', width: '200px', height: '200px', margin: '-100px 0 0 -100px', borderRadius: '50%', border: '1px dashed var(--gold)', opacity: 0.2 }} />

          {/* Job Pins */}
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 }} style={{ position: 'absolute', top: '30%', left: '65%', width: '16px', height: '16px', borderRadius: '50%', background: 'var(--emerald)', border: '2px solid white', zIndex: 3, boxShadow: '0 0 10px var(--emerald-glow)' }} />
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.2 }} style={{ position: 'absolute', top: '70%', left: '40%', width: '16px', height: '16px', borderRadius: '50%', background: 'var(--emerald)', border: '2px solid white', zIndex: 3, boxShadow: '0 0 10px var(--emerald-glow)' }} />
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.1 }} style={{ position: 'absolute', top: '45%', left: '20%', width: '16px', height: '16px', borderRadius: '50%', background: 'var(--emerald)', border: '2px solid white', zIndex: 3, boxShadow: '0 0 10px var(--emerald-glow)' }} />

          <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px', zIndex: 10 }}>
            <div className="card-glass" style={{ background: 'var(--bg-glass-strong)', padding: '12px 16px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={16} className="text-gold" />
                <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>Brunei Muara</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Radius: 10km</span>
                <input type="range" min="1" max="25" defaultValue="10" style={{ width: '60px', accentColor: 'var(--gold)' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
          <div className="card-glass" style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '4px 16px', borderRadius: '20px' }}>
            <Search size={18} className="text-muted" />
            <input 
              type="text" 
              placeholder="Search side quests..." 
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