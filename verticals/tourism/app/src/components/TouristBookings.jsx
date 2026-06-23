import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Calendar, Clock, ChevronRight, Lock, ShieldCheck, ShieldAlert, Award, QrCode, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTourismPayment } from '../context/TourismPaymentContext';
import QRTicket from './tourist/QRTicket';

const TouristBookings = () => {
  const { dbState, fetchDb } = useTourismPayment();
  const navigate = useNavigate();
  const [selectedBookingForTicket, setSelectedBookingForTicket] = useState(null);

  useEffect(() => {
    fetchDb();
  }, []);

  const travelerBookings = dbState.bookings.filter(b => b.tourist_user_id === 'usr_traveler_001');

  // Periodically poll bookings if there's a ticket open to dynamically update released status!
  useEffect(() => {
    let interval;
    if (selectedBookingForTicket) {
      interval = setInterval(() => {
        fetchDb();
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [selectedBookingForTicket]);

  // Sync selected booking details with updated dbState
  const activeBookingDetail = selectedBookingForTicket 
    ? dbState.bookings.find(b => b.id === selectedBookingForTicket.id) 
    : null;

  const getStatusDetails = (status) => {
    switch (status?.toUpperCase()) {
      case 'FROZEN':
      case 'LOCKED':
        return {
          color: 'var(--gold)',
          bg: 'var(--gold-soft)',
          icon: Lock,
          label: 'Escrow Locked',
          description: 'Funds are locked securely in the Escrow Firewall. Host will scan ticket to authorize and claim funds.'
        };
      case 'DISPUTED':
        return {
          color: 'var(--red)',
          bg: 'rgba(239, 68, 68, 0.1)',
          icon: ShieldAlert,
          label: 'AML Blocked',
          description: 'TRANSACTION SUSPENDED: Flagged by Payout Whitelisting Firewall. Declared payout account name mismatch detected.'
        };
      case 'RELEASED':
      case 'VERIFIED':
        return {
          color: 'var(--emerald)',
          bg: 'var(--emerald-soft)',
          icon: ShieldCheck,
          label: 'Escrow Released',
          description: 'Funds successfully verified and released. Transaction archived.'
        };
      default:
        return {
          color: 'var(--text-muted)',
          bg: 'var(--bg-tertiary)',
          icon: Briefcase,
          label: 'Pending',
          description: 'Processing...'
        };
    }
  };

  return (
    <div className="app-content no-scrollbar" style={{ background: 'var(--bg-primary)', paddingBottom: '90px' }}>
      {/* Title */}
      <div style={{ padding: '40px 24px 20px' }}>
        <h1 className="section-title" style={{ padding: 0 }}>My Bookings</h1>
        <p className="section-subtitle" style={{ padding: 0, marginTop: '4px' }}>Tokenized Escrow Verification</p>
      </div>

      {/* List */}
      <div style={{ padding: '0 24px 24px' }}>
        {travelerBookings.length === 0 ? (
          <div className="card-glass" style={{ padding: '60px 24px', textAlign: 'center', background: 'white' }}>
            <Briefcase size={40} className="text-muted" style={{ marginBottom: '16px', opacity: 0.3 }} />
            <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>You haven't booked any activities yet.</p>
            <button onClick={() => navigate('/tourist')} className="btn-primary" style={{ marginTop: '20px', background: 'var(--emerald)' }}>Explore Activities</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {travelerBookings.map(booking => {
              const activity = dbState.activities.find(a => a.id === booking.activity_id) || {
                title: booking.activity_title || 'Heritage Experience',
                district: 'Brunei'
              };
              const status = getStatusDetails(booking.escrow_status);
              const StatusIcon = status.icon;

              return (
                <motion.div 
                  key={booking.id} 
                  whileTap={{ scale: 0.99 }}
                  className="card" 
                  style={{ background: 'white', borderLeft: `5px solid ${status.color}`, padding: '20px', cursor: 'pointer' }}
                  onClick={() => setSelectedBookingForTicket(booking)}
                >
                  <div className="flex-between" style={{ marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800 }}>ID: {booking.id}</span>
                    <span style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'Outfit' }}>BND {booking.gross_amount.toFixed(2)}</span>
                  </div>

                  <h4 style={{ fontSize: '1.05rem', fontWeight: 900, marginBottom: '6px', fontFamily: 'Outfit', color: 'var(--text-primary)' }}>
                    {activity.title}
                  </h4>
                  
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '16px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                      <Calendar size={13} color="var(--emerald)" />
                      <span>{booking.booking_date}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                      <Clock size={13} color="var(--emerald)" />
                      <span>{booking.booking_time_slot}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                      <Award size={13} color="var(--emerald)" />
                      <span>{booking.participant_count} Guests</span>
                    </div>
                  </div>

                  {/* Firewall Status Box */}
                  <div style={{ 
                    background: status.bg, 
                    border: `1px solid ${status.color}33`, 
                    borderRadius: '16px', 
                    padding: '12px 14px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '6px',
                    marginBottom: '12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, color: status.color, fontSize: '0.8rem', textTransform: 'uppercase' }}>
                      <StatusIcon size={16} />
                      {status.label}
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4, fontWeight: 500 }}>
                      {status.description}
                    </p>
                  </div>

                  {/* Ticket trigger button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedBookingForTicket(booking);
                    }}
                    className="btn-outline"
                    style={{
                      width: '100%',
                      borderColor: 'var(--emerald)',
                      color: 'var(--emerald)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      fontWeight: 800,
                      fontSize: '0.75rem',
                      height: '42px',
                      borderRadius: '12px'
                    }}
                  >
                    <QrCode size={16} />
                    View QR Ticket Pass
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* QR Ticket Modal */}
      <AnimatePresence>
        {selectedBookingForTicket && activeBookingDetail && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            zIndex: 1005,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ width: '100%', position: 'relative' }}>
              <button 
                onClick={() => setSelectedBookingForTicket(null)} 
                style={{
                  position: 'absolute',
                  top: '-45px',
                  right: '10px',
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  color: 'white',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={20} />
              </button>
              <QRTicket 
                booking={{
                  ...activeBookingDetail,
                  activity_title: (dbState.activities.find(a => a.id === activeBookingDetail.activity_id))?.title || activeBookingDetail.activity_title
                }} 
              />
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TouristBookings;
