const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  costOfGoods: {
    type: Number,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  images: [{
    type: String,
  }],
  categoryInputData: {
    type: Object,
    required: true
  },
  createdBy: {
    id: { type: Schema.Types.ObjectId, required: true, refPath: 'creatorType' },
    type: { type: String, required: true, enum: ['SuperAdmin', 'Seller'] },
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  rating: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rating'
  },
  deliveryOptions: [
    {
      type: String,
      enum: ['1-hour express delivery', '1-day delivery', 'standard delivery']
    }
  ],
  paymentMethods: [
    {
      type: String,
      enum: ['COD', 'gateway']
    }
  ],
  metaData: {
    type: String,
  },
  metaDescription: {
    type: String,
  },
  stock: {
    type: Number,
    default: 0 
  },
  status: {
    type: String,
    enum: ['pending', 'approved',],
    default: 'pending'
  },
  weight: {
    type: Number,
    required: true
  },
  deleted: {
    type: Boolean,
    default: false
  }
});

const Product = mongoose.model('Product', productSchema);

const trashProductSchema = new mongoose.Schema({
  originalProductId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  }
});

const TrashProduct = mongoose.model('TrashProduct', trashProductSchema);

module.exports = { Product, TrashProduct };
