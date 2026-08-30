<<<<<<< Updated upstream
const express = require('express');
const app = express();

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`We are runninggggg!!!!! app running on port: ${PORT}`);
});
=======
require('dotenv').config({
  path: require('path').resolve(__dirname, '../../.env'),
});

const app = require('./app');
const { connectPostgres } = require('./db/postgres');
const connectMongo = require('./db/mongo.js');

const PORT = process.env.PORT || 3000;

const start = async () => {
  await connectPostgres();
  await connectMongo();

  app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
  });
};

start();

// app.get('/health', (req, res) => res.send('ok'));

// app.get('/health/db', async (req, res) => {
//   try {
//     const pgResult = await pool.query('SELECT NOW()');
//     res.json({ postgres: pgResult.rows[0] });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });
>>>>>>> Stashed changes
