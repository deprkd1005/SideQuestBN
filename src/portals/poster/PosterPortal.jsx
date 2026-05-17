import React from 'react';
import { Routes, Route } from 'react-router-dom';
import BottomNav from '../../shared/BottomNav';
import PosterHome from './PosterHome';
import OrderDetails from './OrderDetails';
import MyServices from './MyServices';
import PostService from './PostService';
import PosterWallet from './PosterWallet';
import PosterMessages from './PosterMessages';
import PosterProfile from './PosterProfile';
import Notifications from '../hustler/Notifications';

const PosterPortal = ({ onAnimation }) => {
  return (
    <div className="theme-customer" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/" element={<PosterHome />} />
          <Route path="/order/:id" element={<OrderDetails />} />
          <Route path="/my-services" element={<MyServices />} />
          <Route path="/post-service" element={<PostService />} />
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