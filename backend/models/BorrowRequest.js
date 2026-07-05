 const mongoose = require('mongoose');

const borrowRequestSchema = new mongoose.Schema(
    {
        itemId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Item',
        },
        borrowerId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        lenderId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        startDate: {
            type: Date,
            required: [true, 'Please provide a start date'],
        },
        endDate: {
            type: Date,
            required: [true, 'Please provide an end date'],
        },
        message: {
            type: String,
            trim: true,
            maxlength: 200, // Keep messages short so the database stays fast
        },
        status: {
            type: String,
            enum: ['Pending', 'Approved', 'Rejected', 'Returned'],
            default: 'Pending',
        },
    },
    { timestamps: true }
);

// Prevent a student from spamming the same item with multiple pending requests
borrowRequestSchema.index({ itemId: 1, borrowerId: 1, status: 1 });

const BorrowRequest = mongoose.model('BorrowRequest', borrowRequestSchema);
module.exports = BorrowRequest;
