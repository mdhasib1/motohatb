const CategorySection = require('../Models/CategorySection.model');

const createCategorySection = async (categorySectionData) => {
  try {
    let { display_position } = categorySectionData;

    let existingSection = await CategorySection.findOne({ display_position });

    if (existingSection) {
      const sectionsToUpdate = await CategorySection.find({ display_position: { $gte: display_position } });
      await Promise.all(sectionsToUpdate.map(async (section) => {
        section.display_position++;
        await section.save();
      }));

      const nextAvailablePosition = await CategorySection.find({ display_position });
      display_position = nextAvailablePosition.length + 1;
    }

    categorySectionData.display_position = display_position;

    const newCategorySection = new CategorySection(categorySectionData);
    await newCategorySection.save();
    
    return newCategorySection;
  } catch (error) {
    throw error;
  }
};

const getCategorySections = async () => {
  try {
    const categorySections = await CategorySection.find().populate('category_id');
    return categorySections;
  } catch (error) {
    throw error;
  }
};

const updateCategorySection = async (id, updatedData) => {
  try {
    const { display_position } = updatedData;

    const existingSection = await CategorySection.findById(id);
    if (!existingSection) {
      throw new Error('Category section not found');
    }

    if (existingSection.display_position !== display_position) {
      const sectionsToUpdate = await CategorySection.find({ display_position: { $gte: display_position } });

      await Promise.all(sectionsToUpdate.map(async (section) => {
        section.display_position++;
        await section.save();
      }));
    }

    const updatedCategorySection = await CategorySection.findByIdAndUpdate(id, updatedData, { new: true });

    return updatedCategorySection;
  } catch (error) {
    throw error;
  }
};

const deleteCategorySection = async (id) => {
  try {
    await CategorySection.findByIdAndDelete(id);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createCategorySection,
  getCategorySections,
  updateCategorySection,
  deleteCategorySection
};
