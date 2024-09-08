const {Product} = require('../Models/Product.model');

const getAllProducts = async (req, res) => {
  try {
    let products;
    if (req.user.isAdmin) {
      products = await Product.find().populate('category');
    } else {
      products = await Product.find({ user: req.user._id }).populate('category');
    }
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

module.exports = {getAllProducts};
