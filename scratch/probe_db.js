import pg from 'pg';
const { Client } = pg;

const passwords = ['', 'postgres', 'password', 'root', 'admin', '123456'];

async function probe() {
  for (const password of passwords) {
    console.log(`Trying password: "${password}"`);
    const client = new Client({
      user: 'postgres',
      host: '127.0.0.1',
      database: 'postgres',
      password: password,
      port: 5432,
    });
    try {
      await client.connect();
      console.log('SUCCESS! Password is:', password);
      await client.end();
      return;
    } catch (err) {
      console.log('Failed:', err.message);
    }
  }
}

probe();
