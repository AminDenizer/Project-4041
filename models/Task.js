// models/Task.js
const mongoose = require('mongoose');

// Task Schema
const TaskSchema = new mongoose.Schema({
    fa: { type: String, required: true },
    en: { type: String, required: true },
    ownerId: { type: String, required: true },
    startDate: { type: String, required: true }, // Storing as YYYY-MM-DD string
    endDate: { type: String, required: true },   // Storing as YYYY-MM-DD string
    isComplete: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', TaskSchema);
