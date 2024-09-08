const categoryService = require('../services/category.service');

const createCategory = async (req, res) => {
  try {
    const { name, attributes, affiliate_commission, image, parent_id } = req.body;
    const newCategory = await categoryService.createCategory({
      name,
      attributes,
      affiliate_commission,
      image,
      parent_id
    });
    res.status(201).json({ success: true, data: newCategory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await categoryService.getCategories();
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await categoryService.getCategoryById(categoryId);
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
    const updatedCategory = await categoryService.updateCategory(categoryId, updatedData);
    res.status(200).json({ success: true, data: updatedCategory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    await categoryService.deleteCategory(categoryId);
    res.status(200).json({ success: true, message: 'Category deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const getTrashCategories = async (req, res) => {
  try {
    const trashCategories = await categoryService.getTrashCategories();
    res.status(200).json({ success: true, data: trashCategories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const restoreTrashCategory = async (req, res) => {
  try {
    const trashCategoryId = req.params.id;
    await categoryService.restoreTrashCategory(trashCategoryId);
    res.status(200).json({ success: true, message: 'Category restored' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
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
