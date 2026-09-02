const { getPool } = require('../db/postgres');

async function findBinsByUserId(userId) {
  const pool = getPool();

  const query = {
    name: 'fetch bins for user',
    text: 'SELECT * FROM bins WHERE user_id = $1',
    values: [userId],
  };

  const result = await pool.query(query);
  return result.rows;
}

async function findBinByName(binName) {
  const pool = getPool();

  const query = {
    name: 'check if endpoint exists in bins',
    text: 'SELECT * FROM bins WHERE bin_name = $1',
    values: [binName],
  };

  const result = await pool.query(query);
  return result.rows;
}

async function createBin(userId, binName) {
  const pool = getPool();

  const query = {
    name: 'adding bin to user',
    text: 'INSERT INTO bins (user_id, bin_name) VALUES ($1, $2) RETURNING *',
    values: [userId, binName],
  };

  const result = await pool.query(query);
  return result.rows[0];
}

module.exports = {
  findBinsByUserId,
  findBinByName,
  createBin,
};
