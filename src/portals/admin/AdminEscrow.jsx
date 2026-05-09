import React from 'react';
import { Shield, Lock, ArrowUpRight, TrendingUp, CheckCircle } from 'lucide-react';

const AdminEscrow = () => {
  const holdings = [
    { id: 1, job: 'Design Logo', amount: '250.00', status: 'Secured', time: '12h remaining' },
    { id: 2, job: 'Food Delivery', amount: '15.00', status: 'Pending Release', time: 'Awaiting Poster' },
    { id: 3, job: 'Mobile App Fix', amount: '1,200.00', status: 'Secured', time: '2 days remaining' }
  ];

  return (
    <div className="app-content" style={{ background: 'var(--bg-primary)', minHeight: '100%' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 className="section-title">Payment Security</h1>
        <p className="section-subtitle">Financial custody & trust control</p>
      </div>

      <div className="card" style={{ padding: '24px', background: 'linear-gradient(135deg, var(--blue) 0%, #1e40af 100%)', color: 'white', border: 'none', marginBottom: '32px' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 700, opacity: 0.8, textTransform: 'uppercase', marginBottom: '8px' }}>Total Escrow Held</div>
        <div style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '24px' }}>BND 12,450.00</div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '16px' }}>
            <div style={{ fontSize: '0.6rem', fontWeight: 800 }}>ACTIVE CONTRACTS</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 900 }}>89</div>
          </div>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '16px' }}>
            <div style={{ fontSize: '0.6rem', fontWeight: 800 }}>DISPUTED</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 900 }}>4</div>
          </div>
        </div>
      </div>

      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px' }}>Live Holdings</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {holdings.map(item => (
          <div key={item.id} className="card" style={{ padding: '16px' }}>
            <div className="flex-between" style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--blue)' }}>
                  <Shield size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 800 }}>{item.job}</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{item.time}</p>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1rem', fontWeight: 900 }}>BND {item.amount}</div>
                <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--emerald)' }}>{item.status}</div>
              </div>
            </div>
            <button className="btn-outline" onClick={() => alert(`Detailed contract view for ${item.job} will be available in the full release. Funds are currently locked securely in Escrow.`)} style={{ width: '100%', height: '40px', fontSize: '0.8rem', fontWeight: 700 }}>View Contract</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminEscrow;
