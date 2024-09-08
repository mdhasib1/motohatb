const mongoose = require('mongoose');

const trashSchema = new mongoose.Schema({
  item_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  item_type: { type: String, required: true, enum: ['Category', 'Product'] },
  deleted_at: { type: Date, default: Date.now }
});

const TrashCategory = mongoose.model('TrashCategory', trashSchema);

module.exports = TrashCategory;
