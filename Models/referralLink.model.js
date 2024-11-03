const mongoose = require('mongoose');

const referralLinkSchema = new mongoose.Schema({
  affiliatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  link: { type: String, unique: true, sparse: true, required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  clicks: { type: Number, default: 0 },
  successfulPurchases: { type: Number, default: 0 },
  earnings: { type: Number, default: 0 },
});

const ReferralLink = mongoose.model('ReferralLink', referralLinkSchema);
module.exports = ReferralLink;
