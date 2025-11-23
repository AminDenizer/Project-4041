// config/db.js
// Handles the MongoDB connection

const mongoose = require('mongoose');

// MongoDB Connection String - Hardcoded as per your request
const MONGODB_URI = 'mongodb://Denizer:IchBinAminDenizer@mongodb:27017/project_dashboard?authSource=admin';

const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Exit process if MongoDB connection fails
    }
};

module.exports = connectDB;
