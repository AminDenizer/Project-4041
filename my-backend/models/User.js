// models/User.js
const mongoose = require('mongoose');

// User Schema
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Hashed password
    role: { type: String, enum: ['admin', 'worker'], default: 'worker' },
    isActive: { type: Boolean, default: true },
    timeTableUrl: { type: String, default: null }, // New field for Time Table URL
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
