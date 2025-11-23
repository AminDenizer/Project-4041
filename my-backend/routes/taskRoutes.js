// routes/taskRoutes.js
const express = require('express');
const Task = require('../models/Task'); // Import Task model
const { validateAppId } = require('../middleware/validationMiddleware'); // Import validation middleware

const router = express.Router();

// Get all tasks
router.get('/:appId', validateAppId, async (req, res) => {
    try {
        const tasks = await Task.find({}).sort({ startDate: 1 });
        res.json(tasks.map(task => ({
            id: task._id.toString(),
            ...task._doc,
            startDate: task.startDate,
            endDate: task.endDate
        })));
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch tasks.' });
    }
});

// Add a new task
router.post('/:appId', validateAppId, async (req, res) => {
    const { fa, en, ownerId, startDate, endDate, isComplete } = req.body;
    if (!fa || !en || !ownerId || !startDate || !endDate) {
        return res.status(400).json({ success: false, message: 'All task fields are required.' });
    }
    try {
        const newTask = new Task({ fa, en, ownerId, startDate, endDate, isComplete: isComplete || false });
        await newTask.save();
        res.status(201).json({ success: true, message: 'Task added successfully', task: newTask });
    } catch (error) {
        console.error('Error adding task:', error);
        res.status(500).json({ success: false, message: 'Failed to add task.' });
    }
});

// Update a task
router.put('/:appId/:taskId', validateAppId, async (req, res) => {
    const { taskId } = req.params;
    const { fa, en, ownerId, startDate, endDate, isComplete } = req.body;
    if (!fa || !en || !ownerId || !startDate || !endDate) {
        return res.status(400).json({ success: false, message: 'All task fields are required.' });
    }
    try {
        const updatedTask = await Task.findByIdAndUpdate(taskId, {
            fa, en, ownerId, startDate, endDate, isComplete
        }, { new: true });

        if (!updatedTask) {
            return res.status(404).json({ success: false, message: 'Task not found.' });
        }
        res.json({ success: true, message: 'Task updated successfully', task: updatedTask });
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ success: false, message: 'Failed to update task.' });
    }
});

// Delete a task
router.delete('/:appId/:taskId', validateAppId, async (req, res) => {
    const { taskId } = req.params;
    console.log(`[DELETE Task] Received request for taskId: ${taskId}`);
    try {
        const deletedTask = await Task.findByIdAndDelete(taskId);
        console.log(`[DELETE Task] Result of findByIdAndDelete: ${deletedTask ? 'Document deleted' : 'Document not found'}`);
        if (!deletedTask) {
            return res.status(404).json({ success: false, message: 'Task not found.' });
        }
        res.json({ success: true, message: 'Task deleted successfully.' });
    } catch (error) {
        console.error(`[DELETE Task] Error deleting task (taskId: ${taskId}):`, error);
        res.status(500).json({ success: false, message: 'Failed to delete task.', error: error.message });
    }
});

module.exports = router;
