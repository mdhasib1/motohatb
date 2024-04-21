const Install = require('../Models/instalation.model');
const Product = require('../Models/Product.model');


const createInstallation = async (req, res) => {
  try {
    const { productId, installationCharge } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const installation = new Install({
      productId,
      installationCharge
    });
    await installation.save();

    res.status(201).json({ message: "Installation charge created successfully", installation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getInstallationByProductId = async (req, res) => {
    try {
      const { productId } = req.params;
      const installation = await Install.findOne({ productId });
      if (!installation) {
        return res.status(404).json({ message: "Installation charge not found for this product" });
      }
      res.status(200).json({ installation });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


const updateInstallationByProductId = async (req, res) => {
  try {
    const { productId } = req.params;
    const { installationCharge } = req.body;

    const installation = await Install.findOneAndUpdate(
      { productId },
      { installationCharge },
      { new: true }
    );

    if (!installation) {
      return res.status(404).json({ message: "Installation charge not found" });
    }

    res.status(200).json({ message: "Installation charge updated successfully", installation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteInstallationByProductId = async (req, res) => {
  try {
    const { productId } = req.params;
    const installation = await Install.findOneAndDelete({ productId });

    if (!installation) {
      return res.status(404).json({ message: "Installation charge not found" });
    }

    res.status(200).json({ message: "Installation charge deleted successfully", installation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllProductsWithInstallation = async (req, res) => {
    try {
      const installations = await Install.find();

      const productIds = installations.map(installation => installation.productId);
  
      const products = await Product.find({ _id: { $in: productIds } });
  
      res.status(200).json({ products });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

module.exports = {
  createInstallation,
  getInstallationByProductId,
  updateInstallationByProductId,
  deleteInstallationByProductId,
  getAllProductsWithInstallation
};
