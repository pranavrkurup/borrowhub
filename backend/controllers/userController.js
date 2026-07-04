 const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper function to generate our "VIP Wristband"
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Token expires in 30 days
    });
};

// @desc    Register a new student
// @route   POST /api/users/register
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // 2. Create the user (this triggers the bcrypt pre-save hook automatically!)
        const user = await User.create({
            name,
            email,
            password,
        });

        // 3. Send back the user data AND the JWT wristband
        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data received' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error during registration', error: error.message });
    }
};

// @desc    Authenticate a user & get token
// @route   POST /api/users/login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find user by email, and explicitly select the password field (since we hid it in the model)
        const user = await User.findOne({ email }).select('+password');

        // 2. Check if user exists AND if the password matches using our model method
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error during login', error: error.message });
    }
};

module.exports = { registerUser, loginUser };
