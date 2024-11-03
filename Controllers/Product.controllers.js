const Product = require('../Models/Product.model');
const User = require('../Models/User.model');

const Store  = require('../Models/Store.model');

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
      warranty
    } = req.body;

    const user = await User.findById(userId);

    let store = await Store.findOne({ owner: userId });

    let seller = null;

    if (user.role === 'seller') {
      seller = userId;
    }

    if (user.role === 'admin') {
      if (user.stores.length > 0) {
        store = user.stores[0]._id;
      } else {
        const newStore = new Store({
          name: `${user.fullName}'s Store`,
          description: `Admin store for ${user.fullName}`,
          owner: userId
        });

        await newStore.save();
        store = newStore._id;
      }

      seller = userId;
    }

    if (user.stores.length > 0 && !store) {
      store = user.stores[0]._id;
    }

    if (!store && !seller) {
      return res.status(400).json({ success: false, message: "User must be either a seller or own a store." });
    }

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
      costOfGoods,
      category: selectedSubcategory,
      images: imageLinks,
      categoryInputData: inputFieldValues,
      user: userId,
      seller: seller,
      store: store,
      deliveryOptions: selectedDeliveryOptions,
      paymentMethods: selectedPaymentMethods,
      metaData,
      metaDescription,
      stock: productStock,
      weight,
      variants: mappedVariants,
      country,
      genuine,
      warranty
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
    const updates = req.body;

    const product = await Product.findOneAndUpdate({ _id: productId, deleted: false }, updates, { new: true });

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ _id: id, deleted: false }).populate('category');

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
    const products = await Product.find({ deleted: false }).populate('category');
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};


const getAllProductsbyUser = async (req, res) => {
  try {
    let products;

    if (req.user.role === 'admin') {
      // Admin: Get all products
      products = await Product.find({ deleted: false }).populate('category');
    } else if (req.user.role === 'seller') {
      // Seller: Get only their own products
      products = await Product.find({ deleted: false, seller: req.user._id }).populate('category');
    } else {
      return res.status(403).json({ success: false, message: 'Unauthorized access' });
    }

    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};




const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ _id: id, deleted: false });

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    product.deleted = true;
    await product.save();
    res.status(200).json({ success: true, message: 'Product deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

const restoreProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ _id: id, deleted: true });

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    product.deleted = false;
    await product.save();
    res.status(200).json({ success: true, message: 'Product restored' });
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


module.exports = { createProduct, updateProduct,getAllProductsbyUser, getProductById,getAllProducts,deleteProduct,  getRelatedProducts,
  getPopularProducts,
  getNewArrivals,
  getFeaturedProducts,
  getMostAffordableProducts,
  getMostPremiumProducts, };
