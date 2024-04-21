const {Product} = require('../Models/Product.model');
const {Category} = require('../Models/Category.model');
const {User} = require('../Models/User.model');

const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      image,
      metaData,
      metaDescription,
      categoryInputFields,
      deliveryOptions,
      paymentMethods,
      stock,
      weight,
      costOfGoods,
    } = req.body;

    const createdBy = req.user._id;

    if (!category || !createdBy) {
      return res.status(400).json({ success: false, error: 'Category and createdBy are required' });
    }

    const cat = await Category.findById(category);
    if (!cat) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }
    const categoryInputData = categoryInputFields.reduce((acc, { fieldName, value }) => {
      acc[fieldName] = value;
      return acc;
    }, {});

    const newProduct = new Product({
      name,
      description,
      price,
      category,
      images:image,
      categoryInputData:categoryInputData,
      createdBy,
      deliveryOptions: deliveryOptions,
      paymentMethods: paymentMethods,
      metaData,
      metaDescription,
      stock,
      weight,
      costOfGoods,
    });

    await newProduct.save();

    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};


const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const {
      name,
      description,
      price,
      categoryId,
      dynamicFields,
      deliveryOptions,
      paymentMethods,
      images,
      metaData,
      metaDescription
    } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    product.name = name;
    product.description = description;
    product.price = price;
    product.category = categoryId;
    product.dynamicFields = dynamicFields;
    product.deliveryOptions = deliveryOptions;
    product.paymentMethods = paymentMethods;
    product.images = images;
    product.metaData = metaData;
    product.metaDescription = metaDescription;

    await product.save();

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

module.exports = { createProduct, updateProduct };


const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId).populate('category').populate('subcategory');

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('category');

    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};


module.exports = { createProduct, updateProduct, getProductById,getAllProducts };
