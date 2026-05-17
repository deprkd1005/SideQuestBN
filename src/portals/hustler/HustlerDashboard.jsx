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
          <button onclick="window.location.href='/hustler/service/${service.id}'" style="background:var(--gold); color:white; border:none; padding:8px; border-radius:8px; cursor:pointer; width:100%; font-weight:800; font-size:0.8rem; margin-top:8px;">View Quest</button>
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
    <div className="app-content no-scrollbar" style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      
      {/* Full Screen Map */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
        <div ref={mapRef} style={{ width: '100%', height: '100%' }}></div>
      </div>

      {/* Floating Top Elements */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 400, padding: '24px 24px 0 24px', pointerEvents: 'none' }}>
        
        {/* Search & Filters */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', pointerEvents: 'auto' }}>
          <div className="card-glass" style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '4px 16px', borderRadius: '24px', background: 'rgba(255, 255, 255, 0.95)', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
            <Search size={18} className="text-muted" />
            <input 
              type="text" 
              placeholder="Search side quests..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ flex: 1, padding: '16px', background: 'none', border: 'none', color: 'var(--text-primary)', fontWeight: 600, outline: 'none' }}
            />
          </div>
          <button className="card-glass flex-center" style={{ width: '56px', borderRadius: '20px', background: 'rgba(255, 255, 255, 0.95)', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
            <Filter size={20} className="text-gold" />
          </button>
        </div>

        {/* Categories */}
        <div className="no-scrollbar" style={{ display: 'flex', gap: '10px', overflowX: 'auto', pointerEvents: 'auto', paddingBottom: '10px' }}>
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '10px 20px',
                borderRadius: '20px',
                background: selectedCategory === cat ? 'var(--gold)' : 'rgba(255, 255, 255, 0.95)',
                color: selectedCategory === cat ? 'white' : 'var(--text-secondary)',
                border: selectedCategory === cat ? 'none' : '1px solid rgba(0,0,0,0.05)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                fontWeight: 800,
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

      {/* Floating Bottom Elements */}
      <div style={{ position: 'absolute', bottom: '120px', left: '24px', right: '24px', zIndex: 400, pointerEvents: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
         
         {/* Map Controls */}
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', pointerEvents: 'auto' }}>
            <div className="card-glass" style={{ background: 'rgba(255, 255, 255, 0.95)', padding: '12px 16px', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', border: '2px solid rgba(212, 175, 55, 0.2)' }}>
               <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Surge Zone Potential</div>
               <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--gold)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                 <Zap size={18} fill="var(--gold)" />
                 BND {totalPotential.toFixed(2)}
               </div>
            </div>
            
            <button onClick={() => mapInstanceRef.current?.setView([4.8903, 114.9401], 12)} style={{ background: 'rgba(255, 255, 255, 0.95)', width: '56px', height: '56px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', border: 'none' }}>
               <LocateFixed size={24} className="text-gold" />
            </button>
         </div>

         {/* Radius Slider */}
         <div className="card-glass" style={{ background: 'rgba(255, 255, 255, 0.95)', padding: '16px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', pointerEvents: 'auto', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(212, 175, 55, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MapPin size={20} className="text-gold" />
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>Scanning Area</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Radius: {radius}km</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input 
                type="range" 
                min="1" 
                max="25" 
                value={radius} 
                onChange={(e) => setRadius(parseInt(e.target.value))}
                style={{ width: '100px', accentColor: 'var(--gold)' }} 
              />
            </div>
         </div>
      </div>
    </div>
  );
};

export default HustlerDashboard;