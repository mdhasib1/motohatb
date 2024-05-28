const {
  Category,
  TrashCategory,
  Subcategory,
} = require("../Models/Category.model");

const createCategory = async (req, res) => {
  try {
    const { name, commissionRate, image } = req.body;

    const existingCategory = await Category.findOne({ name });

    if (existingCategory) {
      return res
        .status(400)
        .json({ message: "Category with the same name already exists" });
    }

    const newCategory = new Category({
      name,
      commissionRate,
      image,
    });

    await newCategory.save();

    res.status(201).json({ success: true, data: newCategory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();

    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res
        .status(404)
        .json({ success: false, error: "Category not found" });
    }

    res.status(200).json({ success: true, data: category });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { name, commissionRate, image } = req.body;

    let category = await Category.findById(req.params.id);

    if (!category) {
      return res
        .status(404)
        .json({ success: false, error: "Category not found" });
    }

    category.name = name;
    category.commissionRate = commissionRate;
    category.image = image;

    await category.save();

    res.status(200).json({ success: true, data: category });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res
        .status(404)
        .json({ success: false, error: "Category not found" });
    }

    const subcategoriesCount = await Subcategory.countDocuments({
      parentCategory: category._id,
    });

    if (subcategoriesCount > 0) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            "Category cannot be deleted as it has associated subcategories",
        });
    }

    const trashCategory = new TrashCategory({
      name: category.name,
      commissionRate: category.commissionRate,
      image: category.image,
      originalCategoryId: category._id,
    });

    await trashCategory.save();

    await Category.updateMany(
      { subcategories: category._id },
      { $pull: { subcategories: category._id } }
    );
    await Category.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

const getTrashData = async (req, res) => {
  try {
    const trashData = await TrashCategory.find();
    res.status(200).json({ success: true, data: trashData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

const resetData = async (req, res) => {
  try {
    const trashData = await TrashCategory.find();
    for (const trashCategory of trashData) {
      const { name, commissionRate, image } = trashCategory;

      const newCategory = new Category({
        name,
        commissionRate,
        image,
      });

      await newCategory.save();
    }
    await TrashCategory.deleteMany({});

    res.status(200).json({ success: true, message: "Data reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

const deleteTrashCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCategory = await TrashCategory.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res
        .status(404)
        .json({ success: false, error: "Trash category not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Trash category deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

const restoreTrashCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const trashCategory = await TrashCategory.findById(id);

    if (!trashCategory) {
      return res
        .status(404)
        .json({ success: false, error: "Trash category not found" });
    }
    const newCategory = new Category({
      name: trashCategory.name,
      commissionRate: trashCategory.commissionRate,
      image: trashCategory.image,
    });

    await newCategory.save();

    await TrashCategory.findByIdAndDelete(id);

    res
      .status(200)
      .json({
        success: true,
        message: "Trash category restored and deleted successfully",
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getTrashData,
  resetData,
  deleteTrashCategory,
  restoreTrashCategory,
};
