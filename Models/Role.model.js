const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  permissions: {
    products: {
      create: { type: Boolean, default: false },
      edit: { type: Boolean, default: false },
      delete: { type: Boolean, default: false }
    },
    orders: {
      add: { type: Boolean, default: false },
      edit: { type: Boolean, default: false },
      push: { type: Boolean, default: false },
      delete: { type: Boolean, default: false }
    },
    users: {
      add: { type: Boolean, default: false },
      chat: { type: Boolean, default: false }
    }
  }
});

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;
