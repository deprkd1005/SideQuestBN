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
    name: "AWANG HUSTLER",
    phone: "+673 8812094",
    balance: 50.00,
    cardNumber: "4532 8812 0943 2210",
    bruVerified: true,
    kycType: "GeneralWorker",
    icColor: "Yellow",
    icNumber: "01-123456"
  },
  jobs: [
    { id: 'q1', title: 'Aircon Servicing', category: 'Home Maintenance', district: 'Brunei-Muara', mukim: 'Gadong A', reward: 45, status: 'open', payer: 'SME_TechFix', duration: '2 Hours', coords: [4.9003, 114.9301] },
    { id: 'q2', title: 'Legal Document Translation', category: 'Professional Services', district: 'Brunei-Muara', mukim: 'Kianggeh', reward: 85, status: 'open', payer: 'LawFirmBN', duration: '1 Day', coords: [4.8950, 114.9450] },
    { id: 'q3', title: 'Groceries Runner', category: 'Daily Errands', district: 'Belait', mukim: 'Kuala Belait', reward: 15, status: 'open', payer: 'Haji Ali', duration: '1 Hour', coords: [4.5833, 114.1833] }
  ],
  escrow: {}, 
  transactions: [
    { id: 'TX-001', type: 'Initial', amount: 50.00, status: 'VERIFIED', date: new Date().toISOString() }
  ],
  chat: {
    sessions: [
      { id: 's1', participant: 'Poster1', lastMessage: 'Hello! I am nearby and can help.', timestamp: new Date().toISOString() }
    ],
    messages: {
      's1': [
        { id: 'm1', sender: 'Poster1', text: 'Hello! I am nearby and can help.', timestamp: new Date().toISOString() }
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
    type,
    amount,
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
  
  // Hybrid Verification Logic
  let isBruVerified = false;
  if (kycType === 'Student' && icNumber) {
    isBruVerified = true; // Assuming HND/Degree ID is valid
  } else if (kycType === 'GeneralWorker' && ['Yellow', 'Purple', 'Green'].includes(icColor)) {
    isBruVerified = true;
  }
  
  state.user = {
    name: (name || "Guest").toUpperCase(),
    phone: phone || "0000000",
    balance: 50.00,
    cardNumber: `4532 ${Math.floor(1000+Math.random()*8999)} ${Math.floor(1000+Math.random()*8999)} ${Math.floor(1000+Math.random()*8999)}`,
    bruVerified: isBruVerified,
    kycType: kycType || 'GeneralWorker',
    icColor: icColor || "None",
    icNumber: icNumber || ""
  };
  state.transactions = [{ id: 'TX-001', type: 'Registration Bonus', amount: 50.00, status: 'VERIFIED', date: new Date().toISOString() }];
  res.json({ success: true, user: state.user });
});

app.post('/api/auth/login', (req, res) => {
  const { phone } = req.body;
  if (phone === state.user.phone) {
    res.json({ success: true, user: state.user });
  } else {
    res.status(401).json({ error: 'User not found' });
  }
});

// Tarus API Integration Points
app.post('/api/tarus/topup', (req, res) => {
  const { amount } = req.body;
  setTimeout(() => {
    state.user.balance += parseFloat(amount);
    const tx = addTx('Tarus Network Top-up', parseFloat(amount), 'VERIFIED');
    res.json({ success: true, newBalance: state.user.balance, txHash: tx.hash });
  }, 800); // Simulate real-time Tarus loop
});

app.post('/api/tarus/withdraw', (req, res) => {
  const { amount, bank, account, twoFactorCode } = req.body;
  const numAmount = parseFloat(amount);
  
  // 2FA BDCB Compliance
  if (!twoFactorCode || twoFactorCode.length !== 6) {
    return res.status(403).json({ error: 'Invalid 2FA Code' });
  }

  if (state.user.balance < numAmount) return res.status(400).json({ error: 'Insufficient funds' });
  
  setTimeout(() => {
    state.user.balance -= numAmount;
    const tx = addTx(`Instant Payout via Tarus (${bank})`, -numAmount, 'VERIFIED');
    res.json({ success: true, newBalance: state.user.balance, txHash: tx.hash });
  }, 1200);
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
    payer: 'Me',
    coords: coords || [4.8903 + Math.random()*0.02, 114.9401 + Math.random()*0.02]
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

// Legacy withdraw endpoint
app.post('/api/withdraw', (req, res) => {
  const { amount, bank, account } = req.body;
  const numAmount = parseFloat(amount);
  if (state.user.balance < numAmount) return res.status(400).json({ error: 'Insufficient funds' });
  
  state.user.balance -= numAmount;
  addTx(`Withdraw (${bank})`, -numAmount, 'PENDING');
  res.json({ success: true, newBalance: state.user.balance });
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
    invoiceNo: `INV-${new Date().getFullYear()}-${Math.floor(Math.random()*9000)+1000}`,
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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
