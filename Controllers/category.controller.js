const Category = require('../Models/Category.model');

const createCategory = async (req, res) => {
  try {
    const { name, attributes, affiliate_commission, image, parent_id } = req.body;

    const newCategory = new Category({
      name,
      attributes,
      affiliate_commission,
      image,
      parent_id
    });

    await newCategory.save();
    res.status(201).json({ success: true, data: newCategory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ deleted: false }).populate('parent_id');
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await Category.findOne({ _id: categoryId, deleted: false }).populate('parent_id');

    if (!category) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }

    res.status(200).json({ success: true, data: category });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const updatedData = req.body;

    const updatedCategory = await Category.findOneAndUpdate({ _id: categoryId, deleted: false }, updatedData, { new: true });

    if (!updatedCategory) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }

    res.status(200).json({ success: true, data: updatedCategory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const trashCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }

    category.deleted = true;
    await category.save();
    res.status(200).json({ success: true, message: 'Category trashed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const restoreCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await Category.findOne({ _id: categoryId, deleted: true });

    if (!category) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }

    category.deleted = false;
    await category.save();
    res.status(200).json({ success: true, message: 'Category restored' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { createCategory, getCategories, getCategoryById, updateCategory, trashCategory, restoreCategory };
