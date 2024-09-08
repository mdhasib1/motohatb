const Article = require("../Models/Blog.model");

exports.getArticles = async (req, res) => {
  try {
    const articles = await Article.find().populate('author.userId', 'fname').exec();
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id).populate('author.userId', 'fname').exec();
    if (article) {
      res.json(article);
    } else {
      res.status(404).json({ message: "Article not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createArticle = async (req, res) => {
  try {
    const { title, content, tags, slug, imageLinks, imageWidth, imageHeight } = req.body;
    const userId = req.user.id;

    if (!title || !content || !tags || !slug || !imageLinks || !imageWidth || !imageHeight) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newArticle = await Article.create({
      title,
      slug,
      author: { userId },
      content,
      featuredImage: {
        url: imageLinks,
        width: imageWidth,
        height: imageHeight,
      },
      tags,
    });

    res.status(201).json(newArticle);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateArticleById = async (req, res) => {
  try {
    const { title, content, tags, slug, imageLinks, imageWidth, imageHeight } = req.body;
    if (!title || !content || !tags || !slug || !imageLinks || !imageWidth || !imageHeight) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const updatedArticle = await Article.findByIdAndUpdate(req.params.id, {
      title,
      slug,
      content,
      featuredImage: {
        url: imageLinks,
        width: imageWidth,
        height: imageHeight,
      },
      tags,
    }, { new: true });

    if (updatedArticle) {
      res.json(updatedArticle);
    } else {
      res.status(404).json({ message: "Article not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteArticleById = async (req, res) => {
  try {
    const deletedArticle = await Article.findByIdAndDelete(req.params.id);
    if (deletedArticle) {
      res.json(deletedArticle);
    } else {
      res.status(404).json({ message: "Article not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.incrementArticleViews = async (req, res) => {
  try {
    const articleId = req.params.id;
    const article = await Article.findByIdAndUpdate(articleId, { $inc: { views: 1 } }, { new: true });
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.json({ message: "Article views incremented successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
