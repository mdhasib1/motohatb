const {Product} = require('../Models/Product.model');
const {Category} = require('../Models/Category.model');
const {User} = require('../Models/User.model');

const createProduct = async (req, res) => {

  console.log(req.body)
  try {
    const userId = req.user._id; 

    const {
      name,
      description,
      price,
      selectedCategory,
      imageLinks,
      metaData,
      metaDescription,
      categoryInputFields,
      deliveryOptions,
      paymentMethods,
      productStock,
      weight,
      costOfGoods,
      variants,
      variantImages
    } = req.body;

    const categoryInputData = categoryInputFields.reduce((acc, { fieldName, value }) => {
      acc[fieldName] = value;
      return acc;
    }, {});

    const mappedVariants = variants.map((variant, index) => ({
      name: variant.variantName,
      price: variant.variantPrice,
      weight: variant.variantWeight,
      stock: variant.variantStock || 0,
      images: variantImages[index] || []
    }));

    const newProduct = new Product({
      name,
      description,
      price,
      selectedCategory,
      images:imageLinks,
      categoryInputData,
      deliveryOptions,
      paymentMethods,
      metaData,
      metaDescription,
      stock:productStock,
      weight,
      costOfGoods,
      variants: mappedVariants,
      user: userId,
      category: selectedCategory 
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


const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    console.log(productId)
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    await Product.findByIdAndDelete(productId);

    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};


module.exports = { createProduct, updateProduct, getProductById,getAllProducts,deleteProduct };
