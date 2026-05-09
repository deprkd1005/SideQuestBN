import React from 'react';
import { Routes, Route } from 'react-router-dom';
import BottomNav from '../../shared/BottomNav';
import PosterDashboard from './PosterDashboard';
import PostJob from './PostJob';
import Applicants from './Applicants';
import ActiveJobs from './ActiveJobs';
import PosterWallet from './PosterWallet';
import PosterMessages from './PosterMessages';
import PosterProfile from './PosterProfile';
import JobTracking from './JobTracking';

const PosterPortal = ({ onAnimation }) => {
  return (
    <div className="theme-poster" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/" element={<PosterDashboard />} />
          <Route path="/post" element={<PostJob onAnimation={onAnimation} />} />
          <Route path="/applicants/:jobId" element={<Applicants />} />
          <Route path="/tracking/:jobId" element={<JobTracking />} />
          <Route path="/active" element={<ActiveJobs />} />
          <Route path="/wallet" element={<PosterWallet onAnimation={onAnimation} />} />
          <Route path="/messages" element={<PosterMessages />} />
          <Route path="/profile" element={<PosterProfile />} />
        </Routes>
      </div>
      <BottomNav portal="poster" />
    </div>
  );
};

export default PosterPortal;