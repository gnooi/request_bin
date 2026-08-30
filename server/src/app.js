const express = require('express');
const app = express();

app.use(express.json());

const requestsRoutes = require('./routes/requests');

app.use('/', requestsRoutes);

const connectMongo = require('./db/mongo');
connectMongo();

module.exports = app;
