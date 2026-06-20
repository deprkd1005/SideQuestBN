import { useState, useEffect } from 'react';
import { Compass, Wallet, Zap, ArrowUpCircle, Lock } from 'lucide-react';
import WalletCard from './WalletCard';

const TouristPortal = () => {
  const [tab, setTab] = useState('marketplace');
  const [balance, setBalance] = useState(250.00);
  const [activities, setActivities] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  useEffect(() => {
    fetch('/api/_test/db')
      .then(res => res.json())
      .then(data => setActivities(data.activities || []))
      .catch(console.error);
  }, []);

  const handleBook = async (activity) => {
    setBookingInProgress(true);
    try {
      const res = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activity_id: activity.id,
          tourist_user_id: 'usr_traveler_001',
          booking_date: new Date().toISOString().substring(0, 10),
          booking_time_slot: '10:00',
          participant_count: 2
        })
      });
      const data = await res.json();
      if (data.success) {
        setBalance(prev => prev - parseFloat(data.booking.gross_amount));
        setBookings(prev => [data.booking, ...prev]);
        setSelectedActivity(null);
        setTab('ledger');
      } else {
        alert("Booking failed: " + data.error);
      }
    } catch (e) {
      console.error(e);
      alert("Error creating booking.");
    }
    setBookingInProgress(false);
  };

  return (
    <div style={{ paddingBottom: '80px' }}>
      {/* Header */}
      <header style={{
        position: 'sticky', top: 0, background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(10px)', padding: '1.2rem', zIndex: 100,
        borderBottom: '1px solid var(--border-color)', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ background: 'var(--emerald)', color: 'white', padding: '6px', borderRadius: '8px' }}>
            <Zap size={20} />
          </div>
          <h2 style={{ fontWeight: 800, fontSize: '1.2rem', fontFamily: 'Outfit' }}>SideQuest Tourism</h2>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)' }}>POCKET BALANCE</p>
          <h3 style={{ color: 'var(--emerald)', fontWeight: 800, fontFamily: 'Outfit' }}>BND {balance.toFixed(2)}</h3>
        </div>
      </header>

      {/* Wallet Card */}
      <WalletCard balance={balance} user="AWANG TRAVELER" isHost={false} />

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '20px', padding: '1.5rem 1.2rem 0.5rem', borderBottom: '1px solid var(--border-color)' }}>
        <button 
          onClick={() => setTab('marketplace')} 
          style={{ background: 'none', border: 'none', fontWeight: 700, fontSize: '0.85rem', color: tab === 'marketplace' ? 'var(--emerald)' : 'var(--text-muted)', fontFamily: 'Outfit', cursor: 'pointer' }}>
          MARKETPLACE
        </button>
        <button 
          onClick={() => setTab('ledger')} 
          style={{ background: 'none', border: 'none', fontWeight: 700, fontSize: '0.85rem', color: tab === 'ledger' ? 'var(--emerald)' : 'var(--text-muted)', fontFamily: 'Outfit', cursor: 'pointer' }}>
          LEDGER
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: '1.2rem' }}>
        {tab === 'marketplace' ? (
          activities.map(act => (
            <div key={act.id} className="card" style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div>
                  <h4 style={{ fontSize: '1rem', fontFamily: 'Outfit', fontWeight: 700 }}>{act.title}</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>📍 {act.district}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: 800, color: 'var(--emerald)', fontFamily: 'Outfit' }}>
                    BND {parseFloat(act.price_per_person).toFixed(2)}<small style={{fontWeight:400, color:'var(--text-muted)'}}>/pax</small>
                  </p>
                </div>
              </div>

              {selectedActivity === act.id ? (
                <div style={{ background: 'var(--bg-tertiary)', padding: '12px', borderRadius: '12px', marginTop: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '12px' }}>
                    <span>2 Pax Total:</span>
                    <span style={{ fontWeight: 700 }}>BND {(parseFloat(act.price_per_person) * 2).toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn-primary" style={{ flex: 1 }} onClick={() => handleBook(act)} disabled={bookingInProgress}>
                      {bookingInProgress ? 'Locking...' : 'Confirm Escrow Lock'}
                    </button>
                    <button className="btn-outline" onClick={() => setSelectedActivity(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <button className="btn-outline" style={{ width: '100%', borderColor: 'var(--emerald)', color: 'var(--emerald)' }} onClick={() => setSelectedActivity(act.id)}>
                  Book Activity
                </button>
              )}
            </div>
          ))
        ) : (
          <div>
            {bookings.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem', fontSize: '0.9rem' }}>No escrow locks yet.</p>
            ) : (
              bookings.map(bk => (
                <div key={bk.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderBottom: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ background: '#fff1f2', color: '#e11d48', padding: '8px', borderRadius: '10px' }}>
                      <Lock size={18} />
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>Escrow Lock</p>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{new Date(bk.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: 800, fontSize: '0.95rem' }}>-BND {parseFloat(bk.gross_amount).toFixed(2)}</p>
                    <span className="badge-emerald" style={{ fontSize: '0.6rem' }}>{bk.escrow_status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <nav className="bottom-nav">
        <button className="nav-item active" style={{ color: 'var(--emerald)' }}>
          <Compass size={24} />
          <span style={{ fontSize: '0.65rem', fontWeight: 600 }}>Explore</span>
        </button>
        <button className="nav-item">
          <Wallet size={24} />
          <span style={{ fontSize: '0.65rem', fontWeight: 600 }}>Pocket</span>
        </button>
      </nav>
    </div>
  );
};

export default TouristPortal;
