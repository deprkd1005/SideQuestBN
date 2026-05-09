import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

const MapView = ({ jobs, onAccept, mapInstanceRef, searchRadius, userLocation }) => {
  const mapRef = useRef(null);
  const mapObjRef = useRef(null);
  const markersLayerRef = useRef(L.layerGroup());
  const circleRef = useRef(null);

  // 1. Initialize Map once
  useEffect(() => {
    if (!mapRef.current || mapObjRef.current) return;

    const center = userLocation || [4.8903, 114.9401];
    const map = L.map(mapRef.current, {
      zoomControl: false,
      attributionControl: false,
      zoomSnap: 0.1
    }).setView(center, 13);
    
    mapObjRef.current = map;
    if (mapInstanceRef) {
      mapInstanceRef.current = map;
    }

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }).addTo(map);

    markersLayerRef.current.addTo(map);

    // Current User Marker
    L.circleMarker(center, {
      color: 'var(--emerald)',
      fillColor: 'var(--emerald)',
      fillOpacity: 0.9,
      radius: 8,
      weight: 2,
    }).addTo(map);

    const handleAccept = (e) => {
      if (typeof onAccept === 'function') onAccept(e.detail);
    };

    window.addEventListener('accept-job', handleAccept);

    return () => {
      window.removeEventListener('accept-job', handleAccept);
      map.remove();
      mapObjRef.current = null;
      if (mapInstanceRef) {
        mapInstanceRef.current = null;
      }
    };
  }, []); // Only once

  // 2. Update Search Radius Circle
  useEffect(() => {
    if (!mapObjRef.current || !searchRadius) return;
    const center = userLocation || [4.8903, 114.9401];

    if (circleRef.current) {
      circleRef.current.setRadius(searchRadius * 1000);
    } else {
      circleRef.current = L.circle(center, {
        radius: searchRadius * 1000,
        color: 'var(--emerald)',
        weight: 1,
        fillColor: 'var(--emerald)',
        fillOpacity: 0.06,
        dashArray: '6 4',
      }).addTo(mapObjRef.current);
    }
  }, [searchRadius, userLocation]);

  // 3. Update Job Markers
  useEffect(() => {
    if (!mapObjRef.current) return;
    markersLayerRef.current.clearLayers();

    jobs.forEach(job => {
      if (!job.coords || !Array.isArray(job.coords)) return;
      const isOwned = job.payer === 'Me' || job.payer === 'TEST USER';
      const color = isOwned ? 'var(--orange)' : 'var(--emerald)';
      
      const marker = L.circleMarker(job.coords, {
        radius: 10,
        color,
        fillColor: color,
        fillOpacity: 0.9,
        weight: 2,
      });

      marker.bindPopup(`
        <div style="font-family:'Inter',sans-serif; padding:8px; min-width:180px; color:#f1f5f9;">
          <strong style="color:${color}; font-size:0.95rem; display:block; margin-bottom:6px;">${job.title}</strong>
          <div style="font-weight:800; font-size:1.1rem; margin-bottom:6px;">BND ${job.reward}</div>
          <p style="font-size:0.72rem; color:#94a3b8; margin-bottom:3px;">📁 ${job.category}</p>
          <p style="font-size:0.72rem; color:#94a3b8; margin-bottom:10px;">📍 ${job.mukim}, ${job.district}</p>
          ${!isOwned && job.status === 'open' ? `<button onclick="window.dispatchEvent(new CustomEvent('accept-job', {detail: '${job.id}'}))" style="background:${color}; color:white; border:none; padding:10px; border-radius:12px; cursor:pointer; width:100%; font-weight:700; font-size:0.8rem; font-family:inherit;">Quick Apply</button>` : ''}
        </div>
      `);

      markersLayerRef.current.addLayer(marker);
    });
  }, [jobs]);

  return <div ref={mapRef} id="map-container"></div>;
};

export default MapView;

