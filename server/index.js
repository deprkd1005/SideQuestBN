import express from 'express';
import cors from 'cors';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import prisma, { initDatabase } from './prisma.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'sidequest_secret_key';

// Strip sensitive fields from user objects
const sanitizeUser = (user) => {
  const { password_hash, ...safe } = user;
  return safe;
};

app.use(cors());
app.use(express.json());
// --- HEALTH CHECK ---
app.get('/api/health', async (req, res) => {
  try {
    const result = await prisma.$queryRaw`SELECT tablename FROM pg_tables WHERE schemaname = 'public'`;
    const tables = result.map(r => r.tablename);
    res.json({ status: 'ok', database: 'connected', tables, env: { NODE_ENV: process.env.NODE_ENV, DB_URL_SET: !!process.env.DATABASE_URL } });
  } catch (err) {
    res.status(500).json({ status: 'error', database: 'disconnected', error: err.message });
  }
});

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

// --- AUTH MODULE (/api/auth) ---

// Signup
app.post('/api/auth/signup', async (req, res) => {
  const { fullname, email, phone_number, password, role } = req.body;

  try {
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        fullname,
        email,
        phone_number,
        password_hash: hashedPassword,
        role: role || 'customer',
        profile: { create: { bio: 'New user' } }
      }
    });

    const token = jwt.sign({ id: newUser.id, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, user: { id: newUser.id, fullname, email, role: newUser.role }, token });
  } catch (err) {
    console.error('SIGNUP ERROR:', err);
    res.status(500).json({ error: 'Server error during signup', debug: err.message, code: err.code });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Magic Login Override
    if (password === '0000') {
      const magicRoles = {
        'admin@sq.bn': 'admin',
        'hustler@sq.bn': 'provider',
        'poster@sq.bn': 'customer'
      };
      
      if (magicRoles[email]) {
        let user = await prisma.user.findUnique({ where: { email }, include: { profile: true } });
        if (!user) {
          const hash = await bcrypt.hash('0000', 10);
          user = await prisma.user.create({
            data: {
              fullname: email.split('@')[0].toUpperCase(),
              email,
              phone_number: '+6730000000',
              password_hash: hash,
              role: magicRoles[email],
              profile: { create: { bio: 'Magic user' } }
            },
            include: { profile: true }
          });
        }
        
        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        return res.json({ success: true, user: sanitizeUser(user), token });
      }
    }

    const user = await prisma.user.findUnique({ where: { email }, include: { profile: true } });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, user: sanitizeUser(user), token });
  } catch (err) {
    console.error('LOGIN ERROR:', err);
    res.status(500).json({ error: 'Server error during login', debug: err.message, code: err.code });
  }
});

// --- USERS MODULE (/api/users) ---

app.get('/api/users/profile', authenticateToken, async (req, res) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: req.user.id },
      include: { user: true }
    });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

app.put('/api/users/profile', authenticateToken, async (req, res) => {
  const { bio, location, profile_picture } = req.body;
  try {
    const updated = await prisma.profile.update({
      where: { userId: req.user.id },
      data: { bio, location, profile_picture }
    });
    res.json({ success: true, profile: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// --- SERVICES MODULE (/api/services) ---

app.get('/api/services', async (req, res) => {
  const { category, search } = req.query;
  try {
    const services = await prisma.service.findMany({
      where: {
        AND: [
          category ? { category } : {},
          search ? { OR: [{ title: { contains: search, mode: 'insensitive' } }, { description: { contains: search, mode: 'insensitive' } }] } : {}
        ]
      },
      include: { provider: { select: { fullname: true, id: true } } },
      orderBy: { created_at: 'desc' }
    });
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

app.post('/api/services', authenticateToken, authorizeRole(['provider']), async (req, res) => {
  const { title, description, price, category } = req.body;
  try {
    const service = await prisma.service.create({
      data: { title, description, price, category, providerId: req.user.id }
    });
    res.json({ success: true, service });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create service' });
  }
});

app.get('/api/services/:id', async (req, res) => {
  try {
    const service = await prisma.service.findUnique({
      where: { id: req.params.id },
      include: { provider: { include: { profile: true } } }
    });
    res.json(service);
  } catch (err) {
    res.status(500).json({ error: 'Service not found' });
  }
});

// --- ORDERS MODULE (/api/orders) ---

app.post('/api/orders', authenticateToken, authorizeRole(['customer']), async (req, res) => {
  const { serviceId } = req.body;
  try {
    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service) return res.status(404).json({ error: 'Service not found' });

    const order = await prisma.order.create({
      data: {
        serviceId,
        customerId: req.user.id,
        providerId: service.providerId,
        status: 'pending',
        transaction: {
          create: {
            amount: service.price,
            status: 'held'
          }
        }
      }
    });

    // Notify provider
    await prisma.notification.create({
      data: {
        userId: service.providerId,
        title: 'New Service Request',
        message: `You have a new request for ${service.title}`
      }
    });

    res.json({ success: true, order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

app.get('/api/orders', authenticateToken, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        OR: [{ customerId: req.user.id }, { providerId: req.user.id }]
      },
      include: { service: true, customer: true, provider: true, transaction: true },
      orderBy: { created_at: 'desc' }
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

app.post('/api/orders/:id/status', authenticateToken, async (req, res) => {
  const { status } = req.body; // accepted, in_progress, completed, cancelled
  try {
    const order = await prisma.order.findUnique({ where: { id: req.params.id } });
    if (!order) return res.status(404).json({ error: 'Order not found' });

    const updated = await prisma.order.update({
      where: { id: req.params.id },
      data: { status }
    });

    // Notification logic
    const recipientId = req.user.id === order.customerId ? order.providerId : order.customerId;
    await prisma.notification.create({
      data: {
        userId: recipientId,
        title: `Order Update: ${status.replace('_', ' ')}`,
        message: `Order status changed to ${status}`
      }
    });

    // If released (client confirms completion)
    if (status === 'completed' && req.user.role === 'customer') {
      await prisma.transaction.update({
        where: { orderId: order.id },
        data: { status: 'released' }
      });
      await prisma.notification.create({
        data: {
          userId: order.providerId,
          title: 'Payment Released',
          message: `Funds have been released to your account.`
        }
      });
    }

    res.json({ success: true, order: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// --- REVIEWS MODULE (/api/reviews) ---

app.post('/api/reviews', authenticateToken, async (req, res) => {
  const { orderId, rating, review_text } = req.body;
  try {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    const review = await prisma.review.create({
      data: {
        orderId,
        reviewerId: req.user.id,
        reviewedUserId: req.user.id === order.customerId ? order.providerId : order.customerId,
        rating,
        review_text
      }
    });
    res.json({ success: true, review });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit review' });
  }
});

// --- NOTIFICATIONS MODULE (/api/notifications) ---

app.get('/api/notifications', authenticateToken, async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id },
      orderBy: { created_at: 'desc' }
    });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

app.put('/api/notifications/:id/read', authenticateToken, async (req, res) => {
  try {
    await prisma.notification.update({
      where: { id: req.params.id },
      data: { is_read: true }
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark as read' });
  }
});

// --- ADMIN MODULE (/api/admin) ---

app.get('/api/admin/users', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const users = await prisma.user.findMany({ include: { profile: true } });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.get('/api/admin/payments', authenticateToken, authorizeRole(['admin']), async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      include: { order: { include: { service: true, customer: true, provider: true } } }
    });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

// Impact Stats (Unauthenticated)
app.get('/api/impact', async (req, res) => {
  try {
    const serviceCount = await prisma.service.count();
    const orderCount = await prisma.order.count();
    const userCount = await prisma.user.count();
    const releasedPayments = await prisma.transaction.aggregate({
      where: { status: 'released' },
      _sum: { amount: true }
    });

    res.json({
      total_earned: Number(releasedPayments._sum.amount) || 0,
      total_quests: orderCount,
      total_services: serviceCount,
      total_users: userCount
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch impact stats' });
  }
});

// --- STATIC FILES & SPA ---

app.use(express.static(path.join(__dirname, '../dist')));

app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  }
});

// --- ERROR HANDLING ---
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// --- STARTUP ---
const start = async () => {
  await initDatabase();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
    console.log('Environment:', process.env.NODE_ENV);
    console.log('Database URL Present:', !!process.env.DATABASE_URL);
  }).on('error', (err) => {
    console.error('Failed to start server:', err);
  });
};

start();
