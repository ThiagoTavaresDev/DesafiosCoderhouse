const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://luziethiago:Thiagoff2019@cluster10.vr46o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster10');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;