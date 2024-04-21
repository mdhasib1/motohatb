const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const sellerSchema = new mongoose.Schema({
  seller_fullName: {
    type: String,
    required: true
  },
  seller_avatar: {
    type: String
  },
  seller_email: {
    type: String,
    required: true,
    unique: true
  },
  seller_password: {
    type: String,
    required: true
  },
  seller_business_name: {
    type: String,
    required: true
  },
  seller_address:{
    city:{type:String, required:true},
    district:{type:String, required:true},
    thana:{type:String, required:true},
    postcode:{type:String, required:true},
    zone_id:{type:String, required:true},
    area_id:{type:String, required:true},
    seller_union:{type:String, required:true},
    seller_address:{type:String, required:true},
    seller_area:{type:String, required:true},
  },
  seller_mobile: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['seller','manager',],
    default: 'seller'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  permissions: {
    products: {
      create: { type: Boolean, default: true },
      edit: { type: Boolean, default: true },
      delete: { type: Boolean, default: true }
    },
    orders: {
      add: { type: Boolean, default: true }
    },
    users: {
      add: { type: Boolean, default: false },
      chat: { type: Boolean, default: false }
    }
  }
});

sellerSchema.pre('save', async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    this.seller_password = await bcrypt.hash(this.seller_password, salt);
    next();
  } catch (error) {
    next(error);
  }
});



sellerSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
}

const Seller = mongoose.model('Seller', sellerSchema);


const sellerBankDetailsSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seller',
    required: true
  },
  bankName: {
    type: String,
    required: true
  },
  bankType: {
    type: String,
    enum: ['mfs','banktransfer',],
    default: 'mfs'
  },
  accountNumber: {
    type: String
  },
  accountHolderName: {
    type: String
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const SellerBankDetails = mongoose.model('SellerBankDetails', sellerBankDetailsSchema);


const sellerPaymentHistorySchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seller',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  transactionDate: {
    type: Date,
    default: Date.now
  },
  images: [{
    type: String,
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const SellerPaymentHistory = mongoose.model('SellerPaymentHistory', sellerPaymentHistorySchema);

module.exports = {
  Seller,
  SellerBankDetails,
  SellerPaymentHistory
};
