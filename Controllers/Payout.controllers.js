const Product = require('../Models/Product.model');

const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, categoryInputData, createdBy, metaData, metaDescription } = req.body;

    const newProduct = new Product({
      name,
      description,
      price,
      category,
      categoryInputData,
      createdBy,
      metaData,
      metaDescription
    });

    await newProduct.save();

    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

const editProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { name, description, price, category, categoryInputData, metaData, metaDescription } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { name, description, price, category, categoryInputData, metaData, metaDescription },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    res.status(200).json({ success: true, data: deletedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

module.exports = { createProduct, editProduct, deleteProduct };
