const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    trim: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['seller', 'manager', 'affiliator', 'customer', 'admin'],
    default: 'customer'
  },
  fullName: {
    type: String,
    trim: true,
    required: true
  },
  avatar: {
    type: String
  },
  phone: {
    type: String,
    required: true
  },
  billingAddress: {
    city: { type: String },
    district: { type: String },
    thana: { type: String },
    postcode: { type: String },
    zone_id: { type: String },
    area_id: { type: String },
    union: { type: String },
    address: { type: String },
    area: { type: String },
  },
  shippingAddress: {
    city: { type: String },
    district: { type: String },
    thana: { type: String },
    postcode: { type: String },
    zone_id: { type: String },
    area_id: { type: String },
    union: { type: String },
    address: { type: String },
    area: { type: String },
  },
  seller_business_name: {
    type: String, 
    required: function() { return this.role === 'seller'; },
    trim: true
  },
  referralLinks: {
    type: [{
      link: { type: String, unique: true, sparse: true }, 
      clicks: { type: Number, default: 0 },
      successfulPurchases: { type: Number, default: 0 }
    }],
    required: function() { return this.role === 'affiliator'; }
  },
  permissions: {
    products: {
      create: { type: Boolean, default: false },
      edit: { type: Boolean, default: false },
      delete: { type: Boolean, default: false }
    },
    orders: {
      add: { type: Boolean, default: false }
    },
    users: {
      add: { type: Boolean, default: false },
      chat: { type: Boolean, default: false }
    }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  chats: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat'
  }]
});

userSchema.pre('save', async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

const User = mongoose.model('User', userSchema);

module.exports = User;
