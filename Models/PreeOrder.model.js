const mongoose = require('mongoose');

const preOrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Vehicle Information - only required if parts or mechanic preferences are involved
  vehicle: {
    make: { type: String },
    model: { type: String },
    variant: { type: String },
    year: { type: Number },
    vin: { type: String },
    engine: { type: String },
    cc: { type: Number },
  },

  // Optional fields for accessories, parts, or mechanic preferences
  accessoriesRequired: [{
    name: { type: String },
    number: { type: String },
    description: { type: String },
    quantity: { type: Number },
    notes: { type: String },
  }],

  partsRequired: [{
    name: { type: String },
    number: { type: String },
    description: { type: String },
    quantity: { type: Number },
    notes: { type: String },
  }],

  mechanicPreferences: {
    mechanicType: { type: String },
    preferredDate: { type: Date },
    preferredTime: { type: String },
    issueDescription: { type: String },
    symptoms: { type: String },
    uploadFile: { type: String },
    additionalNotes: { type: String },
  },

  // Shipping information (if applicable)
  shippingInfo: {
    carrier: { type: String },
    shippingMethod: { type: String },
    specialInstructions: { type: String },
  },
  
  // Invoice & payment details
  invoiceSent: { type: Boolean, default: false },
  advancePaymentRequired: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  trackingId: { type: String, unique: true },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Partially Paid', 'Completed', 'Failed'],
    default: 'Pending',
  },
  shippingStatus: {
    type: String,
    enum: ['Pending', 'In Progress', 'Shipped', 'Delivered'],
    default: 'Pending',
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('PreOrder', preOrderSchema);
