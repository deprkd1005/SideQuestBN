import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Briefcase, MapPin, Star, ChevronRight, Bell, Filter, Zap, LocateFixed, ChevronDown, TrendingUp, Layers, Locate, Radar, SlidersHorizontal } from 'lucide-react';
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

  const categories = ['All', 'Delivery', 'Cleaning', 'Handyman', 'Education'];

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
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 400, padding: '48px 20px 0 20px', pointerEvents: 'none' }}>
        
        {/* Top Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', pointerEvents: 'auto' }}>
          
          {/* Location Pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '50px', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%', background: '#1C1C1E' }}>
              <MapPin size={14} color="white" />
            </div>
            <div style={{ lineHeight: 1 }}>
              <p style={{ fontSize: '10px', color: '#8E8E93', fontWeight: 600 }}>Current Location</p>
              <p style={{ fontSize: '12px', fontWeight: 800, color: '#1C1C1E', marginTop: '2px' }}>Bandar Seri Begawan</p>
            </div>
            <ChevronDown size={14} color="#8E8E93" />
          </div>

          {/* Notification */}
          <button onClick={() => navigate('/hustler/notifications')} style={{ position: 'relative', width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Bell size={18} color="#1C1C1E" />
            <span style={{ position: 'absolute', top: '8px', right: '8px', width: '8px', height: '8px', background: '#FF3B30', borderRadius: '50%' }} />
          </button>
        </div>

        {/* Search Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '50px', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', pointerEvents: 'auto' }}>
          <Search size={18} color="#8E8E93" />
          <input 
            type="text" 
            placeholder="Search nearby quests" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: '14px', color: '#1C1C1E', fontWeight: 600 }}
          />
          <SlidersHorizontal size={18} color="#1C1C1E" />
        </div>
      </div>

      {/* Floating Left: Earnings Card */}
      <div style={{ position: 'absolute', top: '160px', left: '20px', zIndex: 400, pointerEvents: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '50px', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', background: '#1C1C1E' }}>
            <TrendingUp size={16} color="white" />
            <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '10px', height: '10px', background: 'var(--emerald)', border: '2px solid white', borderRadius: '50%' }} />
          </div>
          <div style={{ lineHeight: 1 }}>
            <p style={{ fontSize: '9px', color: '#8E8E93', fontWeight: 700, textTransform: 'uppercase' }}>Earnings</p>
            <p style={{ fontSize: '12px', fontWeight: 900, color: '#1C1C1E', marginTop: '2px' }}>BND {totalPotential.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Floating Right: Action Stack */}
      <div style={{ position: 'absolute', top: '160px', right: '20px', zIndex: 400, display: 'flex', flexDirection: 'column', gap: '12px', pointerEvents: 'auto' }}>
        {/* Layers */}
        <button style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <Layers size={18} color="#1C1C1E" />
        </button>
        {/* Locate */}
        <button onClick={() => mapInstanceRef.current?.setView([4.8903, 114.9401], 12)} style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <Locate size={18} color="#1C1C1E" />
        </button>
        {/* Main Radar Button (cycles radius) */}
        <button onClick={() => setRadius(r => r >= 25 ? 5 : r + 5)} style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#1C1C1E', color: 'white', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 12px 24px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '8px', cursor: 'pointer' }}>
          <Radar size={24} />
        </button>
      </div>

      {/* Floating Bottom Center: Surge Info */}
      <div style={{ position: 'absolute', bottom: '100px', left: '50%', transform: 'translateX(-50%)', zIndex: 400, pointerEvents: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '50px', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', whiteSpace: 'nowrap' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--emerald)', boxShadow: '0 0 8px var(--emerald)' }} />
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#1C1C1E' }}>Surge Zone · {filteredServices.length} quests · {radius} km</span>
        </div>
      </div>
    </div>
  );
};

export default HustlerDashboard;