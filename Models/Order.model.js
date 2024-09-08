const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      trackingId: {
        type: String
      }
    }
  ],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'refunded','canceled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['cod', 'paid', 'failed','unpaid'],
    default: 'cod'
  },
  shippingAddress: {
    recipient_name: { type: String, required: true },
    recipient_mobile: { type: String, required: true },
    recipient_division: { type: String, required: true },
    recipient_district: { type: String, required: true },
    recipient_city: { type: String, required: true },
    recipient_area: { type: String, required: true },
    recipient_thana: { type: String, required: true },
    recipient_union: { type: String, required: true },
    recipient_address: { type: String, required: true },
    recipient_postcode: { type: String, required: true }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
