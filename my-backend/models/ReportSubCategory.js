// models/ReportSubCategory.js
const mongoose = require('mongoose');

// Report Sub-Category Schema
const ReportSubCategorySchema = new mongoose.Schema({
    fa: { type: String, required: true, unique: true },
    en: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ReportSubCategory', ReportSubCategorySchema);
