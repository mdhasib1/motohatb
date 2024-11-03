const express = require('express');
const router = express.Router();
const subcategoryController = require('../Controllers/subcategoryController');
const {  authenticateToken,
    authorizeAdmin } = require("../middlewares/Protect");


router.post('/subcategories/:categoryId', subcategoryController.createSubcategory);
router.get('/subcategories/all-subcategories', subcategoryController.getSubcategories);
router.get('/categories/subcategories/:categoryId', subcategoryController.getSubcategoriesbyparentID);
router.get('/subcategories/inputfields/:id', subcategoryController.getInputFields);
router.get('/subcategories/:id', subcategoryController.getSubcategoryById);
router.put('/subcategories/:id',  subcategoryController.updateSubcategory);
router.delete('/subcategories/:id', subcategoryController.deleteSubcategory);
router.get('/deleted-subcategories', subcategoryController.getTrashSubcategoryData);
router.delete('/subcategories/trash/reset', subcategoryController.resetData);
router.delete('/delete-subcategories/trash/:id', subcategoryController.restoreTrashSubcategory);
router.delete('/subcategories/trash/:id', subcategoryController.deleteTrashSubcategory);

module.exports = router;