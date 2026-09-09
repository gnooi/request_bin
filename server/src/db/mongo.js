const mongoose = require('mongoose');

const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      tls: true,
      tlsCAFile: process.env.MONGO_CA_FILE || './global-bundle.pem',
    });

    console.log('MongoDB/DocumentDB connected');
  } catch (err) {
    console.error('MongoDB/DocumentDB connection error:', err);
    process.exit(1);
  }
};

module.exports = connectMongo;
