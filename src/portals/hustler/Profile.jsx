import React from 'react';
import { motion } from 'framer-motion';
import { User, Star, MapPin, Briefcase, Award, Settings, LogOut } from 'lucide-react';
import { usePayment } from '../../context/PaymentContext';

const Profile = () => {
  const { user } = usePayment();

  // Mock user data
  const profileData = {
    name: user?.name || 'John Doe',
    rating: 4.8,
    completedJobs: 24,
    skills: ['Cleaning', 'Delivery', 'Gardening'],
    location: 'Bandar Seri Begawan',
    memberSince: 'January 2024',
    verificationStatus: 'Verified'
  };

  const stats = [
    { label: 'Completed Jobs', value: profileData.completedJobs, icon: Briefcase },
    { label: 'Rating', value: `${profileData.rating}★`, icon: Star },
    { label: 'Response Rate', value: '98%', icon: Award }
  ];

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg-primary)'
    }}>
      {/* Header */}
      <div style={{
        padding: '1rem',
        background: 'var(--bg-primary)',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: 900,
          color: 'var(--text-primary)'
        }}>
          Profile
        </h1>
      </div>

      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '1rem'
      }}>
        {/* Profile Header */}
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: '16px',
          padding: '1.5rem',
          marginBottom: '1rem',
          border: '1px solid var(--border-color)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '40px',
            background: 'var(--emerald-soft)',
            margin: '0 auto 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <User size={40} color="var(--emerald)" />
          </div>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 900,
            color: 'var(--text-primary)',
            marginBottom: '0.5rem'
          }}>
            {profileData.name}
          </h2>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            marginBottom: '0.5rem'
          }}>
            <MapPin size={16} color="var(--text-muted)" />
            <span style={{
              fontSize: '0.9rem',
              color: 'var(--text-secondary)'
            }}>
              {profileData.location}
            </span>
          </div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            background: 'var(--emerald-soft)',
            padding: '4px 8px',
            borderRadius: '12px'
          }}>
            <Award size={14} color="var(--emerald)" />
            <span style={{
              fontSize: '0.8rem',
              color: 'var(--emerald)',
              fontWeight: 600
            }}>
              {profileData.verificationStatus}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '12px',
          marginBottom: '1rem'
        }}>
          {stats.map(stat => (
            <div key={stat.label} style={{
              background: 'var(--bg-card)',
              borderRadius: '12px',
              padding: '1rem',
              textAlign: 'center',
              border: '1px solid var(--border-color)'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'var(--emerald-soft)',
                margin: '0 auto 8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <stat.icon size={16} color="var(--emerald)" />
              </div>
              <p style={{
                fontSize: '1.2rem',
                fontWeight: 900,
                color: 'var(--text-primary)',
                margin: '0 0 4px 0'
              }}>
                {stat.value}
              </p>
              <p style={{
                fontSize: '0.8rem',
                color: 'var(--text-secondary)',
                margin: 0
              }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Skills */}
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: '16px',
          padding: '1.5rem',
          marginBottom: '1rem',
          border: '1px solid var(--border-color)'
        }}>
          <h3 style={{
            fontSize: '1.2rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: '1rem'
          }}>
            Skills
          </h3>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            {profileData.skills.map(skill => (
              <span key={skill} style={{
                background: 'var(--emerald-soft)',
                color: 'var(--emerald)',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '0.9rem',
                fontWeight: 600
              }}>
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Account Info */}
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: '16px',
          padding: '1.5rem',
          marginBottom: '1rem',
          border: '1px solid var(--border-color)'
        }}>
          <h3 style={{
            fontSize: '1.2rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: '1rem'
          }}>
            Account Information
          </h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{
                fontSize: '0.9rem',
                color: 'var(--text-secondary)'
              }}>
                Member Since
              </span>
              <span style={{
                fontSize: '0.9rem',
                fontWeight: 600,
                color: 'var(--text-primary)'
              }}>
                {profileData.memberSince}
              </span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{
                fontSize: '0.9rem',
                color: 'var(--text-secondary)'
              }}>
                Account Status
              </span>
              <span style={{
                fontSize: '0.9rem',
                fontWeight: 600,
                color: 'var(--emerald)'
              }}>
                Active
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{
          display: 'grid',
          gap: '12px',
          marginBottom: '2rem'
        }}>
          <motion.button
            whileTap={{ scale: 0.95 }}
            style={{
              width: '100%',
              padding: '14px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              color: 'var(--text-primary)',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <Settings size={20} />
            Account Settings
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            style={{
              width: '100%',
              padding: '14px',
              background: 'var(--red-soft)',
              border: '1px solid var(--red)',
              borderRadius: '12px',
              color: 'var(--red)',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <LogOut size={20} />
            Sign Out
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Profile;