 const express = require('express');
const router = express.Router();

const { createItem, getItems, requestItem, updateItem } = require('../controllers/itemController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../config/cloudinary');

// GET /api/items -> Anyone can view items (Public)
router.get('/', getItems);

// POST /api/items -> Must be logged in AND upload a single image named 'image'
router.post('/', protect, upload.single('image'), createItem);

// PUT /api/items/:id -> Update item text details (owner only)
router.put('/:id', protect, updateItem);

// PUT/PATCH /api/items/:id/request -> Must be logged in to request an item
router.put('/:id/request', protect, requestItem);
router.patch('/:id/request', protect, requestItem);

module.exports = router;
