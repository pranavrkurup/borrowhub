 const express = require('express');
const router = express.Router();

const { createRequest, getMyRequests, updateRequestStatus } = require('../controllers/borrowController');
const { protect } = require('../middlewares/authMiddleware');

// ALL request routes require the user to be logged in (protect)
router.use(protect);

router.post('/', createRequest);
router.get('/', getMyRequests);
router.put('/:id', updateRequestStatus);

module.exports = router;