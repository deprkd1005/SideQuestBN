import React, { createContext, useContext, useState, useEffect } from 'react';

const TourismPaymentContext = createContext();

export const useTourismPayment = () => useContext(TourismPaymentContext);

export const TourismPaymentProvider = ({ children }) => {
  const [dbState, setDbState] = useState({
    users: [],
    host_profiles: [],
    activities: [],
    bookings: []
  });
  const [loading, setLoading] = useState(true);
  const [travelerBalance, setTravelerBalance] = useState(() => {
    const saved = localStorage.getItem('tourism_traveler_balance');
    return saved !== null ? parseFloat(saved) : 250.00;
  });
  const [host1Balance, setHost1Balance] = useState(() => {
    const saved = localStorage.getItem('tourism_host1_balance');
    return saved !== null ? parseFloat(saved) : 150.00;
  });
  const [host2Balance, setHost2Balance] = useState(() => {
    const saved = localStorage.getItem('tourism_host2_balance');
    return saved !== null ? parseFloat(saved) : 80.00;
  });

  const [notifications, setNotifications] = useState([]);

  // Sync balances to local storage
  useEffect(() => {
    localStorage.setItem('tourism_traveler_balance', travelerBalance.toString());
  }, [travelerBalance]);

  useEffect(() => {
    localStorage.setItem('tourism_host1_balance', host1Balance.toString());
  }, [host1Balance]);

  useEffect(() => {
    localStorage.setItem('tourism_host2_balance', host2Balance.toString());
  }, [host2Balance]);

  // Fetch complete mock database from backend
  const fetchDb = async () => {
    try {
      const res = await fetch('/api/_test/db');
      if (res.ok) {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const data = await res.json();
          setDbState(data);
          return;
        }
      }
      throw new Error('API unavailable or returned non-JSON');
    } catch (e) {
      console.warn('Network error fetching mock database, using local fallback:', e);
      import('../utils/mockDb').then(module => {
        setDbState(module.localMockDb);
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDb();
  }, []);

  // Book an activity & lock funds in escrow
  const createBooking = async (activityId, date, timeSlot, participantCount) => {
    try {
      const res = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activity_id: activityId,
          tourist_user_id: 'usr_traveler_001',
          booking_date: date,
          booking_time_slot: timeSlot,
          participant_count: participantCount
        })
      });
      const data = await res.json();
      if (data.success) {
        // Deduct from traveler balance
        setTravelerBalance(prev => Math.max(0, prev - parseFloat(data.booking.gross_amount)));
        // Add transaction notification
        addNotification(`Funds escrow locked: BND ${parseFloat(data.booking.gross_amount).toFixed(2)} for ${data.booking.activity_id}`);
        await fetchDb();
        return { success: true, booking: data.booking };
      } else {
        return { success: false, error: data.message || data.error };
      }
    } catch (e) {
      console.error('Booking error:', e);
      return { success: false, error: 'Network error creating booking.' };
    }
  };

  // Initialize payout & run AML whitelist verification
  const initializePayout = async (bookingId, hostUserId, partnerWalletType) => {
    try {
      const res = await fetch('/api/payout/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          booking_id: bookingId,
          host_user_id: hostUserId,
          partner_wallet_type: partnerWalletType
        })
      });
      const data = await res.json();
      if (data.success) {
        // Add to host's balance based on which host is claiming
        const payoutAmount = parseFloat(data.payout_amount);
        if (hostUserId === 'usr_host_001') {
          setHost1Balance(prev => prev + payoutAmount);
        } else if (hostUserId === 'usr_host_002') {
          setHost2Balance(prev => prev + payoutAmount);
        }
        addNotification(`Payout released successfully: BND ${payoutAmount.toFixed(2)} to host via ${partnerWalletType}`);
        await fetchDb();
        return { success: true, data };
      } else {
        addNotification(`ALERT: Payout blocked! ${data.message || data.error}`);
        await fetchDb();
        return { success: false, error: data.message || data.error, aml_status: data.aml_status };
      }
    } catch (e) {
      console.error('Payout initialization error:', e);
      return { success: false, error: 'Network error initializing payout.' };
    }
  };

  // Reset database state
  const resetDb = async () => {
    try {
      const res = await fetch('/api/_test/db/reset', { method: 'POST' });
      if (res.ok) {
        setTravelerBalance(250.00);
        setHost1Balance(150.00);
        setHost2Balance(80.00);
        setNotifications([]);
        await fetchDb();
        return { success: true };
      }
    } catch (e) {
      console.error('Reset database error:', e);
    }
    return { success: false };
  };

  // Internal helper to add logs / notifications
  const addNotification = (text) => {
    const newNotification = {
      id: 'notif_' + Date.now() + '_' + Math.floor(Math.random() * 100),
      text,
      timestamp: new Date().toISOString()
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  return (
    <TourismPaymentContext.Provider value={{
      dbState,
      loading,
      travelerBalance,
      host1Balance,
      host2Balance,
      notifications,
      createBooking,
      initializePayout,
      resetDb,
      fetchDb,
      setTravelerBalance,
      setHost1Balance,
      setHost2Balance
    }}>
      {children}
    </TourismPaymentContext.Provider>
  );
};
