const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  images: {
    type: [String],
    default: []
  },
  price: {
    type: Number,
    required: true
  },
  video: {
    type: String
  },
  meta: {
    title: {
      type: String
    },
    description: {
      type: String
    }
  },
  included: {
    type: [String],
    default: []
  },
  excluded: {
    type: [String],
    default: []
  },
  etc: {
    type: String
  },
  specialNote: {
    type: String
  },
  warningSigns: {
    type: String
  }
});

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
