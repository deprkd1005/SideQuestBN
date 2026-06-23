import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MapPin, DollarSign, Calendar, Users, HelpCircle, Check, ArrowRight, ArrowLeft } from 'lucide-react';

const ActivityCreator = ({ onCreate, onCancel }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    pricePerPerson: '35.00',
    district: 'Brunei-Muara',
    paxLimit: '8',
    lat: '4.8872',
    lng: '114.9426',
    radius: '150',
    tags: ['Heritage'],
    timeSlots: ['09:00', '14:00']
  });

  const handleNext = () => setStep(prev => prev + 1);
  const handlePrev = () => setStep(prev => prev - 1);

  const handleSubmit = () => {
    if (formData.title) {
      onCreate({
        ...formData,
        id: 'act_' + Math.random().toString(36).substring(2, 9),
        price_per_person: parseFloat(formData.pricePerPerson),
        capacity: parseInt(formData.paxLimit),
        title: formData.title,
        description: formData.description,
        district: formData.district,
        coordinates: [parseFloat(formData.lat), parseFloat(formData.lng)]
      });
    }
  };

  const handleTagToggle = (tag) => {
    if (formData.tags.includes(tag)) {
      setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
    } else {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
    }
  };

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.02)',
      borderRadius: '24px',
      border: '1px solid var(--border-glass)',
      padding: '24px',
      color: 'var(--text-primary)',
      fontFamily: 'Outfit'
    }}>
      {/* Wizard Header Progress */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>Create Listing</h3>
        
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: step === i ? 'var(--gold)' : step > i ? 'rgba(74, 222, 128, 0.2)' : 'rgba(255,255,255,0.05)',
                color: step === i ? 'black' : step > i ? '#4ade80' : 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.7rem',
                fontWeight: 800,
                border: step === i ? 'none' : '1px solid var(--border-glass)'
              }}>
                {step > i ? '✓' : i}
              </div>
              {i < 3 && <div style={{ width: '20px', height: '1px', background: step > i ? '#4ade80' : 'rgba(255,255,255,0.1)' }} />}
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--gold)', marginBottom: '16px', textTransform: 'uppercase' }}>
              Step 1: Listing Details
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Experience Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Traditional Weaver Workshop at Kampong Ayer"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '12px',
                    padding: '12px',
                    color: 'white',
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Cultural Description & Bio
                </label>
                <textarea
                  placeholder="Describe the heritage aspects, activities, and what visitors will learn..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '12px',
                    padding: '12px',
                    color: 'white',
                    fontSize: '0.85rem',
                    minHeight: '80px',
                    fontFamily: 'Outfit'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    Price per Person (BND)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <DollarSign size={14} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
                    <input
                      type="number"
                      value={formData.pricePerPerson}
                      onChange={(e) => setFormData(prev => ({ ...prev, pricePerPerson: e.target.value }))}
                      style={{
                        width: '100%',
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid var(--border-glass)',
                        borderRadius: '12px',
                        padding: '12px 12px 12px 28px',
                        color: 'white',
                        fontSize: '0.85rem'
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    District Location
                  </label>
                  <select
                    value={formData.district}
                    onChange={(e) => setFormData(prev => ({ ...prev, district: e.target.value }))}
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid var(--border-glass)',
                      borderRadius: '12px',
                      padding: '12px',
                      color: 'white',
                      fontSize: '0.85rem',
                      fontFamily: 'Outfit'
                    }}
                  >
                    <option value="Brunei-Muara" style={{ background: '#121214' }}>Brunei-Muara</option>
                    <option value="Tutong" style={{ background: '#121214' }}>Tutong</option>
                    <option value="Belait" style={{ background: '#121214' }}>Belait</option>
                    <option value="Temburong" style={{ background: '#121214' }}>Temburong</option>
                  </select>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={onCancel} className="btn-outline" style={{ border: '1px solid var(--border-glass)' }}>Cancel</button>
              <button 
                onClick={handleNext} 
                disabled={!formData.title || !formData.description}
                className="btn-primary" 
                style={{ 
                  flex: 1, 
                  background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)', 
                  color: 'black', 
                  fontWeight: 800,
                  opacity: (!formData.title || !formData.description) ? 0.5 : 1
                }}
              >
                Next Step <ArrowRight size={14} style={{ marginLeft: '4px', display: 'inline' }} />
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--gold)', marginBottom: '16px', textTransform: 'uppercase' }}>
              Step 2: Capacity & Scheduling
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Max Capacity per Slot (Pax)
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={formData.paxLimit}
                    onChange={(e) => setFormData(prev => ({ ...prev, paxLimit: e.target.value }))}
                    style={{ flex: 1, accentColor: 'var(--gold)' }}
                  />
                  <span style={{ fontSize: '1rem', fontWeight: 800, width: '40px', textAlign: 'right' }}>
                    {formData.paxLimit} pax
                  </span>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
                  Cultural Experience Tags
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {['Heritage', 'Artisan', 'Culinary', 'Eco-Tourism', 'Nature Trails'].map(t => {
                    const active = formData.tags.includes(t);
                    return (
                      <button
                        key={t}
                        onClick={() => handleTagToggle(t)}
                        style={{
                          background: active ? 'rgba(255, 215, 0, 0.12)' : 'rgba(255,255,255,0.01)',
                          border: `1px solid ${active ? 'var(--gold)' : 'var(--border-glass)'}`,
                          color: active ? 'var(--gold)' : 'var(--text-secondary)',
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Default Daily Time Slots
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                  {['09:00', '11:00', '14:00', '16:00', '18:00'].map(t => {
                    const active = formData.timeSlots.includes(t);
                    const toggleSlot = () => {
                      if (active) {
                        setFormData(prev => ({ ...prev, timeSlots: prev.timeSlots.filter(ts => ts !== t) }));
                      } else {
                        setFormData(prev => ({ ...prev, timeSlots: [...prev.timeSlots, t] }));
                      }
                    };
                    return (
                      <button
                        key={t}
                        onClick={toggleSlot}
                        style={{
                          background: active ? 'rgba(255, 215, 0, 0.12)' : 'rgba(255,255,255,0.01)',
                          border: `1px solid ${active ? 'var(--gold)' : 'var(--border-glass)'}`,
                          color: active ? 'var(--gold)' : 'var(--text-secondary)',
                          padding: '8px',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={handlePrev} className="btn-outline" style={{ border: '1px solid var(--border-glass)' }}>
                <ArrowLeft size={14} style={{ marginRight: '4px', display: 'inline' }} /> Back
              </button>
              <button 
                onClick={handleNext}
                disabled={formData.timeSlots.length === 0}
                className="btn-primary" 
                style={{ 
                  flex: 1, 
                  background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)', 
                  color: 'black', 
                  fontWeight: 800,
                  opacity: formData.timeSlots.length === 0 ? 0.5 : 1
                }}
              >
                Next Step <ArrowRight size={14} style={{ marginLeft: '4px', display: 'inline' }} />
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--gold)', marginBottom: '16px', textTransform: 'uppercase' }}>
              Step 3: Geofence Location Map Coordinates
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                Enter GPS coordinates and a geofencing validation radius. The tourist's ticket scan triggers location validation automatically using this perimeter.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    Latitude (WGS84)
                  </label>
                  <input
                    type="text"
                    value={formData.lat}
                    onChange={(e) => setFormData(prev => ({ ...prev, lat: e.target.value }))}
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid var(--border-glass)',
                      borderRadius: '12px',
                      padding: '12px',
                      color: 'white',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    Longitude (WGS84)
                  </label>
                  <input
                    type="text"
                    value={formData.lng}
                    onChange={(e) => setFormData(prev => ({ ...prev, lng: e.target.value }))}
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid var(--border-glass)',
                      borderRadius: '12px',
                      padding: '12px',
                      color: 'white',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Geofence Radius (Meters)
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input
                    type="range"
                    min="50"
                    max="1000"
                    step="50"
                    value={formData.radius}
                    onChange={(e) => setFormData(prev => ({ ...prev, radius: e.target.value }))}
                    style={{ flex: 1, accentColor: 'var(--gold)' }}
                  />
                  <span style={{ fontSize: '1rem', fontWeight: 800, width: '70px', textAlign: 'right' }}>
                    {formData.radius} m
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={handlePrev} className="btn-outline" style={{ border: '1px solid var(--border-glass)' }}>
                <ArrowLeft size={14} style={{ marginRight: '4px', display: 'inline' }} /> Back
              </button>
              <button 
                onClick={handleSubmit}
                className="btn-primary" 
                style={{ 
                  flex: 1, 
                  background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)', 
                  color: 'black', 
                  fontWeight: 800
                }}
              >
                Create Listing
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ActivityCreator;
