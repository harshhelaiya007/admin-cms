const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Post = require('../models/Post');

// @route   GET /api/posts/public
// @desc    Get all published posts
// @access  Public
router.get('/public', async (req, res) => {
  try {
    const posts = await Post.find({ published: true })
      .populate('author', 'username')
      .sort({ publishedAt: -1 })
      .select('-content');

    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/posts/public/:slug
// @desc    Get single published post by slug
// @access  Public
router.get('/public/:slug', async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug, published: true })
      .populate('author', 'username');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/posts
// @desc    Get all posts (admin)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'username')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/posts/:id
// @desc    Get single post (admin)
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'username');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/posts
// @desc    Create new post
// @access  Private
router.post(
  '/',
  auth,
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('content').notEmpty().withMessage('Content is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, content, excerpt, published, tags, metaTitle, metaDescription } = req.body;

      // Generate slug from title
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Check if slug already exists
      const existingPost = await Post.findOne({ slug });
      if (existingPost) {
        return res.status(400).json({ message: 'A post with this title already exists' });
      }

      const post = await Post.create({
        title,
        slug,
        content,
        excerpt,
        author: req.user.id,
        published: published || false,
        tags: tags || [],
        metaTitle,
        metaDescription,
      });

      const populatedPost = await Post.findById(post._id).populate('author', 'username');

      res.status(201).json(populatedPost);
    } catch (error) {
      console.error(error);
      if (error.code === 11000) {
        return res.status(400).json({ message: 'A post with this slug already exists' });
      }
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   PUT /api/posts/:id
// @desc    Update post
// @access  Private
router.put(
  '/:id',
  auth,
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('content').notEmpty().withMessage('Content is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      const { title, content, excerpt, published, tags, metaTitle, metaDescription } = req.body;

      // Generate slug from title if title changed
      let slug = post.slug;
      if (title !== post.title) {
        slug = title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');

        // Check if new slug already exists
        const existingPost = await Post.findOne({ slug, _id: { $ne: req.params.id } });
        if (existingPost) {
          return res.status(400).json({ message: 'A post with this title already exists' });
        }
      }

      post.title = title;
      post.slug = slug;
      post.content = content;
      post.excerpt = excerpt;
      post.published = published !== undefined ? published : post.published;
      post.tags = tags || post.tags;
      post.metaTitle = metaTitle;
      post.metaDescription = metaDescription;

      // Set publishedAt when published is set to true
      if (post.published && !post.publishedAt) {
        post.publishedAt = new Date();
      }

      await post.save();

      const updatedPost = await Post.findById(post._id).populate('author', 'username');

      res.json(updatedPost);
    } catch (error) {
      console.error(error);
      if (error.code === 11000) {
        return res.status(400).json({ message: 'A post with this slug already exists' });
      }
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   DELETE /api/posts/:id
// @desc    Delete post
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    await post.deleteOne();

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
