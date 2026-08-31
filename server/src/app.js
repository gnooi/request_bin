const express = require('express');
const cors = require('cors');
const app = express();
const parseBody = require('./middleware/parseBody');

app.use(cors());
app.use(express.text({ type: '*/*', limit: '10mb' }));
app.use(parseBody);

const requestsRoutes = require('./routes/requests');

app.use('/', requestsRoutes);

const connectMongo = require('./db/mongo');
connectMongo();

module.exports = app;
