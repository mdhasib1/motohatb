const express = require('express');
const articleController = require('../Controllers/Blog.controllers');
const { protect, admin } = require("../middlewares/Protect");
const imageController = require('../Controllers/imageControllers');
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.get('/articles', articleController.getArticles);
router.get('/articles/:id', articleController.getArticleById);
router.post('/articles', protect, upload.none(), articleController.createArticle);
router.post('/articles/image/upload', upload.single('file'), imageController.upload);
router.delete('/articles/:id', articleController.deleteArticleById);
router.put('/articles/:id', protect, upload.none(), articleController.updateArticleById);
router.put('/articles/:id/views', articleController.incrementArticleViews);

module.exports = router;
