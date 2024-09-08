const mongoose = require('mongoose');

const categorySectionSchema = new mongoose.Schema({
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  display_in_section: { type: Boolean, default: false },
  display_position: { type: Number, default: 0 },
});

const CategorySection = mongoose.model('CategorySection', categorySectionSchema);

module.exports = CategorySection;
