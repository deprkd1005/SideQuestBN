import React from 'react';
import { Routes, Route } from 'react-router-dom';
import BottomNav from '../../shared/BottomNav';
import HustlerDashboard from './HustlerDashboard';
import ServiceDetails from './ServiceDetails';
import ActiveOrders from './ActiveOrders';
import OrderTracking from './OrderTracking';
import Wallet from './Wallet';
import Messages from './Messages';
import Profile from './Profile';
import Notifications from './Notifications';

const HustlerPortal = ({ onAnimation }) => {
  return (
    <div className="theme-provider" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/" element={<HustlerDashboard />} />
          <Route path="/service/:id" element={<ServiceDetails />} />
          <Route path="/orders" element={<ActiveOrders />} />
          <Route path="/order/:id" element={<OrderTracking />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/wallet" element={<Wallet onAnimation={onAnimation} />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<Notifications />} />
        </Routes>
      </div>

      <BottomNav portal="hustler" />
    </div>
  );
};

export default HustlerPortal;