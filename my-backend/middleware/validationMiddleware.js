// middleware/validationMiddleware.js
// Helper function to validate App ID (used for conceptual project separation, not MongoDB collection names)
function isValidAppId(appId) {
    return typeof appId === 'string' && appId.trim().length > 0;
}

// Middleware to validate appId in request parameters or body
const validateAppId = (req, res, next) => {
    const appId = req.params.appId || req.body.appId;
    if (!isValidAppId(appId)) {
        return res.status(400).json({ success: false, message: 'Invalid appId.' });
    }
    next();
};

module.exports = { validateAppId };
