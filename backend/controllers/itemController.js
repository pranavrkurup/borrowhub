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

// @desc    Get items with optional search & category filtering
// @route   GET /api/items?search=keyword&category=Electronics
// @access  Public
const getItems = async (req, res) => {
    try {
        const { search, category } = req.query;

        // Build a dynamic filter object based on the query parameters
        const filter = {};

        // If a category is provided (and it's not 'All'), filter for exact matches
        if (category && category !== 'All') {
            filter.category = category;
        }

        // If a search string is provided, match against title OR description
        if (search && search.trim() !== '') {
            const searchRegex = { $regex: search.trim(), $options: 'i' };
            filter.$or = [
                { title: searchRegex },
                { description: searchRegex },
            ];
        }

        const items = await Item.find(filter)
            .populate('ownerId', 'name email')
            .sort({ createdAt: -1 }); // Newest first

        res.json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error fetching items' });
    }
};

// @desc    Request to borrow an item (change status from Available to Requested)
// @route   PUT /api/items/:id/request
// @access  Private
const requestItem = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Ensure owner cannot request their own item
        if (item.ownerId.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: 'You cannot request your own item' });
        }

        // Ensure item is currently Available
        if (item.status !== 'Available') {
            return res.status(400).json({ message: `Item is not available for request (current status: ${item.status})` });
        }

        item.status = 'Requested';
        await item.save();

        await item.populate('ownerId', 'name email');

        res.json(item);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error requesting item', error: error.message });
    }
};

// @desc    Update item text details (title, description, category, condition)
// @route   PUT /api/items/:id
// @access  Private (Owner only)
const updateItem = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Security Check: Verify req.user._id matches item.ownerId
        const ownerIdString = item.ownerId._id ? item.ownerId._id.toString() : item.ownerId.toString();
        if (ownerIdString !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to update this item' });
        }

        const { title, description, category, condition } = req.body;

        if (title !== undefined) item.title = title;
        if (description !== undefined) item.description = description;
        if (category !== undefined) item.category = category;
        if (condition !== undefined) item.condition = condition;

        const updatedItem = await item.save();
        await updatedItem.populate('ownerId', 'name email');

        res.json(updatedItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error updating item', error: error.message });
    }
};

module.exports = { createItem, getItems, requestItem, updateItem };

