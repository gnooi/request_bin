const express = require('express');
const cors = require('cors');
const app = express();

const { requestRouter } = require('./routes/requestRouter.js');
const requestsRoutes = require('./routes/requests');
const { authenticate } = require('./middleware/authenticate.js');
const { errorHandler } = require('./middleware/errorHandler.js');

app.use(cors());

app.get('/', (req, res) => {
  res.send('Request Bin API');
});

// Pair B: webhook capture + request listing
app.use('/', requestsRoutes);

// Pair A: bin/user management — needs parsed JSON bodies
app.use('/api/bins', express.json(), authenticate, requestRouter);

app.use(errorHandler);

module.exports = { app };
