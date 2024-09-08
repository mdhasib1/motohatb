const mongoose = require('mongoose');

const attributeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true, enum: ['String', 'number', 'radio', 'checkbox', 'select', 'text'] },
  options: [String],
  required: { type: Boolean, default: false }
});

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  parent_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  attributes: [attributeSchema],
  affiliate_commission: { type: Number, default: 0 },
  image: {
    type: [String],
    required: false
  },
  deleted: { type: Boolean, default: false }
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
