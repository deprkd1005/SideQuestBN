import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Clock, DollarSign, User, CheckCircle } from 'lucide-react';
import { usePayment } from '../../context/PaymentContext';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { jobs, acceptJob } = usePayment();

  const job = jobs.find(j => j.id === id);

  if (!job) {
    return (
      <div style={{
        padding: '2rem',
        textAlign: 'center',
        color: 'var(--text-secondary)'
      }}>
        Job not found
      </div>
    );
  }

  const handleAccept = async () => {
    await acceptJob(job.id);
    navigate('/hustler/jobs');
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
          Job Details
        </h1>
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '1rem'
      }}>
        {/* Job Title and Price */}
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: '16px',
          padding: '1.5rem',
          marginBottom: '1rem',
          border: '1px solid var(--border-color)'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 900,
            color: 'var(--text-primary)',
            marginBottom: '0.5rem'
          }}>
            {job.title}
          </h2>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '1rem'
          }}>
            <DollarSign size={20} color="var(--emerald)" />
            <span style={{
              fontSize: '1.8rem',
              fontWeight: 900,
              color: 'var(--emerald)'
            }}>
              BND {job.reward}
            </span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '8px'
          }}>
            <MapPin size={16} color="var(--text-muted)" />
            <span style={{
              fontSize: '0.9rem',
              color: 'var(--text-secondary)'
            }}>
              {job.mukim}, {job.district}
            </span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Clock size={16} color="var(--text-muted)" />
            <span style={{
              fontSize: '0.9rem',
              color: 'var(--text-secondary)'
            }}>
              Posted {new Date(job.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Job Description */}
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
            Description
          </h3>
          <p style={{
            fontSize: '1rem',
            color: 'var(--text-secondary)',
            lineHeight: '1.6'
          }}>
            {job.description}
          </p>
        </div>

        {/* Job Details */}
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
            Details
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
                Category
              </span>
              <span style={{
                fontSize: '0.9rem',
                fontWeight: 600,
                color: 'var(--text-primary)'
              }}>
                {job.category}
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
                Type
              </span>
              <span style={{
                fontSize: '0.9rem',
                fontWeight: 600,
                color: 'var(--text-primary)'
              }}>
                {job.indoor ? 'Indoor' : 'Outdoor'}
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
                Duration
              </span>
              <span style={{
                fontSize: '0.9rem',
                fontWeight: 600,
                color: 'var(--text-primary)'
              }}>
                {job.duration || 'Flexible'}
              </span>
            </div>
          </div>
        </div>

        {/* Poster Info */}
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: '16px',
          padding: '1.5rem',
          marginBottom: '2rem',
          border: '1px solid var(--border-color)'
        }}>
          <h3 style={{
            fontSize: '1.2rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: '1rem'
          }}>
            Posted by
          </h3>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'var(--emerald-soft)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <User size={24} color="var(--emerald)" />
            </div>
            <div>
              <div style={{
                fontSize: '1rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: '4px'
              }}>
                {job.payer}
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <CheckCircle size={14} color="var(--emerald)" />
                <span style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)'
                }}>
                  Verified Poster
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Button */}
      {job.status === 'open' && (
        <div style={{
          padding: '1rem',
          background: 'var(--bg-primary)',
          borderTop: '1px solid var(--border-color)'
        }}>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleAccept}
            style={{
              width: '100%',
              background: 'var(--emerald)',
              color: 'white',
              border: 'none',
              padding: '16px',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: 'var(--shadow-glow-emerald)'
            }}
          >
            Apply for Job
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default JobDetails;