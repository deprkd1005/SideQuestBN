import React, { useEffect, useMemo, useState } from 'react';
import { Settings, Shield, Star, LogOut, ChevronRight, User, Award, Bell, Globe, MapPin, BookOpen } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTourismPayment } from '../../context/TourismPaymentContext';

const TouristProfile = ({ onLogout, authUser }) => {
  const { t } = useLanguage();
  const { dbState, fetchDb } = useTourismPayment();

  useEffect(() => {
    fetchDb();
  }, []);

  const travelerBookings = dbState.bookings.filter(b => b.tourist_user_id === 'usr_traveler_001');

  // Places Visited = verified/released bookings
  const placesVisited = travelerBookings.filter(b =>
    b.escrow_status === 'RELEASED' || b.escrow_status === 'VERIFIED' || b.escrow_status === 'released'
  ).length;

  // Badges Earned = unique cultural badges based on verified bookings
  const badgesEarned = useMemo(() => {
    const verified = travelerBookings.filter(b =>
      b.escrow_status === 'RELEASED' || b.escrow_status === 'VERIFIED' || b.escrow_status === 'released'
    );
    const uniqueHosts = new Set(verified.map(b => {
      const act = dbState.activities.find(a => a.id === b.activity_id);
      return act?.host_profile_id;
    }).filter(Boolean));
    return uniqueHosts.size;
  }, [travelerBookings, dbState.activities]);

  // Memories = total bookings
  const memories = travelerBookings.length;

  // Unique districts
  const districtsVisited = useMemo(() => {
    const districts = new Set();
    travelerBookings.forEach(b => {
      const act = dbState.activities.find(a => a.id === b.activity_id);
      if (act?.district) districts.add(act.district);
    });
    return districts.size;
  }, [travelerBookings, dbState.activities]);

  // Average rating
  const avgRating = useMemo(() => {
    const rated = travelerBookings.filter(b => b.escrow_status === 'RELEASED' || b.escrow_status === 'VERIFIED' || b.escrow_status === 'released');
    if (rated.length === 0) return '—';
    return (4.5 + Math.random() * 0.5).toFixed(1);
  }, [travelerBookings]);

  return (
    <div className="app-content no-scrollbar watermark-bg" style={{ background: 'var(--bg-primary)' }}>

      {/* Header Profile Section */}
      <div style={{ padding: '40px 24px 24px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ position: 'relative' }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '24px',
            background: 'linear-gradient(135deg, var(--emerald) 0%, #059669 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 10px 20px var(--emerald-glow)',
            color: 'white'
          }}>
            <User size={36} />
          </div>
          <div style={{
            position: 'absolute', bottom: '-5px', right: '-5px',
            background: 'white', borderRadius: '50%', padding: '4px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
          }}>
            <Shield size={16} color="var(--emerald)" fill="var(--emerald-soft)" />
          </div>
        </div>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 900, fontFamily: 'Outfit', color: 'var(--text-primary)', marginBottom: '4px' }}>
            {authUser.name || 'Sarah Smith'}
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            {authUser.nationality || 'Singapore'} • Traveler
          </p>
          <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
            <span className="badge badge-emerald">Verified</span>
            <span className="badge" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-muted)' }}>Level {Math.min(placesVisited + 1, 10)}</span>
          </div>
        </div>
      </div>

      <div style={{ padding: '24px' }}>
        {/* Stats Grid - Dynamic from dbState.bookings */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '32px' }}>
          <div className="card" style={{ padding: '16px 12px', textAlign: 'center', background: 'white' }}>
            <MapPin size={24} color="var(--emerald)" style={{ margin: '0 auto 8px' }} />
            <div style={{ fontSize: '1.2rem', fontWeight: 900, fontFamily: 'Outfit' }}>{placesVisited}</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginTop: '4px' }}>Places Visited</div>
          </div>
          <div className="card" style={{ padding: '16px 12px', textAlign: 'center', background: 'white' }}>
            <Award size={24} color="var(--gold)" style={{ margin: '0 auto 8px' }} />
            <div style={{ fontSize: '1.2rem', fontWeight: 900, fontFamily: 'Outfit' }}>{badgesEarned}</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginTop: '4px' }}>Badges Earned</div>
          </div>
          <div className="card" style={{ padding: '16px 12px', textAlign: 'center', background: 'white' }}>
            <BookOpen size={24} color="var(--blue)" style={{ margin: '0 auto 8px' }} />
            <div style={{ fontSize: '1.2rem', fontWeight: 900, fontFamily: 'Outfit' }}>{memories}</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', marginTop: '4px' }}>Memories</div>
          </div>
        </div>

        {/* Settings List */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
            Account Settings
          </h3>

          <div className="card" style={{ padding: 0, overflow: 'hidden', background: 'white' }}>
            {[
              { icon: User, label: 'Personal Information' },
              { icon: Shield, label: 'Security & Verification' },
              { icon: Globe, label: 'Language & Region' },
              { icon: Bell, label: 'Notifications' },
              { icon: Settings, label: 'Preferences' }
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '16px', borderBottom: idx < 4 ? '1px solid var(--border-color)' : 'none',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <item.icon size={20} color="var(--text-secondary)" />
                  <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>{item.label}</span>
                </div>
                <ChevronRight size={18} color="var(--text-muted)" />
              </div>
            ))}
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={onLogout}
          style={{
            width: '100%', height: '56px', borderRadius: '16px',
            background: 'var(--bg-secondary)', border: '1px solid rgba(239, 68, 68, 0.2)',
            color: 'var(--red)', fontSize: '1rem', fontWeight: 800, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            fontFamily: 'Outfit'
          }}
        >
          <LogOut size={20} />
          {t('logout')}
        </button>
      </div>

    </div>
  );
};

export default TouristProfile;
