import express from 'express';
import cors from 'cors';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Simulation State
let state = {
  user: {
    name: "TEST USER",
    phone: "+673819498",
    pin: "12345678",
    balance: 500.00,
    cardNumber: "4532 8194 9800 0001",
    role: 'SEEKER', // Initial role, can be toggled or set on login
    bruVerified: true,
    kycType: "GeneralWorker",
    icColor: "Yellow",
    icNumber: "01-819498",
    isAdmin: false
  },
  // Mock Users for Admin view
  allUsers: [
    { id: 'u1', name: 'Ali Abu', phone: '+6738123456', role: 'SEEKER', bruVerified: true, icColor: 'Yellow' },
    { id: 'u2', name: 'Siti Aminah', phone: '+6738222333', role: 'POSTER', bruVerified: false, icColor: 'Purple' },
    { id: 'u3', name: 'Admin One', phone: '+6739991234', role: 'ADMIN', bruVerified: true, isAdmin: true }
  ],
  jobs: [
    { id: 'q1', title: 'Aircon Servicing & Cleaning', category: 'Home Maintenance', district: 'Brunei-Muara', mukim: 'Gadong A', reward: 45, status: 'open', payer: 'SME_TechFix', description: 'Need 2 aircon units serviced in my office. Must bring own ladder and tools.', duration: '2 Hours', coords: [4.9003, 114.9301], createdAt: new Date().toISOString() },
    { id: 'q2', title: 'Legal Document Translation', category: 'Professional Services', district: 'Brunei-Muara', mukim: 'Kianggeh', reward: 85, status: 'open', payer: 'LawFirmBN', description: 'Translate a 5-page standard legal contract from Malay to English. Must be accurate.', duration: '1 Day', coords: [4.8950, 114.9450], createdAt: new Date().toISOString() },
    { id: 'q3', title: 'Groceries Runner', category: 'Daily Errands', district: 'Belait', mukim: 'Kuala Belait', reward: 15, status: 'open', payer: 'Haji Ali', description: 'Buy groceries at Supa Save and deliver them to my house. List will be provided in chat.', duration: '1 Hour', coords: [4.5833, 114.1833], createdAt: new Date().toISOString() },
    { id: 'q4', title: 'Car Wash & Polish', category: 'Auto Care', district: 'Tutong', mukim: 'Pekan Tutong', reward: 25, status: 'open', payer: 'Tutong Auto', description: 'Full wash and polish for a sedan car. Equipment provided at the shop.', duration: '1.5 Hours', coords: [4.8000, 114.6500], createdAt: new Date().toISOString() },
    { id: 'q5', title: 'Garden Trimming', category: 'Home Maintenance', district: 'Temburong', mukim: 'Bangar', reward: 35, status: 'open', payer: 'EcoLodge', description: 'Trim the bushes around the lodge entrance.', duration: '2 Hours', coords: [4.7088, 115.0747], createdAt: new Date().toISOString() },
    { id: 'q6', title: 'IT Setup Assistance', category: 'Digital Services', district: 'Belait', mukim: 'Seria', reward: 60, status: 'open', payer: 'TechStore', description: 'Help setup 5 new PCs for our new branch.', duration: '4 Hours', coords: [4.6050, 114.3211], createdAt: new Date().toISOString() },
    { id: 'q7', title: 'Event Photography', category: 'Creative', district: 'Tutong', mukim: 'Keriam', reward: 100, status: 'open', payer: 'WeddingCo', description: 'Need an extra photographer for a small wedding event.', duration: '5 Hours', coords: [4.8210, 114.6810], createdAt: new Date().toISOString() },
    { id: 'q8', title: 'Delivery Driver', category: 'Daily Errands', district: 'Brunei-Muara', mukim: 'Sengkurong', reward: 20, status: 'open', payer: 'CafeExpress', description: 'Deliver 10 boxes of pastries to various locations.', duration: '2 Hours', coords: [4.9400, 114.8500], createdAt: new Date().toISOString() },
    { id: 'q9', title: 'Math Tutoring', category: 'Professional Services', district: 'Temburong', mukim: 'Batu Apoi', reward: 30, status: 'open', payer: 'Cikgu Amin', description: 'Tutor a Year 6 student in Math.', duration: '1.5 Hours', coords: [4.7300, 115.1500], createdAt: new Date().toISOString() },
    { id: 'q10', title: 'Plumbing Repair', category: 'Home Maintenance', district: 'Belait', mukim: 'Kuala Balai', reward: 55, status: 'open', payer: 'HomezBN', description: 'Fix a leaking pipe in the kitchen sink.', duration: '1 Hour', coords: [4.5500, 114.2500], createdAt: new Date().toISOString() },
    { id: 'q11', title: 'Graphic Design for Banner', category: 'Creative', district: 'Tutong', mukim: 'Telisai', reward: 75, status: 'open', payer: 'LocalShop', description: 'Design a 3x5 banner for our upcoming sale.', duration: '2 Days', coords: [4.7500, 114.5800], createdAt: new Date().toISOString() },
    { id: 'q12', title: 'Furniture Assembly', category: 'Home Maintenance', district: 'Brunei-Muara', mukim: 'Berakas B', reward: 40, status: 'open', payer: 'IkeaFan', description: 'Assemble a large wardrobe.', duration: '3 Hours', coords: [4.9700, 114.9500], createdAt: new Date().toISOString() },
    { id: 'p1', title: 'Grass Cutting (Home)', category: 'Home Maintenance', district: 'Brunei-Muara', mukim: 'Gadong B', reward: 30, status: 'in_progress', payer: 'TEST USER', description: 'Cut grass for front and back yard. Grass is slightly tall due to rain.', duration: '3 Hours', coords: [4.9103, 114.9201], createdAt: new Date().toISOString() },
    { id: 'p2', title: 'Website Debugging', category: 'Digital Services', district: 'Brunei-Muara', mukim: 'Berakas A', reward: 120, status: 'completed', payer: 'TEST USER', description: 'Fix an issue with React frontend not loading data from the backend correctly.', duration: '5 Hours', coords: [4.9303, 114.9401], createdAt: new Date().toISOString() }
  ],
  escrow: {},
  transactions: [
    { id: 'TX-001', type: 'credit', description: 'Registration Bonus', amount: 50.00, status: 'VERIFIED', date: new Date().toISOString() },
    { id: 'TX-002', type: 'credit', description: 'Top-up (Test Wallet)', amount: 100.00, status: 'VERIFIED', date: new Date().toISOString() }
  ],
  chat: {
    sessions: [
      { id: 'c1', participant: 'SME_TechFix', lastMessage: 'Please bring a tall ladder for the living room unit.', timestamp: new Date().toISOString(), unread: 2 },
      { id: 'c2', participant: 'Haji Ali', lastMessage: 'Did you get the milk? I need the low-fat one.', timestamp: new Date(Date.now() - 3600000).toISOString(), unread: 0 },
      { id: 'c3', participant: 'LawFirmBN', lastMessage: 'The translation looks good, just revising the final page now.', timestamp: new Date(Date.now() - 86400000).toISOString(), unread: 0 }
    ],
    messages: {
      'c1': [
        { id: 'm1', sender: 'SME_TechFix', text: 'Hi! Are you available to service the aircon today?', timestamp: new Date(Date.now() - 50000).toISOString() },
        { id: 'm2', sender: 'Me', text: 'Yes, I can be there by 2 PM.', timestamp: new Date(Date.now() - 40000).toISOString() },
        { id: 'm3', sender: 'SME_TechFix', text: 'Great. Please bring a tall ladder for the living room unit.', timestamp: new Date().toISOString() }
      ],
      'c2': [
        { id: 'm4', sender: 'Me', text: 'I am at the store now, getting the items on your list.', timestamp: new Date(Date.now() - 4000000).toISOString() },
        { id: 'm5', sender: 'Haji Ali', text: 'Did you get the milk? I need the low-fat one.', timestamp: new Date(Date.now() - 3600000).toISOString() }
      ],
      'c3': [
        { id: 'm6', sender: 'Me', text: 'I have attached the first draft of the translation.', timestamp: new Date(Date.now() - 90000000).toISOString() },
        { id: 'm7', sender: 'LawFirmBN', text: 'The translation looks good, just revising the final page now.', timestamp: new Date(Date.now() - 86400000).toISOString() }
      ]
    }
  }
};

// Helper to add transaction with SHA-256 hash
const addTx = (type, amount, status = 'VERIFIED') => {
  const date = new Date().toISOString();
  const txId = `TX-${Math.floor(Math.random() * 9000) + 1000}`;

  // SHA-256 Hashing for Payment Logs (BDCB Compliance Simulation)
  const hashString = `${txId}|${type}|${amount}|${date}`;
  const hash = crypto.createHash('sha256').update(hashString).digest('hex');

  const tx = {
    id: txId,
    type: amount >= 0 ? 'credit' : 'debit',
    description: type,
    amount: Math.abs(amount),
    status,
    date,
    hash
  };
  state.transactions.unshift(tx);
  return tx;
};

// Endpoints
app.get('/api/state', (req, res) => res.json(state));

app.post('/api/auth/signup', (req, res) => {
  const { name, phone, pin, icColor, icNumber, kycType } = req.body;

  let isBruVerified = false;
  if (kycType === 'Student' && icNumber) isBruVerified = true;
  else if (kycType === 'GeneralWorker' && ['Yellow', 'Purple', 'Green'].includes(icColor)) isBruVerified = true;

  const role = phone.includes('999') ? 'ADMIN' : 'SEEKER';

  state.user = {
    name: (name || "Guest").toUpperCase(),
    phone: phone || "0000000",
    balance: 500.00,
    cardNumber: `4532 ${Math.floor(1000 + Math.random() * 8999)} ${Math.floor(1000 + Math.random() * 8999)} ${Math.floor(1000 + Math.random() * 8999)}`,
    role: role,
    bruVerified: isBruVerified,
    kycType: kycType || 'GeneralWorker',
    icColor: icColor || "None",
    icNumber: icNumber || "",
    isAdmin: role === 'ADMIN'
  };
  state.transactions = [{ id: 'TX-001', type: 'Registration Bonus', amount: 50.00, status: 'VERIFIED', date: new Date().toISOString() }];
  res.json({ success: true, user: state.user });
});

app.post('/api/auth/login', (req, res) => {
  const { phone, role } = req.body;
  const normalise = (p) => (p || '').replace(/\s+/g, '').toLowerCase();

  // Prototype Override: Allow any phone with '999' to be Admin
  if (phone && phone.includes('999')) {
    state.user = { ...state.user, role: 'ADMIN', isAdmin: true, phone: phone };
    return res.json({ success: true, user: state.user });
  }

  // Prototype Override: Honor the requested role if provided
  if (role) {
    state.user = { ...state.user, role: role, isAdmin: role === 'ADMIN', phone: phone || state.user.phone };
    return res.json({ success: true, user: state.user });
  }

  // Fallback to existing logic
  if (normalise(phone) === normalise(state.user.phone)) {
    res.json({ success: true, user: state.user });
  } else {
    res.status(401).json({ error: 'User not found' });
  }
});

// Brunei-Specific Payment Integration Points (Replacing Tarus)
app.post('/api/pay/topup', (req, res) => {
  const { amount, method } = req.body; // method: 'BIBD', 'Baiduri'
  setTimeout(() => {
    state.user.balance += parseFloat(amount);
    const tx = addTx(`${method || 'BIBD QuickPay'} Top-up`, parseFloat(amount), 'VERIFIED');
    res.json({ success: true, newBalance: state.user.balance, txHash: tx.hash });
  }, 800);
});

app.post('/api/pay/withdraw', (req, res) => {
  const { amount, bank, account, twoFactorCode } = req.body;
  const numAmount = parseFloat(amount);
  
  console.log(`Withdrawal attempt: ${numAmount} BND from ${state.user.name} (Balance: ${state.user.balance})`);

  if (isNaN(numAmount) || numAmount <= 0) {
    return res.status(400).json({ error: 'Invalid amount' });
  }

  // Prototype Override: If code is '123456' or missing, allow it for demo
  if (twoFactorCode && twoFactorCode !== '123456' && twoFactorCode.length < 3) {
    return res.status(403).json({ error: 'Invalid 2FA Code' });
  }

  if (state.user.balance < numAmount) {
    console.error(`Insufficient funds: ${state.user.balance} < ${numAmount}`);
    return res.status(400).json({ error: 'Insufficient funds' });
  }

  state.user.balance -= numAmount;
  const tx = addTx(`Withdrawal to ${bank} (${account})`, -numAmount);
  console.log(`Withdrawal successful. New balance: ${state.user.balance}`);
  res.json({ success: true, txHash: tx.hash, newBalance: state.user.balance });
});

// Legacy Top Up (Redirected to Tarus in frontend)
app.post('/api/top-up', (req, res) => {
  const { amount } = req.body;
  setTimeout(() => {
    state.user.balance += parseFloat(amount);
    addTx('Top-up (Legacy)', parseFloat(amount));
    res.json({ success: true, newBalance: state.user.balance });
  }, 1000);
});

app.post('/api/jobs', (req, res) => {
  const { title, reward, duration, coords, category, district, mukim } = req.body;
  const numReward = parseFloat(reward);
  if (state.user.balance < numReward) {
    return res.status(400).json({ error: 'Insufficient balance' });
  }

  const newJob = {
    id: `q${state.jobs.length + 1}`,
    title,
    category: category || 'General',
    district: district || 'Brunei-Muara',
    mukim: mukim || 'Gadong A',
    reward: numReward,
    duration,
    status: 'open',
    payer: state.user.name,
    createdAt: new Date().toISOString(),
    coords: coords // Now assuming accurate coords from frontend
  };

  state.jobs.push(newJob);
  state.user.balance -= numReward;
  addTx('Post Quest (Escrow)', -numReward, 'LOCKED');

  res.json({ success: true, job: newJob, newBalance: state.user.balance });
});

app.post('/api/jobs/:id/accept', (req, res) => {
  const job = state.jobs.find(j => j.id === req.params.id);
  if (!job) return res.status(404).json({ error: 'Job not found' });

  job.status = 'assigned';
  state.escrow[job.id] = {
    amount: job.reward,
    worker: 'current_user',
    status: 'LOCKED',
    startTime: new Date().toISOString()
  };

  res.json({ success: true, job });
});

app.post('/api/jobs/:id/complete', (req, res) => {
  const job = state.jobs.find(j => j.id === req.params.id);
  const escrow = state.escrow[job.id];

  if (escrow) {
    escrow.status = 'PROOF_SUBMITTED';
    escrow.proofTime = new Date().toISOString();
    job.status = 'completed';
    res.json({ success: true, escrow });
  } else {
    res.status(404).json({ error: 'Escrow not found' });
  }
});

app.post('/api/jobs/:id/release', (req, res) => {
  const job = state.jobs.find(j => j.id === req.params.id);
  const escrow = state.escrow[job.id];

  if (escrow && escrow.status !== 'RELEASED') {
    escrow.status = 'RELEASED';
    job.status = 'finished';

    // Platform Commission Logic (5%)
    const commission = escrow.amount * 0.05;
    const finalPayout = escrow.amount - commission;

    // We simulate the payout back to a worker. Since we are testing single-user flow:
    // If payer is Me, it means we spent the money. The worker gets it (not our balance).
    // If we are the worker, we would receive it. Assuming we are the worker:
    if (job.payer !== 'Me') {
      state.user.balance += finalPayout;
      addTx('Quest Payout', finalPayout, 'VERIFIED');
      addTx('Platform Commission (5%)', -commission, 'VERIFIED');
    } else {
      // Just log that the quest was finalized from our escrow
      addTx('Escrow Released (Paid to Worker)', 0, 'VERIFIED');
    }

    res.json({ success: true, commission, finalPayout });
  } else {
    res.status(400).json({ error: 'Already released or invalid job' });
  }
});

// Chat Endpoints
app.get('/api/chat/:sessionId', (req, res) => {
  const messages = state.chat.messages[req.params.sessionId] || [];
  res.json(messages);
});

app.post('/api/chat/:sessionId', (req, res) => {
  const { text, sender } = req.body;
  const sessionId = req.params.sessionId;

  if (!state.chat.messages[sessionId]) {
    state.chat.messages[sessionId] = [];
  }

  const newMessage = {
    id: `m${Date.now()}`,
    text,
    sender: sender || 'Me',
    timestamp: new Date().toISOString()
  };

  state.chat.messages[sessionId].push(newMessage);

  const session = state.chat.sessions.find(s => s.id === sessionId);
  if (session) {
    session.lastMessage = text;
    session.timestamp = newMessage.timestamp;
  } else {
    state.chat.sessions.push({
      id: sessionId,
      participant: sender === 'Me' ? 'Poster' : sender,
      lastMessage: text,
      timestamp: newMessage.timestamp
    });
  }

  if (sender === 'Me') {
    setTimeout(() => {
      const replyText = text.toLowerCase().includes('help') ? "I'm on my way!" : "Got it, thanks for the update!";
      const reply = {
        id: `m${Date.now() + 1}`,
        text: replyText,
        sender: session ? session.participant : 'Poster',
        timestamp: new Date().toISOString()
      };
      state.chat.messages[sessionId].push(reply);
      const s = state.chat.sessions.find(s => s.id === sessionId);
      if (s) {
        s.lastMessage = reply.text;
        s.timestamp = reply.timestamp;
      }
    }, 1500);
  }

  res.json({ success: true, message: newMessage });
});

// Admin Only Routes
app.get('/api/admin/users', (req, res) => {
  if (state.user.role !== 'ADMIN') return res.status(403).json({ error: 'Unauthorised' });
  res.json(state.allUsers);
});

app.post('/api/admin/users/:id/verify', (req, res) => {
  if (state.user.role !== 'ADMIN') return res.status(403).json({ error: 'Unauthorised' });
  const user = state.allUsers.find(u => u.id === req.params.id);
  if (user) {
    user.bruVerified = true;
    res.json({ success: true, user });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

app.get('/api/admin/system-health', (req, res) => {
  if (state.user.role !== 'ADMIN') return res.status(403).json({ error: 'Unauthorised' });
  res.json({
    status: 'OPTIMAL',
    uptime: '14 Days',
    escrowTotal: state.jobs.filter(j => j.status === 'assigned').reduce((acc, j) => acc + j.reward, 0),
    activeUsers: state.allUsers.length + 1
  });
});

// Wawasan 2035 Impact Dashboard
app.get('/api/impact', (req, res) => {
  // Simulate some dynamic nation-wide stats
  res.json({
    totalJobsCreated: 12450 + state.jobs.length,
    activeGigWorkers: 3820,
    economicImpactBND: 245000 + state.jobs.reduce((acc, job) => acc + job.reward, 0),
    sectors: [
      { name: 'Home Maintenance', percentage: 40 },
      { name: 'Professional Services', percentage: 25 },
      { name: 'Daily Errands', percentage: 35 }
    ]
  });
});

// Tax-ready Invoicing
app.get('/api/jobs/:id/invoice', (req, res) => {
  const job = state.jobs.find(j => j.id === req.params.id);
  if (!job) return res.status(404).json({ error: 'Job not found' });

  const invoice = {
    invoiceNo: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000) + 1000}`,
    date: new Date().toISOString(),
    billedTo: job.payer,
    provider: state.user.name,
    providerIc: state.user.icNumber,
    service: job.title,
    category: job.category,
    amount: job.reward,
    tax: 0, // No GST in Brunei currently, but placeholder for tax-ready
    total: job.reward,
    status: job.status === 'finished' ? 'PAID' : 'PENDING'
  };

  res.json({ success: true, invoice });
});

// Serve Static Files in Production
app.use(express.static(path.join(__dirname, '../dist')));

// SPA Routing: Handle React Router/Navigation
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
