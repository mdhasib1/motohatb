const Slider = require('../Models/Slider.model');

const sliderController = {
  createSlider: async (req, res) => {
    try {
      const { image, title } = req.body;
      if (!image || !title) {
        return res.status(400).json({ message: 'Image and title are required' });
      }
      const newSlider = new Slider({
        image,
        title,
      });

      await newSlider.save();

      res.status(201).json({ message: 'Slider created successfully', slider: newSlider });
    } catch (error) {
      console.error('Error creating slider:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getAllSliders: async (req, res) => {
    try {
      const sliders = await Slider.find();

      res.status(200).json({ sliders });
    } catch (error) {
      console.error('Error fetching sliders:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getSliderById: async (req, res) => {
    try {
      const { sliderId } = req.params;
      const slider = await Slider.findById(sliderId);

      if (!slider) {
        return res.status(404).json({ message: 'Slider not found' });
      }

      res.status(200).json({ slider });
    } catch (error) {
      console.error('Error fetching slider:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  updateSlider: async (req, res) => {
    try {
      const { sliderId } = req.params;
      const { image, title } = req.body;
      if (!image || !title) {
        return res.status(400).json({ message: 'Image and title are required' });
      }

      const updatedSlider = await Slider.findByIdAndUpdate(sliderId, { image, title }, { new: true });

      if (!updatedSlider) {
        return res.status(404).json({ message: 'Slider not found' });
      }

      res.status(200).json({ message: 'Slider updated successfully', slider: updatedSlider });
    } catch (error) {
      console.error('Error updating slider:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  deleteSlider: async (req, res) => {
    try {
      const { sliderId } = req.params;

      const deletedSlider = await Slider.findByIdAndDelete(sliderId);

      if (!deletedSlider) {
        return res.status(404).json({ message: 'Slider not found' });
      }

      res.status(200).json({ message: 'Slider deleted successfully', slider: deletedSlider });
    } catch (error) {
      console.error('Error deleting slider:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};

module.exports = sliderController;
