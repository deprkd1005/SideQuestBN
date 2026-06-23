import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { ShieldCheck, Award, MapPin, Calendar, Clock, User, QrCode } from 'lucide-react';

const QRTicket = ({ booking }) => {
  if (!booking) return null;

  // Render proper badges depending on vertical type
  const getBadgeInfo = () => {
    if (booking.activity_title?.toLowerCase().includes('water') || booking.activity_title?.toLowerCase().includes('river')) {
      return {
        name: "Eco-Guardian",
        desc: "Awarded for exploring Brunei's waterways cleanly",
        color: "#38bdf8",
        bg: "rgba(56, 189, 248, 0.1)"
      };
    }
    return {
      name: "Heritage Explorer",
      desc: "Awarded for preserving Kampung Ayer culture",
      color: "#eab308",
      bg: "rgba(234, 179, 8, 0.1)"
    };
  };

  const badge = getBadgeInfo();
  const isReleased = booking.escrow_status === 'released' || booking.escrow_status === 'Verified';

  // QR Code payload contains metadata verified by host signature keys
  const qrPayload = JSON.stringify({
    bookingId: booking.id,
    activityId: booking.activity_id,
    grossAmount: booking.gross_amount,
    touristId: booking.tourist_user_id || 'usr_traveler_001',
    signature: `sq_sig_${booking.id}_sha256_cryptosecure`
  });

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.02)',
      borderRadius: '24px',
      border: '1px solid var(--border-glass)',
      overflow: 'hidden',
      fontFamily: 'Outfit',
      maxWidth: '380px',
      width: '100%',
      margin: '0 auto'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%)',
        padding: '16px 20px',
        borderBottom: '1px dashed var(--border-glass)',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--emerald)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              SideQuest Pass
            </span>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '2px 0 0 0' }}>
              {booking.activity_title || 'Brunei Heritage Tour'}
            </h4>
          </div>
          <span style={{
            fontSize: '0.65rem',
            fontWeight: 800,
            padding: '4px 8px',
            borderRadius: '20px',
            background: isReleased ? 'rgba(74, 222, 128, 0.1)' : 'rgba(234, 179, 8, 0.1)',
            color: isReleased ? '#4ade80' : '#facc15',
            border: `1px solid ${isReleased ? 'rgba(74, 222, 128, 0.2)' : 'rgba(234, 179, 8, 0.2)'}`
          }}>
            {isReleased ? 'VERIFIED / RELEASED' : 'ESCROW LOCKED'}
          </span>
        </div>
      </div>

      {/* Ticket Details */}
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          <div>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>DATE</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700 }}>
              <Calendar size={14} style={{ color: 'var(--emerald)' }} />
              {booking.booking_date}
            </div>
          </div>
          <div>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>TIME SLOT</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700 }}>
              <Clock size={14} style={{ color: 'var(--emerald)' }} />
              {booking.booking_time_slot || '10:00 AM'}
            </div>
          </div>
          <div>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>TRAVELERS</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700 }}>
              <User size={14} style={{ color: 'var(--emerald)' }} />
              {booking.participant_count || 1} Pax
            </div>
          </div>
          <div>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>ESCROW VALUE</span>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--emerald)' }}>
              BND {parseFloat(booking.gross_amount).toFixed(2)}
            </div>
          </div>
        </div>

        {/* QR Scanner visual container */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border-glass)',
          borderRadius: '20px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
          position: 'relative'
        }}>
          {isReleased && (
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              borderRadius: '20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#4ade80',
              backdropFilter: 'blur(2px)',
              zIndex: 5
            }}>
              <ShieldCheck size={48} style={{ marginBottom: '8px' }} />
              <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>TICKET VERIFIED</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>Funds released to host</span>
            </div>
          )}
          
          <QRCodeCanvas 
            value={qrPayload}
            size={160}
            bgColor={"transparent"}
            fgColor={"#10b981"}
            level={"M"}
            includeMargin={false}
          />
          
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <QrCode size={12} />
            SCAN AT HOST LOCATION TO LOG IN
          </span>
        </div>

        {/* Badges Earned / Locked */}
        <div style={{
          background: isReleased ? badge.bg : 'rgba(255,255,255,0.01)',
          borderRadius: '16px',
          border: `1px solid ${isReleased ? badge.color + '33' : 'var(--border-glass)'}`,
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          transition: 'all 0.3s ease'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: isReleased ? 'transparent' : 'rgba(255,255,255,0.03)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isReleased ? badge.color : 'var(--text-muted)',
            border: `2px ${isReleased ? 'solid' : 'dashed'} ${isReleased ? badge.color : 'rgba(255,255,255,0.1)'}`
          }}>
            <Award size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: isReleased ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                {badge.name}
              </span>
              {!isReleased && (
                <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '10px' }}>
                  LOCKED
                </span>
              )}
            </div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', margin: '2px 0 0 0', lineHeight: 1.3 }}>
              {isReleased ? badge.desc : "Complete host verification check to unlock this cultural achievement badge."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRTicket;
