// models/ReportLink.js
const mongoose = require('mongoose');

// Report Link Schema
const ReportLinkSchema = new mongoose.Schema({
    nameFa: { type: String, required: true },
    nameEn: { type: String, required: true },
    url: { type: String, required: true },
    ownerId: { type: String, required: true },
    reportCategory: { type: String, required: true }, // Storing English category
    reportSubCategory: { type: String, required: true }, // Storing English sub-category
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ReportLink', ReportLinkSchema);
