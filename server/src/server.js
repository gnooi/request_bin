require('dotenv').config({
  path: require('path').resolve(__dirname, '../../.env'),
});

const cron = require('node-cron')
const { app } = require('./app');
const { connectPostgres } = require('./db/postgres');
const connectMongo = require('./db/mongo.js');
const { purgeOldRequests } = require('./jobs/cleanup')

const PORT = process.env.PORT || 3000;

const start = async () => {
  await connectPostgres();
  await connectMongo();

  app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
  });
  
  // purges at 3AM every day
  cron.schedule('0 3 * * *', async () => {
    try {
      await purgeOldRequests()
    } catch (e) {
      console.error(`Scheduled purge failed: ${e}`)
    }
  })
};


start();
