const Service = require('../Models/Services.model');


exports.createService = async (req, res) => {
  try {
    const { title, description, images, price, video, meta, included, excluded, etc, specialNote, warningSigns } = req.body;

    if (!title || !description || !images || !price || !meta  || !included || !excluded || !etc || !specialNote || !warningSigns) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    const service = new Service({
      title,
      description,
      images,
      price,
      video,
      meta,
      included,
      excluded,
      etc,
      specialNote,
      warningSigns
    });

    await service.save();

    res.status(201).json({ message: 'Service created successfully', service });
  } catch (error) {
    console.error('Failed to create service:', error);
    res.status(500).json({ error: 'Failed to create service', message: error.message });
  }
};

  

exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json({ services });
  } catch (error) {
    console.error('Failed to fetch services:', error);
    res.status(500).json({ error: 'Failed to fetch services', message: error.message });
  }
};

exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.status(200).json({ service });
  } catch (error) {
    console.error('Failed to fetch service by ID:', error);
    res.status(500).json({ error: 'Failed to fetch service', message: error.message });
  }
};

exports.updateServiceById = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.status(200).json({ message: 'Service updated successfully', service });
  } catch (error) {
    console.error('Failed to update service by ID:', error);
    res.status(500).json({ error: 'Failed to update service', message: error.message });
  }
};


exports.deleteServiceById = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Failed to delete service by ID:', error);
    res.status(500).json({ error: 'Failed to delete service', message: error.message });
  }
};
