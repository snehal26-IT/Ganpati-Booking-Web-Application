const store = require('../config/store');

// @desc    Get all idols / products
// @route   GET /api/idols
// @access  Public
const getIdols = async (req, res, next) => {
  try {
    const { category } = req.query;
    const products = await store.getProducts(category);
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single idol by ID
// @route   GET /api/idols/:id
// @access  Public
const getIdolById = async (req, res, next) => {
  try {
    const product = await store.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Idol product not found' });
    }
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getIdols, getIdolById };
