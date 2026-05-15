import React, { createContext, useContext, useState, useEffect } from 'react';

const PaymentContext = createContext();

export const usePayment = () => useContext(PaymentContext);

export const PaymentProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [orders, setOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [impactStats, setImpactStats] = useState(null);

  const getBaseUrl = () => import.meta.env.DEV ? '' : 'https://sidequest-backend-bivj.onrender.com';

  const fetchProfile = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${getBaseUrl()}/api/users/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user || data);
      }
    } catch (err) {
      console.error("Failed to fetch profile", err);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await fetch(`${getBaseUrl()}/api/services`);
      const data = await res.json();
      setServices(data);
    } catch (err) {
      console.error("Failed to fetch services", err);
    }
  };

  const fetchOrders = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${getBaseUrl()}/api/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    }
  };

  const fetchNotifications = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${getBaseUrl()}/api/notifications`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  const fetchImpactStats = async () => {
    try {
      const res = await fetch(`${getBaseUrl()}/api/impact`);
      const data = await res.json();
      setImpactStats(data);
    } catch (err) {
      console.error("Failed to fetch impact stats", err);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await fetch(`${getBaseUrl()}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
        return { success: true };
      }
      return { success: false, error: data.debug || data.error || 'Server error' };
    } catch (err) {
      return { success: false, error: 'Network error' };
    }
  };

  const signup = async (userData) => {
    try {
      const res = await fetch(`${getBaseUrl()}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
        return { success: true };
      }
      return { success: false, error: data.debug || data.error || 'Server error' };
    } catch (err) {
      return { success: false, error: 'Network error' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const postService = async (serviceData) => {
    try {
      const res = await fetch(`${getBaseUrl()}/api/services`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(serviceData)
      });
      return await res.json();
    } catch (err) {
      return { success: false, error: 'Server error' };
    }
  };

  const placeOrder = async (serviceId) => {
    try {
      const res = await fetch(`${getBaseUrl()}/api/orders`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ serviceId })
      });
      return await res.json();
    } catch (err) {
      return { success: false, error: 'Server error' };
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const res = await fetch(`${getBaseUrl()}/api/orders/${orderId}/status`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      return await res.json();
    } catch (err) {
      return { success: false, error: 'Server error' };
    }
  };

  const refresh = () => {
    fetchServices();
    fetchOrders();
    fetchNotifications();
    fetchImpactStats();
  };

  useEffect(() => {
    const init = async () => {
      if (token) {
        await fetchProfile();
        refresh();
      }
      setLoading(false);
    };
    init();
    fetchImpactStats();
  }, [token]);

  const value = {
    user, token, loading, services, orders, notifications, impactStats,
    login, signup, logout, refresh, postService, placeOrder, updateOrderStatus
  };

  return <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>;
};
