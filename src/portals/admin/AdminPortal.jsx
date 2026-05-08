import React from 'react';
import { Routes, Route } from 'react-router-dom';
import BottomNav from '../../shared/BottomNav';
import AdminDashboard from './AdminDashboard';
import AdminProfile from './AdminProfile';

const AdminPortal = () => {
  return (
    <div className={`app-container theme-admin`}>
      <div className="app-content">
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/escrow" element={<AdminDashboard />} />
          <Route path="/reports" element={<AdminDashboard />} />
          <Route path="/wallet" element={<AdminDashboard />} />
          <Route path="/profile" element={<AdminProfile />} />
        </Routes>
      </div>
      <BottomNav portal="admin" />
    </div>
  );
};

export default AdminPortal;