const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile } = require('../controllers/userController');
// Import the bouncer
const { protect } = require('../middlewares/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);

// Apply the 'protect' middleware BEFORE the controller
router.get('/profile', protect, getUserProfile);

module.exports = router;