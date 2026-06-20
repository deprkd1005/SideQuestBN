import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import routes from './backend/routes/routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend dashboard
app.use(express.static(join(__dirname, 'public')));

// API routes
app.use('/api', routes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'SideQuest Tourism Vertical',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// SPA fallback — serve dashboard for non-API routes
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(join(__dirname, 'public', 'index.html'));
  }
});

app.listen(PORT, () => {
  console.log(`\n╔══════════════════════════════════════════════════════════╗`);
  console.log(`║  🌴  SideQuest Tourism Vertical — Live Server           ║`);
  console.log(`║                                                          ║`);
  console.log(`║  Dashboard:  http://localhost:${PORT}                      ║`);
  console.log(`║  API Base:   http://localhost:${PORT}/api                  ║`);
  console.log(`║  Health:     http://localhost:${PORT}/api/health            ║`);
  console.log(`╚══════════════════════════════════════════════════════════╝\n`);
});

export default app;
