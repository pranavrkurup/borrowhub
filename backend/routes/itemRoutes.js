 const express = require('express');
const router = express.Router();

const { createItem, getItems } = require('../controllers/itemController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../config/cloudinary');

// GET /api/items -> Anyone can view available items (Public)
router.get('/', getItems);

// POST /api/items -> Must be logged in AND upload a single image named 'image'
router.post('/', protect, upload.single('image'), createItem);

module.exports = router;
