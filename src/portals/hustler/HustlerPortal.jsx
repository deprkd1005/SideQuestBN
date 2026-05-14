import React from 'react';
import { Routes, Route } from 'react-router-dom';
import BottomNav from '../../shared/BottomNav';
import HustlerHome from './HustlerHome';
import OrderDetails from './OrderDetails';
import MyServices from './MyServices';
import Wallet from './Wallet';
import Messages from './Messages';
import Profile from './Profile';
import Notifications from './Notifications';
import PostService from './PostService';

const HustlerPortal = ({ onAnimation }) => {
  return (
    <div className="theme-provider" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/" element={<HustlerHome />} />
          <Route path="/order/:id" element={<OrderDetails />} />
          <Route path="/my-services" element={<MyServices />} />
          <Route path="/post-service" element={<PostService />} />
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