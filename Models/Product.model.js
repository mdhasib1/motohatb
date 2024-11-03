const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  weight: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  images: [String]
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  costOfGoods: { type: Number, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  images: [String],
  categoryInputData: { type: Object, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User who created the product
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Seller of the product
  store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true }, // Store where the product is listed
  createdAt: { type: Date, default: Date.now },
  rating: { type: mongoose.Schema.Types.ObjectId, ref: 'Rating' },
  country: { type: String, required: true },
  genuine: { type: Boolean, default: false },
  warranty: { type: Boolean, default: false },
  deliveryOptions: { type: [String], enum: ['1-hour express delivery', '1-day delivery', 'standard delivery'], default: 'standard delivery' },
  paymentMethods: { type: [String], enum: ['COD', 'online payment'] },
  metaData: String,
  metaDescription: String,
  stock: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'approved', 'featured'], default: 'pending' },
  weight: { type: Number, required: true },
  deleted: { type: Boolean, default: false },
  variants: [variantSchema]
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
