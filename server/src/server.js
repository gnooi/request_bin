require('dotenv').config({
  path: require('path').resolve(__dirname, '../../.env'),
});

const { app } = require('./app');
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
