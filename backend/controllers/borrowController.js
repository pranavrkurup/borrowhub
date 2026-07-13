const BorrowRequest = require('../models/BorrowRequest');
const Item = require('../models/Item');

// @desc    Create a new borrow request (with date-overlap validation)
// @route   POST /api/requests
const createRequest = async (req, res) => {
    try {
        const { itemId, startDate, endDate, message } = req.body;

        // 1. Find the item to make sure it exists and see who owns it
        const item = await Item.findById(itemId);
        if (!item) return res.status(404).json({ message: 'Item not found' });

        // 2. Prevent the owner from borrowing their own item!
        if (item.ownerId.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: 'You cannot borrow your own item' });
        }

        // 3. Date-overlap validation against active bookings
        const newStart = new Date(startDate);
        const newEnd = new Date(endDate);

        const activeBookings = await BorrowRequest.find({
            itemId,
            status: { $in: ['Approved', 'Borrowed'] },
        });

        for (const booking of activeBookings) {
            const existingStart = new Date(booking.startDate);
            const existingEnd = new Date(booking.endDate);

            // Overlap check: (newStart <= existingEnd) && (newEnd >= existingStart)
            if (newStart <= existingEnd && newEnd >= existingStart) {
                return res.status(400).json({
                    message: 'This item is already booked during these dates.',
                });
            }
        }

        // 4. No overlap — create the ticket
        const request = await BorrowRequest.create({
            itemId,
            borrowerId: req.user._id,
            lenderId: item.ownerId, // We grab the owner directly from the item!
            startDate,
            endDate,
            message,
        });

        res.status(201).json(request);
    } catch (error) {
        res.status(500).json({ message: 'Server Error creating request', error: error.message });
    }
};

// @desc    Get booked date ranges for a specific item (Approved/Borrowed only)
// @route   GET /api/items/:id/booked-dates
// @access  Public
const getBookedDates = async (req, res) => {
    try {
        const activeBookings = await BorrowRequest.find({
            itemId: req.params.id,
            status: { $in: ['Approved', 'Borrowed'] },
        }).select('startDate endDate -_id');

        res.json(activeBookings);
    } catch (error) {
        res.status(500).json({ message: 'Server Error fetching booked dates', error: error.message });
    }
};

// @desc    Get all requests involving the logged-in user (as borrower OR lender)
// @route   GET /api/requests
const getMyRequests = async (req, res) => {
    try {
        // Find requests where the user is EITHER the borrower OR the lender
        const requests = await BorrowRequest.find({
            $or: [{ borrowerId: req.user._id }, { lenderId: req.user._id }],
        })
            .populate('itemId', 'title imageUrl') // Grab the item picture and title
            .populate('borrowerId', 'name email') // Grab the borrower's info
            .populate('lenderId', 'name email');  // Grab the lender's info

        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Server Error fetching requests' });
    }
};

// @desc    Approve or Reject a request
// @route   PUT /api/requests/:id
const updateRequestStatus = async (req, res) => {
    try {
        const { status } = req.body; // Expecting 'Approved' or 'Rejected'
        const request = await BorrowRequest.findById(req.params.id);

        if (!request) return res.status(404).json({ message: 'Request not found' });

        // Security check: Only the LENDER (owner) can approve or reject!
        if (request.lenderId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Only the item owner can update this request' });
        }

        request.status = status;
        await request.save();

        res.json(request);
    } catch (error) {
        res.status(500).json({ message: 'Server Error updating request' });
    }
};

module.exports = { createRequest, getMyRequests, updateRequestStatus, getBookedDates };