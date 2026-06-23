import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, Users, ChevronRight, Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const InteractiveScheduler = ({ pricePerPerson, onScheduleSelected, onCancel }) => {
  const { t } = useLanguage();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [paxCount, setPaxCount] = useState(1);

  // Generate next 5 days for quick dates
  const dates = Array.from({ length: 5 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return {
      iso: d.toISOString().split('T')[0],
      day: d.toLocaleDateString(undefined, { weekday: 'short' }),
      date: d.getDate(),
      month: d.toLocaleDateString(undefined, { month: 'short' })
    };
  });

  const times = [
    { value: '09:00', label: '09:00 AM (Morning Heritage)' },
    { value: '14:00', label: '02:00 PM (Afternoon Artisan)' },
    { value: '17:30', label: '05:30 PM (Sunset River Safari)' }
  ];

  const totalCost = pricePerPerson * paxCount;

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      onScheduleSelected({
        date: selectedDate,
        timeSlot: selectedTime,
        pax: paxCount,
        total: totalCost
      });
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
      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <CalendarIcon size={20} style={{ color: 'var(--emerald)' }} />
        Schedule & Select Pax
      </h3>

      {/* Date selector */}
      <div style={{ marginBottom: '20px' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
          Select Date
        </span>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {dates.map(d => (
            <button
              key={d.iso}
              onClick={() => setSelectedDate(d.iso)}
              style={{
                flexShrink: 0,
                width: '60px',
                height: '70px',
                borderRadius: '16px',
                border: selectedDate === d.iso ? '2px solid var(--emerald)' : '1px solid var(--border-glass)',
                background: selectedDate === d.iso ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.01)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <span style={{ fontSize: '0.65rem', color: selectedDate === d.iso ? 'var(--emerald)' : 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                {d.day}
              </span>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: selectedDate === d.iso ? 'var(--emerald)' : 'var(--text-primary)' }}>
                {d.date}
              </span>
              <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>
                {d.month}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Time Slots */}
      <div style={{ marginBottom: '20px' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
          Available Slots
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {times.map(t => (
            <button
              key={t.value}
              onClick={() => setSelectedTime(t.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '14px',
                border: selectedTime === t.value ? '2px solid var(--emerald)' : '1px solid var(--border-glass)',
                background: selectedTime === t.value ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.01)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Clock size={16} style={{ color: selectedTime === t.value ? 'var(--emerald)' : 'var(--text-muted)' }} />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: selectedTime === t.value ? 'var(--emerald)' : 'var(--text-primary)' }}>
                  {t.label}
                </span>
              </div>
              {selectedTime === t.value && <Check size={16} style={{ color: 'var(--emerald)' }} />}
            </button>
          ))}
        </div>
      </div>

      {/* Pax Count Selector */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
            Number of Travelers
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Max 10 per booking
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-glass)',
            borderRadius: '16px',
            padding: '4px'
          }}>
            <button
              onClick={() => setPaxCount(prev => Math.max(1, prev - 1))}
              disabled={paxCount <= 1}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '12px',
                border: 'none',
                background: 'rgba(255,255,255,0.05)',
                color: 'var(--text-primary)',
                fontWeight: 800,
                fontSize: '1.2rem',
                cursor: 'pointer'
              }}
            >
              -
            </button>
            <span style={{ width: '40px', textAlign: 'center', fontWeight: 800, fontSize: '1rem' }}>
              {paxCount}
            </span>
            <button
              onClick={() => setPaxCount(prev => Math.min(10, prev + 1))}
              disabled={paxCount >= 10}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '12px',
                border: 'none',
                background: 'rgba(255,255,255,0.05)',
                color: 'var(--text-primary)',
                fontWeight: 800,
                fontSize: '1.2rem',
                cursor: 'pointer'
              }}
            >
              +
            </button>
          </div>
          <div style={{ flex: 1, textAlign: 'right' }}>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>ESTIMATED TOTAL</span>
            <span style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--emerald)' }}>
              BND {totalCost.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={handleConfirm}
          disabled={!selectedDate || !selectedTime}
          className="btn-primary"
          style={{
            flex: 1,
            background: 'linear-gradient(135deg, var(--emerald) 0%, var(--emerald-dark) 100%)',
            color: 'white',
            fontWeight: 800,
            border: 'none',
            opacity: (!selectedDate || !selectedTime) ? 0.5 : 1,
            cursor: (!selectedDate || !selectedTime) ? 'not-allowed' : 'pointer'
          }}
        >
          Confirm Schedule & Pay
        </button>
        <button
          onClick={onCancel}
          className="btn-outline"
          style={{ border: '1px solid var(--border-glass)', cursor: 'pointer' }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default InteractiveScheduler;
