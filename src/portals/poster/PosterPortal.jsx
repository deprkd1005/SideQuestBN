import React from 'react';
import { Routes, Route } from 'react-router-dom';
import BottomNav from '../../shared/BottomNav';
import PosterDashboard from './PosterDashboard';
import ServiceDetails from './ServiceDetails';
import OrderDetails from './OrderDetails';
import PosterActivity from './PosterActivity';
import PostJob from './PostJob';
import Applicants from './Applicants';
import JobTracking from './JobTracking';
import PosterWallet from './PosterWallet';
import PosterMessages from './PosterMessages';
import PosterProfile from './PosterProfile';
import Notifications from '../hustler/Notifications';

const PosterPortal = ({ onAnimation }) => {
  return (
    <div className="theme-customer" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/" element={<PosterDashboard />} />
          <Route path="/service/:id" element={<ServiceDetails />} />
          <Route path="/order/:id" element={<OrderDetails />} />
          <Route path="/my-services" element={<PosterActivity />} />
          <Route path="/orders" element={<PosterActivity />} />
          <Route path="/post-service" element={<PostJob />} />
          <Route path="/post-job" element={<PostJob />} />
          <Route path="/post" element={<PostJob />} />
          <Route path="/applicants/:jobId" element={<Applicants />} />
          <Route path="/tracking/:jobId" element={<JobTracking />} />
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