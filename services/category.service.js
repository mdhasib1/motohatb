const mongoose = require('mongoose');
const Category = require('../Models/Category.model');
const TrashCategory = require('../Models/TrashCategory.model');

const createCategory = async (categoryData) => {
  try {
    const { name, attributes, affiliate_commission, image, parent_id } = categoryData;

    const existingCategory = await Category.findOne({ name });

    if (existingCategory) {
      throw new Error('Category with the same name already exists');
    }

    const newCategory = new Category({
      name,
      attributes,
      affiliate_commission,
      image,
      parent_id
    });

    await newCategory.save();
    return newCategory;
  } catch (error) {
    throw error;
  }
};

const getCategories = async () => {
  try {
    const categories = await Category.find().populate('parent_id');
    return categories;
  } catch (error) {
    throw error;
  }
};

const getCategoryById = async (categoryId) => {
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new Error('Invalid category ID');
  }
  
  try {
    const category = await Category.findById(categoryId).populate('parent_id');
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  } catch (error) {
    throw error;
  }
};

const updateCategory = async (categoryId, updatedData) => {
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new Error('Invalid category ID');
  }

  try {
    const { name, attributes, affiliate_commission, image } = updatedData;

    let category = await Category.findById(categoryId);

    if (!category) {
      throw new Error('Category not found');
    }

    category.name = name;
    category.attributes = attributes;
    category.affiliate_commission = affiliate_commission;
    category.image = image;

    await category.save();
    return category;
  } catch (error) {
    throw error;
  }
};

const deleteCategory = async (categoryId) => {
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new Error('Invalid category ID');
  }

  try {
    const category = await Category.findById(categoryId);

    if (!category) {
      throw new Error('Category not found');
    }

    const trashCategory = new TrashCategory({
      item_id: category._id,
      item_type: 'Category'
    });

    await trashCategory.save();
    await Category.findByIdAndDelete(categoryId);
  } catch (error) {
    throw error;
  }
};

const getTrashCategories = async () => {
  try {
    const trashCategories = await TrashCategory.find();
    return trashCategories;
  } catch (error) {
    throw error;
  }
};

const restoreTrashCategory = async (trashCategoryId) => {
  if (!mongoose.Types.ObjectId.isValid(trashCategoryId)) {
    throw new Error('Invalid trash category ID');
  }

  try {
    const trashCategory = await TrashCategory.findById(trashCategoryId);

    if (!trashCategory) {
      throw new Error('Trash category not found');
    }

    const { item_id, item_type } = trashCategory;

    if (item_type === 'Category') {
      const originalCategory = await Category.findById(item_id);

      if (!originalCategory) {
        throw new Error('Original category not found');
      }

      const { name, attributes, affiliate_commission, image } = originalCategory;

      const newCategory = new Category({
        name,
        attributes,
        affiliate_commission,
        image
      });

      await newCategory.save();
      await TrashCategory.findByIdAndDelete(trashCategoryId);
    } else {
      throw new Error('Unsupported item type in trash');
    }
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getTrashCategories,
  restoreTrashCategory
};
