const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    user: { type: String, required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const postSchema = new mongoose.Schema({
    user: { type: String, required: true },
    title: { type: String, required: true },
    text: { type: String, required: true },
    hashtag: { type: String },
    location: { type: String },
    url: { type: String },
    topic: { type: String },
    status: { type: String, default: 'Live' },
    expirationTime: { type: Date },
    likes: { type: [String], default: [] },
    dislikes: { type: [String], default: [] },
    comments: { type: [commentSchema], default: [] },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', postSchema);

// Verify Token Middleware
function verifyToken(req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'Access denied' });

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid token' });
    }
}

// GET all posts
router.get('/', verifyToken, async (req, res) => {
    try {
        const posts = await Post.find().limit(10);
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST (Create data)
router.post('/', verifyToken, async (req, res) => {
    const postData = new Post({
        user: req.body.user,
        title: req.body.title,
        text: req.body.text,
        hashtag: req.body.hashtag,
        location: req.body.location,
        url: req.body.url
    });

    try {
        const savedPost = await postData.save();
        res.status(201).json(savedPost);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// GET by ID
router.get('/:postId', verifyToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) return res.status(404).json({ message: 'Post not found' });
        res.json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PATCH (Update)
router.patch('/:postId', verifyToken, async (req, res) => {
    try {
        const updatedPost = await Post.findByIdAndUpdate(
            req.params.postId,
            { $set: req.body },
            { new: true }
        );
        if (!updatedPost) return res.status(404).json({ message: 'Post not found' });
        res.json(updatedPost);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE
router.delete('/:postId', verifyToken, async (req, res) => {
    try {
        const deletedPost = await Post.findByIdAndDelete(req.params.postId);
        if (!deletedPost) return res.status(404).json({ message: 'Post not found' });
        res.json({ message: 'Post deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * Middleware to update the status of posts from 'Live' to 'Expired' if their expiration time has passed.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */

/*******  195dcd20-960b-4a0d-81fb-efc13682e135  *******/
const updatePostStatus = async (req, res, next) => {
  const posts = await Post.find({ status: 'Live' });
  const now = new Date();

  await Promise.all(posts.map(async (post) => {
    if (post.expirationTime <= now) {
      post.status = 'Expired';
      await post.save();
    }
  }));

  next();
};

router.use(updatePostStatus);

// Like
router.post('/:id/like', verifyToken, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post || post.status === 'Expired') return res.status(400).json({ message: 'Invalid or expired post' });

  if (post.user === req.user._id) return res.status(403).json({ message: 'Cannot like your own post' });
  if (!post.likes.includes(req.user._id)) post.likes.push(req.user._id);

  await post.save();
  res.json({ message: 'Liked' });
});

// Dislike
router.post('/:id/dislike', verifyToken, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post || post.status === 'Expired') return res.status(400).json({ message: 'Invalid or expired post' });

  if (!post.dislikes.includes(req.user._id)) post.dislikes.push(req.user._id);

  await post.save();
  res.json({ message: 'Disliked' });
});

// Comment
router.post('/:id/comment', verifyToken, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post || post.status === 'Expired') return res.status(400).json({ message: 'Invalid or expired post' });

  const comment = {
    user: req.user._id,
    text: req.body.text
  };
  post.comments.push(comment);

  await post.save();
  res.json({ message: 'Comment added' });
});

// Get all posts for a topic
router.get('/topic/:topic', verifyToken, async (req, res) => {
  const posts = await Post.find({ topic: req.params.topic });
  res.json(posts);
});

// Most active post per topic
router.get('/topic/:topic/most-active', verifyToken, async (req, res) => {
  const posts = await Post.find({ topic: req.params.topic, status: 'Live' });

  const mostActive = posts.sort((a, b) => 
    (b.likes.length + b.dislikes.length) - (a.likes.length + a.dislikes.length)
  )[0];

  res.json(mostActive || { message: 'No active posts found' });
});

// Get expired posts per topic
router.get('/topic/:topic/expired', verifyToken, async (req, res) => {
  const expired = await Post.find({ topic: req.params.topic, status: 'Expired' });
  res.json(expired);
});

