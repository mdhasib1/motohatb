const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  store_id: {
    type: Number,
    required: true
  },
  store_name: {
    type: String,
    required: true
  }
});

const Store = mongoose.model('Store', storeSchema);

module.exports = Store;
