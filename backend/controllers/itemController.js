 const Item = require('../models/Item');

// @desc    Create a new item listing
// @route   POST /api/items
// @access  Private
const createItem = async (req, res) => {
    try {   
        const { title, description, category, condition } = req.body;

        // 1. Ensure an image was successfully uploaded to Cloudinary by Multer
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload an image for the item' });
        }

        // 2. Create the Item in MongoDB
        const item = await Item.create({
            ownerId: req.user._id, // Got this from our 'protect' Bouncer!
            title,
            description,
            category,
            condition,
            imageUrl: req.file.path, // Got this from Cloudinary via Multer!
        });

        res.status(201).json(item);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error creating item', error: error.message });
    }
};

// @desc    Get all available items
// @route   GET /api/items
// @access  Public
const getItems = async (req, res) => {
    try {
        // Find items that are 'Available' and populate the owner's name and email
        const items = await Item.find({ status: 'Available' })
            .populate('ownerId', 'name email')
            .sort({ createdAt: -1 }); // Newest first
            
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Server Error fetching items' });
    }
};

module.exports = { createItem, getItems };
