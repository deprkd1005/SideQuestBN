import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, ChevronRight, Bell, Zap, Locate, Radar, Layers, SlidersHorizontal, Trash2, Calendar, Users, X, CreditCard, Wallet } from 'lucide-react';
import { useTourismPayment } from '../context/TourismPaymentContext';
import { useLanguage } from '../context/LanguageContext';
import InteractiveScheduler from './tourist/InteractiveScheduler';
import PaymentCard from './tourist/PaymentCard';

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

const getCategoryIcon = (category) => {
  switch (category?.toUpperCase()) {
    case 'CULTURE': return { emoji: '🏛️', color: '#10b981', label: 'Culture' };
    case 'ADVENTURE': return { emoji: '🚣', color: '#3b82f6', label: 'Adventure' };
    case 'FOOD': return { emoji: '🍲', color: '#f59e0b', label: 'Food' };
    case 'NATURE': return { emoji: '🌴', color: '#8b5cf6', label: 'Nature' };
    default: return { emoji: '🌏', color: '#64748b', label: 'Activity' };
  }
};

const TouristDashboard = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { dbState, travelerBalance, createBooking, resetDb, fetchDb } = useTourismPayment();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [radius, setRadius] = useState(15);
  const [mapStyle, setMapStyle] = useState('voyager'); // voyager | dark | satellite
  const [selectedActivity, setSelectedActivity] = useState(null);
  
  // Booking details
  const [bookingDate, setBookingDate] = useState('');
  const [bookingSlot, setBookingSlot] = useState('');
  const [participantsCount, setParticipantsCount] = useState(1);
  const [bookingInProgress, setBookingInProgress] = useState(false);

  // Payment integration states
  const [showPaymentChoice, setShowPaymentChoice] = useState(false);
  const [showCreditCardForm, setShowCreditCardForm] = useState(false);

  // User location states
  const [userCoords, setUserCoords] = useState({ lat: 4.8903, lng: 114.9401 }); // BSB default
  const [locationName, setLocationName] = useState('Bandar Seri Begawan');

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const circleRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    fetchDb();
  }, []);

  // Expose global callback for Leaflet popups
  useEffect(() => {
    window.openActivityDetails = (id) => {
      const found = dbState.activities.find(a => a.id === id);
      if (found) {
        setSelectedActivity(found);
        setBookingDate('');
        setBookingSlot('');
        setParticipantsCount(1);
        setShowPaymentChoice(false);
        setShowCreditCardForm(false);
      }
    };
    return () => {
      delete window.openActivityDetails;
    };
  }, [dbState.activities]);

  const handleRequestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserCoords(coords);
          setLocationName('My Real Location');
          if (mapInstanceRef.current) {
            mapInstanceRef.current.setView([coords.lat, coords.lng], 13);
          }
        },
        (err) => {
          console.warn('Geolocation failed, keeping default.', err);
        }
      );
    }
  };

  const filteredActivities = dbState.activities.filter(act => {
    const dist = getDistance(userCoords.lat, userCoords.lng, act.location_lat, act.location_lng);
    const matchesCategory = selectedCategory === 'All' || act.category.toUpperCase() === selectedCategory.toUpperCase();
    const matchesSearch = act.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          act.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRadius = dist <= radius;
    return matchesCategory && matchesSearch && matchesRadius;
  });

  const totalHeritageValue = filteredActivities.reduce((sum, act) => sum + parseFloat(act.price_per_person), 0);

  // Initialize and update Leaflet Map
  useEffect(() => {
    if (!window.L || !mapRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapRef.current, { zoomControl: false }).setView([userCoords.lat, userCoords.lng], 12);
      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView([userCoords.lat, userCoords.lng]);
    }

    const map = mapInstanceRef.current;

    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    let tileUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    if (mapStyle === 'dark') {
      tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    } else if (mapStyle === 'satellite') {
      tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    }
    L.tileLayer(tileUrl, { maxZoom: 19 }).addTo(map);

    if (circleRef.current) {
      map.removeLayer(circleRef.current);
    }
    circleRef.current = L.circle([userCoords.lat, userCoords.lng], {
      radius: radius * 1000,
      color: 'var(--emerald)',
      weight: 2,
      fillColor: 'var(--emerald)',
      fillOpacity: 0.08
    }).addTo(map);

    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];

    const touristRadarIcon = L.divIcon({
      className: 'custom-radar-icon',
      html: `
        <div style="position: relative; width: 60px; height: 60px; margin: -30px 0 0 -30px;">
          <div style="position: absolute; inset: 0; border-radius: 50%; background: conic-gradient(from 0deg, transparent 70%, rgba(16, 185, 129, 0.4) 100%); animation: spin 3s linear infinite;"></div>
          <div style="position: absolute; top: 50%; left: 50%; width: 16px; height: 16px; margin: -8px 0 0 -8px; border-radius: 50%; background: var(--emerald); border: 2.5px solid white; box-shadow: 0 0 15px var(--emerald);"></div>
        </div>
        <style>@keyframes spin { 100% { transform: rotate(360deg); } }</style>
      `,
      iconSize: [0, 0]
    });
    const touristMarker = L.marker([userCoords.lat, userCoords.lng], { icon: touristRadarIcon }).addTo(map);
    markersRef.current.push(touristMarker);

    filteredActivities.forEach((act) => {
      const catIcon = getCategoryIcon(act.category);

      const activityPinIcon = L.divIcon({
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

      const marker = L.marker([act.location_lat, act.location_lng], { icon: activityPinIcon }).addTo(map);
      marker.bindPopup(`
        <div style="font-family:'Outfit', sans-serif; padding:8px; min-width:140px; text-align: center;">
          <span style="background:${catIcon.color}15; color:${catIcon.color}; font-size:10px; font-weight:800; padding:4px 8px; border-radius:6px; display:inline-block; margin-bottom:8px; text-transform:uppercase;">${catIcon.label}</span>
          <strong style="color:var(--text-primary); font-size:0.95rem; display:block; margin-bottom:4px; font-weight:800;">${act.title}</strong>
          <div style="font-weight:900; font-size:1.15rem; color:var(--emerald); margin-bottom:8px;">BND ${act.price_per_person.toFixed(2)} / pax</div>
          <button onclick="window.openActivityDetails('${act.id}')" style="background:var(--emerald); color:white; border:none; padding:10px; border-radius:10px; cursor:pointer; width:100%; font-weight:800; font-size:0.8rem; box-shadow: 0 4px 10px rgba(16,185,129,0.3); transition: transform 0.1s;">${t('viewActivity')}</button>
        </div>
      `);

      markersRef.current.push(marker);
    });

  }, [filteredActivities, mapStyle, userCoords, radius, language => t('viewActivity')]);

  const handleConfirmBooking = async (paymentMethod = 'wallet') => {
    if (!selectedActivity) return;
    setBookingInProgress(true);
    const totalAmount = parseFloat(selectedActivity.price_per_person) * participantsCount;
    
    // For direct Card Payment, we bypass virtual card balance check (since it simulates credit card debiting directly)
    if (paymentMethod === 'wallet' && travelerBalance < totalAmount) {
      alert("Insufficient funds in your SideQuest virtual pocket card. Please select Card Payment or top up in Pocket tab.");
      setBookingInProgress(false);
      return;
    }

    const res = await createBooking(
      selectedActivity.id,
      bookingDate,
      bookingSlot,
      participantsCount
    );

    setBookingInProgress(false);
    if (res.success) {
      setSelectedActivity(null);
      setShowPaymentChoice(false);
      setShowCreditCardForm(false);
      navigate('/tourist/bookings');
    } else {
      alert(res.error || "Failed to place booking");
    }
  };

  const handleReset = async () => {
    if (window.confirm("Reset mock database and balances back to prototype default values?")) {
      const res = await resetDb();
      if (res.success) {
        alert("Mock database successfully reset!");
      }
    }
  };

  const categories = ['All', 'Culture', 'Adventure', 'Food', 'Nature'];

  return (
    <div className="app-content no-scrollbar" style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      
      {/* Full Screen Map */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
        <div ref={mapRef} style={{ width: '100%', height: '100%', background: '#e2e8f0' }}></div>
      </div>

      {/* Floating Top Elements */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 400, padding: '20px 20px 0 20px', pointerEvents: 'none' }}>
        
        {/* Row 1: Search Bar & Notifications */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', pointerEvents: 'auto' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '50px', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.3)', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
            <Search size={18} color="#8E8E93" />
            <input 
              type="text" 
              placeholder={t('searchActivities')} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: '14px', color: '#1C1C1E', fontWeight: 600 }}
            />
            <SlidersHorizontal size={18} color="#1C1C1E" />
          </div>

          <button onClick={() => navigate('/tourist/notifications')} style={{ position: 'relative', width: '46px', height: '46px', borderRadius: '50%', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.3)', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
            <Bell size={19} color="#1C1C1E" />
            <span style={{ position: 'absolute', top: '12px', right: '12px', width: '8px', height: '8px', background: '#FF3B30', borderRadius: '50%' }} />
          </button>
        </div>

        {/* Row 2: Category Filter Horizontal Scroll */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '4px 0 12px 0', pointerEvents: 'auto', WebkitOverflowScrolling: 'touch' }} className="no-scrollbar">
          {categories.map(cat => (
            <button 
              key={cat} 
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                background: selectedCategory === cat ? 'var(--emerald)' : 'rgba(255,255,255,0.95)',
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
              {getCategoryIcon(cat).emoji} {t(cat.toLowerCase())}
            </button>
          ))}
        </div>

        {/* Row 3: Current Location Badge */}
        <div style={{ display: 'flex', pointerEvents: 'auto', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '50px', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.3)', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyWindow: 'center', width: '28px', height: '28px', borderRadius: '50%', background: '#1C1C1E', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={handleRequestLocation}>
              <MapPin size={14} color="white" />
            </div>
            <div style={{ lineHeight: 1 }}>
              <p style={{ fontSize: '9px', color: '#8E8E93', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t('exploreBrunei')}</p>
              <p style={{ fontSize: '11px', fontWeight: 800, color: '#1C1C1E', marginTop: '2px' }}>{locationName}</p>
            </div>
          </div>
        </div>

      </div>

      {/* Floating Left: Total Heritage Activity Value */}
      <div style={{ position: 'absolute', top: '190px', left: '20px', zIndex: 400, pointerEvents: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '50px', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.3)', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', background: '#1C1C1E' }}>
            <Radar size={16} color="white" />
          </div>
          <div style={{ lineHeight: 1 }}>
            <p style={{ fontSize: '8px', color: '#8E8E93', fontWeight: 700, textTransform: 'uppercase' }}>{t('availableValue')}</p>
            <p style={{ fontSize: '12px', fontWeight: 900, color: 'var(--emerald)', marginTop: '2px' }}>BND {totalHeritageValue.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Floating Right: Action controls */}
      <div style={{ position: 'absolute', top: '190px', right: '20px', zIndex: 400, display: 'flex', flexDirection: 'column', gap: '12px', pointerEvents: 'auto' }}>
        <button 
          onClick={() => setMapStyle(style => style === 'voyager' ? 'dark' : style === 'dark' ? 'satellite' : 'voyager')}
          style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.3)', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', outline: 'none' }}
        >
          <Layers size={19} color={mapStyle === 'satellite' ? 'var(--emerald)' : '#1C1C1E'} />
        </button>

        <button 
          onClick={() => mapInstanceRef.current?.setView([userCoords.lat, userCoords.lng], 13)} 
          style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.3)', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', outline: 'none' }}
        >
          <Locate size={19} color="#1C1C1E" />
        </button>

        <button 
          onClick={() => setRadius(r => r >= 40 ? 5 : r + 10)} 
          style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#1C1C1E', color: 'white', border: '2px solid rgba(255,255,255,0.2)', boxShadow: '0 12px 32px rgba(0,0,0,0.25)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginTop: '8px', cursor: 'pointer', outline: 'none' }}
        >
          <Radar size={22} color="var(--emerald)" />
          <span style={{ fontSize: '9px', fontWeight: 800, marginTop: '2px', color: 'white' }}>{radius}K</span>
        </button>

        <button 
          onClick={handleReset}
          style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.9)', border: 'none', boxShadow: '0 8px 24px rgba(239, 68, 68, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', outline: 'none' }}
        >
          <Trash2 size={18} color="white" />
        </button>
      </div>

      {/* Floating Bottom Center: Surge Info */}
      <div style={{ position: 'absolute', bottom: '100px', left: '50%', transform: 'translateX(-50%)', zIndex: 400, pointerEvents: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '50px', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.3)', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', whiteSpace: 'nowrap' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--emerald)', boxShadow: '0 0 8px var(--emerald)' }} />
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#1C1C1E' }}>{t('geofence')}: {filteredActivities.length} {t('heritageExperiences')}</span>
        </div>
      </div>

      {/* Bottom Sheet Details & Booking Form */}
      <AnimatePresence>
        {selectedActivity && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(6px)',
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
                maxHeight: '85vh',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 -15px 40px rgba(0,0,0,0.25)',
                overflow: 'hidden',
                color: 'var(--text-primary)',
                fontFamily: 'Outfit'
              }}
            >
              {/* Sheet Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px 10px 24px', borderBottom: '1px solid var(--border-glass)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="badge badge-emerald" style={{ padding: '6px 12px', fontSize: '10px' }}>
                    {getCategoryIcon(selectedActivity.category).emoji} {t(selectedActivity.category.toLowerCase())}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>📍 {selectedActivity.district}</span>
                </div>
                <button 
                  onClick={() => setSelectedActivity(null)} 
                  style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-tertiary)', border: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', outline: 'none' }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Scrollable Info */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '24px 24px 40px 24px' }} className="no-scrollbar">
                
                <h2 style={{ fontSize: '1.35rem', fontWeight: 900, marginBottom: '6px', lineHeight: 1.3 }}>{selectedActivity.title}</h2>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--emerald)', marginBottom: '16px' }}>
                  BND {selectedActivity.price_per_person.toFixed(2)} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>{t('perPerson')}</span>
                </div>

                {/* Description */}
                <h4 style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>{t('description')}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '20px' }}>
                  {selectedActivity.description}
                </p>

                {/* Logistics */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '24px' }}>
                  <div className="card-glass" style={{ padding: '12px 16px', background: 'var(--bg-tertiary)' }}>
                    <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>{t('location')}</div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>{selectedActivity.exact_location}</div>
                  </div>
                  <div className="card-glass" style={{ padding: '12px 16px', background: 'var(--bg-tertiary)' }}>
                    <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>{t('duration')}</div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>{selectedActivity.duration_minutes} {t('minutes')}</div>
                  </div>
                </div>

                {!showPaymentChoice ? (
                  /* Native Interactive Scheduler */
                  <InteractiveScheduler 
                    pricePerPerson={selectedActivity.price_per_person}
                    onScheduleSelected={(schedule) => {
                      setBookingDate(schedule.date);
                      setBookingSlot(schedule.timeSlot);
                      setParticipantsCount(schedule.pax);
                      setShowPaymentChoice(true);
                    }}
                    onCancel={() => setSelectedActivity(null)}
                  />
                ) : (
                  /* Payment Selector Flow */
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      borderRadius: '24px',
                      border: '1px solid var(--border-glass)',
                      padding: '20px'
                    }}
                  >
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CreditCard size={18} style={{ color: 'var(--emerald)' }} />
                      Choose Payout Payment Method
                    </h3>

                    {/* Booking Details Summary */}
                    <div style={{
                      background: 'rgba(255,255,255,0.02)',
                      borderRadius: '16px',
                      padding: '14px',
                      marginBottom: '20px',
                      fontSize: '0.8rem',
                      lineHeight: 1.5,
                      border: '1px solid var(--border-glass)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Date:</span>
                        <span style={{ fontWeight: 700 }}>{bookingDate}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Time Slot:</span>
                        <span style={{ fontWeight: 700 }}>{bookingSlot}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Travelers:</span>
                        <span style={{ fontWeight: 700 }}>{participantsCount} Pax</span>
                      </div>
                      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '8px', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                        <span style={{ fontWeight: 800 }}>Total Price:</span>
                        <span style={{ fontWeight: 900, color: 'var(--emerald)' }}>BND {(parseFloat(selectedActivity.price_per_person) * participantsCount).toFixed(2)}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                      {/* Virtual Wallet Account */}
                      <button
                        onClick={() => handleConfirmBooking('wallet')}
                        className="btn-outline"
                        style={{
                          padding: '16px',
                          borderRadius: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          border: '1px solid var(--border-glass)',
                          background: 'rgba(255,255,255,0.01)',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <Wallet size={20} style={{ color: 'var(--emerald)' }} />
                          <div>
                            <span style={{ fontSize: '0.85rem', fontWeight: 800, display: 'block', color: 'white' }}>SideQuest Pocket Balance</span>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Current balance: BND {travelerBalance.toFixed(2)}</span>
                          </div>
                        </div>
                        <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
                      </button>

                      {/* Visa/Mastercard Integration */}
                      <button
                        onClick={() => setShowCreditCardForm(true)}
                        className="btn-outline"
                        style={{
                          padding: '16px',
                          borderRadius: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          border: '1px solid var(--border-glass)',
                          background: 'rgba(255,255,255,0.01)',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <CreditCard size={20} style={{ color: 'var(--emerald)' }} />
                          <div>
                            <span style={{ fontSize: '0.85rem', fontWeight: 800, display: 'block', color: 'white' }}>Visa / Mastercard</span>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Direct Card Payment Sync</span>
                          </div>
                        </div>
                        <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
                      </button>
                    </div>

                    <button 
                      onClick={() => setShowPaymentChoice(false)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'block',
                        margin: '0 auto'
                      }}
                    >
                      ← Change Schedule
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Credit Card payment checkout popup */}
      <AnimatePresence>
        {showCreditCardForm && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.8)',
            zIndex: 1002,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            backdropFilter: 'blur(10px)'
          }}>
            <PaymentCard 
              amount={parseFloat(selectedActivity?.price_per_person || 0) * participantsCount}
              onPaymentComplete={() => handleConfirmBooking('card')}
              onCancel={() => setShowCreditCardForm(false)}
            />
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default TouristDashboard;
