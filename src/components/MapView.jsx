import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

const MapView = ({ jobs, onAccept, mapInstanceRef, searchRadius, userLocation }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const center = userLocation || [4.8903, 114.9401];
    const map = L.map(mapRef.current, {
      zoomControl: false,
      attributionControl: false,
    }).setView(center, 13);
    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }).addTo(map);

    L.circleMarker(center, {
      color: '#10b981',
      fillColor: '#10b981',
      fillOpacity: 0.9,
      radius: 8,
      weight: 2,
    }).addTo(map);

    L.circle(center, {
      radius: searchRadius * 1000,
      color: '#10b981',
      weight: 1,
      fillColor: '#10b981',
      fillOpacity: 0.06,
      dashArray: '6 4',
    }).addTo(map);

    jobs.forEach(job => {
      const isOwned = job.payer === 'Me' || job.payer === 'TEST USER';
      const color = isOwned ? '#f59e0b' : '#10b981';
      const marker = L.circleMarker(job.coords, {
        radius: 10,
        color,
        fillColor: color,
        fillOpacity: 0.9,
        weight: 2,
      }).addTo(map);

      marker.bindPopup(`
        <div style="font-family:'Inter',sans-serif; padding:8px; min-width:180px; color:#f1f5f9;">
          <strong style="color:${color}; font-size:0.95rem; display:block; margin-bottom:6px;">${job.title}</strong>
          <div style="font-weight:800; font-size:1.1rem; margin-bottom:6px;">BND ${job.reward}</div>
          <p style="font-size:0.72rem; color:#94a3b8; margin-bottom:3px;">📁 ${job.category}</p>
          <p style="font-size:0.72rem; color:#94a3b8; margin-bottom:10px;">📍 ${job.mukim}, ${job.district}</p>
          ${!isOwned && job.status === 'open' ? `<button onclick="window.dispatchEvent(new CustomEvent('accept-job', {detail: '${job.id}'}))" style="background:${color}; color:white; border:none; padding:10px; border-radius:12px; cursor:pointer; width:100%; font-weight:700; font-size:0.8rem; font-family:inherit;">Quick Apply</button>` : ''}
        </div>
      `);
    });

    const handleAccept = (e) => {
      if (typeof onAccept === 'function') onAccept(e.detail);
    };

    window.addEventListener('accept-job', handleAccept);

    return () => {
      window.removeEventListener('accept-job', handleAccept);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [jobs, onAccept, searchRadius, userLocation, mapInstanceRef]);

  return <div ref={mapRef} id="map-container"></div>;
};

export default MapView;
