const Store = require('../Models/Store.model');
const User = require('../Models/User.model');
const Product = require('../Models/Product.model');


const getAllStores = async (req, res) => {
    try {
      const stores = await Store.find()
        .populate('owner', 'name email');
      const storeWithProducts = await Promise.all(
        stores.map(async (store) => {
          const products = await Product.find({ store: store._id });
          return {
            ...store.toObject(), 
            products,
          };
        })
      );
  
      res.status(200).json({ success: true, stores: storeWithProducts });
    } catch (error) {
      console.error('Error fetching stores:', error);
      res.status(500).json({ success: false, message: 'Error fetching stores' });
    }
  };
  

const getMyStores = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const stores = await Store.find({ owner: sellerId })
      .populate('products');

    res.status(200).json({ success: true, stores });
  } catch (error) {
    console.error('Error fetching stores:', error);
    res.status(500).json({ success: false, message: 'Error fetching stores' });
  }
};

const getStoreById = async (req, res) => {
    try {
      const { id } = req.params;
      const store = await Store.findById(id)
        .populate('owner', 'name email') 
        .lean(); 
  
      if (!store) {
        return res.status(404).json({ success: false, message: 'Store not found' });
      }
  
      const products = await Product.find({ store: id });
      
      const storeWithProducts = {
        ...store,
        products,
      };
  
      res.status(200).json({ success: true, store: storeWithProducts });
    } catch (error) {
      console.error('Error fetching store:', error);
      res.status(500).json({ success: false, message: 'Error fetching store' });
    }
  };

const deleteStore = async (req, res) => {
  try {
    const storeId = req.params.storeId;

    const store = await Store.findById(storeId);

    if (!store) {
      return res.status(404).json({ success: false, message: 'Store not found' });
    }

    if (store.owner._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized access' });
    }

    await store.remove();
    res.status(200).json({ success: true, message: 'Store deleted successfully' });
  } catch (error) {
    console.error('Error deleting store:', error);
    res.status(500).json({ success: false, message: 'Error deleting store' });
  }
};

const followStore = async (req, res, io) => {
    try {
      const storeId = req.params.id;
      const userId = req.user._id;
  
      const store = await Store.findById(storeId);
  
      if (!store) {
        return res.status(404).json({ success: false, message: 'Store not found' });
      }
  
      if (store.followers.includes(userId)) {
        store.followers = store.followers.filter(follower => follower.toString() !== userId.toString());
        await store.save();
  
        io.emit('store-unfollowed', { storeId, userId, followersCount: store.followers.length });
  
        return res.status(200).json({ success: true, message: 'You have unfollowed this store', isFollowing: false });
      } else {
        store.followers.push(userId);
        await store.save();
  
        io.emit('store-followed', { storeId, userId, followersCount: store.followers.length });
  
        return res.status(200).json({ success: true, message: 'You are now following this store', isFollowing: true });
      }
    } catch (error) {
      console.error('Error following/unfollowing store:', error);
      res.status(500).json({ success: false, message: 'Error following/unfollowing store' });
    }
  };
  

module.exports = {
  getAllStores,
  getMyStores,
  getStoreById,
  deleteStore,
  followStore
};
