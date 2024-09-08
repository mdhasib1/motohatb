const express = require('express');
const router = express.Router();
const categorySectionController = require('../Controllers/categorySectionController');

router.post('/', categorySectionController.createCategorySection);
router.get('/', categorySectionController.getCategorySections);
router.put('/:id', categorySectionController.updateCategorySection);
router.delete('/:id', categorySectionController.deleteCategorySection);

module.exports = router;
