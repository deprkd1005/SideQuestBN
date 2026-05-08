import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, Sliders, List, Map as MapIcon, Navigation, Star, ChevronRight, Clock, Shield, X, User } from 'lucide-react';
import { usePayment } from '../../context/PaymentContext';
import MapView from '../../components/MapView';

const HustlerHome = () => {
  const navigate = useNavigate();
  const { jobs, userLocation } = usePayment();
  const [searchRadius, setSearchRadius] = useState(20);
  const [viewMode, setViewMode] = useState('map'); // map or list
  const [selectedJob, setSelectedJob] = useState(null);
  const mapInstanceRef = useRef(null);

  const openJobs = jobs.filter(job => job.status === 'open');
  const nearbyJobs = openJobs.slice(0, 8);

  const handleJobSelect = (job) => {
    setSelectedJob(job);
    if (mapInstanceRef.current && job.location) {
      mapInstanceRef.current.setView([job.location.lat, job.location.lng], 15);
    }
  };

  const handleViewDetails = (jobId) => {
    navigate(`/hustler/job/${jobId}`);
  };

  return (
    <div className="app-content no-pad" style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', background: 'var(--bg-primary)' }}>
      {/* Search Header Overlay */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        right: '20px',
        zIndex: 100,
        display: 'flex',
        gap: '10px'
      }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <div className="card-glass" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: '4px 16px', 
            borderRadius: '16px',
            background: 'var(--bg-glass-strong)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
          }}>
            <Search size={18} className="text-muted" />
            <input 
              type="text" 
              placeholder="Search tasks nearby..." 
              style={{ 
                flex: 1,
                padding: '12px', 
                background: 'none', 
                border: 'none', 
                color: 'white',
                fontSize: '0.9rem',
                fontWeight: 600,
                outline: 'none'
              }} 
            />
          </div>
        </div>
        <button className="card-glass" style={{ width: '48px', height: '48px', borderRadius: '16px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Sliders size={20} />
        </button>
      </div>

      {/* Floating View Toggle */}
      <div style={{
        position: 'absolute',
        top: '84px',
        right: '20px',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        <button 
          onClick={() => setViewMode(viewMode === 'map' ? 'list' : 'map')}
          className="btn-primary"
          style={{ 
            width: '48px', 
            height: '48px', 
            padding: 0, 
            borderRadius: '16px',
            background: 'var(--emerald)',
            boxShadow: '0 0 20px var(--emerald-glow)'
          }}
        >
          {viewMode === 'map' ? <List size={22} /> : <MapIcon size={22} />}
        </button>
        <button className="card-glass" style={{ width: '48px', height: '48px', borderRadius: '16px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Navigation size={22} />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === 'map' ? (
          <motion.div 
            key="map-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ flex: 1, position: 'relative' }}
          >
            <MapView
              jobs={openJobs}
              onAccept={(id) => handleViewDetails(id)}
              mapInstanceRef={mapInstanceRef}
              searchRadius={searchRadius}
              userLocation={userLocation}
            />
            
            {/* Grab-style Bottom Sheet for Selected Job */}
            <AnimatePresence>
              {selectedJob && (
                <motion.div 
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="bottom-sheet"
                  style={{ paddingBottom: '30px' }}
                >
                  <div className="sheet-handle" />
                  <div className="flex-between" style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <div className="badge badge-emerald">BND {selectedJob.reward}</div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                        {selectedJob.distance || '1.2 km'} away
                      </span>
                    </div>
                    <button className="btn-ghost" onClick={() => setSelectedJob(null)}><X size={20} /></button>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '8px' }}>{selectedJob.title}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--bg-tertiary)', overflow: 'hidden' }}>
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedJob.poster_name}`} alt="poster" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{selectedJob.poster_name}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Star size={10} fill="var(--orange)" color="var(--orange)" /> 4.9 • 24 Jobs Posted
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                    <div className="card" style={{ padding: '12px', background: 'var(--bg-primary)' }}>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Time Estimate</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>2-3 Hours</div>
                    </div>
                    <div className="card" style={{ padding: '12px', background: 'var(--bg-primary)' }}>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Job Type</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{selectedJob.category}</div>
                    </div>
                  </div>

                  <button 
                    className="btn-primary" 
                    style={{ width: '100%', height: '56px', fontSize: '1.1rem' }}
                    onClick={() => handleViewDetails(selectedJob.id)}
                  >
                    View Full Details
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Nearby Jobs Carousel (only if no job selected) */}
            {!selectedJob && (
              <div style={{
                position: 'absolute',
                bottom: '24px',
                left: 0,
                right: 0,
                zIndex: 90,
                padding: '0 20px',
                display: 'flex',
                gap: '12px',
                overflowX: 'auto',
                paddingBottom: '12px'
              }} className="no-scrollbar">
                {nearbyJobs.map(job => (
                  <div 
                    key={job.id} 
                    className="card-glass"
                    onClick={() => handleJobSelect(job)}
                    style={{
                      minWidth: '260px',
                      padding: '16px',
                      cursor: 'pointer'
                    }}
                  >
                    <div className="flex-between" style={{ marginBottom: '10px' }}>
                      <span className="badge badge-emerald">BND {job.reward}</span>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>{job.distance || '1.2 km'}</div>
                    </div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '4px' }}>{job.title}</h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {job.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="list-view"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            style={{ padding: '100px 20px 24px', overflowY: 'auto', background: 'var(--bg-primary)', height: '100%' }}
          >
            <div style={{ marginBottom: '24px' }}>
              <h2 className="section-title">Nearby Quests</h2>
              <p className="section-subtitle">{openJobs.length} active tasks in your area</p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {openJobs.map(job => (
                <div 
                  key={job.id} 
                  className="card"
                  onClick={() => handleViewDetails(job.id)}
                  style={{ padding: '16px' }}
                >
                  <div className="flex-between" style={{ marginBottom: '8px' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <div className="badge badge-emerald" style={{ fontSize: '0.9rem', padding: '6px 12px' }}>BND {job.reward}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} /> {job.timestamp_human || 'New'}
                      </div>
                    </div>
                    <Shield size={18} className="text-emerald" />
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '8px' }}>{job.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.5' }}>
                    {job.description}
                  </p>
                  <div className="flex-between">
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${job.poster_name}`} alt="poster" />
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{job.poster_name || 'Verified Poster'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--emerald)' }}>
                      View <ChevronRight size={14} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HustlerHome;