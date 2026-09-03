require('dotenv').config({
  path: require('path').resolve(__dirname, '../../.env'),
});

const http = require('http'); // library that creates a HTTP server
const { Server } = require('socket.io'); // library that handles events (requests)
const cron = require('node-cron');
const { app } = require('./app');
const { connectPostgres, getPool } = require('./db/postgres');
const connectMongo = require('./db/mongo.js');
const { purgeOldRequests } = require('./jobs/cleanup');

const PORT = process.env.PORT || 3000;

const start = async () => {
  await connectPostgres();
  await connectMongo();

  const httpServer = http.createServer(app); // creating an HTTP server

  // specifying that the server can accept same resources
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
    },
  });

  // handshake verification of the client using the auth token
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

  // checks when a user visits specific bin page that they are a authorized user
  io.on('connection', (socket) => {
    socket.on('join-bin', async (binName) => {
      try {
        const pool = getPool();
        const binResult = await pool.query(
          'SELECT user_id FROM bins WHERE bin_name = $1',
          [binName],
        );
        // if user doesn't have this bin or
        if (binResult.rows.length === 0) return;
        if (binResult.rows[0].user_id !== socket.userId) return;

        socket.join(binName);
      } catch (err) {
        console.error('Error joining bin room:', err);
      }
    });
  });

  // set up server once so we can use in route handlers
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
