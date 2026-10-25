const mongoose = require('mongoose');

let isMongoConnected = false;

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ganpati_booking';
  try {
    // Attempt connection with 3 sec timeout to fail fast if MongoDB daemon is not active locally
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000
    });
    isMongoConnected = true;
    console.log(`[Database] MongoDB connected successfully to ${mongoURI}`);
  } catch (error) {
    isMongoConnected = false;
    console.warn(`[Database Warning] Could not connect to local MongoDB (${error.message}).`);
    console.warn(`[Database Notice] Falling back to built-in JSON Database Store for local execution.`);
  }
};

const getIsMongoConnected = () => isMongoConnected;

module.exports = { connectDB, getIsMongoConnected };
