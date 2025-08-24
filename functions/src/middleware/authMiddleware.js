const {requireSession} = require("@clerk/clerk-sdk-node");

// Middleware to protect routes for clerk.
const authMiddleware = requireSession();

module.exports = {authMiddleware};
