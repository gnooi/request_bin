require('dotenv').config({
  path: require('path').resolve(__dirname, '../../.env'),
});

const http = require('http');
const { Server } = require('socket.io');
const cron = require('node-cron');
const { app } = require('./app');
const { connectPostgres, getPool } = require('./db/postgres');
const connectMongo = require('./db/mongo.js');
const { purgeOldRequests } = require('./jobs/cleanup');

const PORT = process.env.PORT || 3000;

const start = async () => {
  await connectPostgres();
  await connectMongo();

  const httpServer = http.createServer(app);

  // instantiating web socket instance
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
    },
  });

  // authorizing requests over the web socket
  io.use(async (socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Authorization token missing'));

    try {
      const pool = getPool();
      const idQuery = {
        name: 'fetch_user_id',
        text: `SELECT users.id FROM users WHERE users.token = $1`,
        values: [token],
      };
      const idQueryResult = await pool.query(idQuery);

      if (idQueryResult.rows.length === 0)
        return next(new Error('Invalid token'));

      socket.userId = idQueryResult.rows[0].id;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  // starting the web socket connection
  io.on('connection', (socket) => {
    socket.on('join-bin', async (binName) => {
      try {
        const pool = getPool();
        const binResult = await pool.query(
          'SELECT user_id FROM bins WHERE bin_name = $1',
          [binName],
        );

        if (binResult.rows.length === 0) return;
        if (binResult.rows[0].user_id !== socket.userId) return;

        socket.join(binName);
      } catch (err) {
        console.error('Error joining bin room:', err);
      }
    });
  });

  app.set('io', io);

  // starting app
  httpServer.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
  });

  // cron job purges at 3AM every day
  cron.schedule('0 3 * * *', async () => {
    try {
      await purgeOldRequests();
    } catch (e) {
      console.error(`Scheduled purge failed: ${e}`);
    }
  });
};

start();
