const mongoose = require('mongoose');

// Define the Blueprint for an Item Listing
const itemSchema = new mongoose.Schema(
    {
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User', // This creates the "Referencing" link to the User collection
        },
        title: {
            type: String,
            required: [true, 'Please provide an item title'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Please provide a brief description'],
        },
        category: {
            type: String,
            required: [true, 'Please select a category'],
            enum: ['Electronics', 'Books', 'Lab Equipment', 'Sports', 'Other'],
        },
        condition: {
            type: String,
            required: true,
            enum: ['Like New', 'Good', 'Fair'],
        },
        imageUrl: {
            type: String,
            required: true,
            default: 'https://via.placeholder.com/300', // Fallback if no image is provided
        },
        status: {
            type: String,
            enum: ['Available', 'Requested', 'Borrowed'],
            default: 'Available',
        },
    },
    { timestamps: true }
);

// Create indexes to make searching for items incredibly fast
itemSchema.index({ category: 1, status: 1 });
itemSchema.index({ title: 'text', description: 'text' });

const Item = mongoose.model('Item', itemSchema);
module.exports = Item;