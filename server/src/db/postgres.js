const { Pool } = require('pg');

let pool;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function connectPostgres(retries = 10, delayMs = 1000) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await pool.query('SELECT 1');
      console.log('PostgreSQL connected');
      return pool;
    } catch (err) {
      console.error(
        `PostgreSQL connection attempt ${attempt}/${retries} failed: ${err.message}`,
      );
      if (attempt === retries) {
        console.error('PostgreSQL connection failed after max retries');
        throw err;
      }
      await sleep(delayMs);
    }
  }
}

function getPool() {
  if (!pool) {
    throw new Error(
      'Postgres pool not initialized — call connectPostgres() first',
    );
  }
  return pool;
}

module.exports = { connectPostgres, getPool };
