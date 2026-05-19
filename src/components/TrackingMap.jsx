import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const TrackingMap = ({ providerId, customerId }) => {
  const mapRef = useRef(null);
  const mapObjRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current || mapObjRef.current) return;

    // Mock locations for Brunei Gadong area
    const customerCoords = [4.8903, 114.9401]; 
    const providerCoords = [4.8820, 114.9350]; 

    const map = L.map(mapRef.current, {
      zoomControl: false,
      attributionControl: false,
    }).setView([4.8860, 114.9375], 15);
    
    mapObjRef.current = map;

    // Voyager light theme map perfectly fits the Poster portal's light UI
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }).addTo(map);

    // Customer Icon (Destination Pin)
    const customerIcon = L.divIcon({
      className: 'custom-pin',
      html: `<div style="width: 24px; height: 24px; border-radius: 50%; background: #0f172a; border: 4px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.2);"></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
    L.marker(customerCoords, { icon: customerIcon }).addTo(map);

    // Route line connecting them
    L.polyline([providerCoords, customerCoords], {
      color: '#10b981', // Emerald green
      weight: 5,
      dashArray: '10, 10',
      opacity: 0.8
    }).addTo(map);

    // Provider Icon (Hustler live avatar + ETA tag)
    const providerIcon = L.divIcon({
      className: 'provider-pin',
      html: `
        <div style="display:flex; flex-direction:column; align-items:center; transform: translate(-50%, -100%); width: 80px;">
          <div style="background:#0f172a; color:white; padding:4px 8px; border-radius:8px; font-size:0.7rem; font-weight:800; white-space:nowrap; margin-bottom:6px; box-shadow:0 4px 6px rgba(0,0,0,0.15); font-family: 'Outfit', sans-serif;">
            5 min away
          </div>
          <div style="width: 44px; height: 44px; border-radius: 50%; background: white; border: 3px solid #10b981; overflow: hidden; box-shadow: 0 6px 16px rgba(16,185,129,0.3);">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=${providerId || 'hustler'}" style="width:100%; height:100%;" />
          </div>
        </div>
      `,
      iconSize: [0, 0], 
      iconAnchor: [0, 0] 
    });

    markerRef.current = L.marker(providerCoords, { icon: providerIcon, zIndexOffset: 1000 }).addTo(map);

    // Live tracking animation (simulate driving)
    let start = null;
    const duration = 60000; // 60s for full trip
    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      
      const lat = providerCoords[0] + (customerCoords[0] - providerCoords[0]) * progress;
      const lng = providerCoords[1] + (customerCoords[1] - providerCoords[1]) * progress;
      
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      }
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);

    return () => {
      map.remove();
      mapObjRef.current = null;
    };
  }, [providerId, customerId]);

  return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />;
};

export default TrackingMap;
