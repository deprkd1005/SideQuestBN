import React from 'react';
import { Routes, Route } from 'react-router-dom';
import BottomNav from '../../shared/BottomNav';
import HustlerHome from './HustlerHome';
import JobDetails from './JobDetails';
import MyJobs from './MyJobs';
import Wallet from './Wallet';
import Messages from './Messages';
import Profile from './Profile';

const HustlerPortal = () => {
  return (
    <div className={`app-container theme-seeker`}>
      <div className="app-content">
        <Routes>
          <Route path="/" element={<HustlerHome />} />
          <Route path="/job/:id" element={<JobDetails />} />
          <Route path="/jobs" element={<MyJobs />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
      <BottomNav portal="hustler" />
    </div>
  );
};

export default HustlerPortal;