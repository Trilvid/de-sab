const mongoose = require('mongoose');

async function connectDb() {
  try {
    mongoose.set('strictQuery', false);
    const db = await mongoose.connect(process.env.DATABASE);
    console.log(`MongoDB Connected: ${db.connection.host}`);
  } catch (e) {
    console.error(`Can't connect to MongoDB: ${e.message}`);
    process.exit(1);
  }
}

module.exports = { connectDb };
