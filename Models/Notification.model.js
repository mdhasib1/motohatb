const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  message: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  read: { type: Boolean, default: false }
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
