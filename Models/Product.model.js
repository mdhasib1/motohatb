const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const productSchema = new Schema({
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
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  rating: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rating'
  },
  country: {
    type: String,
    required: true
  },
  genuine: {
    type: Boolean,
    default: false
  },
  warranty: {
    type: Boolean,
    default: false
  },
  deliveryOptions: [
    {
      type: String,
      enum: ['1-hour express delivery', '1-day delivery', 'standard delivery'],
      default:'standard delivery'
    }
  ],
  paymentMethods: [
    {
      type: String,
      enum: ['COD', 'online payment']
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
    enum: ['pending', 'approved','featured'],
    default: 'pending'
  },
  weight: {
    type: Number,
    required: true
  },
  deleted: {
    type: Boolean,
    default: false
  },
  variants: [{
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    weight: {
      type: Number,
      required: true
    },
    stock: {
      type: Number,
      default: 0
    },
    images: [{
      type: String
    }]
  }]
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
