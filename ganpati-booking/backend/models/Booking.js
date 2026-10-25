const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingNumber: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  customerName: {
    type: String,
    required: [true, 'Customer name is required']
  },
  customerEmail: {
    type: String,
    required: [true, 'Customer email is required']
  },
  customerPhone: {
    type: String,
    required: [true, 'Customer phone is required']
  },
  productId: {
    type: String,
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  size: {
    type: String,
    default: 'Medium'
  },
  quantity: {
    type: Number,
    default: 1
  },
  totalAmount: {
    type: Number,
    required: true
  },
  fulfillmentType: {
    type: String,
    enum: ['delivery', 'pickup'],
    default: 'delivery'
  },
  deliveryAddress: {
    type: String,
    required: function() { return this.fulfillmentType === 'delivery'; }
  },
  preferredDate: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'delivered', 'cancelled'],
    default: 'confirmed'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Booking', bookingSchema);
