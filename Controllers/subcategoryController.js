const {Category} = require('../Models/Category.model');

const createSubcategory = async (req, res) => {
  try {
    const { categoryId, name, inputFields, commissionRate,image } = req.body;

    const existingCategory = await Category.findOne({ name });

    if (existingCategory) {
        return res
          .status(400)
          .json({ message: "Same Category Already available" });
      }

    const parentCategory = await Category.findById(categoryId);

    if (!parentCategory) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }

    const newSubcategory = new Category({
      name,
      inputFields,
      commissionRate,
      image,
    });

    newSubcategory.parentCategory = parentCategory._id;

    await newSubcategory.save();

    parentCategory.subcategories.push(newSubcategory._id);
    await parentCategory.save();

    res.status(201).json({ success: true, data: newSubcategory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

module.exports = { createSubcategory };
