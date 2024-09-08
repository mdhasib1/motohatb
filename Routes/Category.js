const express = require('express');
const router = express.Router();
const categoryController = require('../Controllers/category.controller');

router.post('/', categoryController.createCategory);
router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategoryById);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);
router.get('/trash', categoryController.getTrashCategories);
router.post('/restore/:id', categoryController.restoreTrashCategory);

module.exports = router;
