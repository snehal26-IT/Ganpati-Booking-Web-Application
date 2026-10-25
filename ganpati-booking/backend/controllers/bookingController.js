const store = require('../config/store');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Public
const createBooking = async (req, res, next) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      productId,
      size,
      quantity,
      fulfillmentType,
      deliveryAddress,
      preferredDate
    } = req.body;

    if (!customerName || !customerEmail || !customerPhone || !productId || !preferredDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, phone, product selection, and date.'
      });
    }

    if (fulfillmentType === 'delivery' && !deliveryAddress) {
      return res.status(400).json({
        success: false,
        message: 'Delivery address is required when choosing home delivery.'
      });
    }

    // Lookup product price
    const product = await store.getProductById(productId);
    const itemPrice = product ? product.price : 1500;
    const productName = product ? product.name : 'Eco Ganpati Idol';
    const numQty = parseInt(quantity) || 1;
    const totalAmount = itemPrice * numQty;

    const booking = await store.createBooking({
      customerName,
      customerEmail,
      customerPhone,
      productId,
      productName,
      size: size || 'Medium',
      quantity: numQty,
      totalAmount,
      fulfillmentType: fulfillmentType || 'delivery',
      deliveryAddress: deliveryAddress || 'Pickup from center',
      preferredDate
    });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully!',
      booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Public / Admin
const getBookings = async (req, res, next) => {
  try {
    const bookings = await store.getBookings();
    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Lookup booking by booking number
// @route   GET /api/bookings/lookup/:bookingNumber
// @access  Public
const lookupBooking = async (req, res, next) => {
  try {
    const booking = await store.getBookingByNumber(req.params.bookingNumber);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking reference not found' });
    }
    res.json({
      success: true,
      booking
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createBooking, getBookings, lookupBooking };
