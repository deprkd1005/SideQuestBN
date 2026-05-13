import pg from 'pg';
const { Pool } = pg;

const configs = [
  { user: 'postgres', host: 'localhost', database: 'postgres', password: '', port: 5432 },
  { user: 'postgres', host: 'localhost', database: 'postgres', password: 'password', port: 5432 },
  { user: 'postgres', host: 'localhost', database: 'postgres', port: 5432 },
];

async function test() {
  for (const config of configs) {
    console.log(`Testing config: ${JSON.stringify(config)}`);
    const pool = new Pool(config);
    try {
      const res = await pool.query('SELECT NOW()');
      console.log('Connected successfully:', res.rows[0]);
      await pool.end();
      return;
    } catch (err) {
      console.error('Connection failed');
    }
    await pool.end();
  }
}

test();
