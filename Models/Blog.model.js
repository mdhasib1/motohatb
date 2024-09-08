const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    unique: true,
    required: true,
  },
  author: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  content: {
    type: String,
    required: true,
  },
  featuredImage: {
    url: {
      type: String,
      required: true,
    },
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
  },
  tags: {
    type: [String],
    default: [],
  },
  publishedAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  views: {
    type: Number,
    default: 0,
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
  meta: {
    keywords: {
      type: [String],
      default: [],
    },
    readTimeMinutes: {
      type: Number,
      default: 0,
    },
  },
});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
