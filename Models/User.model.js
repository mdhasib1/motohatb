const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    trim: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['affiliator','customer',],
    default: 'customer'
  },
  fullName: {
    type: String,
    trim: true,
    required: true
  },
  avatar: {
    type: String
  },
  permissions: {
    orders: {
      add: { type: Boolean, default: false }
    }
  },
  referrals: [{ product: String, link: String }],
  phone: {
    type: String,
    required: true
  },
  city: {
    type: String
  },
  district: {
    type: String
  },
  thana: {
    type: String
  },
  address: {
    type: String
  },
  zipcode: {
    type: String
  },
  chats: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat'
  }]
});

userSchema.pre('save', async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});


userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
}


userSchema.pre('save', function (next) {
  if (this.role === 'admin' || this.role === 'manager') {
    this.permissions.users.chat = true;
  }
  next();
});

const User = mongoose.model('User', userSchema);

const trashUserSchema = new mongoose.Schema({
  originalUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const TrashUser = mongoose.model('TrashUser', trashUserSchema);

module.exports = {User,TrashUser};
