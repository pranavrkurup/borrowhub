const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    // 1. Check if the Authorization header exists and starts with "Bearer"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // 2. Extract the token (Header looks like: "Bearer eyJhbG...")
            token = req.headers.authorization.split(' ')[1];

            // 3. Verify the token using our secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 4. Find the user in the database, but DO NOT fetch the password
            req.user = await User.findById(decoded.id).select('-password');

            // 5. Let the user through to the controller
            next();
        } catch (error) {
            console.error("Token verification failed:", error);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    // If no token was found at all
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token provided' });
    }
};

module.exports = { protect };