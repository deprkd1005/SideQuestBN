import React from 'react';
import { Activity, Cpu, Server, Database, CheckCircle, AlertCircle } from 'lucide-react';

const AdminSystem = () => {
  const metrics = [
    { label: 'API Latency', value: '42ms', status: 'Stable', icon: Activity },
    { label: 'CPU Usage', value: '12%', status: 'Low', icon: Cpu },
    { label: 'Server Load', value: '0.4', status: 'Optimal', icon: Server },
    { label: 'DB Connections', value: '450', status: 'Healthy', icon: Database }
  ];

  return (
    <div className="app-content" style={{ background: 'var(--bg-primary)', minHeight: '100%' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 className="section-title">System Health</h1>
        <p className="section-subtitle">Real-time infrastructure & transaction integrity logs</p>
      </div>

      <div style={{ display: 'grid', gap: '16px', marginBottom: '32px' }}>
        {metrics.map(m => (
          <div key={m.label} className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: 'var(--blue-soft)', color: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <m.icon size={28} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{m.label}</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)' }}>{m.value}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--emerald)', fontWeight: 800, fontSize: '0.85rem' }}>
              <CheckCircle size={16} />
              {m.status}
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: '24px', background: 'var(--bg-secondary)', border: '1px dashed var(--border-color)' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '12px' }}>System Logs</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[1,2,3].map(i => (
            <div key={i} style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-secondary)', padding: '8px', background: 'white', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--blue)' }}>[19:44:0{i}]</span> Success: Transaction SHA-256 Verified for BDCB.
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminSystem;
