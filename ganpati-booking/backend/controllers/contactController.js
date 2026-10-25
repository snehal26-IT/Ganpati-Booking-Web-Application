const store = require('../config/store');

// @desc    Submit contact inquiry form
// @route   POST /api/contact
// @access  Public
const submitInquiry = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and message.'
      });
    }

    const inquiry = await store.createInquiry({
      name,
      email,
      message
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been received.',
      inquiry
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all inquiries
// @route   GET /api/contact
// @access  Public / Admin
const getInquiries = async (req, res, next) => {
  try {
    const inquiries = await store.getInquiries();
    res.json({
      success: true,
      count: inquiries.length,
      data: inquiries
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { submitInquiry, getInquiries };
