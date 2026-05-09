import React from 'react';
import { AlertTriangle, MessageSquare, Flag, Trash2, CheckCircle } from 'lucide-react';

const AdminReports = () => {
  const reports = [
    { id: 1, type: 'Spam', user: 'Zul_99', target: 'Fast Money Job', status: 'Pending', priority: 'High' },
    { id: 2, type: 'Harassment', user: 'Liyana_X', target: 'Chat with Ahmad', status: 'Investigating', priority: 'Critical' },
    { id: 3, type: 'Underage', user: 'System', target: 'Seeker_92', status: 'Resolved', priority: 'Medium' }
  ];

  return (
    <div style={{ padding: '24px 24px 100px', background: 'var(--bg-primary)', minHeight: '100%' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 className="section-title">Safety Reports</h1>
        <p className="section-subtitle">Community moderation & trust</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '32px' }}>
        <div className="card" style={{ padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--red)' }}>12</div>
          <div style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--text-muted)' }}>OPEN</div>
        </div>
        <div className="card" style={{ padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--orange)' }}>4</div>
          <div style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--text-muted)' }}>URGENT</div>
        </div>
        <div className="card" style={{ padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--emerald)' }}>142</div>
          <div style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--text-muted)' }}>SOLVED</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {reports.map(report => (
          <div key={report.id} className="card" style={{ padding: '20px', borderLeft: report.priority === 'Critical' ? '4px solid var(--red)' : '1px solid var(--border-color)' }}>
            <div className="flex-between" style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: report.priority === 'Critical' ? 'var(--red-soft)' : 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: report.priority === 'Critical' ? 'var(--red)' : 'var(--text-secondary)' }}>
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800 }}>{report.type}</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>By {report.user} • {report.priority}</p>
                </div>
              </div>
              <div style={{ padding: '6px 12px', borderRadius: '100px', background: 'var(--bg-secondary)', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {report.status}
              </div>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px', fontWeight: 500 }}>
              Flagged Content: <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>"{report.target}"</span>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn-primary" onClick={() => alert(`Taking action on report ${report.id}`)} style={{ flex: 1, height: '44px', background: 'var(--red)', fontSize: '0.85rem' }}>Take Action</button>
              <button className="btn-outline" onClick={() => alert(`Dismissing report ${report.id}`)} style={{ flex: 1, height: '44px', fontSize: '0.85rem' }}>Dismiss</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminReports;
