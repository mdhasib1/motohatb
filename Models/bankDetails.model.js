const mongoose = require('mongoose');

const bankDetailsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  bankName: { type: String, required: true },
  accountNumber: { type: String, required: true },
  branch: { type: String, required: true },
  accountHolder: { type: String, required: true },
});

const BankDetails = mongoose.model('BankDetails', bankDetailsSchema);
module.exports = BankDetails;
