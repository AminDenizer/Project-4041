// routes/userRoutes.js
const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User'); // Import User model
const { validateAppId } = require('../middleware/validationMiddleware'); // Import validation middleware

const router = express.Router();

// Login Endpoint
// Apply validateAppId as middleware here to ensure req.body.appId is validated correctly
router.post('/login', validateAppId, async (req, res) => {
    // appId is now guaranteed to be validated by the validateAppId middleware
    const { username, password } = req.body; 

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username and password are required.' });
    }

    try {
        const user = await User.findOne({ username, isActive: true });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid username or password.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid username or password.' });
        }

        res.json({ success: true, message: 'Login successful', role: user.role, username: user.username, timeTableUrl: user.timeTableUrl || null });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'An error occurred during login.' });
    }
});

// Create User Endpoint
router.post('/createUser', validateAppId, async (req, res) => {
    const { username, password, role, timeTableUrl } = req.body; // appId is validated by middleware

    if (!username || !password || !role) {
        return res.status(400).json({ success: false, message: 'Username, password, and role are required.' });
    }

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ success: false, message: 'User with this username already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            password: hashedPassword,
            role,
            isActive: true,
            timeTableUrl: timeTableUrl || null
        });
        await newUser.save();

        res.status(201).json({ success: true, message: 'User created successfully.' });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ success: false, message: 'Failed to create user.' });
    }
});

// Update User Endpoint
router.post('/updateUser', validateAppId, async (req, res) => {
    const { userId, username, password, role, isActive, timeTableUrl } = req.body; // userId is MongoDB _id

    if (!userId || !username || !role) {
        return res.status(400).json({ success: false, message: 'userId, username, and role are required.' });
    }

    try {
        const updateData = {
            username,
            role,
            isActive,
            timeTableUrl: timeTableUrl || null
        };

        if (password) { // Only update password if provided
            updateData.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        res.json({ success: true, message: 'User updated successfully.' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ success: false, message: 'Failed to update user.' });
    }
});

// Delete User Endpoint
router.delete('/:appId/:userId', validateAppId, async (req, res) => {
    const { userId } = req.params;
    console.log(`[DELETE User] Received request for userId: ${userId}`);

    try {
        const deletedUser = await User.findByIdAndDelete(userId);
        console.log(`[DELETE User] Result of findByIdAndDelete: ${deletedUser ? 'Document deleted' : 'Document not found'}`);
        if (!deletedUser) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }
        res.json({ success: true, message: 'User deleted successfully.' });
    } catch (error) {
        console.error(`[DELETE User] Error deleting user (userId: ${userId}):`, error);
        res.status(500).json({ success: false, message: 'Failed to delete user.', error: error.message });
    }
});

// Endpoint to toggle user active status
router.put('/:appId/:userId/toggle-active', validateAppId, async (req, res) => {
    const { userId } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
        return res.status(400).json({ success: false, message: 'isActive status is required and must be boolean.' });
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(userId, { isActive }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }
        res.json({ success: true, message: 'User active status updated successfully.', user: updatedUser });
    } catch (error) {
        console.error('Error toggling user active status:', error);
        res.status(500).json({ success: false, message: 'Failed to update user active status.' });
    }
});

// Get all users (for populating owner dropdowns on frontend)
router.get('/:appId', validateAppId, async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users.map(user => ({
            id: user._id.toString(),
            ...user._doc,
            password: ''
        })));
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch users.' });
    }
});

module.exports = router;
