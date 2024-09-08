const {Product} = require('../Models/Product.model');
const {Category} = require('../Models/Category.model');
const {User} = require('../Models/User.model');

const createProduct = async (req, res) => {
  try {
    const userId = req.user._id; 
    const {
      name,
      description,
      price,
      selectedSubcategory,
      imageLinks,
      metaData,
      metaDescription,
      inputFieldValues,
      selectedDeliveryOptions,
      selectedPaymentMethods,
      productStock,
      weight,
      costOfGoods,
      variants,
      country,
      variantImages,
      genuine,
      warranty,
    } = req.body;

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
      selectedSubcategory,
      images:imageLinks,
      categoryInputData:inputFieldValues,
      deliveryOptions:selectedDeliveryOptions,
      paymentMethods:selectedPaymentMethods,
      metaData,
      metaDescription,
      stock:productStock,
      weight,
      costOfGoods,
      variants: mappedVariants,
      user: userId,
      category: selectedSubcategory,
      country:country,
      genuine:genuine,
      warranty:warranty
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


const getProductById = async (req, res) => {

  try {
    const { id } = req.params;
    const product = await Product.findById(id);

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
    console.log(products)

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

const getDefaultProducts = async () => {
  const count = await Product.countDocuments();
  if (count <= 12) {
    return await Product.find().limit(12);
  }

  const random = Math.floor(Math.random() * (count - 12));
  return await Product.find().skip(random).limit(12);
};


const getRelatedProducts = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId).populate('category');

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    let relatedProducts = await Product.find({ category: product.category, _id: { $ne: productId } }).limit(10);

    if (relatedProducts.length === 0) {
      relatedProducts = await getDefaultProducts();
    }

    res.status(200).json({ success: true, data: relatedProducts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

const getPopularProducts = async (req, res) => {
  try {
    let popularProducts = await Product.find().sort({ rating: -1 }).limit(10);

    if (popularProducts.length === 0) {
      popularProducts = await getDefaultProducts();
    }

    res.status(200).json({ success: true, data: popularProducts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

const getNewArrivals = async (req, res) => {
  try {
    let newArrivals = await Product.find().sort({ createdAt: -1 }).limit(10);

    if (newArrivals.length === 0) {
      newArrivals = await getDefaultProducts();
    }

    res.status(200).json({ success: true, data: newArrivals });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

const getFeaturedProducts = async (req, res) => {
  try {
    let featuredProducts = await Product.find({ status: 'featured' }).limit(10);

    if (featuredProducts.length === 0) {
      featuredProducts = await getDefaultProducts();
    }

    res.status(200).json({ success: true, data: featuredProducts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

const getMostAffordableProducts = async (req, res) => {
  try {
    let affordableProducts = await Product.find().sort({ price: 1 }).limit(10);

    if (affordableProducts.length === 0) {
      affordableProducts = await getDefaultProducts();
    }

    res.status(200).json({ success: true, data: affordableProducts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

const getMostPremiumProducts = async (req, res) => {
  try {
    let premiumProducts = await Product.find().sort({ price: -1 }).limit(10);

    if (premiumProducts.length === 0) {
      premiumProducts = await getDefaultProducts();
    }

    res.status(200).json({ success: true, data: premiumProducts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};


module.exports = { createProduct, updateProduct, getProductById,getAllProducts,deleteProduct,  getRelatedProducts,
  getPopularProducts,
  getNewArrivals,
  getFeaturedProducts,
  getMostAffordableProducts,
  getMostPremiumProducts, };
