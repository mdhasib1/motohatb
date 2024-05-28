const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  commissionRate: {
    type: Number,
    default: 0,
  },
  image: {
    type: [String],
    required: false
  }
});


const Category = mongoose.model('Category', categorySchema);

const trashCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  commissionRate: {
    type: Number,
    default: 0
  },
  image: {
    type: [String],
    required: false
  },
  originalCategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  }
});


const TrashCategory = mongoose.model('TrashCategory', trashCategorySchema);

const subcategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  inputFields: {
    type: [{
      fieldName: { type: String, required: true },
      fieldType: { type: String, required: true }, 
      isRequired: { type: Boolean, default: false }
    }],
    required: true,
  },
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  commissionRate: {
    type: Number,
    default: 0,
  },
  image: {
    type: [String],
    required: false
  }
});


const Subcategory = mongoose.model('Subcategory', subcategorySchema);

const trashSubcategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  inputFields: {
    type: [{
      fieldName: { type: String, required: true },
      fieldType: { type: String, required: true }, 
      isRequired: { type: Boolean, default: false }
    }],
    required: true,
  },
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  commissionRate: {
    type: Number,
    default: 0,
  },
  image: {
    type: [String],
    required: false
  },
  originalSubcategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subcategory',
    required: true
  }
});


const TrashSubcategory = mongoose.model('TrashSubcategory', trashSubcategorySchema);

module.exports = { Category, TrashCategory, Subcategory, TrashSubcategory };
