const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  city: { type: String },
  district: { type: String },
  thana: { type: String },
  postcode: { type: String },
  zone_id: { type: String },
  area_id: { type: String },
  union: { type: String },
  address: { type: String },
  area: { type: String },
}, { _id: false });

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, trim: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['seller', 'manager', 'affiliator', 'customer', 'admin'], default: 'customer' },
  fullName: { type: String, trim: true, required: true },
  avatar: { type: String },
  phone: { type: String, required: true },
  billingAddress: addressSchema,
  shippingAddress: [addressSchema],
  seller_business_name: { type: String, required: function() { return this.role === 'seller'; }, trim: true },
  referralLinks: [{
    link: { type: String, unique: true, sparse: true },
    clicks: { type: Number, default: 0 },
    successfulPurchases: { type: Number, default: 0 }
  }],
  permissions: {
    products: { create: { type: Boolean, default: false }, edit: { type: Boolean, default: false }, delete: { type: Boolean, default: false }},
    orders: { add: { type: Boolean, default: false }},
    users: { add: { type: Boolean, default: false }, chat: { type: Boolean, default: false }}
  },
  latitude: { type: Number },
  longitude: { type: Number },
  isVerified: { type: Boolean, default: false },
  googleId: { type: String },
  facebookId: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  chats: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chat' }]
});


const User = mongoose.model('User', userSchema);
module.exports = User;
