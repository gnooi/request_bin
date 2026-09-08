const express = require('express');
const cors = require('cors');
const path = require('path')
const app = express();

const { requestRouter } = require('./routes/requestRouter.js');
const requestsRoutes = require('./routes/requests');
const { authRouter } = require('./routes/authRouter.js');
const { authenticate } = require('./middleware/authenticate.js');
const { errorHandler } = require('./middleware/errorHandler.js');

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));

app.use('/api/auth', authRouter);

app.use('/', requestsRoutes);

app.use('/api/bins', express.json(), authenticate, requestRouter);

app.use(express.static(path.join(__dirname, '..', 'dist')))

app.get('/*splat', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

app.use(errorHandler);

module.exports = { app };
