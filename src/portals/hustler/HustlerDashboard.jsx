import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Briefcase, MapPin, Star, ChevronRight, Bell, Filter, Zap, LocateFixed, ChevronDown, TrendingUp, Layers, Locate, Radar, SlidersHorizontal, Eye, Shield, Clock, X } from 'lucide-react';
import { usePayment } from '../../context/PaymentContext';

// Helper to calculate exact Haversine distance in km
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Deterministic lat/lng generator based on service ID to prevent teleportation
const getDeterministicCoords = (id, baseLat = 4.8903, baseLng = 114.9401) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  // Generate deterministic offsets within roughly 12-15km radius
  const latOffset = ((Math.abs(hash) % 100) / 100 - 0.5) * 0.16;
  const lngOffset = (((Math.abs(hash) >> 8) % 100) / 100 - 0.5) * 0.16;
  return {
    lat: baseLat + latOffset,
    lng: baseLng + lngOffset
  };
};

const getCategoryIcon = (category) => {
  switch (category?.toLowerCase()) {
    case 'delivery': return { emoji: '🚗', color: '#3b82f6', label: 'Delivery' };
    case 'cleaning': return { emoji: '🧹', color: '#10b981', label: 'Cleaning' };
    case 'handyman': return { emoji: '🔨', color: '#f59e0b', label: 'Handyman' };
    case 'education': return { emoji: '📚', color: '#8b5cf6', label: 'Education' };
    default: return { emoji: '💼', color: '#64748b', label: 'Other' };
  }
};

const HustlerDashboard = () => {
  const navigate = useNavigate();
  const { services, refresh, placeOrder } = usePayment();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [radius, setRadius] = useState(15);
  const [mapStyle, setMapStyle] = useState('voyager'); // 'voyager' | 'dark' | 'satellite'
  const [selectedQuest, setSelectedQuest] = useState(null);
  const [accepting, setAccepting] = useState(false);
  
  // Location States
  const [userCoords, setUserCoords] = useState(() => {
    const saved = localStorage.getItem('sidequest_user_coords');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return { lat: 4.8903, lng: 114.9401 };
  });
  const [locationName, setLocationName] = useState(() => {
    return localStorage.getItem('sidequest_location_name') || 'Bandar Seri Begawan';
  });
  const [showLocationPrompt, setShowLocationPrompt] = useState(() => {
    return !localStorage.getItem('sidequest_location_authorized');
  });

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const circleRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    refresh();
  }, []);

  // Expose global callback so Leaflet popups can set React state without reloading the page
  useEffect(() => {
    window.openQuestDetails = (id) => {
      const found = services.find(s => s.id === id);
      if (found) {
        setSelectedQuest(found);
      }
    };
    return () => {
      delete window.openQuestDetails;
    };
  }, [services]);

  // Request user geolocation
  const handleRequestLocation = () => {
    localStorage.setItem('sidequest_location_authorized', 'true');
    setShowLocationPrompt(false);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserCoords(coords);
          setLocationName('Your Current Location');
          localStorage.setItem('sidequest_user_coords', JSON.stringify(coords));
          localStorage.setItem('sidequest_location_name', 'Your Current Location');
          if (mapInstanceRef.current) {
            mapInstanceRef.current.setView([coords.lat, coords.lng], 13);
          }
        },
        (error) => {
          console.warn('Geolocation denied or failed, falling back to default.', error);
          const defaultName = 'Bandar Seri Begawan (Default)';
          setLocationName(defaultName);
          localStorage.setItem('sidequest_location_name', defaultName);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      const defaultName = 'Bandar Seri Begawan (Default)';
      setLocationName(defaultName);
      localStorage.setItem('sidequest_location_name', defaultName);
    }
  };

  const handleUseDefaultLocation = () => {
    localStorage.setItem('sidequest_location_authorized', 'true');
    setShowLocationPrompt(false);
    const defaultName = 'Bandar Seri Begawan (Default)';
    setLocationName(defaultName);
    localStorage.setItem('sidequest_location_name', defaultName);
  };

  // Pre-filter services based on Category, Search Query, AND Geofence Radius
  const filteredServices = services.filter(service => {
    const coords = getDeterministicCoords(service.id, userCoords.lat, userCoords.lng);
    const distance = getDistance(userCoords.lat, userCoords.lng, coords.lat, coords.lng);
    
    const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRadius = distance <= radius;

    return matchesCategory && matchesSearch && matchesRadius;
  });

  const totalPotential = filteredServices.reduce((sum, s) => sum + parseFloat(s.price), 0);

  // Initialize & Update Map & Layers
  useEffect(() => {
    if (!window.L || !mapRef.current) return;

    // 1. Initialize Map instance
    if (!mapInstanceRef.current) {
      const map = L.map(mapRef.current, { zoomControl: false }).setView([userCoords.lat, userCoords.lng], 12);
      mapInstanceRef.current = map;
    } else {
      // Re-center if coordinates changed (e.g. after location access granted)
      mapInstanceRef.current.setView([userCoords.lat, userCoords.lng]);
    }

    const map = mapInstanceRef.current;

    // 2. Remove existing layers
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    // 3. Set Tile style based on selected layer
    let tileUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    if (mapStyle === 'dark') {
      tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    } else if (mapStyle === 'satellite') {
      tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    }
    L.tileLayer(tileUrl, { maxZoom: 19 }).addTo(map);

    // 4. Update Geofence Circle
    if (circleRef.current) {
      map.removeLayer(circleRef.current);
    }
    circleRef.current = L.circle([userCoords.lat, userCoords.lng], {
      radius: radius * 1000,
      color: 'var(--gold)',
      weight: 2,
      fillColor: 'var(--gold)',
      fillOpacity: 0.08
    }).addTo(map);

    // 5. Update Hustler Radar Marker
    // Clear old markers
    markersRef.current.forEach(marker => map.removeLayer(marker));
    markersRef.current = [];

    const radarIcon = L.divIcon({
      className: 'custom-radar-icon',
      html: `
        <div style="position: relative; width: 60px; height: 60px; margin: -30px 0 0 -30px;">
          <div style="position: absolute; inset: 0; border-radius: 50%; background: conic-gradient(from 0deg, transparent 70%, rgba(212, 175, 55, 0.4) 100%); animation: spin 3s linear infinite;"></div>
          <div style="position: absolute; top: 50%; left: 50%; width: 16px; height: 16px; margin: -8px 0 0 -8px; border-radius: 50%; background: var(--gold); border: 2.5px solid white; box-shadow: 0 0 15px var(--gold);"></div>
        </div>
        <style>@keyframes spin { 100% { transform: rotate(360deg); } }</style>
      `,
      iconSize: [0, 0]
    });
    const hustlerMarker = L.marker([userCoords.lat, userCoords.lng], { icon: radarIcon }).addTo(map);
    markersRef.current.push(hustlerMarker);

    // 6. Draw dynamic category-icon job pins
    filteredServices.forEach((service) => {
      const coords = getDeterministicCoords(service.id, userCoords.lat, userCoords.lng);
      const catIcon = getCategoryIcon(service.category);

      const jobPinIcon = L.divIcon({
        className: 'custom-job-pin',
        html: `
          <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            width: 38px;
            height: 38px;
            background: ${catIcon.color};
            border: 2.5px solid white;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            box-shadow: 0 6px 16px rgba(0,0,0,0.25);
            transition: all 0.2s ease-in-out;
          " class="job-marker-hover">
            <span style="transform: rotate(45deg); font-size: 16px; display: block; margin-top: -2px; margin-left: -2px;">${catIcon.emoji}</span>
          </div>
        `,
        iconSize: [38, 38],
        iconAnchor: [19, 38]
      });

      const marker = L.marker([coords.lat, coords.lng], { icon: jobPinIcon }).addTo(map);
      marker.bindPopup(`
        <div style="font-family:'Outfit', sans-serif; padding:8px; min-width:140px; text-align: center;">
          <span style="background:${catIcon.color}15; color:${catIcon.color}; font-size:10px; font-weight:800; padding:4px 8px; border-radius:6px; display:inline-block; margin-bottom:8px; text-transform:uppercase;">${catIcon.label}</span>
          <strong style="color:var(--text-primary); font-size:0.95rem; display:block; margin-bottom:4px; font-weight:800;">${service.title}</strong>
          <div style="font-weight:900; font-size:1.15rem; color:var(--emerald); margin-bottom:8px;">BND ${service.price}</div>
          <button onclick="window.openQuestDetails('${service.id}')" style="background:var(--gold); color:white; border:none; padding:10px; border-radius:10px; cursor:pointer; width:100%; font-weight:800; font-size:0.8rem; box-shadow: 0 4px 10px rgba(212,175,55,0.3); transition: transform 0.1s;">View Quest</button>
        </div>
      `);

      markersRef.current.push(marker);
    });

  }, [filteredServices, mapStyle, userCoords, radius]);

  const categories = ['All', 'Delivery', 'Cleaning', 'Handyman', 'Education'];

  const handleAcceptQuest = async () => {
    if (!selectedQuest) return;
    setAccepting(true);
    const res = await placeOrder(selectedQuest.id);
    if (res.success) {
      setSelectedQuest(null);
      navigate('/hustler/orders');
    } else {
      alert(res.error || 'Failed to accept quest');
    }
    setAccepting(false);
  };

  return (
    <div className="app-content no-scrollbar" style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      
      {/* Full Screen Map */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
        <div ref={mapRef} style={{ width: '100%', height: '100%', background: '#e2e8f0' }}></div>
      </div>

      {/* Floating Top Elements */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 400, padding: '20px 20px 0 20px', pointerEvents: 'none' }}>
        
        {/* Row 1: Search Bar & Notification */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', pointerEvents: 'auto' }}>
          {/* Search Input Box */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '50px', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.3)', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
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

          {/* Inbox Notification Icon */}
          <button onClick={() => navigate('/hustler/notifications')} style={{ position: 'relative', width: '46px', height: '46px', borderRadius: '50%', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.3)', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
            <Bell size={19} color="#1C1C1E" />
            <span style={{ position: 'absolute', top: '12px', right: '12px', width: '8px', height: '8px', background: '#FF3B30', borderRadius: '50%' }} />
          </button>
        </div>

        {/* Row 2: Category Filter Horizontal Scroll bar */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '4px 0 12px 0', pointerEvents: 'auto', WebkitOverflowScrolling: 'touch' }} className="no-scrollbar">
          {categories.map(cat => (
            <button 
              key={cat} 
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                background: selectedCategory === cat ? 'var(--gold)' : 'rgba(255,255,255,0.95)',
                color: selectedCategory === cat ? 'white' : '#1C1C1E',
                border: 'none',
                fontWeight: 800,
                fontSize: '11px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
                textTransform: 'uppercase',
                letterSpacing: '0.3px'
              }}
            >
              {getCategoryIcon(cat).emoji} {cat}
            </button>
          ))}
        </div>

        {/* Row 3: Current Location Pin */}
        <div style={{ display: 'flex', pointerEvents: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '50px', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.3)', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%', background: '#1C1C1E' }}>
              <MapPin size={14} color="white" />
            </div>
            <div style={{ lineHeight: 1 }}>
              <p style={{ fontSize: '9px', color: '#8E8E93', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Location Authorized</p>
              <p style={{ fontSize: '11px', fontWeight: 800, color: '#1C1C1E', marginTop: '2px' }}>{locationName}</p>
            </div>
          </div>
        </div>

      </div>

      {/* Floating Left: Total Potential Earnings Card */}
      <div style={{ position: 'absolute', top: '190px', left: '20px', zIndex: 400, pointerEvents: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '50px', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.3)', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', background: '#1C1C1E' }}>
            <TrendingUp size={16} color="white" />
            <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '10px', height: '10px', background: 'var(--emerald)', border: '2px solid white', borderRadius: '50%' }} />
          </div>
          <div style={{ lineHeight: 1 }}>
            <p style={{ fontSize: '8px', color: '#8E8E93', fontWeight: 700, textTransform: 'uppercase' }}>Radar Value</p>
            <p style={{ fontSize: '12px', fontWeight: 900, color: '#1C1C1E', marginTop: '2px' }}>BND {totalPotential.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Floating Right: Action Stack */}
      <div style={{ position: 'absolute', top: '190px', right: '20px', zIndex: 400, display: 'flex', flexDirection: 'column', gap: '12px', pointerEvents: 'auto' }}>
        {/* Toggle Layers */}
        <button 
          onClick={() => setMapStyle(style => style === 'voyager' ? 'dark' : style === 'dark' ? 'satellite' : 'voyager')}
          style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.3)', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', outline: 'none' }}
          title={`Map layer: ${mapStyle}`}
        >
          <Layers size={19} color={mapStyle === 'satellite' ? 'var(--gold)' : '#1C1C1E'} />
        </button>

        {/* Center Back on User Coordinates */}
        <button 
          onClick={() => mapInstanceRef.current?.setView([userCoords.lat, userCoords.lng], 13)} 
          style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.3)', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', outline: 'none' }}
        >
          <Locate size={19} color="#1C1C1E" />
        </button>

        {/* Dynamic Radar Radius Button (cycles radius by 5km increment) */}
        <button 
          onClick={() => setRadius(r => r >= 25 ? 5 : r + 5)} 
          style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#1C1C1E', color: 'white', border: '2px solid rgba(255,255,255,0.2)', boxShadow: '0 12px 32px rgba(0,0,0,0.25)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: '8px', cursor: 'pointer', outline: 'none' }}
        >
          <Radar size={22} className="animated-pulse" />
          <span style={{ fontSize: '9px', fontWeight: 800, marginTop: '2px', color: 'var(--gold)' }}>{radius}K</span>
        </button>
      </div>

      {/* Floating Bottom Center: Surge Info */}
      <div style={{ position: 'absolute', bottom: '100px', left: '50%', transform: 'translateX(-50%)', zIndex: 400, pointerEvents: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '50px', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.3)', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', whiteSpace: 'nowrap' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--gold)', boxShadow: '0 0 8px var(--gold)' }} />
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#1C1C1E' }}>Radar Area · {filteredServices.length} quests in {radius} km</span>
        </div>
      </div>

      {/* RENDER MODAL: Location Permission Authorization Sheet */}
      <AnimatePresence>
        {showLocationPrompt && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(8px)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center'
          }}>
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              style={{
                width: '100%',
                background: 'var(--bg-secondary)',
                borderRadius: '32px 32px 0 0',
                padding: '32px 24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                boxShadow: '0 -15px 30px rgba(0,0,0,0.15)'
              }}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(212, 175, 55, 0.15)', color: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <MapPin size={26} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '8px', fontFamily: 'Outfit' }}>Discover Nearby Quests</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', fontWeight: 600, lineHeight: 1.5, marginBottom: '28px', padding: '0 10px' }}>
                Allow SideQuest to access your location to discover high-paying deliveries, cleaning work, and micro-gigs in your immediate neighborhood.
              </p>
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button 
                  onClick={handleRequestLocation} 
                  className="btn-primary" 
                  style={{ width: '100%', height: '56px', fontSize: '0.95rem' }}
                >
                  Authorize Location
                </button>
                 <button 
                  onClick={handleUseDefaultLocation} 
                  className="btn-ghost" 
                  style={{ width: '100%', height: '52px', border: '1px solid var(--border-glass)', fontSize: '0.9rem', color: 'var(--text-muted)' }}
                >
                  Use Bandar Seri Begawan (Default)
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* RENDER MODAL: Instant Bottom Sheet Quest Details Sheet */}
      <AnimatePresence>
        {selectedQuest && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(5px)',
            zIndex: 1001,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center'
          }}>
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              style={{
                width: '100%',
                background: 'var(--bg-secondary)',
                borderRadius: '32px 32px 0 0',
                maxHeight: '82vh',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 -15px 40px rgba(0,0,0,0.25)',
                overflow: 'hidden'
              }}
            >
              {/* Sheet Drag Indicator & Close */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px 10px 24px', borderBottom: '1px solid var(--border-glass)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="badge badge-gold" style={{ padding: '6px 12px', fontSize: '10px' }}>
                    {getCategoryIcon(selectedQuest.category).emoji} {selectedQuest.category}
                  </span>
                </div>
                <button 
                  onClick={() => setSelectedQuest(null)} 
                  style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-tertiary)', border: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyCenter: 'center', cursor: 'pointer', outline: 'none', padding: 0 }}
                  className="flex-center"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Scrollable Quest Info */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '24px 24px 120px 24px', position: 'relative' }} className="no-scrollbar">
                
                {/* Title & Price Header */}
                <h2 style={{ fontSize: '1.45rem', fontWeight: 900, marginBottom: '6px', fontFamily: 'Outfit', lineHeight: 1.3 }}>{selectedQuest.title}</h2>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--gold)', marginBottom: '20px' }}>
                  BND {selectedQuest.price}
                </div>

                {/* Info Card Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '24px' }}>
                  <div className="card-glass" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-tertiary)' }}>
                    <MapPin size={15} className="text-gold" /> 
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)' }}>Brunei Muara</span>
                  </div>
                  <div className="card-glass" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-tertiary)' }}>
                    <Shield size={15} className="text-gold" /> 
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)' }}>Escrow Secured</span>
                  </div>
                </div>

                {/* Description */}
                <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Description</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, fontWeight: 500, marginBottom: '28px' }}>
                  {selectedQuest.description || 'No description provided by the poster for this task.'}
                </p>

                {/* Provider Card */}
                <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Quest Poster</h4>
                <div className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', border: '1.5px dashed var(--border-glass)' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', overflow: 'hidden', background: 'var(--bg-tertiary)', border: '1px solid var(--border-glass)' }}>
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedQuest.providerId}`} alt="provider" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: '0.92rem' }}>{selectedQuest.provider?.fullname || 'Quest Poster'}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Registered Poster</div>
                  </div>
                </div>

              </div>

              {/* Absolute Bottom Booking Bar inside the Sheet */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '20px 24px 32px',
                background: 'var(--bg-secondary)',
                borderTop: '1px solid var(--border-glass)',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                zIndex: 10
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Payout</div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-primary)' }}>BND {selectedQuest.price}</div>
                </div>
                <button 
                  className="btn-primary" 
                  onClick={handleAcceptQuest}
                  disabled={accepting}
                  style={{ flex: 2, height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', outline: 'none' }}
                >
                  {accepting ? <div className="spinner-small" style={{ borderTopColor: 'white' }} /> : <><Zap size={18} /> Accept Quest</>}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default HustlerDashboard;