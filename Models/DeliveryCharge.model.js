const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const deliveryChargeSchema = new Schema({
  sameDayCharge: { type: Number, required: true },
  expressCharge: { type: Number, required: true },
  standardCharge: { type: Number, required: true },
  additionalCharge: { type: Number, required: true },
  additionalChargeThreshold: { type: Number, required: true },
  extraCharge5to10: { type: Number, required: true },
  extraCharge10to20: { type: Number, required: true }
}, { timestamps: true });

const DeliveryCharge = mongoose.model('DeliveryCharge', deliveryChargeSchema);
module.exports = DeliveryCharge;
