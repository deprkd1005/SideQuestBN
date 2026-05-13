import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'sidequest_bn',
  password: 'root',
  port: 5432,
});

const schema = `
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  payer_id UUID REFERENCES users(id),
  receiver_id UUID REFERENCES users(id),
  amount DECIMAL(10, 2) NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'held', 'released', 'cancelled')),
  transaction_reference TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES users(id),
  receiver_id UUID REFERENCES users(id),
  task_id UUID REFERENCES tasks(id),
  message TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID REFERENCES tasks(id),
  reviewer_id UUID REFERENCES users(id),
  reviewed_user_id UUID REFERENCES users(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
`;

async function init() {
  try {
    await pool.query(schema);
    console.log('Schema initialized successfully');
  } catch (err) {
    console.error('Error initializing schema:', err);
  } finally {
    await pool.end();
  }
}

init();
