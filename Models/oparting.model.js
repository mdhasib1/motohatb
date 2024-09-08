const mongoose = require("mongoose");

const OparatingSchema = new mongoose.Schema({
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

const Oparating = mongoose.model("Oparating", OparatingSchema);
module.exports = Oparating;
