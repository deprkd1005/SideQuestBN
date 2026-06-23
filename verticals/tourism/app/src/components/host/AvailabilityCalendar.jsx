import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Users, ShieldAlert, CheckCircle, Ban } from 'lucide-react';

const AvailabilityCalendar = () => {
  const [blockedDates, setBlockedDates] = useState(['2026-06-25', '2026-06-28']);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Generate simulated slots for next 7 days
  const getSlotsForNext7Days = () => {
    const slots = [];
    const dateNames = ['Today', 'Tomorrow', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const isoString = d.toISOString().split('T')[0];
      const isBlocked = blockedDates.includes(isoString);
      
      slots.push({
        date: isoString,
        label: dateNames[i] || d.toLocaleDateString(undefined, { weekday: 'short' }),
        dayNum: d.getDate(),
        month: d.toLocaleDateString(undefined, { month: 'short' }),
        isBlocked,
        events: isBlocked ? [] : [
          { time: '09:00 AM', status: 'Booked', pax: 6, max: 8, title: 'Heritage Tour' },
          { time: '02:00 PM', status: 'Open', pax: 0, max: 8, title: 'Artisan Workshop' },
          { time: '05:30 PM', status: 'Partially Booked', pax: 3, max: 8, title: 'Sunset River Safari' }
        ]
      });
    }
    return slots;
  };

  const days = getSlotsForNext7Days();

  const handleToggleBlockDate = (date) => {
    if (blockedDates.includes(date)) {
      setBlockedDates(prev => prev.filter(d => d !== date));
    } else {
      setBlockedDates(prev => [...prev, date]);
    }
  };

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.02)',
      borderRadius: '24px',
      border: '1px solid var(--border-glass)',
      padding: '20px',
      color: 'var(--text-primary)',
      fontFamily: 'Outfit'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
          <CalendarIcon size={20} style={{ color: 'var(--gold)' }} />
          Capacity & Booking Slots
        </h3>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>7-Day Active Horizon</span>
      </div>

      {/* Grid of Days */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', marginBottom: '20px' }}>
        {days.map(day => (
          <button
            key={day.date}
            onClick={() => setSelectedSlot(day)}
            style={{
              padding: '10px 4px',
              borderRadius: '14px',
              background: day.isBlocked ? 'rgba(239, 68, 68, 0.05)' : selectedSlot?.date === day.date ? 'rgba(255, 215, 0, 0.1)' : 'rgba(255,255,255,0.01)',
              border: day.isBlocked ? '1px solid rgba(239, 68, 68, 0.3)' : selectedSlot?.date === day.date ? '1.5px solid var(--gold)' : '1px solid var(--border-glass)',
              color: day.isBlocked ? '#f87171' : 'white',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <span style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              {day.label}
            </span>
            <span style={{ fontSize: '1.15rem', fontWeight: 800, margin: '2px 0' }}>
              {day.dayNum}
            </span>
            <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>
              {day.month}
            </span>
            
            {/* Visual occupancy indicators */}
            {!day.isBlocked && (
              <div style={{ display: 'flex', gap: '2px', marginTop: '6px' }}>
                <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#4ade80' }} />
                <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#eab308' }} />
              </div>
            )}
            {day.isBlocked && (
              <Ban size={8} style={{ color: '#ef4444', marginTop: '6px' }} />
            )}
          </button>
        ))}
      </div>

      {/* Selected Day Slots Info */}
      {selectedSlot ? (
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid var(--border-glass)',
          borderRadius: '16px',
          padding: '16px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>SCHEDULE FOR</span>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, margin: '2px 0 0 0' }}>
                {selectedSlot.month} {selectedSlot.dayNum} ({selectedSlot.date})
              </h4>
            </div>
            
            <button
              onClick={() => handleToggleBlockDate(selectedSlot.date)}
              style={{
                background: selectedSlot.isBlocked ? 'rgba(74, 222, 128, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                border: 'none',
                color: selectedSlot.isBlocked ? '#4ade80' : '#f87171',
                padding: '6px 12px',
                borderRadius: '12px',
                fontSize: '0.7rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {selectedSlot.isBlocked ? 'Unblock Date' : 'Block All Slots'}
            </button>
          </div>

          {selectedSlot.isBlocked ? (
            <div style={{ textAlign: 'center', padding: '16px', color: '#ef4444', background: 'rgba(239, 68, 68, 0.02)', border: '1px dashed rgba(239,68,68,0.2)', borderRadius: '12px' }}>
              <ShieldAlert size={28} style={{ margin: '0 auto 8px' }} />
              <p style={{ fontSize: '0.8rem', fontWeight: 700, margin: 0 }}>This date is currently blocked</p>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>Tourists cannot book slots on this date.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {selectedSlot.events.map((evt, idx) => {
                const occupancyRate = evt.pax > 0 ? (evt.pax / evt.max) * 100 : 0;
                return (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(255,255,255,0.01)',
                      border: '1px solid var(--border-glass)',
                      borderRadius: '12px',
                      padding: '10px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <Clock size={16} style={{ color: 'var(--gold)' }} />
                      <div>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block' }}>{evt.time}</span>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{evt.title}</span>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{
                        fontSize: '0.6rem',
                        fontWeight: 800,
                        padding: '2px 6px',
                        borderRadius: '10px',
                        background: evt.status === 'Booked' ? 'rgba(74, 222, 128, 0.1)' : evt.status === 'Partially Booked' ? 'rgba(234, 179, 8, 0.1)' : 'rgba(255,255,255,0.05)',
                        color: evt.status === 'Booked' ? '#4ade80' : evt.status === 'Partially Booked' ? '#facc15' : 'var(--text-secondary)'
                      }}>
                        {evt.status}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        <Users size={10} />
                        {evt.pax}/{evt.max} slots filled
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '32px 0', border: '1px dashed var(--border-glass)', borderRadius: '16px', color: 'var(--text-muted)' }}>
          <CalendarIcon size={24} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
          <p style={{ fontSize: '0.75rem', margin: 0 }}>Select a date to manage hourly capacities and blocked slots.</p>
        </div>
      )}
    </div>
  );
};

export default AvailabilityCalendar;
