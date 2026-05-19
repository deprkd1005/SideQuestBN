import React from 'react';
import { Routes, Route } from 'react-router-dom';
import BottomNav from '../../shared/BottomNav';
import AdminDashboard from './AdminDashboard';
import AdminEscrow from './AdminEscrow';
import AdminReports from './AdminReports';
import AdminSystem from './AdminSystem';
import AdminProfile from './AdminProfile';
import AdminLogs from './AdminLogs';

const AdminPortal = () => {
  return (
    <div className="theme-admin" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/escrow" element={<AdminEscrow />} />
          <Route path="/reports" element={<AdminReports />} />
          <Route path="/logs" element={<AdminLogs />} />
          <Route path="/wallet" element={<AdminSystem />} />
          <Route path="/profile" element={<AdminProfile />} />
        </Routes>
      </div>

      <BottomNav portal="admin" />
    </div>
  );
};

export default AdminPortal;