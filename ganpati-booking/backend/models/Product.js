const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required']
  },
  category: {
    type: String,
    enum: ['clay', 'plant', 'decorated', 'eco'],
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  size: {
    type: String,
    default: 'Medium'
  },
  description: {
    type: String
  },
  imageUrl: {
    type: String
  },
  stockQuantity: {
    type: Number,
    default: 20
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);
