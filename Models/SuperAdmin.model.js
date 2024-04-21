const mongoose = require('mongoose');

const superAdminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  fullName: {
    type: String,
    trim: true,
    required: true
  },
  avatar: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  admin_address:{
    city:{type:String, required:true},
    district:{type:String, required:true},
    thana:{type:String, required:true},
    postcode:{type:String, required:true},
    zone_id:{type:String, required:true},
    area_id:{type:String, required:true},
    admin_union:{type:String, required:true},
    admin_address:{type:String, required:true},
    admin_area:{type:String, required:true},
  },
  role: { type: String, default: 'admin' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  chats: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat'
  }]
});

const SuperAdmin = mongoose.model('SuperAdmin', superAdminSchema);

module.exports = SuperAdmin;
