const mongoose = require('mongoose');

const mobileBankingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  provider: { type: String, required: true },
  accountNumber: { type: String, required: true },
  accountHolder: { type: String, required: true },
});

const MobileBanking = mongoose.model('MobileBanking', mobileBankingSchema);
module.exports = MobileBanking;
