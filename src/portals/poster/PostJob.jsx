import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Calendar, Clock, DollarSign } from 'lucide-react';
import { usePayment } from '../../context/PaymentContext';

const PostJob = () => {
  const navigate = useNavigate();
  const { postJob } = usePayment();

  const [jobData, setJobData] = useState({
    title: '',
    description: '',
    category: '',
    budget: '',
    location: '',
    date: '',
    time: '',
    indoor: true
  });

  const categories = [
    'Cleaning', 'Delivery', 'Gardening', 'Moving', 'Repair',
    'Tutoring', 'Event Help', 'Pet Care', 'Shopping', 'Other'
  ];

  const handleSubmit = async () => {
    // Mock post job
    await postJob(jobData);
    navigate('/poster');
  };

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
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'var(--bg-secondary)',
            border: 'none',
            borderRadius: '8px',
            padding: '8px',
            cursor: 'pointer',
            color: 'var(--text-secondary)'
          }}
        >
          <ArrowLeft size={20} />
        </button>
        <h1 style={{
          fontSize: '1.2rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          flex: 1
        }}>
          Post a Job
        </h1>
      </div>

      {/* Form */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '1rem'
      }}>
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {/* Job Title */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: '8px'
            }}>
              Job Title
            </label>
            <input
              type="text"
              placeholder="e.g. House Cleaning"
              value={jobData.title}
              onChange={(e) => setJobData({...jobData, title: e.target.value})}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                fontSize: '1rem'
              }}
            />
          </div>

          {/* Category */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: '8px'
            }}>
              Category
            </label>
            <select
              value={jobData.category}
              onChange={(e) => setJobData({...jobData, category: e.target.value})}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                fontSize: '1rem'
              }}
            >
              <option value="">Select category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: '8px'
            }}>
              Description
            </label>
            <textarea
              placeholder="Describe the job requirements..."
              value={jobData.description}
              onChange={(e) => setJobData({...jobData, description: e.target.value})}
              rows={4}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                fontSize: '1rem',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Budget */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: '8px'
            }}>
              Budget (BND)
            </label>
            <div style={{ position: 'relative' }}>
              <DollarSign size={20} style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }} />
              <input
                type="number"
                placeholder="0.00"
                value={jobData.budget}
                onChange={(e) => setJobData({...jobData, budget: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 40px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  fontSize: '1rem'
                }}
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: '8px'
            }}>
              Location
            </label>
            <div style={{ position: 'relative' }}>
              <MapPin size={20} style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }} />
              <input
                type="text"
                placeholder="Enter location or use map picker"
                value={jobData.location}
                onChange={(e) => setJobData({...jobData, location: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 40px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  fontSize: '1rem'
                }}
              />
            </div>
          </div>

          {/* Date & Time */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: '8px'
              }}>
                Date
              </label>
              <div style={{ position: 'relative' }}>
                <Calendar size={20} style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)'
                }} />
                <input
                  type="date"
                  value={jobData.date}
                  onChange={(e) => setJobData({...jobData, date: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 40px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    fontSize: '1rem'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: '8px'
              }}>
                Time
              </label>
              <div style={{ position: 'relative' }}>
                <Clock size={20} style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)'
                }} />
                <input
                  type="time"
                  value={jobData.time}
                  onChange={(e) => setJobData({...jobData, time: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 40px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    fontSize: '1rem'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Indoor/Outdoor */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: '8px'
            }}>
              Job Type
            </label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setJobData({...jobData, indoor: true})}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '8px',
                  border: `2px solid ${jobData.indoor ? 'var(--orange)' : 'var(--border-color)'}`,
                  background: jobData.indoor ? 'var(--orange-soft)' : 'var(--bg-secondary)',
                  color: jobData.indoor ? 'var(--orange)' : 'var(--text-primary)',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Indoor
              </button>
              <button
                onClick={() => setJobData({...jobData, indoor: false})}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '8px',
                  border: `2px solid ${!jobData.indoor ? 'var(--orange)' : 'var(--border-color)'}`,
                  background: !jobData.indoor ? 'var(--orange-soft)' : 'var(--bg-secondary)',
                  color: !jobData.indoor ? 'var(--orange)' : 'var(--text-primary)',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Outdoor
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div style={{
        padding: '1rem',
        background: 'var(--bg-primary)',
        borderTop: '1px solid var(--border-color)'
      }}>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
          disabled={!jobData.title || !jobData.category || !jobData.budget}
          style={{
            width: '100%',
            background: (!jobData.title || !jobData.category || !jobData.budget) ? 'var(--bg-tertiary)' : 'var(--orange)',
            color: 'white',
            border: 'none',
            padding: '16px',
            borderRadius: '12px',
            fontSize: '1.1rem',
            fontWeight: 700,
            cursor: (!jobData.title || !jobData.category || !jobData.budget) ? 'not-allowed' : 'pointer',
            boxShadow: (!jobData.title || !jobData.category || !jobData.budget) ? 'none' : 'var(--shadow-glow-orange)'
          }}
        >
          Post Job
        </motion.button>
      </div>
    </div>
  );
};

export default PostJob;