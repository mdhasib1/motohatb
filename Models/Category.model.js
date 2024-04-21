const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  inputFields: [
    {
      fieldName: { type: String, required: true },
      fieldType: { type: String, enum: ['text', 'number', 'textarea', 'checkbox'], required: true },
      isRequired: { type: Boolean, default: true }
    }
  ],
  subcategories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
    }
  ],
  commissionRate: {
    type: Number,
    default: 0,
  },
  image: {
    type: [String],
    required: true
  }
});

const Category = mongoose.model('Category', categorySchema);

const trashCategorySchema = new mongoose.Schema({
  originalCategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  }
});

const TrashCategory = mongoose.model('TrashCategory', trashCategorySchema);

module.exports = {Category,TrashCategory};
