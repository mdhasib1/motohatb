const mongoose = require("mongoose");

const installationSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  installationCharge: {
    type: Number,
    default: 0,
  },
});

const Install = mongoose.model("Install", installationSchema);
module.exports = Install;
