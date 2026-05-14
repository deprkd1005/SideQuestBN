import React, { createContext, useContext, useState, useEffect } from 'react';

const PaymentContext = createContext();

export const usePayment = () => useContext(PaymentContext);

export const PaymentProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('sidequest_token'));
  const [balance, setBalance] = useState(0);
  const [jobs, setJobs] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [impactStats, setImpactStats] = useState(null);

  const fetchWithAuth = async (url, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const baseUrl = import.meta.env.DEV ? '' : 'https://sidequest-backend-bivj.onrender.com';
    const res = await fetch(`${baseUrl}${url}`, { ...options, headers });
    if (res.status === 401 || res.status === 403) {
      // Handle session expiry
      logout();
    }
    return res;
  };

  const fetchState = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      // In this new architecture, we get user data from login/signup. 
      // But we can have a profile endpoint. For now, let's just fetch tasks and other shared state.
      const resTasks = await fetchWithAuth('/api/tasks');
      if (resTasks.ok) {
        const tasks = await resTasks.json();
        setJobs(tasks);
      }
    } catch (err) {
      console.error("Failed to fetch state", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchImpactStats = async () => {
    try {
      const baseUrl = import.meta.env.DEV ? '' : 'https://sidequest-backend-bivj.onrender.com';
      const res = await fetch(`${baseUrl}/api/impact`);
      const data = await res.json();
      setImpactStats(data);
    } catch (err) {
      console.error("Failed to fetch impact stats", err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchState();
    } else {
      setLoading(false);
    }
    fetchImpactStats();
  }, [token]);

  const login = async (credentials) => {
    const baseUrl = import.meta.env.DEV ? '' : 'https://sidequest-backend-bivj.onrender.com';
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const data = await res.json();
    if (data.success) {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('sidequest_token', data.token);
      localStorage.setItem('sidequest_user', JSON.stringify(data.user));
    }
    return data;
  };

  const signup = async (userData) => {
    const baseUrl = import.meta.env.DEV ? '' : 'https://sidequest-backend-bivj.onrender.com';
    const res = await fetch(`${baseUrl}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (data.success) {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('sidequest_token', data.token);
      localStorage.setItem('sidequest_user', JSON.stringify(data.user));
    }
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('sidequest_token');
    localStorage.removeItem('sidequest_user');
  };

  // Restore user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('sidequest_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const postTask = async (taskData) => {
    const res = await fetchWithAuth('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData)
    });
    const data = await res.json();
    if (data.success) fetchState();
    return data;
  };

  const acceptTask = async (taskId) => {
    const res = await fetchWithAuth(`/api/tasks/${taskId}/accept`, { method: 'POST' });
    const data = await res.json();
    if (data.success) fetchState();
    return data;
  };

  const completeTask = async (taskId) => {
    const res = await fetchWithAuth(`/api/tasks/${taskId}/complete`, { method: 'POST' });
    const data = await res.json();
    if (data.success) fetchState();
    return data;
  };

  const releasePayment = async (taskId) => {
    const res = await fetchWithAuth(`/api/tasks/${taskId}/release`, { method: 'POST' });
    const data = await res.json();
    if (data.success) fetchState();
    return data;
  };

  return (
    <PaymentContext.Provider value={{
      user, token, balance, jobs, transactions, loading, impactStats,
      login, signup, logout, postTask, acceptTask, completeTask, releasePayment, refresh: fetchState
    }}>
      {children}
    </PaymentContext.Provider>
  );
};
