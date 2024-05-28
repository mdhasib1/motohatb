const express = require('express');
const router = express.Router();
const categoryController = require('../Controllers/Category.controllers');
const subcategoryController = require('../Controllers/subcategoryController');
const { protect, admin } = require("../Middleware/Protect");


router.post('/categories', categoryController.createCategory);
router.get('/categories', categoryController.getCategories);
router.get('/categories/:id', categoryController.getCategoryById);
router.put('/categories/:id', categoryController.updateCategory);
router.delete('/categories/:id', categoryController.deleteCategory);
router.get('/delete-categories', categoryController.getTrashData);
router.delete('/categories/trash/reset', categoryController.resetData);
router.delete('/categories/trash/:id', categoryController.deleteTrashCategory);
router.delete('/categories/trash/reset/:id', categoryController.restoreTrashCategory);


module.exports = router;