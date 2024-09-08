const Oparating = require('../Models/oparting.model');
const {Product} = require('../Models/Product.model');

const createOparatingation = async (req, res) => {
  try {
    const { productId, oparatingCharge } = req.body;

    const product = await Product.findOne({ _id: productId });

    if (!product) {
      console.log('Product not found');
      return res.status(404).json({ message: "Product not found" });
    }

    const oparating = new Oparating({
      productId,
      oparatingCharge
    });
    await oparating.save();

    res.status(201).json({ message: "Oparatingation charge created successfully", oparating });
  } catch (error) {
    console.error("Failed to add oparating charge:", error);
    res.status(500).json({ message: "Failed to add oparating charge", error: error.message });
  }
};


const getOparatingationByProductId = async (req, res) => {
    try {
      const { productId } = req.params;
      const oparating = await Oparating.findOne({ productId });
      res.status(201).json({ oparating });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


const updateOparatingationByProductId = async (req, res) => {
  try {
    const { productId } = req.params;
    const { oparatingCharge } = req.body;

    const oparating = await Oparating.findOneAndUpdate(
      { productId },
      { oparatingCharge },
      { new: true }
    );

    if (!oparating) {
      return res.status(404).json({ message: "Oparatingation charge not found" });
    }

    res.status(200).json({ message: "Oparatingation charge updated successfully", oparating });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteOparatingationByProductId = async (req, res) => {
  try {
    const { productId } = req.params;
    const oparating = await Oparating.findOneAndDelete({ productId });
    if (!oparating) {
      return res.status(404).json({ message: "Oparatingation charge not found" });
    }
    res.status(200).json({ message: "Oparatingation charge deleted successfully", oparating });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getAllProductsWithOparatingation = async (req, res) => {
  try {
    const oparatings = await Oparating.find();
    const productIds = oparatings.map(oparating => oparating.productId);
    const products = await Product.find({ _id: { $in: productIds } });
    const productsWithOparatingationCharge = products.map(product => {
      const oparating = oparatings.find(oparating => String(oparating.productId) === String(product._id));
      if (oparating) {
        return {
          ...product.toObject(),
          oparatingCharge: oparating.oparatingCharge
        };
      } else {
        return product.toObject();
      }
    });

    res.status(200).json({ products: productsWithOparatingationCharge });
  } catch (error) {
    console.error("Failed to fetch products with oparating:", error);
    res.status(500).json({ message: "Failed to fetch products with oparating", error: error.message });
  }
};

module.exports = {
  createOparatingation,
  getOparatingationByProductId,
  updateOparatingationByProductId,
  deleteOparatingationByProductId,
  getAllProductsWithOparatingation
};
