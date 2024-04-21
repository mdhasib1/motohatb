const express = require('express');
const router = express.Router();
const sliderController = require('../Controllers/sliderController');

router.post('/sliders', sliderController.createSlider);
router.get('/sliders', sliderController.getAllSliders);
router.get('/sliders/:sliderId', sliderController.getSliderById);
router.put('/sliders/:sliderId', sliderController.updateSlider);
router.delete('/sliders/:sliderId', sliderController.deleteSlider);

module.exports = router;
