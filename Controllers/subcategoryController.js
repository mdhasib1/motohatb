const {
  Category,
  Subcategory,
  TrashSubcategory,
} = require("../Models/Category.model");

const createSubcategory = async (req, res) => {
  const categoryId = req.params.categoryId;

  console.log(categoryId);
  console.log(req.body);

  try {
    const { name, inputFields, commissionRate, image } = req.body;

    const existingSubcategory = await Subcategory.findOne({ name });

    if (existingSubcategory) {
      return res
        .status(400)
        .json({ message: "Subcategory with the same name already exists" });
    }

    // Check for parent category in both Category and Subcategory collections
    let parentCategory = await Category.findById(categoryId);

    if (!parentCategory) {
      parentCategory = await Subcategory.findById(categoryId);
      if (!parentCategory) {
        return res
          .status(404)
          .json({ success: false, error: "Category not found" });
      }
    }

    const newSubcategory = new Subcategory({
      name,
      inputFields,
      commissionRate,
      image,
      parentCategory: parentCategory._id,
    });

    await newSubcategory.save();

    if (!parentCategory.subcategories) {
      parentCategory.subcategories = [];
    }

    parentCategory.subcategories.push(newSubcategory._id);
    await parentCategory.save();

    res.status(201).json({ success: true, data: newSubcategory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};


const getSubcategories = async (req, res) => {
  try {
    const subcategories = await Subcategory.find();

    res.status(200).json({ success: true, data: subcategories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

const getSubcategoriesbyparentID = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const subcategories = await Subcategory.find({
      parentCategory: categoryId,
    });
    res.status(200).json({ success: true, data: subcategories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

const getSubcategoryById = async (req, res) => {
  try {
    const subcategory = await Subcategory.findById(req.params.id);
    if (!subcategory) {
      return res
        .status(404)
        .json({ success: false, error: "Subcategory not found" });
    }

    res.status(200).json({ success: true, data: subcategory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

const updateSubcategory = async (req, res) => {
  try {
    const { name, inputFields, commissionRate, image } = req.body;

    let subcategory = await Subcategory.findById(req.params.id);

    if (!subcategory) {
      return res
        .status(404)
        .json({ success: false, error: "Subcategory not found" });
    }

    subcategory.name = name;
    subcategory.inputFields = inputFields;
    subcategory.commissionRate = commissionRate;
    subcategory.image = image;

    await subcategory.save();

    res.status(200).json({ success: true, data: subcategory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

const deleteSubcategory = async (req, res) => {
  try {
    const subcategory = await Subcategory.findById(req.params.id);

    if (!subcategory) {
      return res
        .status(404)
        .json({ success: false, error: "Subcategory not found" });
    }

    const trashSubcategory = new TrashSubcategory({
      name: subcategory.name,
      inputFields: subcategory.inputFields,
      parentCategory: subcategory.parentCategory,
      commissionRate: subcategory.commissionRate,
      image: subcategory.image,
      originalSubcategoryId: subcategory._id,
    });

    await trashSubcategory.save();

    await Subcategory.deleteOne({ _id: subcategory._id });

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

const getInputFields = async (req, res) => {
  try {
    const { id } = req.params;
    const subcategory = await Subcategory.findById(id);

    if (!subcategory) {
      return res
        .status(404)
        .json({ success: false, error: "Category not found" });
    }

    res
      .status(200)
      .json({ success: true, inputFields: subcategory.inputFields });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

const getTrashSubcategoryData = async (req, res) => {
  try {
    const trashData = await TrashSubcategory.find();
    res.status(200).json({ success: true, data: trashData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};


const resetData = async (req, res) => {
  try {
    const trashData = await TrashSubcategory.find();

    for (const trashSubcategory of trashData) {
      const { name, commissionRate, image, inputFields, parentCategory, originalSubcategoryId } = trashSubcategory;
      const newSubcategory = new Subcategory({
        name,
        inputFields,
        commissionRate,
        image,
        parentCategory, 
      });
      await newSubcategory.save();
      if (parentCategory) {
        const parentCat = await Category.findById(parentCategory);
        if (parentCat) {
          parentCat.subcategories.push(newSubcategory._id);
          await parentCat.save();
        }
      }
    }
    await TrashSubcategory.deleteMany({});
    res.status(200).json({ success: true, message: 'Data reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};


const deleteTrashSubcategory = async (req, res) => {
  try {
    const { id } = req.params; 

    const deletedSubcategory = await TrashSubcategory.findByIdAndDelete(id);

    if (!deletedSubcategory) {
      return res.status(404).json({ success: false, error: 'Trash subcategory not found' });
    }

    res.status(200).json({ success: true, message: 'Trash subcategory deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

const restoreTrashSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const trashSubcategory = await TrashSubcategory.findById(id);

    if (!trashSubcategory) {
      return res.status(404).json({ success: false, error: 'Trash subcategory not found' });
    }
    const newSubcategory = new Subcategory({
      name: trashSubcategory.name,
      inputFields: trashSubcategory.inputFields,
      parentCategory: trashSubcategory.parentCategory,
      commissionRate: trashSubcategory.commissionRate,
      image: trashSubcategory.image,
    });
    await newSubcategory.save();

    await TrashSubcategory.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: 'Trash subcategory restored and deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};




module.exports = {
  createSubcategory,
  getSubcategories,
  getSubcategoryById,
  updateSubcategory,
  deleteSubcategory,
  getInputFields,
  getSubcategoriesbyparentID,
  getTrashSubcategoryData,
  restoreTrashSubcategory,
  deleteTrashSubcategory,
  resetData,
};
