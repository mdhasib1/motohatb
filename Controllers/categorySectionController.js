const categorySectionService = require('../services/categorySectionService');

const createCategorySection = async (req, res) => {
  try {
    const { name, category_id, display_position } = req.body;
    const newCategorySection = await categorySectionService.createCategorySection({
      name,
      category_id,
      display_position
    });
    res.status(201).json({ success: true, data: newCategorySection });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const getCategorySections = async (req, res) => {
  try {
    const categorySections = await categorySectionService.getCategorySections();
    res.status(200).json({ success: true, data: categorySections });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateCategorySection = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    const updatedCategorySection = await categorySectionService.updateCategorySection(id, updatedData);
    res.status(200).json({ success: true, data: updatedCategorySection });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteCategorySection = async (req, res) => {
  try {
    const id = req.params.id;
    await categorySectionService.deleteCategorySection(id);
    res.status(200).json({ success: true, message: 'Category section deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  createCategorySection,
  getCategorySections,
  updateCategorySection,
  deleteCategorySection
};
