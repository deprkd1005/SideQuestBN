import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Simulation State
let state = {
  wallet: {
    balance: 50.00,
    cardNumber: "4532 8812 0943 2210",
    holder: "AWANG HUSTLER"
  },
  jobs: [
    { id: 'q1', title: 'Grass Cutting', reward: 25, status: 'open', payer: 'Poster1', duration: '2 Hours', coords: [4.8903, 114.9401] },
    { id: 'q2', title: 'Deliver Package', reward: 15, status: 'open', payer: 'Poster2', duration: '1 Hour', coords: [4.8950, 114.9450] }
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

// Helper to add transaction
const addTx = (type, amount, status = 'VERIFIED') => {
  const tx = {
    id: `TX-${Math.floor(Math.random() * 9000) + 1000}`,
    type,
    amount,
    status,
    date: new Date().toISOString()
  };
  state.transactions.unshift(tx);
  return tx;
};

// Endpoints
app.get('/api/state', (req, res) => res.json(state));

app.post('/api/top-up', (req, res) => {
  const { amount, phone } = req.body;
  setTimeout(() => {
    state.wallet.balance += parseFloat(amount);
    addTx('Top-up (Tarus)', parseFloat(amount));
    res.json({ success: true, newBalance: state.wallet.balance });
  }, 1000);
});

app.post('/api/jobs', (req, res) => {
  const { title, reward, duration, coords } = req.body;
  const numReward = parseFloat(reward);
  if (state.wallet.balance < numReward) {
    return res.status(400).json({ error: 'Insufficient balance' });
  }
  
  const newJob = {
    id: `q${state.jobs.length + 1}`,
    title,
    reward: numReward,
    duration,
    status: 'open',
    payer: 'Me',
    coords: coords || [4.8903 + Math.random()*0.02, 114.9401 + Math.random()*0.02]
  };
  
  state.jobs.push(newJob);
  state.wallet.balance -= numReward;
  addTx('Post Quest (Escrow)', -numReward, 'LOCKED');
  
  res.json({ success: true, job: newJob, newBalance: state.wallet.balance });
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
    addTx('Quest Payout', escrow.amount, 'VERIFIED');
    res.json({ success: true });
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

app.post('/api/withdraw', (req, res) => {
  const { amount, bank, account } = req.body;
  const numAmount = parseFloat(amount);
  if (state.wallet.balance < numAmount) return res.status(400).json({ error: 'Insufficient funds' });
  
  state.wallet.balance -= numAmount;
  addTx(`Withdraw (${bank})`, -numAmount, 'PENDING');
  res.json({ success: true, newBalance: state.wallet.balance });
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
