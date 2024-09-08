const ServiceCategory = require('../Models/ServicesCategory.model')

exports.createServiceCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({ error: 'Please provide name and description' });
    }

    const existingCategory = await ServiceCategory.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ error: 'Category with this name already exists' });
    }

    const serviceCategory = new ServiceCategory({ name, description });
    await serviceCategory.save();

    res.status(201).json({ message: 'Service category created successfully', serviceCategory });
  } catch (error) {
    console.error('Failed to create service category:', error);
    res.status(500).json({ error: 'Failed to create service category', message: error.message });
  }
};

exports.getAllServiceCategories = async (req, res) => {
  try {
    const serviceCategories = await ServiceCategory.find();
    res.status(200).json(serviceCategories);
  } catch (error) {
    console.error('Failed to fetch service categories:', error);
    res.status(500).json({ error: 'Failed to fetch service categories', message: error.message });
  }
};

exports.getServiceCategoryById = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const serviceCategory = await ServiceCategory.findById(categoryId);
    if (!serviceCategory) {
      return res.status(404).json({ error: 'Service category not found' });
    }
    res.status(200).json(serviceCategory);
  } catch (error) {
    console.error('Failed to fetch service category:', error);
    res.status(500).json({ error: 'Failed to fetch service category', message: error.message });
  }
};

exports.updateServiceCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({ error: 'Please provide name and description' });
    }

    const updatedCategory = await ServiceCategory.findByIdAndUpdate(
      categoryId,
      { name, description },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ error: 'Service category not found' });
    }

    res.status(200).json({ message: 'Service category updated successfully', updatedCategory });
  } catch (error) {
    console.error('Failed to update service category:', error);
    res.status(500).json({ error: 'Failed to update service category', message: error.message });
  }
};

exports.deleteServiceCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    console.log('categoryId:', categoryId);
    const deletedCategory = await ServiceCategory.findByIdAndDelete(categoryId);
    
    if (!deletedCategory) {
      return res.status(404).json({ error: 'Service category not found' });
    }
    res.status(200).json({ message: 'Service category deleted successfully' });
  } catch (error) {
    console.error('Failed to delete service category:', error);
    res.status(500).json({ error: 'Failed to delete service category', message: error.message });
  }
};
