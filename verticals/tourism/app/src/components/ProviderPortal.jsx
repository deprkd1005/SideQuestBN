import { useState, useEffect } from 'react';
import { Briefcase, Wallet, ShieldCheck, AlertCircle, RefreshCcw } from 'lucide-react';
import WalletCard from './WalletCard';

const ProviderPortal = () => {
  const [tab, setTab] = useState('dashboard');
  const [bookings, setBookings] = useState([]);
  const [amlStatus, setAmlStatus] = useState('CLEAR');
  const [payoutLogs, setPayoutLogs] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetch('/api/_test/db')
      .then(res => res.json())
      .then(data => setBookings(data.bookings || []))
      .catch(console.error);
  }, [tab]); // Reload bookings on tab switch

  const handlePayout = async (hostId) => {
    if (bookings.length === 0) return alert("No bookings available for payout.");
    setIsProcessing(true);
    
    try {
      const res = await fetch('/api/payout/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          booking_id: bookings[0].id,
          host_user_id: hostId,
          partner_wallet_type: 'POCKET'
        })
      });
      const data = await res.json();
      
      setPayoutLogs(prev => [JSON.stringify(data, null, 2), ...prev]);
      
      if (data.error === 'AML_NAME_MISMATCH' || data.aml_status === 'SUSPENDED_AML_FLAG') {
        setAmlStatus('SUSPENDED');
      } else if (data.success) {
        setAmlStatus('CLEAR');
      }
    } catch (e) {
      console.error(e);
      alert("Error processing payout.");
    }
    setIsProcessing(false);
  };

  const resetDB = async () => {
    await fetch('/api/_test/db/reset', { method: 'POST' });
    setAmlStatus('CLEAR');
    setPayoutLogs([]);
    setBookings([]);
    alert("Database reset.");
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
          <div style={{ background: 'var(--gold)', color: 'white', padding: '6px', borderRadius: '8px' }}>
            <Briefcase size={20} />
          </div>
          <h2 style={{ fontWeight: 800, fontSize: '1.2rem', fontFamily: 'Outfit' }}>Provider Portal</h2>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)' }}>EARNINGS</p>
          <h3 style={{ color: 'var(--gold)', fontWeight: 800, fontFamily: 'Outfit' }}>
            BND {bookings.reduce((sum, b) => sum + parseFloat(b.host_payout_amount), 0).toFixed(2)}
          </h3>
        </div>
      </header>

      {/* Wallet Card */}
      <WalletCard balance={0} user="BRUNEI HOST" isHost={true} />

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '20px', padding: '1.5rem 1.2rem 0.5rem', borderBottom: '1px solid var(--border-color)' }}>
        <button 
          onClick={() => setTab('dashboard')} 
          style={{ background: 'none', border: 'none', fontWeight: 700, fontSize: '0.85rem', color: tab === 'dashboard' ? 'var(--gold)' : 'var(--text-muted)', fontFamily: 'Outfit', cursor: 'pointer' }}>
          DASHBOARD
        </button>
        <button 
          onClick={() => setTab('payouts')} 
          style={{ background: 'none', border: 'none', fontWeight: 700, fontSize: '0.85rem', color: tab === 'payouts' ? 'var(--gold)' : 'var(--text-muted)', fontFamily: 'Outfit', cursor: 'pointer' }}>
          PAYOUT & SECURITY
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: '1.2rem' }}>
        {tab === 'dashboard' ? (
          <div>
            <h3 style={{ fontFamily: 'Outfit', fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>Recent Bookings</h3>
            {bookings.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No bookings yet.</p>
            ) : (
              bookings.map(bk => (
                <div key={bk.id} className="card" style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Activity Booking</span>
                    <span className="badge-gold" style={{ fontSize: '0.7rem' }}>{bk.escrow_status}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    <span>Date: {new Date(bk.created_at).toLocaleDateString()}</span>
                    <span style={{ fontWeight: 700, color: 'var(--gold)' }}>BND {parseFloat(bk.host_payout_amount).toFixed(2)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div>
            {amlStatus === 'SUSPENDED' && (
              <div style={{ background: 'rgba(239,68,68,0.1)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', gap: '12px', marginBottom: '20px' }}>
                <AlertCircle color="var(--red)" size={24} />
                <div>
                  <h4 style={{ color: 'var(--red)', fontSize: '0.9rem', fontWeight: 700 }}>AML FREEZE ACTIVE</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Payouts locked due to name mismatch between legal name and bank account.</p>
                </div>
              </div>
            )}
            
            <div className="card" style={{ marginBottom: '20px' }}>
              <h4 style={{ fontFamily: 'Outfit', fontSize: '1rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={18} color="var(--gold)" />
                Payout Whitelisting Firewall
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Simulate the API gateway AML validation. 
              </p>
              
              <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
                <button className="btn-primary" style={{ background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%)' }} onClick={() => handlePayout('usr_host_001')} disabled={isProcessing}>
                  {isProcessing ? 'Processing...' : 'Simulate Match (BIBD)'}
                </button>
                <button className="btn-outline" style={{ borderColor: 'var(--red)', color: 'var(--red)' }} onClick={() => handlePayout('usr_host_002')} disabled={isProcessing}>
                  Simulate Mismatch (Baiduri)
                </button>
                <button className="btn-outline" onClick={resetDB}>
                  <RefreshCcw size={16} /> Reset Database
                </button>
              </div>
            </div>

            {payoutLogs.length > 0 && (
              <div style={{ background: '#0f172a', borderRadius: '12px', padding: '16px', color: '#10b981', fontFamily: 'monospace', fontSize: '0.75rem', maxHeight: '200px', overflowY: 'auto' }}>
                {payoutLogs.map((log, i) => (
                  <pre key={i} style={{ marginBottom: '12px', whiteSpace: 'pre-wrap' }}>{log}</pre>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <nav className="bottom-nav">
        <button className="nav-item">
          <Briefcase size={24} />
          <span style={{ fontSize: '0.65rem', fontWeight: 600 }}>Requests</span>
        </button>
        <button className="nav-item active" style={{ color: 'var(--gold)' }}>
          <Wallet size={24} />
          <span style={{ fontSize: '0.65rem', fontWeight: 600 }}>Payout</span>
        </button>
      </nav>
    </div>
  );
};

export default ProviderPortal;
