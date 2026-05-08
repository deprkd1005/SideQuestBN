import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, Sliders } from 'lucide-react';
import { usePayment } from '../../context/PaymentContext';
import MapView from '../../components/MapView';

const HustlerHome = () => {
  const navigate = useNavigate();
  const { jobs, userLocation } = usePayment();
  const [searchRadius, setSearchRadius] = useState(20);
  const [viewMode, setViewMode] = useState('map'); // map or list
  const mapInstanceRef = useRef(null);

  const nearbyJobs = jobs.filter(job => job.status === 'open').slice(0, 5);
  const handleAccept = (jobId) => navigate(`/hustler/job/${jobId}`);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{
        padding: '1rem',
        background: 'var(--bg-primary)',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: 900,
            color: 'var(--text-primary)'
          }}>
            Find Jobs
          </h1>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setViewMode('list')}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: viewMode === 'list' ? '2px solid var(--emerald)' : '1px solid var(--border-color)',
                background: viewMode === 'list' ? 'var(--emerald)' : 'var(--bg-primary)',
                color: viewMode === 'list' ? 'white' : 'var(--text-primary)',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              List
            </button>
            <button
              onClick={() => setViewMode('map')}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: viewMode === 'map' ? '2px solid var(--emerald)' : '1px solid var(--border-color)',
                background: viewMode === 'map' ? 'var(--emerald)' : 'var(--bg-primary)',
                color: viewMode === 'map' ? 'white' : 'var(--text-primary)',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Map
            </button>
          </div>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '1rem'
        }}>
          <div style={{
            flex: 1,
            position: 'relative'
          }}>
            <Search style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-secondary)',
              width: '20px',
              height: '20px'
            }} />
            <input
              type="text"
              placeholder="Search jobs..."
              style={{
                width: '100%',
                padding: '12px 12px 12px 44px',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-card)',
                color: 'var(--text-primary)',
                fontSize: '1rem'
              }}
            />
          </div>
          <button style={{
            padding: '12px',
            borderRadius: '12px',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-card)',
            cursor: 'pointer'
          }}>
            <Sliders style={{
              width: '20px',
              height: '20px',
              color: 'var(--text-primary)'
            }} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        position: 'relative',
        overflow: 'hidden'
      }}>
        {viewMode === 'list' && (
          <div style={{
            padding: '1rem',
            height: '100%',
            overflowY: 'auto'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {nearbyJobs.map(job => (
                <div
                  key={job.id}
                  onClick={() => navigate(`/hustler/job/${job.id}`)}
                  style={{
                    background: 'var(--bg-card)',
                    borderRadius: '12px',
                    padding: '16px',
                    cursor: 'pointer',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '8px'
                  }}>
                    <h3 style={{
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      margin: 0
                    }}>
                      {job.title}
                    </h3>
                    <span style={{
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      color: 'var(--emerald)'
                    }}>
                      BND {job.reward}
                    </span>
                  </div>
                  <p style={{
                    fontSize: '0.9rem',
                    color: 'var(--text-secondary)',
                    marginBottom: '12px'
                  }}>
                    {job.description}
                  </p>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{
                      fontSize: '0.8rem',
                      color: 'var(--text-secondary)'
                    }}>
                      {job.category} • {job.distance || 'Nearby'}
                    </span>
                    <button style={{
                      background: 'var(--emerald)',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}>
                      Apply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {viewMode === 'map' && (
          <div style={{
            height: '100%',
            position: 'relative'
          }}>
            <MapView
              jobs={nearbyJobs}
              onAccept={handleAccept}
              mapInstanceRef={mapInstanceRef}
              searchRadius={searchRadius}
              userLocation={userLocation}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default HustlerHome;