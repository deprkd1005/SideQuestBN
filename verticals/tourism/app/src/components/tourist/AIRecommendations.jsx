import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Star, MapPin, ChevronRight } from 'lucide-react';
import { useTourismPayment } from '../../context/TourismPaymentContext';
import { useLanguage } from '../../context/LanguageContext';

const getCategoryIcon = (category) => {
    switch (category?.toUpperCase()) {
        case 'CULTURE': return { emoji: '🏛️', color: '#10b981', label: 'Culture' };
        case 'ADVENTURE': return { emoji: '🚣', color: '#3b82f6', label: 'Adventure' };
        case 'FOOD': return { emoji: '🍲', color: '#f59e0b', label: 'Food' };
        case 'NATURE': return { emoji: '🌴', color: '#8b5cf6', label: 'Nature' };
        default: return { emoji: '🌏', color: '#64748b', label: 'Activity' };
    }
};

const AIRecommendations = ({ userCoords, onActivitySelect }) => {
    const { dbState } = useTourismPayment();
    const { t } = useLanguage();

    const recommendations = useMemo(() => {
        const activities = dbState.activities;
        const bookings = dbState.bookings.filter(b => b.tourist_user_id === 'usr_traveler_001');
        const bookedActivityIds = new Set(bookings.map(b => b.activity_id));
        const completedActivityIds = new Set(
            bookings
                .filter(b => b.escrow_status === 'RELEASED' || b.escrow_status === 'VERIFIED' || b.escrow_status === 'released')
                .map(b => b.activity_id)
        );

        const getDistance = (lat1, lon1, lat2, lon2) => {
            const R = 6371;
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLon = (lon2 - lon1) * Math.PI / 180;
            const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c;
        };

        // Get categories user has NOT booked
        const bookedCategories = new Set(
            bookings.map(b => {
                const act = activities.find(a => a.id === b.activity_id);
                return act?.category;
            }).filter(Boolean)
        );

        // Score each activity
        const scored = activities.map(act => {
            let score = 0;

            // Highest priority: featured
            if (act.is_featured) score += 100;

            // Distance bonus (closer = better)
            if (userCoords) {
                const dist = getDistance(userCoords.lat, userCoords.lng, act.location_lat, act.location_lng);
                if (dist < 5) score += 50;
                else if (dist < 10) score += 40;
                else if (dist < 20) score += 30;
                else if (dist < 50) score += 20;
                else score += 10;
            }

            // Rating bonus
            score += (act.average_rating || 0) * 10;

            // Popularity bonus
            score += Math.min((act.total_bookings || 0), 50);

            // Category diversity bonus (prefer categories user hasn't booked)
            if (bookedCategories.size > 0 && !bookedCategories.has(act.category)) {
                score += 25;
            }

            // Not recommended if completed unless necessary
            if (completedActivityIds.has(act.id)) {
                score -= 200;
            }

            return { ...act, score };
        });

        // Sort by score descending
        scored.sort((a, b) => b.score - a.score);

        // Remove duplicates and take top 6
        const seen = new Set();
        const unique = [];
        for (const act of scored) {
            if (!seen.has(act.id)) {
                seen.add(act.id);
                unique.push(act);
            }
            if (unique.length >= 6) break;
        }

        // If less than 6, fill with featured activities
        if (unique.length < 6) {
            const featured = activities
                .filter(a => a.is_featured && !seen.has(a.id))
                .slice(0, 6 - unique.length);
            unique.push(...featured);
        }

        return unique;
    }, [dbState.activities, dbState.bookings, userCoords]);

    if (recommendations.length === 0) return null;

    return (
        <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Sparkles size={16} color="white" />
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, fontFamily: 'Outfit', color: 'var(--text-primary)' }}>
                    {t('recommendedForYou')}
                </h3>
            </div>

            <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }} className="no-scrollbar">
                {recommendations.map((activity, idx) => {
                    const catInfo = getCategoryIcon(activity.category);
                    return (
                        <motion.button
                            key={activity.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => onActivitySelect(activity)}
                            style={{
                                flexShrink: 0,
                                width: '200px',
                                background: 'var(--bg-secondary)',
                                borderRadius: '20px',
                                border: '1px solid var(--border-color)',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                textAlign: 'left',
                                padding: '0',
                                boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
                            }}
                        >
                            {/* Image */}
                            <div style={{
                                width: '100%',
                                height: '100px',
                                background: `linear-gradient(135deg, ${catInfo.color}33, ${catInfo.color}15)`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative'
                            }}>
                                <span style={{ fontSize: '36px' }}>{catInfo.emoji}</span>
                                {activity.is_featured && (
                                    <span style={{
                                        position: 'absolute',
                                        top: '8px',
                                        right: '8px',
                                        padding: '2px 6px',
                                        borderRadius: '6px',
                                        background: 'rgba(245, 158, 11, 0.9)',
                                        color: 'white',
                                        fontSize: '0.5rem',
                                        fontWeight: 800,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                    }}>
                                        Featured
                                    </span>
                                )}
                            </div>

                            <div style={{ padding: '12px' }}>
                                <div style={{
                                    display: 'inline-block',
                                    padding: '2px 8px',
                                    borderRadius: '4px',
                                    background: `${catInfo.color}15`,
                                    color: catInfo.color,
                                    fontSize: '0.55rem',
                                    fontWeight: 800,
                                    textTransform: 'uppercase',
                                    marginBottom: '6px',
                                    letterSpacing: '0.3px'
                                }}>
                                    {catInfo.label}
                                </div>
                                <h4 style={{
                                    fontSize: '0.8rem',
                                    fontWeight: 800,
                                    color: 'var(--text-primary)',
                                    marginBottom: '4px',
                                    lineHeight: 1.2,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}>
                                    {activity.title}
                                </h4>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Star size={11} color="#f59e0b" fill="#f59e0b" />
                                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                                            {activity.average_rating?.toFixed(1)}
                                        </span>
                                    </div>
                                    <div style={{ fontWeight: 900, fontSize: '0.8rem', color: 'var(--emerald)' }}>
                                        BND {activity.price_per_person.toFixed(2)}
                                    </div>
                                </div>
                            </div>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
};

export default AIRecommendations;