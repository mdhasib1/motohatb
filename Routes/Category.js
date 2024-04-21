const express = require('express');
const router = express.Router();
const categoryController = require('../Controllers/Category.controllers');
const subcategoryController = require('../Controllers/subcategoryController');
const {protect,admin} = require("../Middleware/Protect");

router.post('/categories', categoryController.createCategory);
router.get('/categories', categoryController.getCategories);
router.post('/categories/subcategories', subcategoryController.createSubcategory);
router.get('/categories/:categoryId/inputFields', categoryController.getInputFields);
router.get('/categories/:id', categoryController.getCategories);
router.delete('/categories/:categoryId', categoryController.deleteCategory);
router.put('/categories/:categoryId', categoryController.editCategory);

module.exports = router;
