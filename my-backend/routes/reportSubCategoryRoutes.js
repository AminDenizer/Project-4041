// routes/reportSubCategoryRoutes.js
const express = require('express');
const ReportSubCategory = require('../models/ReportSubCategory'); // Import ReportSubCategory model
const { validateAppId } = require('../middleware/validationMiddleware'); // Import validation middleware

const router = express.Router();

// Get all report sub-categories
router.get('/:appId', validateAppId, async (req, res) => {
    try {
        const subCategories = await ReportSubCategory.find({});
        res.json(subCategories.map(subCat => ({
            id: subCat._id.toString(),
            ...subCat._doc
        })));
    } catch (error) {
        console.error('Error fetching report sub-categories:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch report sub-categories.' });
    }
});

// Add a new report sub-category
router.post('/:appId', validateAppId, async (req, res) => {
    const { fa, en } = req.body;
    if (!fa || !en) {
        return res.status(400).json({ success: false, message: 'Persian and English names for sub-category are required.' });
    }
    try {
        const newSubCategory = new ReportSubCategory({ fa, en });
        await newSubCategory.save();
        res.status(201).json({ success: true, message: 'Sub-category added successfully', subCategory: newSubCategory });
    } catch (error) {
        console.error('Error adding sub-category:', error);
        res.status(500).json({ success: false, message: 'Failed to add sub-category.' });
    }
});

// Update a report sub-category
router.put('/:appId/:subCategoryId', validateAppId, async (req, res) => {
    const { subCategoryId } = req.params;
    const { fa, en } = req.body;
    if (!fa || !en) {
        return res.status(400).json({ success: false, message: 'Persian and English names for sub-category are required.' });
    }
    try {
        const updatedSubCategory = await ReportSubCategory.findByIdAndUpdate(subCategoryId, { fa, en }, { new: true });
        if (!updatedSubCategory) {
            return res.status(404).json({ success: false, message: 'Sub-category not found.' });
        }
        res.json({ success: true, message: 'Sub-category updated successfully', subCategory: updatedSubCategory });
    } catch (error) {
        console.error('Error updating sub-category:', error);
        res.status(500).json({ success: false, message: 'Failed to update sub-category.' });
    }
});

// Delete a report sub-category
router.delete('/:appId/:subCategoryId', validateAppId, async (req, res) => {
    const { subCategoryId } = req.params;
    console.log(`[DELETE SubCategory] Received request for subCategoryId: ${subCategoryId}`);
    try {
        const deletedSubCategory = await ReportSubCategory.findByIdAndDelete(subCategoryId);
        console.log(`[DELETE SubCategory] Result of findByIdAndDelete: ${deletedSubCategory ? 'Document deleted' : 'Document not found'}`);
        if (!deletedSubCategory) {
            return res.status(404).json({ success: false, message: 'Sub-category not found.' });
        }
        res.json({ success: true, message: 'Sub-category deleted successfully.' });
    } catch (error) {
        console.error(`[DELETE SubCategory] Error deleting sub-category (subCategoryId: ${subCategoryId}):`, error);
        res.status(500).json({ success: false, message: 'Failed to delete sub-category.', error: error.message });
    }
});

module.exports = router;
