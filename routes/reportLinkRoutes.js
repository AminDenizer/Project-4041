// routes/reportLinkRoutes.js
const express = require('express');
const ReportLink = require('../models/ReportLink'); // Import ReportLink model
const { validateAppId } = require('../middleware/validationMiddleware'); // Import validation middleware

const router = express.Router();

// Get all report links
router.get('/:appId', validateAppId, async (req, res) => {
    try {
        const reportLinks = await ReportLink.find({});
        res.json(reportLinks.map(link => ({
            id: link._id.toString(),
            ...link._doc
        })));
    } catch (error) {
        console.error('Error fetching report links:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch report links.' });
    }
});

// Add a new report link
router.post('/:appId', validateAppId, async (req, res) => {
    const { nameFa, nameEn, url, ownerId, reportCategory, reportSubCategory } = req.body;
    if (!nameFa || !nameEn || !url || !ownerId || !reportCategory || !reportSubCategory) {
        return res.status(400).json({ success: false, message: 'All report link fields are required.' });
    }
    try {
        const newReportLink = new ReportLink({ nameFa, nameEn, url, ownerId, reportCategory, reportSubCategory });
        await newReportLink.save();
        res.status(201).json({ success: true, message: 'Report link added successfully', reportLink: newReportLink });
    } catch (error) {
        console.error('Error adding report link:', error);
        res.status(500).json({ success: false, message: 'Failed to add report link.' });
    }
});

// Update a report link
router.put('/:appId/:linkId', validateAppId, async (req, res) => {
    const { linkId } = req.params;
    const { nameFa, nameEn, url, ownerId, reportCategory, reportSubCategory } = req.body;
    if (!nameFa || !nameEn || !url || !ownerId || !reportCategory || !reportSubCategory) {
        return res.status(400).json({ success: false, message: 'All report link fields are required.' });
    }
    try {
        const updatedReportLink = await ReportLink.findByIdAndUpdate(linkId, {
            nameFa, nameEn, url, ownerId, reportCategory, reportSubCategory
        }, { new: true });

        if (!updatedReportLink) {
            return res.status(404).json({ success: false, message: 'Report link not found.' });
        }
        res.json({ success: true, message: 'Report link updated successfully', reportLink: updatedReportLink });
    } catch (error) {
        console.error('Error updating report link:', error);
        res.status(500).json({ success: false, message: 'Failed to update report link.' });
    }
});

// Delete a report link
router.delete('/:appId/:linkId', validateAppId, async (req, res) => {
    const { linkId } = req.params;
    console.log(`[DELETE ReportLink] Received request for linkId: ${linkId}`);
    try {
        const deletedReportLink = await ReportLink.findByIdAndDelete(linkId);
        console.log(`[DELETE ReportLink] Result of findByIdAndDelete: ${deletedReportLink ? 'Document deleted' : 'Document not found'}`);
        if (!deletedReportLink) {
            return res.status(404).json({ success: false, message: 'Report link not found.' });
        }
        res.json({ success: true, message: 'Report link deleted successfully.' });
    } catch (error) {
        console.error(`[DELETE ReportLink] Error deleting report link (linkId: ${linkId}):`, error);
        res.status(500).json({ success: false, message: 'Failed to delete report link.', error: error.message });
    }
});

module.exports = router;
