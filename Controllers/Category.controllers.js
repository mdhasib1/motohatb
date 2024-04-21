const {Category} = require('../Models/Category.model');

const createCategory = async (req, res) => {
  try {
    const { name, inputFields, commissionRate,image } = req.body;

    if (!name || !inputFields || inputFields.length === 0) {
      return res.status(400).json({ success: false, error: 'Name and inputFields are required' });
    }

    const existingCategory = await Category.findOne({ name });

    if (existingCategory) {
        return res
          .status(400)
          .json({ message: "Same Category Already available" });
      }

      const newCategory = new Category({
        name,
        inputFields,
        commissionRate,
        image
      });
  
      await newCategory.save();

    res.status(201).json({ success: true, data: newCategory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate('subcategories');
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

const getInputFields = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }

    res.status(200).json({ success: true, inputFields: category.inputFields });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const deletedCategory = await Category.findByIdAndDelete(categoryId);
    if (!deletedCategory) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }
    res.status(200).json({ success: true, data: deletedCategory, message: 'Category deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

const editCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    console.log(req.body)
    const { name, inputFields, commissionRate, image } = req.body;

    if (!name || !inputFields || inputFields.length === 0) {
      return res.status(400).json({ success: false, error: 'Name and inputFields are required' });
    }

    const existingCategory = await Category.findOne({ _id: categoryId });

    if (!existingCategory) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }

    existingCategory.name = name;
    existingCategory.inputFields = inputFields;
    existingCategory.commissionRate = commissionRate;
    existingCategory.image = image;

    await existingCategory.save();

    res.status(200).json({ success: true, data: existingCategory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};


module.exports = { createCategory, getCategories,getInputFields,deleteCategory,editCategory };
