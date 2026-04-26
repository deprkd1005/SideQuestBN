import React, { createContext, useContext, useState, useEffect } from 'react';

const PaymentContext = createContext();

export const usePayment = () => useContext(PaymentContext);

export const PaymentProvider = ({ children }) => {
  const [balance, setBalance] = useState(0);
  const [walletInfo, setWalletInfo] = useState({ cardNumber: "•••• •••• •••• ••••", holder: "LOADING..." });
  const [jobs, setJobs] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [escrow, setEscrow] = useState({});
  const [chatSessions, setChatSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchState = async () => {
    try {
      const res = await fetch('/api/state');
      if (!res.ok) throw new Error('Backend unreachable');
      const data = await res.json();
      setBalance(data.user.balance);
      setWalletInfo({
        cardNumber: data.user.cardNumber,
        holder: data.user.name
      });
      setJobs(data.jobs);
      setTransactions(data.transactions);
      setEscrow(data.escrow);
      setChatSessions(data.chat.sessions);
    } catch (err) {
      console.error("Failed to fetch state", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchState();
    const interval = setInterval(fetchState, 5000); // Poll for updates
    return () => clearInterval(interval);
  }, []);

  const topUp = async (amount, phone) => {
    const res = await fetch('/api/top-up', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, phone })
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
    const res = await fetch('/api/withdraw', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(details)
    });
    const data = await res.json();
    if (data.success) fetchState();
    return data;
  };

  const signup = async (userData) => {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (data.success) fetchState();
    return data;
  };

  const login = async (credentials) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const data = await res.json();
    if (data.success) fetchState();
    return data;
  };

  return (
    <PaymentContext.Provider value={{
      balance, walletInfo, jobs, transactions, escrow, chatSessions, loading,
      topUp, postJob, acceptJob, completeJob, releaseFunds, withdraw, sendMessage, fetchMessages, signup, login, refresh: fetchState
    }}>
      {children}
    </PaymentContext.Provider>
  );
};
