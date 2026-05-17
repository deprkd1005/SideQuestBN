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

  // New states for wallet, chat, and jobs
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [escrow, setEscrow] = useState({});
  const [chatSessions, setChatSessions] = useState([]);
  const [jobs, setJobs] = useState([]);

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
      return { success: false, error: data.error || 'Server error' };
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
      return { success: false, error: data.error || 'Server error' };
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
      // Deduct from local wallet before posting
      const amt = parseFloat(serviceData.price);
      if (balance < amt) {
        return { success: false, error: 'Insufficient balance to escrow this task' };
      }

      const res = await fetch(`${getBaseUrl()}/api/services`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(serviceData)
      });
      const data = await res.json();
      
      if (data.success) {
        const newBalance = balance - amt;
        setBalance(newBalance);
        localStorage.setItem(`wallet_balance_${user?.id}`, newBalance.toString());

        const tx = {
          id: 'tx_' + Math.random().toString(36).substr(2, 9),
          type: 'debit',
          description: `Held in Escrow: ${serviceData.title}`,
          amount: amt,
          date: new Date().toISOString()
        };
        const newTransactions = [tx, ...transactions];
        setTransactions(newTransactions);
        localStorage.setItem(`wallet_txs_${user?.id}`, JSON.stringify(newTransactions));
        
        refresh();
      }
      return data;
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
      const data = await res.json();
      if (data.success) {
        refresh();
      }
      return data;
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

  // Wallet Management
  const updateBalance = (newBalance) => {
    setBalance(newBalance);
    if (user) {
      localStorage.setItem(`wallet_balance_${user.id}`, newBalance.toString());
    }
  };

  const topUp = async (amount, bank) => {
    if (!user) return { success: false, error: 'Not authenticated' };
    const amt = parseFloat(amount);
    const tx = {
      id: 'tx_' + Math.random().toString(36).substr(2, 9),
      type: 'credit',
      description: `Deposit via ${bank}`,
      amount: amt,
      date: new Date().toISOString()
    };
    const newTransactions = [tx, ...transactions];
    setTransactions(newTransactions);
    localStorage.setItem(`wallet_txs_${user.id}`, JSON.stringify(newTransactions));
    
    const newBalance = balance + amt;
    setBalance(newBalance);
    localStorage.setItem(`wallet_balance_${user.id}`, newBalance.toString());
    
    return { success: true, txHash: 'tx_hash_' + Math.random().toString(36).substr(2, 9) };
  };

  const withdraw = async ({ amount, bank, account, twoFactorCode }) => {
    if (!user) return { success: false, error: 'Not authenticated' };
    const amt = parseFloat(amount);
    if (amt > balance) return { success: false, error: 'Insufficient funds' };
    
    const tx = {
      id: 'tx_' + Math.random().toString(36).substr(2, 9),
      type: 'debit',
      description: `Withdraw to ${bank} (****${account.slice(-4)})`,
      amount: amt,
      date: new Date().toISOString()
    };
    const newTransactions = [tx, ...transactions];
    setTransactions(newTransactions);
    localStorage.setItem(`wallet_txs_${user.id}`, JSON.stringify(newTransactions));
    
    const newBalance = balance - amt;
    setBalance(newBalance);
    localStorage.setItem(`wallet_balance_${user.id}`, newBalance.toString());
    
    return { success: true, txHash: 'tx_hash_' + Math.random().toString(36).substr(2, 9) };
  };

  // Chat System
  const fetchMessages = async (sessionId) => {
    const cachedMsgs = localStorage.getItem(`chat_msgs_${sessionId}`);
    if (cachedMsgs) {
      return JSON.parse(cachedMsgs);
    }
    const order = orders.find(o => o.id === sessionId);
    const title = order?.service?.title || 'Quest';
    const partner = user?.role === 'customer' ? order?.provider?.fullname : order?.customer?.fullname;
    const defaultMsgs = [
      {
        id: 'msg_1',
        sender: partner || 'Partner',
        text: `Hello! Thanks for the SideQuest order for "${title}". I'm starting on it now.`,
        timestamp: new Date(Date.now() - 3600000).toISOString()
      }
    ];
    localStorage.setItem(`chat_msgs_${sessionId}`, JSON.stringify(defaultMsgs));
    return defaultMsgs;
  };

  const sendMessage = async (sessionId, text) => {
    const msgs = await fetchMessages(sessionId);
    const newMsg = {
      id: 'msg_' + Math.random().toString(36).substr(2, 9),
      sender: 'Me',
      text: text,
      timestamp: new Date().toISOString()
    };
    const updated = [...msgs, newMsg];
    localStorage.setItem(`chat_msgs_${sessionId}`, JSON.stringify(updated));
    
    setChatSessions(prev => prev.map(s => s.id === sessionId ? { ...s, lastMessage: text, timestamp: newMsg.timestamp } : s));
    
    return { success: true };
  };

  // Jobs mock stubs for backward compatibility
  const postTask = async (taskData) => {
    return { success: true };
  };
  const acceptTask = async (taskId) => {
    return { success: true };
  };

  // Effect to initialize wallet from cache or defaults when user changes
  useEffect(() => {
    if (user) {
      // Balance Sync
      const cachedBalance = localStorage.getItem(`wallet_balance_${user.id}`);
      if (cachedBalance !== null) {
        setBalance(parseFloat(cachedBalance));
      } else {
        const defaultBal = user.role === 'customer' ? 500 : 150;
        setBalance(defaultBal);
        localStorage.setItem(`wallet_balance_${user.id}`, defaultBal.toString());
      }

      // Transactions Sync
      const cachedTxs = localStorage.getItem(`wallet_txs_${user.id}`);
      if (cachedTxs !== null) {
        try {
          setTransactions(JSON.parse(cachedTxs));
        } catch (e) {
          setTransactions([]);
        }
      } else {
        const initialTxs = [
          {
            id: 'tx_init',
            type: 'credit',
            description: 'Welcome Bonus Credit',
            amount: user.role === 'customer' ? 500 : 150,
            date: new Date().toISOString()
          }
        ];
        setTransactions(initialTxs);
        localStorage.setItem(`wallet_txs_${user.id}`, JSON.stringify(initialTxs));
      }
    } else {
      setBalance(0);
      setTransactions([]);
    }
  }, [user]);

  // Effect to handle dynamic Escrow calculation & Self-Healing Syncing
  useEffect(() => {
    if (!user || !orders || orders.length === 0) {
      setEscrow({});
      return;
    }

    // Escrow Calculation
    const heldOrders = orders.filter(o => 
      o.transaction && 
      o.transaction.status === 'held' && 
      (o.customerId === user.id || o.providerId === user.id)
    );
    const escrowObj = {};
    heldOrders.forEach(o => {
      escrowObj[o.id] = {
        amount: parseFloat(o.transaction.amount || 0),
        title: o.service?.title || 'Active Request'
      };
    });
    setEscrow(escrowObj);

    // Sync chat sessions with active/completed orders dynamically
    const sessions = orders.map(o => {
      const partnerName = user.role === 'customer' ? o.provider?.fullname : o.customer?.fullname;
      return {
        id: o.id,
        participant: partnerName || 'Partner',
        unread: false,
        lastMessage: `Hi, let's coordinate about "${o.service?.title}"!`,
        timestamp: o.created_at || new Date().toISOString()
      };
    });
    setChatSessions(sessions);

    // Self-Healing Sync: Credit Provider when orders are completed
    if (user.role === 'provider') {
      const processedOrders = JSON.parse(localStorage.getItem(`processed_orders_${user.id}`) || '[]');
      const completedOrders = orders.filter(o => o.status === 'completed' && o.providerId === user.id && !processedOrders.includes(o.id));
      if (completedOrders.length > 0) {
        let newBalance = balance;
        let newTransactions = [...transactions];
        completedOrders.forEach(o => {
          const amt = parseFloat(o.service?.price || 0);
          newBalance += amt;
          newTransactions.unshift({
            id: 'tx_' + Math.random().toString(36).substr(2, 9),
            type: 'credit',
            description: `Payment Received: ${o.service?.title || 'Service Completed'}`,
            amount: amt,
            date: new Date().toISOString()
          });
          processedOrders.push(o.id);
        });
        setBalance(newBalance);
        setTransactions(newTransactions);
        localStorage.setItem(`wallet_balance_${user.id}`, newBalance.toString());
        localStorage.setItem(`wallet_txs_${user.id}`, JSON.stringify(newTransactions));
        localStorage.setItem(`processed_orders_${user.id}`, JSON.stringify(processedOrders));
      }
    }

    // Self-Healing Sync: Refund Customer when orders are cancelled
    if (user.role === 'customer') {
      const refundedOrders = JSON.parse(localStorage.getItem(`refunded_orders_${user.id}`) || '[]');
      const cancelledOrders = orders.filter(o => o.status === 'cancelled' && o.customerId === user.id && !refundedOrders.includes(o.id));
      if (cancelledOrders.length > 0) {
        let newBalance = balance;
        let newTransactions = [...transactions];
        cancelledOrders.forEach(o => {
          const amt = parseFloat(o.service?.price || 0);
          newBalance += amt;
          newTransactions.unshift({
            id: 'tx_' + Math.random().toString(36).substr(2, 9),
            type: 'credit',
            description: `Escrow Refunded: ${o.service?.title || 'Service Cancelled'}`,
            amount: amt,
            date: new Date().toISOString()
          });
          refundedOrders.push(o.id);
        });
        setBalance(newBalance);
        setTransactions(newTransactions);
        localStorage.setItem(`wallet_balance_${user.id}`, newBalance.toString());
        localStorage.setItem(`wallet_txs_${user.id}`, JSON.stringify(newTransactions));
        localStorage.setItem(`refunded_orders_${user.id}`, JSON.stringify(refundedOrders));
      }
    }
  }, [orders, user]);

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
    balance, transactions, escrow, chatSessions, jobs,
    login, signup, logout, refresh, postService, placeOrder, updateOrderStatus,
    updateBalance, topUp, withdraw, fetchMessages, sendMessage, postTask, acceptTask
  };

    return <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>;
};
