import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Edit3, Save, Award, Eye, Globe, ChevronRight } from 'lucide-react';

const HostProfileStudio = ({ onSave }) => {
  const [profile, setProfile] = useState({
    businessName: "Kempas Heritage Tours & Crafts",
    biography: "Third-generation Kampong Ayer native artisans sharing traditional weave patterns, hand-crafted wooden boats, and sunset water taxi heritage trails.",
    bannerUrl: "https://images.unsplash.com/photo-1596422846543-75c6fc18a523?auto=format&fit=crop&w=800&q=80",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80",
    contactEmail: "ahmad@kempasheritage.bn",
    contactPhone: "+673 898 7654",
    district: "Brunei-Muara",
    website: "www.kempasheritage.bn",
    tags: ["Halal Certified", "Eco-Friendly", "Kampong Ayer Native", "Traditional Crafts"]
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedBio, setEditedBio] = useState(profile.biography);
  const [editedPhone, setEditedPhone] = useState(profile.contactPhone);
  const [editedEmail, setEditedEmail] = useState(profile.contactEmail);

  // Available tags to toggle
  const availableTags = ["Halal Certified", "Eco-Friendly", "Kampong Ayer Native", "Traditional Crafts", "English-Speaking Guide", "Kid-Friendly"];
  const [selectedTags, setSelectedTags] = useState(profile.tags);

  const handleTagToggle = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(prev => prev.filter(t => t !== tag));
    } else {
      setSelectedTags(prev => [...prev, tag]);
    }
  };

  const handleSave = () => {
    const updated = {
      ...profile,
      biography: editedBio,
      contactPhone: editedPhone,
      contactEmail: editedEmail,
      tags: selectedTags
    };
    setProfile(updated);
    setIsEditing(false);
    if (onSave) onSave(updated);
  };

  return (
    <div style={{
      background: 'var(--bg-secondary)',
      borderRadius: '24px',
      border: '1px solid var(--border-color)',
      overflow: 'hidden',
      fontFamily: 'Outfit'
    }}>
      {/* Cover Banner */}
      <div style={{
        height: '140px',
        backgroundImage: `url(${profile.bannerUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0) 30%, rgba(0,0,0,0.85) 100%)'
        }} />
        <button style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: 'rgba(0,0,0,0.5)',
          border: 'none',
          color: 'white',
          padding: '6px 12px',
          borderRadius: '20px',
          fontSize: '0.7rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          cursor: 'pointer',
          backdropFilter: 'blur(5px)'
        }}>
          <Camera size={12} />
          Change Banner
        </button>
      </div>

      {/* Avatar and Header */}
      <div style={{ padding: '0 20px', position: 'relative', marginTop: '-45px', marginBottom: '16px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '24px',
            border: '4px solid var(--bg-card)',
            backgroundImage: `url(${profile.avatarUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
            background: 'var(--bg-secondary)'
          }}>
            <button style={{
              position: 'absolute',
              bottom: '-4px',
              right: '-4px',
              background: 'var(--gold)',
              border: '2px solid var(--bg-card)',
              color: 'black',
              padding: '4px',
              borderRadius: '50%',
              cursor: 'pointer'
            }}>
              <Camera size={12} />
            </button>
          </div>
          <div style={{ paddingBottom: '4px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              {profile.businessName}
            </h3>
            <span style={{ fontSize: '0.7rem', color: 'var(--gold)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Award size={12} />
              Brunei Heritage Registered MSME
            </span>
          </div>
        </div>

        <button 
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          style={{
            background: isEditing ? 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)' : 'var(--bg-tertiary)',
            border: isEditing ? 'none' : '1px solid var(--border-color)',
            color: isEditing ? 'black' : 'var(--text-primary)',
            padding: '8px 16px',
            borderRadius: '14px',
            fontSize: '0.75rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s ease'
          }}
        >
          {isEditing ? <Save size={14} /> : <Edit3 size={14} />}
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </button>
      </div>

      {/* Main Details */}
      <div style={{ padding: '0 20px 20px' }}>
        {/* Biography */}
        <div style={{ marginBottom: '20px' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
            MSME Biography
          </span>
          {isEditing ? (
            <textarea
              value={editedBio}
              onChange={(e) => setEditedBio(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '12px',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                fontFamily: 'Outfit',
                minHeight: '80px',
                resize: 'vertical'
              }}
            />
          ) : (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              {profile.biography}
            </p>
          )}
        </div>

        {/* Contact Info */}
        <div style={{
          background: 'var(--bg-tertiary)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '16px',
          marginBottom: '20px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px'
        }}>
          <div>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>CONTACT EMAIL</span>
            {isEditing ? (
              <input
                type="text"
                value={editedEmail}
                onChange={(e) => setEditedEmail(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '1px solid var(--gold)',
                  color: 'var(--text-primary)',
                  fontSize: '0.8rem',
                  width: '100%',
                  padding: '2px 0'
                }}
              />
            ) : (
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>{profile.contactEmail}</span>
            )}
          </div>
          <div>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>PHONE / WHATSAPP</span>
            {isEditing ? (
              <input
                type="text"
                value={editedPhone}
                onChange={(e) => setEditedPhone(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '1px solid var(--gold)',
                  color: 'var(--text-primary)',
                  fontSize: '0.8rem',
                  width: '100%',
                  padding: '2px 0'
                }}
              />
            ) : (
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>{profile.contactPhone}</span>
            )}
          </div>
          <div>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>DISTRICT</span>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>{profile.district}</span>
          </div>
          <div>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>WEBSITE</span>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--gold)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Globe size={12} />
              {profile.website}
            </span>
          </div>
        </div>

        {/* Tags / Badges */}
        <div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
            Cultural & Quality Credentials
          </span>
          
          {isEditing ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {availableTags.map(tag => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    style={{
                      background: isSelected ? 'var(--gold-soft)' : 'var(--bg-tertiary)',
                      border: `1px solid ${isSelected ? 'var(--gold)' : 'var(--border-color)'}`,
                      color: isSelected ? 'var(--gold-dark)' : 'var(--text-secondary)',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {profile.tags.map(tag => (
                <span
                  key={tag}
                  style={{
                    background: 'rgba(255, 215, 0, 0.08)',
                    border: '1px solid rgba(255, 215, 0, 0.2)',
                    color: 'var(--gold)',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    letterSpacing: '0.2px'
                  }}
                >
                  ✓ {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HostProfileStudio;
