const express = require('express');
const router = express.Router();
const { createBooking, getBookings, lookupBooking } = require('../controllers/bookingController');

router.post('/', createBooking);
router.get('/', getBookings);
router.get('/lookup/:bookingNumber', lookupBooking);

module.exports = router;
