import React, { createContext, useContext, useState, useEffect } from 'react';

const PaymentContext = createContext();

export const usePayment = () => useContext(PaymentContext);

export const PaymentProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(500); // Demo Balance for Prototype
  const [walletInfo, setWalletInfo] = useState({ cardNumber: "•••• •••• •••• 8842", holder: "DEMO USER" });
  const [jobs, setJobs] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [escrow, setEscrow] = useState({});
  const [chatSessions, setChatSessions] = useState([]);
  const [impactStats, setImpactStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState([4.9003, 114.9301]); // Default to Gadong for Prototype

  const fetchState = async () => {
    try {
      const res = await fetch('/api/state');
      if (!res.ok) throw new Error('Backend unreachable');
      const data = await res.json();
      if (data && data.user) {
        setUser(data.user);
        setBalance(data.user.balance !== undefined ? Number(data.user.balance) : 0);
        setWalletInfo({
          cardNumber: data.user.cardNumber || "•••• •••• •••• 0000",
          holder: data.user.name || "User",
          role: data.user.role,
          bruVerified: !!data.user.bruVerified,
          icColor: data.user.icColor,
          icNumber: data.user.icNumber,
          isAdmin: !!data.user.isAdmin
        });
      }
      if (data && data.jobs) setJobs(data.jobs);
      if (data && data.transactions) setTransactions(data.transactions);
      if (data && data.escrow) setEscrow(data.escrow);
      if (data && data.chat && data.chat.sessions) setChatSessions(data.chat.sessions);
    } catch (err) {
      console.error("Failed to fetch state", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchState();
    fetchImpactStats();
    const interval = setInterval(fetchState, 5000); // Poll for updates
    return () => clearInterval(interval);
  }, []);

  const fetchImpactStats = async () => {
    try {
      const res = await fetch('/api/impact');
      const data = await res.json();
      setImpactStats(data);
    } catch (err) {
      console.error("Failed to fetch impact stats", err);
    }
  };

  const topUp = async (amount, method) => {
    const res = await fetch('/api/pay/topup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, method })
    });
    const data = await res.json();
    if (data.success) fetchState();
    return data;
  };

  const postJob = async (jobData) => {
    const res = await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jobData)
    });
    const data = await res.json();
    if (data.success) fetchState();
    return data;
  };

  const acceptJob = async (jobId) => {
    const res = await fetch(`/api/jobs/${jobId}/accept`, { method: 'POST' });
    const data = await res.json();
    if (data.success) fetchState();
    return data;
  };

  const completeJob = async (jobId) => {
    const res = await fetch(`/api/jobs/${jobId}/complete`, { method: 'POST' });
    const data = await res.json();
    if (data.success) fetchState();
    return data;
  };

  const releaseFunds = async (jobId) => {
    const res = await fetch(`/api/jobs/${jobId}/release`, { method: 'POST' });
    const data = await res.json();
    if (data.success) fetchState();
    return data;
  };

  const sendMessage = async (sessionId, text) => {
    const res = await fetch(`/api/chat/${sessionId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, sender: 'Me' })
    });
    const data = await res.json();
    if (data.success) fetchState();
    return data;
  };

  const fetchMessages = async (sessionId) => {
    const res = await fetch(`/api/chat/${sessionId}`);
    return await res.json();
  };

  const withdraw = async (details) => {
    const res = await fetch('/api/pay/withdraw', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(details)
    });
    const data = await res.json();
    if (data.success) fetchState();
    return data;
  };

  const setRole = (newRole) => {
     setUser(prev => ({ ...prev, role: newRole }));
  };

  const getAdminUsers = async () => {
     const res = await fetch('/api/admin/users');
     return await res.json();
  };

  const getSystemHealth = async () => {
     const res = await fetch('/api/admin/system-health');
     return await res.json();
  };

  const verifyUser = async (userId) => {
     const res = await fetch(`/api/admin/users/${userId}/verify`, { method: 'POST' });
     return await res.json();
  };

  const signup = async (userData) => {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (data.success) await fetchState();
    return data;
  };

  const login = async (credentials) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const data = await res.json();
    if (data.success) await fetchState();
    return data;
  };

  return (
    <PaymentContext.Provider value={{
      user, balance, setBalance, walletInfo, jobs, transactions, escrow, chatSessions, loading, impactStats, userLocation, setUserLocation,
      topUp, postJob, acceptJob, completeJob, releaseFunds, withdraw, sendMessage, fetchMessages, signup, login, refresh: fetchState, 
      fetchImpactStats, setRole, getAdminUsers, getSystemHealth, verifyUser, updateBalance: setBalance
    }}>

      {children}
    </PaymentContext.Provider>
  );
};
