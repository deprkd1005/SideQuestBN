import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Award, Lock, MapPin, Calendar, Shield, ChevronRight, BookOpen, Globe, Camera, QrCode } from 'lucide-react';
import { useTourismPayment } from '../../context/TourismPaymentContext';
import { useLanguage } from '../../context/LanguageContext';

const CULTURAL_ICONS = {
    CULTURE: '🏛️',
    FOOD: '🍲',
    ADVENTURE: '🚣',
    NATURE: '🌴'
};

const CULTURAL_BADGES = {
    'hp_001': { name: 'Kampong Ayer Guardian', icon: '🚤', color: '#10b981' },
    'hp_002': { name: 'Weaving Heritage Keeper', icon: '🧵', color: '#8b5cf6' },
    'hp_003': { name: 'Culinary Artisan', icon: '👩‍🍳', color: '#f59e0b' },
    'hp_004': { name: 'Jungle Explorer', icon: '🌿', color: '#3b82f6' },
    'hp_005': { name: 'Nature Steward', icon: '🦜', color: '#06b6d4' },
    'hp_006': { name: 'River Adventurer', icon: '🛶', color: '#ec4899' }
};

const getBadgeForBooking = (booking, activities) => {
    const activity = activities.find(a => a.id === booking.activity_id);
    if (!activity) return { name: 'Heritage Explorer', icon: '🌏', color: '#d4af37' };
    return CULTURAL_BADGES[activity.host_profile_id] || { name: 'Heritage Explorer', icon: '🌏', color: '#d4af37' };
};

const STRIPE_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

const TouristPassport = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const { dbState, fetchDb } = useTourismPayment();
    const [currentPage, setCurrentPage] = useState(0);
    const [showCover, setShowCover] = useState(true);
    const [flippedPages, setFlippedPages] = useState(new Set());

    useEffect(() => {
        fetchDb();
    }, []);

    const travelerBookings = dbState.bookings.filter(b => b.tourist_user_id === 'usr_traveler_001');

    const verifiedBookings = travelerBookings.filter(b =>
        b.escrow_status === 'RELEASED' || b.escrow_status === 'VERIFIED' || b.escrow_status === 'released'
    );

    const pendingBookings = travelerBookings.filter(b =>
        b.escrow_status === 'FROZEN' || b.escrow_status === 'LOCKED' || b.escrow_status === 'DISPUTED'
    );

    const allStampedBookings = [...verifiedBookings, ...pendingBookings];

    const handleFlipPage = (index) => {
        setFlippedPages(prev => new Set([...prev, index]));
        setCurrentPage(index + 1);
        setShowCover(false);
    };

    const getRandomRotation = () => {
        const rotations = [-8, -5, -3, 0, 3, 5, 8];
        return rotations[Math.floor(Math.random() * rotations.length)];
    };

    const getRandomColor = () => {
        return STRIPE_COLORS[Math.floor(Math.random() * STRIPE_COLORS.length)];
    };

    // Generate stamps for verified bookings
    const stamps = useMemo(() => {
        return verifiedBookings.map((booking, i) => {
            const activity = dbState.activities.find(a => a.id === booking.activity_id);
            const badge = getBadgeForBooking(booking, dbState.activities);
            return {
                id: booking.id,
                type: 'verified',
                destination: activity?.exact_location || 'Brunei',
                visitDate: booking.booking_date,
                category: activity?.category || 'CULTURE',
                icon: CULTURAL_ICONS[activity?.category] || '🌏',
                badge,
                rotation: getRandomRotation(),
                color: getRandomColor()
            };
        });
    }, [verifiedBookings, dbState.activities]);

    const pendingStamps = useMemo(() => {
        return pendingBookings.map((booking) => {
            const activity = dbState.activities.find(a => a.id === booking.activity_id);
            return {
                id: booking.id,
                type: 'pending',
                destination: activity?.exact_location || 'Brunei',
                visitDate: booking.booking_date,
                category: activity?.category || 'CULTURE'
            };
        });
    }, [pendingBookings, dbState.activities]);

    const authUser = JSON.parse(localStorage.getItem('tourism_auth_user') || '{}');

    return (
        <div className="app-content no-scrollbar" style={{ background: 'var(--bg-primary)', paddingBottom: '90px' }}>
            {/* Header */}
            <div style={{
                padding: '40px 24px 20px',
                background: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ position: 'absolute', top: '-50%', right: '-30%', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
                <div style={{ position: 'absolute', bottom: '-40%', left: '-20%', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
                    <div>
                        <h1 className="section-title" style={{ padding: 0, color: 'white', fontSize: '1.5rem' }}>{t('digitalPassport')}</h1>
                        <p className="section-subtitle" style={{ padding: 0, marginTop: '4px', color: 'rgba(255,255,255,0.7)' }}>
                            {verifiedBookings.length} cultures discovered
                        </p>
                    </div>
                    <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.2)' }}>
                        <BookOpen size={22} color="white" />
                    </div>
                </div>

                {/* Stats row */}
                <div style={{ display: 'flex', gap: '16px', marginTop: '20px', position: 'relative' }}>
                    <div style={{ flex: 1, background: 'rgba(255,255,255,0.1)', borderRadius: '16px', padding: '12px', textAlign: 'center', backdropFilter: 'blur(10px)' }}>
                        <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'white' }}>{verifiedBookings.length}</div>
                        <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.7)', fontWeight: 700, textTransform: 'uppercase', marginTop: '2px' }}>Stamps</div>
                    </div>
                    <div style={{ flex: 1, background: 'rgba(255,255,255,0.1)', borderRadius: '16px', padding: '12px', textAlign: 'center', backdropFilter: 'blur(10px)' }}>
                        <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'white' }}>{pendingBookings.length}</div>
                        <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.7)', fontWeight: 700, textTransform: 'uppercase', marginTop: '2px' }}>Pending</div>
                    </div>
                    <div style={{ flex: 1, background: 'rgba(255,255,255,0.1)', borderRadius: '16px', padding: '12px', textAlign: 'center', backdropFilter: 'blur(10px)' }}>
                        <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'white' }}>{travelerBookings.length}</div>
                        <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.7)', fontWeight: 700, textTransform: 'uppercase', marginTop: '2px' }}>Total</div>
                    </div>
                </div>
            </div>

            <div style={{ padding: '24px' }}>
                {allStampedBookings.length === 0 ? (
                    /* Empty state */
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ textAlign: 'center', padding: '60px 24px' }}
                    >
                        <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--emerald-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                            <BookOpen size={48} color="var(--emerald)" />
                        </div>
                        <h2 style={{ fontSize: '1.3rem', fontWeight: 900, marginBottom: '8px', fontFamily: 'Outfit' }}>Start your journey!</h2>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '24px' }}>
                            Book your first activity to earn your first passport stamp. Each experience unlocks a unique cultural badge.
                        </p>
                        <button
                            onClick={() => navigate('/tourist')}
                            className="btn-primary"
                            style={{ background: 'linear-gradient(135deg, var(--emerald), var(--emerald-dark))', padding: '16px 32px' }}
                        >
                            <Globe size={18} /> Explore Activities
                        </button>
                    </motion.div>
                ) : (
                    /* Passport Pages */
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                        {/* Passport Cover */}
                        {showCover && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, y: -50 }}
                                style={{
                                    background: 'linear-gradient(145deg, #0c4a6e 0%, #075985 50%, #0369a1 100%)',
                                    borderRadius: '24px',
                                    padding: '32px 24px',
                                    color: 'white',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    boxShadow: '0 20px 60px rgba(3, 105, 161, 0.3)',
                                    border: '2px solid rgba(255,255,255,0.1)'
                                }}
                            >
                                <div style={{ position: 'absolute', top: 0, right: 0, width: '120px', height: '120px', background: 'rgba(255,215,0,0.1)', borderRadius: '50%', transform: 'translate(30%, -30%)' }} />
                                <div style={{ position: 'absolute', bottom: 0, left: 0, width: '80px', height: '80px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', transform: 'translate(-20%, 20%)' }} />

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', position: 'relative' }}>
                                    <Shield size={32} color="rgba(255,215,0,0.8)" />
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 700 }}>Brunei</div>
                                        <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 700 }}>Darussalam</div>
                                    </div>
                                </div>

                                <div style={{ position: 'relative' }}>
                                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                                        <div style={{
                                            width: '60px', height: '60px',
                                            background: 'linear-gradient(135deg, #d4af37 0%, #fbbf24 100%)',
                                            borderRadius: '50%',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            boxShadow: '0 8px 24px rgba(212, 175, 55, 0.4)'
                                        }}>
                                            <Award size={30} color="#0c4a6e" />
                                        </div>
                                    </div>
                                    <h2 style={{ textAlign: 'center', fontSize: '1.4rem', fontWeight: 900, letterSpacing: '1px', marginBottom: '4px', fontFamily: 'Outfit' }}>
                                        Digital Passport
                                    </h2>
                                    <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '24px' }}>
                                        Tourism Heritage Edition
                                    </p>

                                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '16px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                            <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>Traveler</span>
                                            <span style={{ fontSize: '0.9rem', fontWeight: 800 }}>{authUser.name || 'Sarah Smith'}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>Passport No.</span>
                                            <span style={{ fontSize: '0.9rem', fontWeight: 800, fontFamily: 'monospace', letterSpacing: '2px' }}>
                                                {authUser.passport?.passportNo || 'PA8829451'}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => { setShowCover(false); }}
                                        style={{
                                            width: '100%', marginTop: '20px', padding: '12px',
                                            background: 'rgba(255,255,255,0.15)',
                                            border: '1px solid rgba(255,255,255,0.2)',
                                            borderRadius: '14px', color: 'white',
                                            fontWeight: 800, fontSize: '0.85rem',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                            cursor: 'pointer', fontFamily: 'Outfit',
                                            backdropFilter: 'blur(10px)'
                                        }}
                                    >
                                        <BookOpen size={16} /> Open Passport
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Hidden cover when opened */}
                        {!showCover && (
                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                onClick={() => setShowCover(true)}
                                style={{
                                    padding: '10px', borderRadius: '14px', border: '1px dashed var(--border-color)',
                                    background: 'var(--bg-secondary)', cursor: 'pointer', color: 'var(--text-muted)',
                                    fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                                }}
                            >
                                <Shield size={14} /> Show Passport Cover
                            </motion.button>
                        )}

                        {/* Verified Stamps */}
                        {stamps.map((stamp, index) => (
                            <motion.div
                                key={stamp.id}
                                initial={{ opacity: 0, x: -30, rotate: -5 }}
                                animate={{ opacity: 1, x: 0, rotate: stamp.rotation }}
                                transition={{ delay: index * 0.1, type: 'spring', damping: 20 }}
                                style={{
                                    background: 'linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary))',
                                    borderRadius: '20px',
                                    border: `2px solid ${stamp.color}33`,
                                    padding: '20px',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    boxShadow: `0 8px 24px ${stamp.color}15`
                                }}
                            >
                                {/* Decorative stamp corner */}
                                <div style={{
                                    position: 'absolute', top: '-20px', right: '-20px',
                                    width: '80px', height: '80px',
                                    background: `${stamp.color}10`,
                                    borderRadius: '50%',
                                    transform: 'rotate(15deg)'
                                }} />

                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', position: 'relative' }}>
                                    {/* Stamp circle */}
                                    <div style={{
                                        width: '64px', height: '64px', borderRadius: '50%',
                                        background: `linear-gradient(135deg, ${stamp.color}22, ${stamp.color}44)`,
                                        border: `3px solid ${stamp.color}`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        flexShrink: 0,
                                        boxShadow: `0 4px 12px ${stamp.color}30`,
                                        transform: `rotate(${stamp.rotation}deg)`
                                    }}>
                                        <span style={{ fontSize: '28px' }}>{stamp.icon}</span>
                                    </div>

                                    <div style={{ flex: 1 }}>
                                        <div style={{
                                            display: 'inline-block',
                                            padding: '4px 10px',
                                            borderRadius: '8px',
                                            background: `${stamp.color}15`,
                                            color: stamp.color,
                                            fontSize: '0.6rem', fontWeight: 800,
                                            textTransform: 'uppercase', letterSpacing: '0.5px',
                                            marginBottom: '8px',
                                            border: `1px solid ${stamp.color}30`
                                        }}>
                                            Verified Visit ✓
                                        </div>
                                        <h3 style={{ fontSize: '1rem', fontWeight: 900, marginBottom: '4px', fontFamily: 'Outfit' }}>
                                            {stamp.destination}
                                        </h3>
                                        <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '8px' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Calendar size={12} color={stamp.color} />
                                                {stamp.visitDate}
                                            </span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <MapPin size={12} color={stamp.color} />
                                                {stamp.category}
                                            </span>
                                        </div>

                                        {/* Badge */}
                                        <div style={{
                                            background: `${stamp.badge.color}10`,
                                            borderRadius: '12px',
                                            border: `1px solid ${stamp.badge.color}30`,
                                            padding: '8px 12px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px'
                                        }}>
                                            <span style={{ fontSize: '20px' }}>{stamp.badge.icon}</span>
                                            <div>
                                                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: stamp.badge.color }}>
                                                    {stamp.badge.name}
                                                </div>
                                                <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                                                    Cultural badge unlocked
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        {/* Pending Stamps */}
                        {pendingStamps.map((stamp, index) => (
                            <motion.div
                                key={stamp.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                style={{
                                    background: 'var(--bg-secondary)',
                                    borderRadius: '20px',
                                    border: '1px dashed var(--border-color)',
                                    padding: '20px',
                                    position: 'relative',
                                    opacity: 0.7
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                    {/* Greyed-out stamp */}
                                    <div style={{
                                        width: '64px', height: '64px', borderRadius: '50%',
                                        background: 'var(--bg-tertiary)',
                                        border: '3px dashed var(--border-color)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        <Lock size={22} color="var(--text-muted)" />
                                    </div>

                                    <div style={{ flex: 1 }}>
                                        <div style={{
                                            display: 'inline-block',
                                            padding: '4px 10px',
                                            borderRadius: '8px',
                                            background: 'var(--bg-tertiary)',
                                            color: 'var(--text-muted)',
                                            fontSize: '0.6rem', fontWeight: 800,
                                            textTransform: 'uppercase', letterSpacing: '0.5px',
                                            marginBottom: '8px'
                                        }}>
                                            Pending Verification
                                        </div>
                                        <h3 style={{ fontSize: '1rem', fontWeight: 900, marginBottom: '4px', fontFamily: 'Outfit', color: 'var(--text-muted)' }}>
                                            {stamp.destination}
                                        </h3>
                                        <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Calendar size={12} />
                                                {stamp.visitDate}
                                            </span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                {stamp.category}
                                            </span>
                                        </div>
                                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '8px', fontStyle: 'italic' }}>
                                            Complete your visit and scan your QR ticket at the location to unlock this stamp.
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TouristPassport;