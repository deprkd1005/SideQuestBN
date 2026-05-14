import React from 'react';
import { Routes, Route } from 'react-router-dom';
import BottomNav from '../../shared/BottomNav';
import PosterDashboard from './PosterDashboard';
import ServiceDetails from './ServiceDetails';
import ActiveOrders from './ActiveOrders';
import OrderTracking from './OrderTracking';
import PosterWallet from './PosterWallet';
import PosterMessages from './PosterMessages';
import PosterProfile from './PosterProfile';
import Notifications from '../hustler/Notifications'; // Shared component

const PosterPortal = ({ onAnimation }) => {
  return (
    <div className="theme-customer" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/" element={<PosterDashboard />} />
          <Route path="/service/:id" element={<ServiceDetails />} />
          <Route path="/orders" element={<ActiveOrders />} />
          <Route path="/order/:id" element={<OrderTracking />} />
          <Route path="/wallet" element={<PosterWallet onAnimation={onAnimation} />} />
          <Route path="/messages" element={<PosterMessages />} />
          <Route path="/profile" element={<PosterProfile />} />
          <Route path="/notifications" element={<Notifications />} />
        </Routes>
      </div>
      <BottomNav portal="poster" />
    </div>
  );
};

export default PosterPortal;