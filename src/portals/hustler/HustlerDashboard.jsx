import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Briefcase, MapPin, Star, ChevronRight, Bell, Filter, Zap, LocateFixed } from 'lucide-react';
import { usePayment } from '../../context/PaymentContext';

const HustlerDashboard = () => {
  const navigate = useNavigate();
  const { services, refresh, user } = usePayment();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [radius, setRadius] = useState(10);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    if (!window.L || !mapRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    const map = L.map(mapRef.current, { zoomControl: false }).setView([4.8903, 114.9401], 12);
    mapInstanceRef.current = map;
    
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png').addTo(map);

    // Custom Gamified Radar Marker
    const radarIcon = L.divIcon({
      className: 'custom-radar-icon',
      html: `
        <div style="position: relative; width: 60px; height: 60px; margin: -30px 0 0 -30px;">
          <div style="position: absolute; inset: 0; border-radius: 50%; background: conic-gradient(from 0deg, transparent 70%, rgba(212, 175, 55, 0.6) 100%); animation: spin 3s linear infinite;"></div>
          <div style="position: absolute; top: 50%; left: 50%; width: 14px; height: 14px; margin: -7px 0 0 -7px; border-radius: 50%; background: var(--gold); box-shadow: 0 0 15px var(--gold);"></div>
        </div>
        <style>@keyframes spin { 100% { transform: rotate(360deg); } }</style>
      `,
      iconSize: [0, 0]
    });

    // Hustler Location with Radar
    L.marker([4.8903, 114.9401], { icon: radarIcon }).addTo(map);
    
    // Radius Geofence
    L.circle([4.8903, 114.9401], {
       radius: radius * 1000, 
       color: 'var(--gold)', 
       weight: 2, 
       fillColor: 'var(--gold)', 
       fillOpacity: 0.1
    }).addTo(map);

    // Render Services as Map Pins
    services.forEach((service, i) => {
      // Mock coordinates near Brunei Muara
      const lat = 4.8903 + (Math.random() - 0.5) * 0.08;
      const lng = 114.9401 + (Math.random() - 0.5) * 0.08;

      const marker = L.circleMarker([lat, lng], { color: 'var(--emerald)', fillColor: 'var(--emerald)', fillOpacity: 0.9, radius: 8 }).addTo(map);
      marker.bindPopup(`
        <div style="font-family:'Outfit', sans-serif; padding:4px; min-width:120px;">
          <strong style="color:var(--text-primary); font-size:1rem; display:block; margin-bottom:4px;">${service.title}</strong>
          <div style="font-weight:900; font-size:1.1rem; color:var(--emerald); margin-bottom:4px;">BND ${service.price}</div>
        </div>
      `);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [services, radius]);

  const categories = ['All', 'Delivery', 'Cleaning', 'Digital', 'Handyman', 'Education'];

  const filteredServices = services.filter(s => 
    (selectedCategory === 'All' || s.category === selectedCategory) &&
    (s.title.toLowerCase().includes(searchTerm.toLowerCase()) || s.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPotential = filteredServices.reduce((sum, s) => sum + parseFloat(s.price), 0);

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

        {/* Real Geofencing Map (Leaflet) */}
        <div className="card-glass" style={{ marginBottom: '24px', overflow: 'hidden', position: 'relative', height: '300px', borderRadius: '24px', background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)' }}>
          <div ref={mapRef} style={{ width: '100%', height: '100%', zIndex: 1 }}></div>
          
          {/* Map Controls & HUD */}
          <div style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 400, display: 'flex', flexDirection: 'column', gap: '12px' }}>
             <button onClick={() => mapInstanceRef.current?.setView([4.8903, 114.9401], 12)} style={{ background: 'white', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: 'none', alignSelf: 'flex-end' }}>
                <LocateFixed size={20} className="text-gold" />
             </button>
          </div>

          {/* Financial Impact Overlay */}
          <div style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 400 }}>
             <div className="card-glass" style={{ background: 'rgba(255, 255, 255, 0.95)', padding: '12px 16px', borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', border: '1px solid var(--gold-soft)' }}>
               <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Surge Zone Potential</div>
               <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--gold)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                 <Zap size={18} fill="var(--gold)" />
                 BND {totalPotential.toFixed(2)}
               </div>
             </div>
          </div>

          <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px', zIndex: 400 }}>
            <div className="card-glass" style={{ background: 'var(--bg-glass-strong)', padding: '12px 16px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={16} className="text-gold" />
                <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>Brunei Muara</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>{radius}km</span>
                <input 
                  type="range" 
                  min="1" 
                  max="25" 
                  value={radius} 
                  onChange={(e) => setRadius(parseInt(e.target.value))}
                  style={{ width: '60px', accentColor: 'var(--gold)' }} 
                />
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
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'Outfit' }}>Active Quests</h3>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>{filteredServices.length} found</span>
        </div>

        {filteredServices.length === 0 ? (
          <div className="card-glass" style={{ padding: '60px 24px', textAlign: 'center' }}>
            <Zap size={40} className="text-muted" style={{ marginBottom: '16px', opacity: 0.3 }} />
            <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>No quests found in this category.</p>
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
                      <div style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--gold)' }}>✓ Verified Customer</div>
                    </div>
                  </div>
                  <div style={{ color: 'var(--gold)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 800 }}>
                    Accept Quest <ChevronRight size={16} />
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