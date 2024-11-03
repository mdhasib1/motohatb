const HotProduct = require('../Models/SpacialDiscount');


exports.addHotProduct = async (req, res) => {
  try {
    const { productId, discountPercentage, startDate, endDate, isActive } = req.body;

    const hotProduct = new HotProduct({
      productId,
      discountPercentage,
      startDate,
      endDate,
      isActive
    });

    const savedHotProduct = await hotProduct.save();
    res.status(201).json(savedHotProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getHotProducts = async (req, res) => {
  try {
    const hotProducts = await HotProduct.find()
      .populate({
        path: 'productId',
        select: 'name price costOfGoods category store rating status stock images', 
        populate: [
          { path: 'category', select: 'name' },
          { path: 'store', select: 'name' }, 
          { path: 'rating', select: 'averageRating' } 
        ]
      });
    res.status(200).json(hotProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.updateHotProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { productId, discountPercentage, startDate, endDate, isActive } = req.body;

    const updatedHotProduct = await HotProduct.findByIdAndUpdate(
      id,
      { productId, discountPercentage, startDate, endDate, isActive },
      { new: true }
    );

    if (!updatedHotProduct) return res.status(404).json({ message: 'Hot Product not found' });
    res.status(200).json(updatedHotProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteHotProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedHotProduct = await HotProduct.findByIdAndDelete(id);

    if (!deletedHotProduct) return res.status(404).json({ message: 'Hot Product not found' });
    res.status(200).json({ message: 'Hot Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getHotProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const hotProduct = await HotProduct.findById(id).populate('productId');

    if (!hotProduct) return res.status(404).json({ message: 'Hot Product not found' });
    res.status(200).json(hotProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
